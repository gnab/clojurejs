var clojure = require('../../src/clojure')
  , forms = require('../../src/forms')
  , number = forms.number
  ;

describe('Primitives', function () {
  describe('Numbers', function () {
    describe('Arithmetic', function () {
      it('+', function () {
        clojure.run('(+ 1 2 3)').should.eql(number(6));
      });
      it('-', function () {
        clojure.run('(- 1 2)').should.eql(number(-1));
      });
      it('*', function () {
        clojure.run('(* 2 3)').should.eql(number(6));
      });
      it('/', function () {
        clojure.run('(/ 6 2)').should.eql(number(3));
      });
      it('mod', function () {
        clojure.run('(mod 17 13').should.eql(number(4));
      });
    });
  });
});
