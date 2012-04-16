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
      it('mod', function () {
        clojure.run('(mod 10 6)').should.equal(4);
      });
    });

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
