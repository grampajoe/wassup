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

    it('should let users add and remove a URL', function() {
      // The user enters a URL and presses "Add URL"
      browser.
        fill('new_url', 'http://google.com').
        pressButton('Add URL', function() {

          // They see they're on the same page
          browser.location.pathname.should.equal('/');

          // And see the new URL as the first item on the list
          var urlList = browser.document.querySelectorAll('#urls li');
          urlList.should.have.length(1, 'List should have 1 URL');
          urlList[0].textContent.should.match(/http\:\/\/google\.com/);

          // The user clicks on the item's "Delete" button
          browser.clickLink('#urls li:first-child a.delete', function() {

            // They see the item is removed
            urlList = browser.document.querySelectorAll('#urls li');
            urlList.should.have.length(0, 'List should have no URLs');
          });
        });
    });
  });
});
