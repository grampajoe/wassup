var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;


var MongoStorage = function(dbName, dbHost, dbPort) {
  this._db = new Db(dbName, new Server(dbHost, dbPort), {w: 1});
};

MongoStorage.prototype.create = function(collectionName, item, callback) {
  var db = this._db;

  db.open(function(err, db) {
    db.collection(collectionName, function(err, collection) {
      collection.insert(item, {w: 1}, function(err, result) {
        db.close();

        var item = result[0];
        item.id = item._id.toHexString();

        callback(err, item);
      });
    });
  });
};

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
