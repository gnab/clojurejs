var clojure = require('../../src/clojure')
  , forms = require('../../src/forms')
  , literal = forms.literal
  ;

describe('Compare', function () {
  it('= should return true if primitives are equal', function () {
    clojure.run('(= 1 1)').should.eql(literal(true));
  });
  it('= should return false if primitives are not equal', function () {
    clojure.run('(= 1 2)').should.eql(literal(false));
  });
  it('= should return true if quoted lists are equal', function () {
    clojure.run('(= \'(1 2) \'(1 2)').should.eql(literal(true));
  });
  it('= should return false if quoted lists are not equal', function () {
    clojure.run('(= \'(1 2) \'(3 4)').should.eql(literal(false));
  });
  it('= should handle more than two arguments', function () {
    clojure.run('(= 1 2 1 1').should.eql(literal(false));
  });
  it('= should handle vectors and lists', function () {
    clojure.run('(= [1 2 3] \'(1 2 3)').should.eql(literal(true));
    clojure.run('(= [1 2 4] \'(1 2 3)').should.eql(literal(false));
    clojure.run('(= [1 2 3 4] \'(1 2 3)').should.eql(literal(false));
  });
});