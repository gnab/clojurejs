var reader = require('../src/reader')
  , tokens = require('./tokens')
  , e = tokens.e, i = tokens.i, n = tokens.n, v = tokens.v, s = tokens.s
  ;

describe('Reader', function () {
  it('should read simple expression', function () {
    reader.read('(+ 1 1)').should.eql([e(i('+'), n('1'), n('1'))]);
  });

  it('should read nested expression', function () {
    reader.read('(+ 1 (* 2 3))').should.eql([e(i('+'), n('1'),
      e(i('*'), n('2'), n('3')))]);
  });

  it('should read function call', function () {
    reader.read('(func 1 2)').should.eql([e(i('func'), n('1'), n('2'))]);
  });

  it('should ignore spaces', function () {
    reader.read('(func   1   2)').should.eql([e(i('func'), n('1'), n('2'))]);
  });

  it('should read strings', function () {
    reader.read('(concat "abc" "def")').should.eql([e(i('concat'), s('abc'), s('def'))]);
  });

  it('should include spaces in strings', function () {
    reader.read('(concat "abc def")').should.eql([e(i('concat'), s('abc def'))]);
  });

  it('should ignore special characters in strings', function () {
    reader.read('(concat "(" ")" "\\"" "[" "]")')
      .should.eql([e(i('concat'), s('('), s(')'), s('\\"'), s('['), s(']'))]);
  });

  it('should read vectors', function () {
    reader.read('(defn [a b c])').should.eql([e(i('defn'), v(i('a'), i('b'), i('c')))]);
  });
});
