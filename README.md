# fluff-cli

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

The thing we solve here is preventing the network provider from timing out.

## Usage

A command line interface for using fluff
