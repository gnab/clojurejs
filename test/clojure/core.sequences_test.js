var core = require('../../src/clojure/core.sequences');

describe('Sequences', function () {
  it('map', function () {
    var pos = function (n) { return n >= 0; };

    core.map(pos, [-1, 0, 1]).should.eql([false, true, true]);
  });
});
