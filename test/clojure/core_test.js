var core = require('../../src/clojure/core');

describe('clojure.core', function () {

  describe('arithmetic function', function () {
    it('+', function () {
      core['+'](1, 2, 3).should.equal(6);
    });
    it('-', function () {
      core['-'](1, 2).should.equal(-1);
    });
    it('*', function () {
      core['*'](2, 3).should.equal(6);
    });
    it('/', function () {
      core['/'](6, 2).should.equal(3);
    });
  });

  describe('boolean functions', function () {
    it('odd?', function () {
      core['odd?'](1).should.equal(true);
      core['odd?'](2).should.equal(false);
    });
    it('even?', function () {
      core['even?'](1).should.equal(false);
      core['even?'](2).should.equal(true);
    });
  });

  describe('meta functions', function () {
    it('partial', function () {
      core.partial(core['+'], 1)(2).should.equal(3);
    });
  });

});
