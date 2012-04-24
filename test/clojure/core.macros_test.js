var clojure = require('../../src/clojure');

describe('Macros', function () {
  it('defmacro', function () {
    clojure.run('(defmacro unless [expr body] `(if ~expr nil ~body))');
    clojure.run('(unless (= 1 2) (+ 1 2))').should.equal(3);
  });
}); 
