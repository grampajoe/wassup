var express = require('express'),
    app = express();

app.get('/', function(req, res) {
  res.send('Hi!');
});

module.exports = exports = app;
