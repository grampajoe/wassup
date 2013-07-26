/*
 * Functional tests for pinging hosts
 */
require('should');
var Browser = require('zombie');
var utils = require('./utils');


describe('pings', function() {
  var server;
  var upServer;
  var downServer;
  var browser;

  before(function(done) {
    browser = new Browser();
    browser.site = utils.serverURL;

    server = utils.startServer(function() {
      upServer = utils.startSimpleServer(9092, done);
    });
  });

  beforeEach(function(done) {
    browser.visit('/').then(done, done);
  });

  after(function() {
    server.kill();

    try {
      upServer.close();
    } catch(e) {}

    try {
      downServer.close();
    } catch(e) {}
  });

  it('should show whether a URL is up or down', function(done) {
    // The user adds a URL that's expected to be up
    browser.fill('new_url', 'http://localhost:9092').
      pressButton('Add URL', function() {

        // And see it on the page, marked as "up"
        var items = browser.document.querySelectorAll('#urls li');
        var url = items[0].querySelector('.url').textContent;
        url.should.include('http://localhost:9092')
        items[0].className.should.include('up');

        // Next, they add a URL that's not expected to be up
        browser.fill('new_url', 'http://localhost:9093').
          pressButton('Add URL', function() {

            // They see it on the page, marked as "down"
            var items = browser.document.querySelectorAll('#urls li');
            var url = items[1].querySelector('.url').textContent;
            url.should.include('http://localhost:9093');
            items[1].className.should.include('down');

            // The first URL goes down!
            upServer.close();

            // It's now marked as "down"
            browser.visit('/', function() {
              items = browser.document.querySelectorAll('#urls li');
              items[0].className.should.include('down');

              // The second URL comes up!
              var downServer = utils.startSimpleServer(9093, function() {
                browser.visit('/', function() {

                  // It's now marked as "up"
                  items = browser.document.querySelectorAll('#urls li');
                  items[1].className.should.include('up');

                  done();
                });
              });
            });
          });
      });
  });
});
