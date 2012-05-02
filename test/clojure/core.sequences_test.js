var clojure = require('../../src/clojure');

describe('Sequences', function () {
  it('map', function () {
    clojure.run('(map odd? [1 2 3])').should.eql([true, false, true]);
  });
  it('concat', function () {
    clojure.run('(concat \'(1 2 3) \'(4 5 6)').should.eql('(1 2 3 4 5 6)');
  });
});
