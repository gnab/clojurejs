var clojure = require('../../src/clojure')
  , forms = require('../../src/forms')
  , literal = forms.literal
  ;

describe('Primitives', function () {
  describe('Numbers', function () {
    describe('Test', function () {
      it('odd?', function () {
        clojure.run('(odd? 1)').should.eql(literal(true));
        clojure.run('(odd? 2)').should.eql(literal(false));
      });

      it('even?', function () {
        clojure.run('(even? 1)').should.eql(literal(false));
        clojure.run('(even? 2)').should.eql(literal(true));
      });
    });
  });
});
