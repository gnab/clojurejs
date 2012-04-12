var reader = require('../src/reader')
  , evaluator = require('../src/evaluator')
  ;

describe('Clojure JS', function () {
  it('should execute simple expression', function () {
    evaluator.evaluate(reader.parse('(+ 1 1)')).should.equal(2);
  });

  it('should execute nested expression', function () {
    evaluator.evaluate(reader.parse('(+ 1 (* 2 3)')).should.equal(7);
  });
});
