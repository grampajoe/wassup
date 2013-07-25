/*
 * Controller unit tests
 */
require('should');
var sinon = require('sinon');
var nock = require('nock');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var controllers = require('../../wassup/controllers');


var FakeResponse = function() {
  EventEmitter.call(this);

  this.ended = false;

  this.on('end', function() {
    this.ended = true;
  });
};

util.inherits(FakeResponse, EventEmitter);

// Make the response work kind of like a promise
FakeResponse.prototype.then = function(callback) {
  var self = this;

  if (this.ended) {
    callback();
  } else {
    this.on('end', function listener() {
      self.removeListener('end', listener);

      callback();
    });
  }
};

FakeResponse.prototype.render = function(view, data) {
  this.view = view;
  this.data = data;

  this.emit('end');
};

FakeResponse.prototype.redirect = function(url) {
  this.location = url;

  this.emit('end');
};


describe('index', function() {
  beforeEach(function() {
    nock('http://up.com').get('/').reply(200, 'OK');
    nock('http://google.com').get('/').reply(200, 'OK');
    nock('http://fark.com').get('/').reply(200, 'OK');
  });

  afterEach(function() {
    controllers.urls = [];
    nock.cleanAll();
  });

  it('should render the index view', function() {
    var req = {};
    var res = new FakeResponse();

    controllers.index(req, res);

    res.view.should.equal('index');
  });

  it('should display data', function() {
    var req = {};
    var res = new FakeResponse();
    controllers.urls = [
      {'url': 'http://google.com', 'status': 'up'},
    ];

    controllers.index(req, res);

    res.view.should.eql('index')
    res.data.should.eql({urls: [
      {'url': 'http://google.com', 'status': 'up'},
    ]});
  });

  it('should save POSTed data', function(done) {
    var req = {body: {}};
    var res = new FakeResponse();

    req.body.new_url = 'http://google.com';
    controllers.index(req, res);

    res.then(function() {
      controllers.urls.should.eql([
        {'url': 'http://google.com', 'status': 'up'},
      ]);

      res.location.should.eql('/');

      req.body.new_url = 'http://fark.com';
      res = new FakeResponse();
      controllers.index(req, res);

      res.then(function() {
        controllers.urls.should.eql([
          {'url': 'http://google.com', 'status': 'up'},
          {'url': 'http://fark.com', 'status': 'up'},
        ]);

        res.location.should.eql('/');

        done();
      });
    });
  });

  it('should only save when something actually gets POSTed', function(done) {
    var req = {body: {}};
    var res = new FakeResponse();

    controllers.index(req, res);

    res.then(function() {
      controllers.urls.should.eql([]);

      done();
    });
  });

  it('should ping URLS when they are added', function() {
    var req = {body: {}};
    var res = new FakeResponse();

    req.body.new_url = 'http://up.com';
    controllers.index(req, res);

    res.then(function() {
      controllers.urls.should.eql([
        {'url': 'http://up.com', 'status': 'up'},
      ]);

      // Try a URL that won't return a response
      controllers.urls = [];
      req.body.new_url = 'http://what-if-this-was-real.fake.com';
      res = new FakeResponse();
      controllers.index(req, res);

      res.then(function() {
        controllers.urls.should.eql([
          {'url': 'http://what-if-this-was-real.fake.com', 'status': 'down'},
        ]);
      });
    });
  });
});

describe('delete_url', function() {
  afterEach(function() {
    controllers.urls = [];
  });

  it('should delete a given URL', function(done) {
    var req = {params: ['http://google.com']};
    var res = new FakeResponse();
    controllers.urls = [
      {'url': 'http://google.com', 'status': 'up'},
      {'url': 'http://fark.com', 'status': 'up'},
    ];

    controllers.delete_url(req, res);

    res.then(function() {

      controllers.urls.should.eql([
        {'url': 'http://fark.com', 'status': 'up'},
      ]);

      res.location.should.eql('/');

      done();
    });
  });
});
