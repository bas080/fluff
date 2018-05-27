import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: './index.js',
  output: {
    file: './dist/fluff',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
  plugins: [
    resolve(),
    commonjs({
      exclude: ['./index.js']
    }),
  ]
}
