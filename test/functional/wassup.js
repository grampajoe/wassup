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

    // Check that a URL is in the list
    function checkForURL(url) {
        var urlList = browser.document.querySelectorAll('#urls li');
        for (var i = 0; i < urlList.length; i++) {
          if (urlList[i].textContent.indexOf(url) !== -1) {
            return true;
          }
        }

        return false;
    }

    it('should let users add URLs', function(done) {
      // The user enters a URL and presses "Add URL"
      browser.
        fill('new_url', 'http://google.com').
        pressButton('Add URL', function() {

          // They see they're on the same page
          browser.location.pathname.should.equal('/');

          // And see the new URL as the first item on the list
          checkForURL('http://google.com').should.be.ok;

          // They add a second URL
          browser.fill('new_url', 'http://fark.com').
            pressButton('Add URL', function() {

              // And see it in the list along with the first one
              checkForURL('http://fark.com').should.be.ok;
              checkForURL('http://google.com').should.be.ok;

              done();
            });
        });
    });
  });
});
