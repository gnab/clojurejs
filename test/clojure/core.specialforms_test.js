var clojure = require('../../src/clojure')
  , Namespace = require('../../src/namespace').Namespace
  , should = require('should')
  ;

describe('Special Forms', function () {
  beforeEach(function () {
    Namespace.reset();
  });

  describe('def', function () {
    it('should define var with null value by default', function () {
      clojure.run('(def a)');

      should.strictEqual(Namespace.current.get('a'), null);
    });
    it('should define var with given value', function () {
      clojure.run('(def a 5)');

      Namespace.current.get('a').should.equal(5);
    });
  });

  it('if', function () {
    clojure.run('(if true 42 (this-is-not-evaluated)').should.equal(42);
    clojure.run('(if false (this-is-not-evaluated) 43)').should.equal(43);
  });

  describe('fn', function () {
    it('should define anonymous function', function () {
      clojure.run('((fn [a b] (+ a b)) 1 2)').should.equal(3);
    });

    it('should define anonymous function without body', function () {
      should.strictEqual(clojure.run('((fn [a b]))'), undefined);
    });
  });

  describe('let', function () {
    it('should apply bindings to inner context', function () {
      Namespace.current.set('x', 1);
      clojure.run('(let [x 2] x)').should.equal(2);
      clojure.run('x').should.equal(1);
    });

    it('should throw exception when uneven number of bindings', function () {
      (function () { clojure.run('(let [x 1 y])')})
        .should.throw(/let requires an even number of forms in binding vector/);
    });
  });
});
