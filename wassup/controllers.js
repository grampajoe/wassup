/*
 * Controllers
 */
var index = function(req, res) {
  if (req.body && 'new_url' in req.body) {
    exports.urls.push(req.body.new_url);

    res.redirect('/');
  }

  res.render('index', {urls: exports.urls});
};

var delete_url = function(req, res) {
  var url = req.params[0];

  var i = exports.urls.indexOf(url);
  exports.urls.splice(i, 1);

  res.redirect('/');
};

module.exports.index = exports.index = index;
module.exports.delete_url = exports.delete_url = delete_url;
module.exports.urls = exports.urls = [];
