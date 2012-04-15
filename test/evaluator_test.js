var evaluator = require('../src/evaluator.js')
  , tokens = require('../src/tokens')
  , c = tokens.c, i = tokens.i, n = tokens.n, v = tokens.v, s = tokens.s
  ;

describe('Evaluator', function () {
  describe('Expressions', function () {
    it('should evaluate numbers', function () {
      evaluator.evaluate([n('42')]).should.equal(42);
    });

    it('should evaluate strings', function () {
      evaluator.evaluate([s('clojure')]).should.equal('clojure');
    });

    it('should evaluate identifiers', function () {
      evaluator.evaluate([i('a')], {a: 5}).should.equal(5);
    });

    it('should evaluate vectors', function () {
      evaluator.evaluate([v(n(42), s('clojure'))]).should.eql([42, 'clojure']);
    });

    it('should evaluate calls', function () {
      evaluator.evaluate([c(i('f'))], {f: function () { return 42; }}).should.equal(42);
    });
  });
});
