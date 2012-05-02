var clojure = require('../../src/clojure');

describe('Compare', function () {
      it('=', function () {
        clojure.run('(= 1 1)').should.equal(true);
      });
      it('=', function () {
        clojure.run('(= 1 2)').should.equal(false);
      });
      it('=', function () {
        clojure.run('(= "a" "a")').should.equal(true);
      });
      it('=', function () {
        clojure.run('(= "a" "b")').should.equal(false);
      });
      it('=', function () {
        clojure.run('(= \'(1 2) \'(1 2)').should.equal(true);
      });
});
