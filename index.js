'use strict'

import tmp from 'tmp'
import streamToPromise from 'stream-to-promise'
import fluffStream from './lib/index.js'

tmp.file((err, path, _, cleanup) => {
  if (err)
    throw err

  streamToPromise(fluffStream(process.stdin, path).pipe(process.stdout))
    .then(cleanup)
    .catch(error => process.stderr.write(`fluff: ${error}\n`))
})
