var clojure = require('../../src/clojure')
  ;

describe('Collections', function () {
  describe('Lists', function() {
    it('first', function () {
      clojure.run('(first \'(1 2 3)').should.equal(1);
    });
    it('second', function () {
      clojure.run('(second \'(1 2 3)').should.equal(2);
    });
    it('nth', function () {
      clojure.run('(nth \'(0 1 2) 1').should.equal(1);
    });
  });
});
