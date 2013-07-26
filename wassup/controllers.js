/*
 * Controllers
 */
var request = require('request');
var async = require('async');


request.defaults({timeout: 100});


exports.urls = [];

exports.index = function(req, res) {
  if (req.body && 'new_url' in req.body) {
    var url = {
      'url': req.body.new_url,
      'status': 'down',
    };

    exports.urls.push(url);

    request(url.url, function(error, response, body) {
      if (!error) {
        url.status = 'up';
      }

      res.redirect('/');
    });
  } else {
    // Make an array of request functions bound to each url
    var urlTests = exports.urls.map(function(url) {
      return function(done) {
        request(url.url, function(error, response, body) {
          if (!error) {
            url.status = 'up';
          } else {
            url.status = 'down';
          }

          done();
        });
      };
    });

    // Make requests to each url, then render a response when they're done
    async.parallel(urlTests, function() {
      res.render('index', {urls: exports.urls});
    });
  }
};

exports.delete_url = function(req, res) {
  var url = req.params[0];

  for (var i = 0; i < exports.urls.length; i++) {
    if (exports.urls[i].url == url) {
      exports.urls.splice(i, 1);
      break;
    }
  }

  res.redirect('/');
};
