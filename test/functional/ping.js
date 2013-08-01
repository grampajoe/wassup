/*
 * Functional tests for pinging hosts
 */
require('should');
var Browser = require('zombie');
var utils = require('./utils');


describe('pings', function() {
  var server;
  var browser;

  before(function(done) {
    browser = new Browser();
    browser.site = utils.serverURL;

    server = utils.startServer(done);
  });

  beforeEach(function(done) {
    browser.visit('/').then(done, done);
  });

  after(function() {
    server.kill();
  });

  it('should show whether a URL is up or down', function(done) {
    // The user adds a URL that's expected to be up

    // And see it on the page, marked as "up"

    // Next, they add a URL that's expected to be down

    // They see it on the page, marked as "down"

    // The first URL goes down!

    // It's now marked as "down"

    // The second URL comes up!

    // It's now marked as "up"

    done(new Error('Finish the test!'));
  });
});
