/*
 * Controllers
 */
var index = function(req, res) {
  var data = {};

  if (req.body) {
    data.new_url = req.body.new_url;
  }

  return res.render('index', data);
};

module.exports.index = exports.index = index;
