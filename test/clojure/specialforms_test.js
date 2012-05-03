var clojure = require('../../src/clojure')
  , Namespace = require('../../src/namespace').Namespace
  , forms = require('../../src/forms')
  , number = forms.number
  , literal = forms.literal
  ;

describe('Special Forms', function () {
  beforeEach(function () {
    Namespace.reset();
  });

  describe('def', function () {
    it('should define var with null value by default', function () {
      clojure.run('(def a)');

      Namespace.current.get('a').should.eql(literal(null));
    });
    it('should define var with given value', function () {
      clojure.run('(def a 5)');

      Namespace.current.get('a').should.eql(number(5));
    });
  });

  it('if', function () {
    clojure.run('(if true 42 (this-is-not-evaluated)').should.eql(number(42));
    clojure.run('(if false (this-is-not-evaluated) 43)').should.eql(number(43));
  });

  describe('fn', function () {
    it('should define anonymous function', function () {
      clojure.run('((fn [a b] (+ a b)) 1 2)').should.eql(number(3));
    });

    it('should define anonymous function without body', function () {
      clojure.run('((fn [a b]))').should.eql(literal(null));
    });
  });

  describe('let', function () {
    it('should apply bindings to inner context', function () {
      Namespace.current.set('x', number(1));
      clojure.run('(let [x 2] x)').should.eql(number(2));
      clojure.run('x').should.eql(number(1));
    });

    it('should throw exception when uneven number of bindings', function () {
      (function () { clojure.run('(let [x 1 y])');})
        .should.throw(/let requires an even number of forms in binding vector/);
    });
  });
});
