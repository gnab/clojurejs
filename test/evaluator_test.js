var evaluator = require('../src/evaluator.js')
  , tokens = require('../src/tokens')
  , Namespace = require('../src/namespace').Namespace
  , call = tokens.call
  , symbol = tokens.symbol
  , number = tokens.number
  , vector = tokens.vector
  , string = tokens.string
  ;

describe('Evaluator', function () {
  describe('Expressions', function () {
    it('should evaluate numbers', function () {
      evaluator.evaluate([number('42')]).should.equal(42);
    });

    it('should evaluate strings', function () {
      evaluator.evaluate([string('clojure')]).should.equal('clojure');
    });

    it('should evaluate symbols', function () {
      var context = new Namespace();
      context.set('a', 5);
      evaluator.evaluate([symbol('a')], context).should.equal(5);
    });

    it('should evaluate vectors', function () {
      evaluator.evaluate([vector(number(42), string('clojure'))]).should.eql([42, 'clojure']);
    });

    it('should evaluate calls', function () {
      var context = new Namespace();
      context.set('f', function () { return 42; });
      evaluator.evaluate([call(symbol('f'))], context).should.equal(42);
    });
  });
});
