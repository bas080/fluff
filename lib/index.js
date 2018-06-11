import {PassThrough} from 'stream'

export default function fluff({
  inStream,
  createReadStream,
  createWriteStream
}) {
  let inStreamIsDone = false
  const outStream = new PassThrough({})

  const writeStream = createWriteStream()

  inStream.pipe(writeStream)

  outStream.on('error', () => inStream.end())

  reStream()

  process.stdin.on('end', () => {
    inStreamIsDone = true
  })

  function reStream() {
    const readStream = createReadStream()

    if (!inStreamIsDone)
      readStream.on('close', () => setTimeout(() => reStream(), 100))

    readStream.pipe(outStream, {end: inStreamIsDone})
  }

  return outStream
}
