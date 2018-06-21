#!/bin/bash

npm run build &> /dev/null

./node_modules/.bin/tap index.spec.js | ./dist/fluffer 2> /dev/null
