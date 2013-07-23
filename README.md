# Wassup

Is the server up?

## Introduction

Wassup is a super-simple monitor for HTTP servers with an easy-to-glance-at
Web UI. It sends HTTP requests to any URI you give it, and tells you whether
it got a response.

## Installation

Get Wassup from NPM:

    $ npm install -g wassup

## Running

To run Wassup, just do:

    $ wassup
    Wassup server listening at 127.0.0.1:9000...

Binding to a custom host and port is easy:

    $ wassup --host=0.0.0.0 --port=8080

Options for the wassup command can be found with:

    $ wassup --help

## Tests

To run the tests:

    $ npm test
