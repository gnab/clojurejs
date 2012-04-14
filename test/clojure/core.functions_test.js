var clojure = require('../../src/clojure');

describe('Functions', function () {
  it('partial', function () {
    clojure.run('((partial + 2) 3)').should.equal(5);
  });
});
