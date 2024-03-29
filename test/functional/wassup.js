/*
 * Functional tests
 */
require('should');
var Browser = require('zombie');
var utils = require('./utils');


describe('the wassup server', function() {
  var server;
  var browser;

  // Get a list of URLs shown on the page
  function getItems() {
    var urlList = browser.document.querySelectorAll('#urls .url');
    var items = [];
    for (var i = 0; i < urlList.length; i++) {
      items.push(urlList[i].textContent.trim());
    }

    return items;
  }

  before(function(done) {
    server = utils.startServer(done);
    browser = new Browser();
    browser.site = utils.serverURL;
  });

  after(function() {
    server.kill();
  });

  it('should run', function(done) {
    // Visit the home page
    browser.visit('/', function() {
      browser.success.should.be.ok;
      done();
    });
  });

  describe('home page', function() {
    beforeEach(function(done) {
      browser.visit('/').then(done, done);
    });

    it('should have a cool title', function() {
      browser.text('title').should.include('Wassup');
    });

    it('should let users add and remove URLs', function(done) {
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
              items.should.have.length(2);
              items.should.include('http://fark.com');
              items.should.include('http://google.com');

              // The user clicks the delete button on the first item
              var firstDelete = '#urls li:first-child input[type=submit]';
              browser.pressButton(firstDelete, function() {

                // And sees that it's gone
                getItems().should.have.length(1);

                // They click on the last item's delete link
                browser.pressButton(firstDelete, function() {

                  // And see that it's gone, too
                  getItems().should.have.length(0);

                  done();
                });
              });
            });
        });
    });
  });
});
