var parser = require('../src/parser')
  , evaluator = require('../src/evaluator')
  ;

describe('Clojure JS', function () {
  it('should perform simple arithmetic operation', function () {
    evaluator.evaluate(parser.parse('(+ 1 1)')).should.equal(2);
  });
});
