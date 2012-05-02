var clojure = require('../../src/clojure')
  , tokens = require('../../src/tokens')
  , list = tokens.list
  , number = tokens.number
  ;

describe('Sequences', function () {
  it('map', function () {
    clojure.run('(map odd? [1 2 3])').should.eql([true, false, true]);
  });
  it('concat', function () {
    clojure.run('(concat \'(1) \'(2)').should.eql(list(number('1'), number('2')));
  });
});
