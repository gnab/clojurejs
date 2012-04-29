var clojure = require('../../src/clojure')
  , Namespace = require('../../src/namespace').Namespace
  , should = require('should')
  ;

describe('Functions', function () {
  beforeEach(function () {
    Namespace.reset();
  });

  it('partial', function () {
    clojure.run('((partial + 2) 3)').should.equal(5);
  });

  describe('defn', function () {
    it('should define function', function () {
      clojure.run('(defn testfun [a b] (+ a b))');
      clojure.run('(testfun 1 2)').should.equal(3);
    });

    it('should define function without body', function () {
      clojure.run('(defn testfun [])');
      should.strictEqual(clojure.run('(testfun)'), undefined);
    });
  });
});
