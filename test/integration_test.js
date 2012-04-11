var reader = require('../src/reader')
  , evaluator = require('../src/evaluator')
  ;

describe('Clojure JS', function () {
  it('should perform simple arithmetic operation', function () {
    evaluator.evaluate(reader.parse('(+ 1 1)')).should.equal(2);
  });
});
