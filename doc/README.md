# fluff

Buffers stdin to a temp file which is then used to stream to stdout.

## Reasoning

There might be cases where you need to stream relatively large files/data from
a network, through your application and maybe beyond. Imagine that the duration
of that network connection is limited, the stream that consumes is slower than
the network is providing and the data surpasses the amount of data that can be
stored in memory.

You could end up with the connection timing out.

How about storing it on your file system. While the file is being written we
can start reading from it too.

## API

This package both installs an executable script, and it can be used by
requiring it as a module.

### Command line interface

The executable script is named `fluff`. After installing this either globally
or having the path where the executable file is located be added to the PATH
variable, you can start using it in your command line.

```sh
require ./doc/example/cli.sh
```

This shows how you can use fluff to stream big files while having less
connection timeout issues. You can now pause your audio player and come back to
it later.

### Javascript interface

The javascript interface relies on the requiring/importing of fluff's lib
module.

The command line interface uses this lib module. We'll that as an example on
how to use fluff's lib module.

```js
require ./index.js
```

You can see that the creation of the read and write stream is done outside of
the fluff stream function. This allows you to use different types of read and
write streams. They don't have to be your local file system.
