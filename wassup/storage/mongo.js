/*
 * MongoDB storage adapter
 */

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;


var MongoStorage = function(dbName, dbHost, dbPort) {
  this._db = new Db(dbName, new Server(dbHost, dbPort), {w: 1});
};

/*
 * Create an item in a collection.
 *
 * @param {String} collectionName The name of the collection to use
 * @param {Object} item The item to insert
 * @param {Function} callback
 */
MongoStorage.prototype.create = function(collectionName, item, callback) {
  var db = this._db;

  db.open(function(err, db) {
    db.collection(collectionName, function(err, collection) {
      collection.insert(item, {w: 1}, function(err, result) {
        db.close();

        // Give the item an .id property, nicer than Mongo's ._id
        var item = result[0];
        item.id = item._id.toHexString();

        callback(err, item);
      });
    });
  });
};

/*
 * Get an item from a collection.
 *
 * @param {String} collectionName The name of the collection to use
 * @param {String} id The ID of the item to get
 * @param {Function} callback
 */
MongoStorage.prototype.get = function(collectionName, id, callback) {
  this._db.open(function(err, db) {
    db.collection(collectionName, function(err, collection) {
      collection.findOne({_id: new ObjectID(id)}, function(err, result) {
        db.close();

        var item = result;

        if (item) {
          item.id = item._id.toHexString();
        }

        callback(err, item);
      });
    });
  });
};

/*
 * Update an existing item.
 *
 * @param {String} collectionName The name of the collection to use
 * @param {String} id The ID of the item to update
 * @param {Object} newItem An item used to update the existing one
 * @param {Function} callback
 */
MongoStorage.prototype.update = function(collectionName, id, newItem, callback) {
  var self = this;

  this._db.open(function(err, db) {
    db.collection(collectionName, function(err, collection) {
      collection.update({_id: new ObjectID(id)}, newItem, function(err, result) {
        db.close();

        self.get(collectionName, id, callback);
      });
    });
  });
};

/*
 * Delete an item.
 *
 * @param {String} collectionName The name of the collection to use
 * @param {String} id The ID of the item to delete
 * @param {Function} callback
 */
MongoStorage.prototype.delete = function(collectionName, id, callback) {
  this._db.open(function(err, db) {
    db.collection(collectionName, function(err, collection) {
      collection.remove({_id: new ObjectID(id)}, {w: 1}, function(err, result) {
        db.close();

        callback(err);
      });
    });
  });
};


module.exports = MongoStorage;
