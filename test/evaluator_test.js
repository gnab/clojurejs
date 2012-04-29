var evaluator = require('../src/evaluator.js')
  , specialforms = require('../src/clojure/specialforms')
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
  beforeEach(function () {
    Namespace.reset();
  });

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
    it('should evaluate qualified symbols in current namespace', function () {
      Namespace.current.set('a', 1);
      evaluator.evaluate([symbol('user', 'a')], Namespace.current).should.equal(1);
    });

    it('should evaluate qualified symbols in other namespace', function () {
      Namespace.current.set('a', 1);
      Namespace.set('other');
      evaluator.evaluate([symbol('user', 'a')], Namespace.current).should.equal(1);
    });

    it('should let special forms take precedence over vars', function () {
      Namespace.current.set('def', 1);
      evaluator.evaluate([symbol('def')], Namespace.current)
        .should.equal(specialforms.def);
    });

    it('should evaluate qualified special form-named vars', function () {
      Namespace.current.set('def', 1);
      evaluator.evaluate([symbol('user', 'def')], Namespace.current).should.equal(1);
    });

    it('should not evaluate undefined, qualified special form-named vars', function () {
      (function () { evaluator.evaluate([symbol('user', 'def')], Namespace.current); })
        .should.throw(/No such var: user\/def/);
    });

    it('should evaluate vars in current namespace', function () {
      Namespace.current.set('a', 1);
      evaluator.evaluate([symbol('a')], Namespace.current).should.equal(1);
    });

    it('should evaluate vars in context extending namespace', function () {
      Namespace.current.set('a', 1);
      evaluator.evaluate([symbol('a')], Namespace.current.extend()).should.equal(1);
    });

    it('should throw error when symbol cannot be resolved', function () {
      (function () { evaluator.evaluate([symbol('a')], Namespace.current)})
        .should.throw(/Unable to resolve symbol: a in this context/);
    });
  });

  describe('vector evaluation', function () {
    it('should evaluate vectors', function () {
      evaluator.evaluate([vector(number(42), string('clojure'))]).should.eql([42, 'clojure']);
    });
  });

  describe('call evaluation', function () {
    it('should evaluate calls', function () {
      Namespace.current.set('f', function () { return 42; });
      evaluator.evaluate([call(symbol('f'))], Namespace.current).should.equal(42);
    });
  });
});
