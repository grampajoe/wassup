/*
 * Controller unit tests
 */
require('should');
var sinon = require('sinon');
var controllers = require('../../wassup/controllers');


var FakeResponse = function() {
};

FakeResponse.prototype.render = function(view, data) {
  this.view = view;
  this.data = data;
};

FakeResponse.prototype.redirect = sinon.spy();


describe('index', function() {
  afterEach(function() {
    controllers.urls = [];
  });

  it('should render the index view', function() {
    var req = {};
    var res = new FakeResponse();

    controllers.index(req, res);

    res.view.should.equal('index');
  });

  it('should display POSTed data', function() {
    var req = {body: {new_url: 'http://google.com'}};
    var res = new FakeResponse();

    controllers.index(req, res);

    res.view.should.eql('index')
    res.data.should.eql({urls: ['http://google.com']});
  });

  it('should save POSTed data', function() {
    var req = {body: {}};
    var res = new FakeResponse();

    req.body.new_url = 'http://google.com';
    controllers.index(req, res);

    res.data.should.eql({urls: ['http://google.com']});

    req.body.new_url = 'http://fark.com';
    controllers.index(req, res);

    res.data.should.eql({urls: ['http://google.com', 'http://fark.com']});
    res.redirect.calledWith('/').should.be.true;
  });

  it('should only save when something actually gets POSTed', function() {
    var req = {body: {}};
    var res = new FakeResponse();

    controllers.index(req, res);

    res.data.should.eql({urls: []});
  });
});

describe('delete_url', function() {
  afterEach(function() {
    controllers.urls = [];
  });

  it('should delete a given URL', function() {
    var req = {params: ['http://google.com']};
    var res = new FakeResponse();
    controllers.urls = ['http://google.com', 'http://fark.com'];

    controllers.delete_url(req, res);

    controllers.urls.should.eql(['http://fark.com']);
    res.redirect.calledWith('/').should.be.true;
  });
});
