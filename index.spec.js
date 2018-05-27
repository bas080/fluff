'use strict'

const promisify = require('promisify')
const {createWriteStream, createReadStream, readFile, unlink} = require('fs')
const readFilePromise = promisify.func(readFile)
const {spawn} = require('child_process')
const {test} = require('tap')
const streamToPromise = require('stream-to-promise')
const {Readable, PassThrough} = require('stream')
const path = require('path')


test('input stream is written to the buffer file', t => {
  const fluff = spawn(path.join(__dirname, './dist/fluff'))

  createReadStream(path.join(__dirname, './fixture/file.txt'))
    .pipe(fluff.stdin)

  const fluff2 = fluff.stdout.pipe(createWriteStream(path.join(__dirname, './fixture/file.tmp.txt')))

  fluff.stderr.pipe(process.stderr)

  return streamToPromise(fluff2)
    .then(() => Promise.all([
      readFilePromise(path.join(__dirname, './fixture/file.txt')),
      readFilePromise(path.join(__dirname, './fixture/file.tmp.txt'))
    ]))
    .then(([b, a]) => {
      t.equal(a.toString(), b.toString())

      return promisify.func(unlink)(path.join(__dirname, './fixture/file.tmp.txt'))
    })
    .then(() => t.end())
})

test('delayed input stream is written to the buffer file', t => {
  const total=20
  let times=total
  let index = 0
  t.plan(times)
  const fluff = spawn(path.join(__dirname, './dist/fluff'))
  const assertStream = new PassThrough()
  const readStream = new Readable({
    read() {
      setTimeout(() => {
        (times > 0) && this.push(index+'')
        index += 1
      }, 100 * index)
    }
  })

  assertStream.on('data', d => {
    if (times > 0) {
      times -= 1
      t.ok(d, total - times)
    } else {
      readStream.push(null)
    }
  })

  readStream.pipe(fluff.stdin)
  fluff.stdout.pipe(assertStream)
})
