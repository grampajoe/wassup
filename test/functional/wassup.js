/*
 * Functional tests
 */
require('should');
var spawn = require('child_process').spawn;
var Browser = require('zombie');
var serverHost = '127.0.0.1';
var serverPort = '9091';
var serverURL = 'http://' + serverHost + ':' + serverPort;

describe('the wassup server', function() {
  var server;
  var browser;

  function getItems() {
    var urlList = browser.document.querySelectorAll('#urls li');
    var items = [];
    for (var i = 0; i < urlList.length; i++) {
      items.push(urlList[i].textContent.trim());
    }

    return items;
  }

  before(function() {
    server = spawn('wassup', ['-H', serverHost, '-p', serverPort]);
    browser = new Browser();
    browser.site = serverURL;
  });

  after(function() {
    server.kill();
  });

  it('should run', function(done) {
    // Wait for some output to avoid race conditions
    server.stdout.on('data', function() {
      // Visit the home page
      browser.visit('/', function() {
        browser.success.should.be.ok;
        done();
      });
    });
  });

  describe('home page', function() {
    beforeEach(function(done) {
      browser.visit('/').then(done, done);
    });

    it('should have a cool title', function() {
      browser.text('title').should.match(/Wassup/);
    });

    it('should let users add URLs', function(done) {
      // The user enters a URL and presses "Add URL"
      browser.
        fill('new_url', 'http://google.com').
        pressButton('Add URL', function() {

          // They see they're on the same page
          browser.location.pathname.should.equal('/');

          // And see the new URL on the list
          getItems().should.include('http://google.com')

          // They add a second URL
          browser.fill('new_url', 'http://fark.com').
            pressButton('Add URL', function() {

              // And see it in the list along with the first one
              var items = getItems();
              items.should.include('http://fark.com');
              items.should.include('http://google.com');

              done();
            });
        });
    });
  });
});
