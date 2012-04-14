var core = require('../../src/clojure/core.specialforms')
  , evaluator = require('../../src/evaluator')
  , tokens = require('../tokens')
  , e = tokens.e, n = tokens.n, i = tokens.i
  ;

describe('Special Forms', function () {
  it('def', function () {
    core.def('a', 5);

    evaluator.globalContext.should.have.property('a', 5);
  });

  it('if', function () {
    var context = evaluator.extendContext(core);
    context['false'] = false;

    var exprs1 = [e(i('if'), n(1), n(42))];             // (if 1 42)
    var exprs2 = [e(i('if'), i('false'), n(1), n(43))]; // (if false 1 43)

    evaluator.evaluate(exprs1, context).should.equal(42);
    evaluator.evaluate(exprs2, context).should.equal(43);
  });
});
