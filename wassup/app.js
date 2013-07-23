/*
 * App
 */
var express = require('express'),
    app = express(),
    path = require('path');

app.configure(function() {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
});

require('routes')(app);

module.exports = exports = app;
