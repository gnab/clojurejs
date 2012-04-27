var clojure = require('../../src/clojure')
  , sinon = require('sinon')
  ;

describe('IO', function () {
  describe('println', function () {
    before(function () {
      sinon.spy(console, 'log');
    });

    it('', function () {
      clojure.run('(println 1 2 3 "clojure")');
      console.log.alwaysCalledWithExactly(1, 2, 3, 'clojure').should.equal(true);
    });

    after(function () {
      console.log.restore();
    });
  });
});
