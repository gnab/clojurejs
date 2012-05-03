var evaluator = require('../src/evaluator.js')
  , specialforms = require('../src/clojure/specialforms')
  , should = require('should')
  , forms = require('../src/forms')
  , Namespace = require('../src/namespace').Namespace
  , number = forms.number
  , string = forms.string
  , literal = forms.literal
  , symbol = forms.symbol
  , vector = forms.vector
  , list = forms.list
  , call = forms.call
  ;

describe('Evaluator', function () {
  beforeEach(function () {
    Namespace.reset();
  });

  it('should evaluate numbers', function () {
    evaluator.evaluate([number('42')]).should.eql(number(42));
  });

  it('should evaluate strings', function () {
    evaluator.evaluate([string('clojure')]).should.eql(string('clojure'));
  });

  describe('literal evaluation', function () {
    it('should evaluate true', function () {
      evaluator.evaluate([literal('true')]).should.eql(literal(true));
    });

    it('should evaluate false', function () {
      evaluator.evaluate([literal('false')]).should.eql(literal(false));
    });

    it('should evaluate nil', function () {
      evaluator.evaluate([literal('nil')]).should.eql(literal(null));
    });
  });

  describe('symbol evaluation', function () {
    it('should evaluate qualified symbols in current namespace', function () {
      Namespace.current.set('a', number(1));
      evaluator.evaluate([symbol('user', 'a')], Namespace.current).should.eql(number(1));
    });

    it('should evaluate qualified symbols in other namespace', function () {
      Namespace.current.set('a', number(1));
      Namespace.set('other');
      evaluator.evaluate([symbol('user', 'a')], Namespace.current).should.eql(number(1));
    });

    it('should let special forms take precedence over vars', function () {
      Namespace.current.set('def', number(1));
      evaluator.evaluate([symbol('def')], Namespace.current)
        .should.equal(specialforms.def);
    });

    it('should evaluate qualified special form-named vars', function () {
      Namespace.current.set('def', number(1));
      evaluator.evaluate([symbol('user', 'def')], Namespace.current).should.eql(number(1));
    });

    it('should not evaluate undefined, qualified special form-named vars', function () {
      (function () { evaluator.evaluate([symbol('user', 'def')], Namespace.current); })
        .should.throw(/No such var: user\/def/);
    });

    it('should evaluate vars in current namespace', function () {
      Namespace.current.set('a', number(1));
      evaluator.evaluate([symbol('a')], Namespace.current).should.eql(number(1));
    });

    it('should evaluate vars in context extending namespace', function () {
      Namespace.current.set('a', number(1));
      evaluator.evaluate([symbol('a')], Namespace.current.extend()).should.eql(number(1));
    });

    it('should throw error when symbol cannot be resolved', function () {
      (function () { evaluator.evaluate([symbol('a')], Namespace.current)})
        .should.throw(/Unable to resolve symbol: a in this context/);
    });
  });

  describe('call evaluation', function () {
    it('should evaluate calls', function () {
      Namespace.current.set('f', function () { return 42; });
      evaluator.evaluate([call(symbol('f'))], Namespace.current).should.equal(42);
    });
  });

  describe('vector evaluation', function () {
    it('should evaluate vectors', function () {
      evaluator.evaluate([vector(number('1'), number('2'))], Namespace.current)
        .should.eql(vector(number(1), number(2)));
    });
  });

  describe('list evaluation', function () {
    it('should not eval quoted lists', function () {
      var quotedList = list(number('1'));
      quotedList.quoted = true;
      evaluator.evaluate([quotedList], Namespace.current).should.equal(quotedList);
    });
  });
});
