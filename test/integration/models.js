/*
 * Integration tests for models
 */

var should = require('should');
var models = require('../../wassup/models');


describe('URL', function() {
  it('should save', function(done) {
    var url = {
      url: 'http://test.com',
      status: 'up',
    };

    models.URL.create(url, function(err, newUrl) {
      newUrl.url.should.eql(url.url);
      newUrl.status.should.eql(url.status);
      should.exist(newUrl.id, 'The saved URL should have an id.');

      done();
    });
  });

  it('should get existing items', function(done) {
    var url = {
      url: 'http://test.com',
      status: 'up',
    };

    models.URL.create(url, function(err, newUrl) {
      models.URL.get(url.id, function(err, gottenUrl) {
        gottenUrl.id.should.eql(newUrl.id);

        done();
      });
    });
  });

  it('should update existing items', function(done) {
    var url = {
      url: 'http://test.com',
      status: 'up',
    };

    models.URL.create(url, function(err, newUrl) {
      url.status = 'down';

      models.URL.update(newUrl.id, url, function() {
        models.URL.get(newUrl.id, function(err, updatedUrl) {
          updatedUrl.id.should.eql(newUrl.id);
          updatedUrl.url.should.eql(newUrl.url);
          updatedUrl.status.should.eql('down');

          done();
        });
      });
    });
  });

  it('should delete items', function(done) {
    var url = {
      url: 'http://test.com',
      status: 'up',
    };

    models.URL.create(url, function(err, newUrl) {
      should.exist(newUrl.id);

      models.URL.delete(newUrl.id, function(err) {
        models.URL.get(newUrl.id, function(err, gottenUrl) {
          should.not.exist(gottenUrl);

          done();
        });
      });
    });
  });
});
