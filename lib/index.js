import {PassThrough} from 'stream'

export default function fluffer({
  inStream,
  createReadStream,
  createWriteStream
}) {
  let readStream = null
  const outStream = new PassThrough({})
  const writeStream = createWriteStream()

  inStream.pipe(writeStream)

  outStream.on('error', () => inStream.end())

  inStream.on('data', () => {
    if (readStream && !readStream._readableState.ended) return

    readStream = createReadStream()

    setTimeout(() => {
      readStream.pipe(outStream, {end: writeStream._writableState.ended})
    }, 500)
  })

  return outStream
}
