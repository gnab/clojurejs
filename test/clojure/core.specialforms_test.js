var core = require('../../src/clojure/core.specialforms')
  , evaluator = require('../../src/evaluator')
  ;

describe('Special Forms', function () {
  it('def', function () {
    core.def('a', 5);

    evaluator.globalContext.should.have.property('a', 5);
  });
});
