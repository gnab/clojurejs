var clojure = require('../../src/clojure')
  , forms = require('../../src/forms')
  , list = forms.list
  , string = forms.string
  , number = forms.number
  ;

describe('Sequences', function () {
  it('map', function () {
    clojure.run('(map odd? [1 2 3])').should.eql([true, false, true]);
  });

  it('map', function () {
    clojure.run('(map odd? \'(1 2 3))').should.eql([true, false, true]);
  });

  it('concat', function () {
    clojure.run('(concat \'(1) \'(2)').should.eql(list(number('1'), number('2')));
  });

  it('concat three lists', function () {
    clojure.run('(concat \'(1) \'(2) \'(3)').should.eql(list(number('1'), number('2'), 
     number('3')));
  });
  it('cons', function () {
    var expList = list(number('1'), number('2'), number('3')); 
    expList.quoted = true;
    clojure.run('(cons 1 \'(2 3)').should.eql(expList);
  });
});
