/*
 * Application models
 */

var MongoStorage = require('./storage/mongo');


/*
 * The URL model.
 *
 * Proxies methods to the chosen storage adapter. For now, this is always
 * the MongoStorage adapter.
 *
 * @property {String} collection The name of the collection for this model
 * @property {MongoStorage} storage A storage instance
 */
var URL = {
  collection: 'urls',
  storage: new MongoStorage('wassup', 'localhost', '27017'),

  create: function(item, callback) {
    this.storage.create(this.collection, item, callback);
  },

  get: function(id, callback) {
    this.storage.get(this.collection, id, callback);
  },

  update: function(id, item, callback) {
    this.storage.update(this.collection, id, item, callback);
  },

  delete: function(id, callback) {
    this.storage.delete(this.collection, id, callback);
  },
};


module.exports.URL = URL;
