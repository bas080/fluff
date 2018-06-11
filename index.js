'use strict'

import tmp from 'tmp'
import streamToPromise from 'stream-to-promise'
import flufferStream from './lib/index.js'
import {createReadStream, createWriteStream} from 'fs'

tmp.file((err, path, _, cleanup) => {
  if (err)
    throw err

  process.stderr.write(`fluffer: ${path}\n`)
  process.stdin.on('end', () => {
    process.stderr.write(`fluffer: done buffering to ${path} \n`)
  })

  streamToPromise(flufferStream({
    inStream: process.stdin,
    createReadStream: () => createReadStream(path),
    createWriteStream: () => createWriteStream(path, {start: process.stdout.bytesWritten})
  }).pipe(process.stdout))
    .then(cleanup)
    .catch(error => process.stderr.write(`fluffer: ${error}\n`))
})
