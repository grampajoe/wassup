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
  app.use(express.logger('short'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

require('./routes')(app);

module.exports = exports = app;
