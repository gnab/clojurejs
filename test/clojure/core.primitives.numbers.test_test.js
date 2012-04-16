var clojure = require('../../src/clojure');

describe('Primitives', function () {
  describe('Numbers', function () {
    describe('Test', function () {
      it('odd?', function () {
        clojure.run('(odd? 1)').should.equal(true);
        clojure.run('(odd? 2)').should.equal(false);
      });
      it('even?', function () {
        clojure.run('(even? 1)').should.equal(false);
        clojure.run('(even? 2)').should.equal(true);
      });
    });
  });
});
