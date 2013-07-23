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


describe('index', function() {
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
    res.data.should.eql({new_url: 'http://google.com'});
  });
});
