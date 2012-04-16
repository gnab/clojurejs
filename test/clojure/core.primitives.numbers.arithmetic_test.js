var clojure = require('../../src/clojure');

describe('Primitives', function () {
  describe('Numbers', function () {
    describe('Arithmetic', function () {
      it('+', function () {
        clojure.run('(+ 1 2 3)').should.equal(6);
      });
      it('-', function () {
        clojure.run('(- 1 2)').should.equal(-1);
      });
      it('*', function () {
        clojure.run('(* 2 3)').should.equal(6);
      });
      it('/', function () {
        clojure.run('(/ 6 2)').should.equal(3);
      });
    });
  });
});
