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


    res.redirect('/');
  } else {
    res.render('index', {urls: exports.urls});
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
