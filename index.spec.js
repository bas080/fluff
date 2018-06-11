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
  const fluffer = spawn(path.join(__dirname, './dist/fluffer'))

  createReadStream(path.join(__dirname, './fixture/file.txt'))
    .pipe(fluffer.stdin)

  const fluffer2 = fluffer.stdout.pipe(createWriteStream(path.join(__dirname, './fixture/file.tmp.txt')))

  fluffer.stderr.pipe(process.stderr)

  return streamToPromise(fluffer2)
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
  const fluffer = spawn(path.join(__dirname, './dist/fluffer'))
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

  readStream.pipe(fluffer.stdin)
  fluffer.stdout.pipe(assertStream)
})
