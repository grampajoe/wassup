var should = require('should');
var MongoStorage = require('../../wassup/storage/mongo');


describe('MongoStorage', function() {
  var storage;

  before(function() {
    storage = new MongoStorage('test', 'localhost', 27017);
  });

  it('should create records', function(done) {
    storage.create('things', {test: 1}, function(err, item) {
      item.test.should.equal(1);

      storage.get('things', item.id, function(err, newItem) {
        newItem.should.eql(item);

        done();
      });
    });
  });

  it('should update records', function(done) {
    storage.create('things', {test: 1}, function(err, item) {
      storage.update(
        'things',
        item.id,
        {test: 2, newProp: 'yep'},
        function(err, updated) {
          updated.id.should.equal(item.id);
          updated.test.should.equal(2);
          updated.newProp.should.equal('yep');

          done();
        }
      );
    });
  });

  it('should get records', function(done) {
    storage.create('things', {test: 1}, function(err, item) {
      storage.get('things', item.id, function(err, gotten) {
        gotten.should.eql(item);

        done();
      });
    });
  });

  it('should delete records', function(done) {
    storage.create('things', {test: 1}, function(err, item) {
      storage.delete('things', item.id, function(err) {
        storage.get('things', item.id, function(err, item) {
          should.not.exist(item);

          done();
        });
      });
    });
  });
});
