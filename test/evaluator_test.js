var evaluator = require('../src/evaluator.js')
  , should = require('should')
  , tokens = require('../src/tokens')
  , Namespace = require('../src/namespace').Namespace
  , number = tokens.number
  , string = tokens.string
  , literal = tokens.literal
  , symbol = tokens.symbol
  , vector = tokens.vector
  , call = tokens.call
  ;

describe('Evaluator', function () {
  describe('number evaluation', function () {
    it('should evaluate numbers', function () {
      evaluator.evaluate([number('42')]).should.equal(42);
    });
  });

  describe('string evaluation', function () {
    it('should evaluate strings', function () {
      evaluator.evaluate([string('clojure')]).should.equal('clojure');
    });
  });

  describe('literal evaluation', function () {
    it('should evaluate true', function () {
      evaluator.evaluate([literal('true')]).should.equal(true);
    });

    it('should evaluate false', function () {
      evaluator.evaluate([literal('false')]).should.equal(false);
    });

    it('should evaluate nil', function () {
      should.strictEqual(evaluator.evaluate([literal('nil')]), null);
    });
  });

  describe('symbol evaluation', function () {
    it('should evaluate symbols', function () {
      var context = new Namespace();
      context.set('a', 5);
      evaluator.evaluate([symbol('a')], context).should.equal(5);
    });
  });

  describe('vector evaluation', function () {
    it('should evaluate vectors', function () {
      evaluator.evaluate([vector(number(42), string('clojure'))]).should.eql([42, 'clojure']);
    });
  });

  describe('call evaluation', function () {
    it('should evaluate calls', function () {
      var context = new Namespace();
      context.set('f', function () { return 42; });
      evaluator.evaluate([call(symbol('f'))], context).should.equal(42);
    });
  });
});
