var evaluator = require('../src/evaluator.js')
  ;

describe('Evaluator', function () {
  it('should evaluate simple expression', function () {
    evaluator.evaluate([['+', '1', '1']]).should.equal(2);
  });
});
