var spawn = require('child_process').spawn;
var http = require('http');
var serverHost = exports.serverHost = '127.0.0.1';
var serverPort = exports.serverPort = '9091';
var serverURL = exports.serverURL = 'http://' + serverHost + ':' + serverPort;


// Start the Wassup server
exports.startServer = function(callback) {
    var server = spawn('./bin/wassup', ['-H', serverHost, '-p', serverPort]);

    if (typeof(callback) === 'function') {
      // Call the callback after the first chunk of output
      server.stdout.on('data', function dataCallback() {
        server.stdout.removeListener('data', dataCallback);
        callback();
      });
    }

    return server;
};


// Start a simple HTTP server
exports.startSimpleServer = function(port, callback) {
  var server = http.createServer();

  server.on('request', function(req, res) {
    res.statusCode = 200;
    res.end('OK');
  });

  server.listen(port, callback);

  return server;
};
