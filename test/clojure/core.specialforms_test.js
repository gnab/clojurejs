var clojure = require('../../src/clojure')
  , Namespace = require('../../src/namespace').Namespace
  , should = require('should')
  ;

describe('Special Forms', function () {
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
});
