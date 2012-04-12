var evaluator = require('../src/evaluator.js')
  , tokens = require('./tokens')
  , e = tokens.e, i = tokens.i, n = tokens.n, v = tokens.v, s = tokens.s
  ;

describe('Evaluator', function () {
  it('should evaluate simple expression', function () {
    evaluator.evaluate([e(i('+'), n('1'), n('1'))]).should.equal(2);
  });
});
