require('should');
var spawn = require('child_process').spawn;

describe('The wassup server', function() {
  it('should run', function(done) {
    var server = spawn('wassup');

    server.stdout.on('data', function(data) {
      data.toString().should.match(/server listening/);
      server.kill();
      done();
    });
  });
});
