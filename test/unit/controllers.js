/*
 * Controller unit tests
 */
require('should');
var sinon = require('sinon');
var controllers = require('../../wassup/controllers');

describe('index', function() {
  it('should render the index view', function() {
    var req = {}, res = {'render': sinon.spy()};

    controllers.index(req, res);

    res.render.calledWith('index').should.be.true;
  });
});
