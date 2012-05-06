var clojure = require('../../src/clojure')
  , forms = require('../../src/forms')
  , list = forms.list
  , number = forms.number
  , string = forms.string
  ;

describe('Collections', function () {
  describe('Lists', function() {
    it('first', function () {
      clojure.run('(first \'(1 2 3)').should.eql(number(1));
    });
    it('second', function () {
      clojure.run('(second \'(1 2 3)').should.eql(number(2));
    });
    it('nth', function () {
      clojure.run('(nth \'(0 1 2) 1').should.eql(number(1));
    });
    it('rest', function () {
      var expList = list(number(2), number(3));
      expList.quoted = true;
      clojure.run('(rest \'(1 2 3)').should.eql(expList);
    });
    it('list', function () {
      var expList = list(number(1), number(2));
      expList.quoted = true;
      clojure.run('(list 1 2)').should.eql(expList);
    });
  });
});
