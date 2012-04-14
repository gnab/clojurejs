var clojure = require('../../src/clojure')
  , evaluator = require('../../src/evaluator')
  ;

describe('Special Forms', function () {
  it('def', function () {
    clojure.run('(def a 5)');

    evaluator.globalContext.should.have.property('a', 5);
  });

  it('if', function () {
    clojure.run('(if true 42 (this-is-not-evaluated)').should.equal(42);
    clojure.run('(if false (this-is-not-evaluated) 43)').should.equal(43);
  });

  it('fn', function () {
    clojure.run('((fn [a b] (+ a b)) 1 2)').should.equal(3);
  });
});
