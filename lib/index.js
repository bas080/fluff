import {createReadStream, createWriteStream} from 'fs'
import {PassThrough} from 'stream'

export default function fluff(inStream, path) {
  let inStreamIsDone = false
  const outStream = new PassThrough({})

  process.stderr.write(`fluff: ${path}\n`)

  outStream.path = path

  const writeStream = createWriteStream(path)

  inStream.pipe(writeStream)

  inStream.on('end', () => {
    inStreamIsDone = true
    process.stderr.write(`fluff: done buffering to ${path} \n`)
  })

  outStream.on('error', () => inStream.end())

  reStream()

  function reStream() {
    const readStream = createReadStream(path, {start: outStream.bytesWritten})

    if (!inStreamIsDone)
      readStream.on('close', () => setTimeout(() => reStream(), 100))

    readStream.pipe(outStream, {end: inStreamIsDone})
  }

  return outStream
}
