var clojure = require('../../src/clojure')
  , tokens = require('../../src/tokens')
  , list = tokens.list
  , number = tokens.number
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
    it('rest', function () {
      var expList = list(number('2'), number('3'));
      expList.quoted = true;
      clojure.run('(rest \'(1 2 3)').should.eql(expList);
    });
  });
});
