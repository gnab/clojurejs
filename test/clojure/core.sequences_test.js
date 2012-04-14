var clojure = require('../../src/clojure');

describe('Sequences', function () {
  it('map', function () {
    clojure.run('(map odd? [1 2 3])').should.eql([true, false, true]);
  });
});
