var clojure = require('../src/clojure')
  ;

describe('Clojure JS', function () {
  it('should execute simple expression', function () {
    clojure.run('(+ 1 1)').should.equal(2);
  });

  it('should execute nested expression', function () {
    clojure.run('(+ 1 (* 2 3)').should.equal(7);
  });

  it('should execute core functions', function () {
    clojure.run('(odd? 13)').should.equal(true);
    clojure.run('(even? 13)').should.equal(false);
  });

  it('should execute anonymous functions', function () {
    var f1 = clojure.run('(fn [a b] (+ a b))');

    f1(1, 2).should.equal(3);

    var f2 = clojure.run('(fn [a] (fn [b] (+ a b)))');

    f2(1)(2).should.equal(3);
  });

  it('should execute partial functions', function () {
    var f = clojure.run('(partial - 2)');

    f(3).should.equal(-1);
  });

  it('should execute JavaScript functions', function () {
    clojure.run('(parseInt "42")').should.equal(42);
  });
});
