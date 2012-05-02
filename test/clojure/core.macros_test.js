var clojure = require('../../src/clojure');

describe('Macros', function () {
  it('defmacro', function () {
    clojure.run('(defmacro unless [expr body] `(if expr nil body))');
    clojure.run('(unless (= 1 2) (+ 1 2))').should.equal(3);
  });

  describe('assert', function () {
    it('should throw exception when condition is false', function () {
      (function () { clojure.run('(assert (= 1 2))'); })
        .should.throw(/Assert failed: \(= 1 2\)/);
    });

    it('should handle unfinished asserts', function () {
      (function () { clojure.run('(assert (= __ 2))'); })
        .should.throw(/Assert failed: \(= __ 2\)/);
    });

    it('should not throw exception when condition is true', function () {
      (function () { clojure.run('(assert (= 1 1))'); }).should.not.throw();
    });
  });
}); 
