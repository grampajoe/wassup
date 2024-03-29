/*
 * Routes
 */
var controllers = require('./controllers');

// Export a function that takes an app and binds controllers to routes
module.exports = exports = function(app) {
  app.get('/', controllers.index);
  app.post('/urls/', controllers.index);
  app.delete(/^\/urls\/(.*)/, controllers.delete_url);
};
