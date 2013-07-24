var spawn = require('child_process').spawn;
var serverHost = exports.serverHost = '127.0.0.1';
var serverPort = exports.serverPort = '9091';
var serverURL = exports.serverURL = 'http://' + serverHost + ':' + serverPort;


exports.startServer = function() {
    return spawn('wassup', ['-H', serverHost, '-p', serverPort]);
}
