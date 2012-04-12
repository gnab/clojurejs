var evaluator = require('../src/evaluator.js')
  ;

describe('Evaluator', function () {
  it('should evaluate simple expression', function () {
    evaluator.evaluate([e(i('+'), n('1'), n('1'))]).should.equal(2);
  });

  function n (value) { return {kind: 'number', value: value }; }
  function s (value) { return {kind: 'string', value: value }; }
  function i (value) { return {kind: 'identifier', value: value }; }

  function e (value) {
    return {kind: 'expression', value: Array.prototype.slice.apply(arguments) };
  }

  function v (value) {
    return {kind: 'vector', value: Array.prototype.slice.apply(arguments) };
  }
});
