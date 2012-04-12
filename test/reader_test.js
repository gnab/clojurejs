var reader = require('../src/reader.js')
  ;

describe('Reader', function () {
  it('should parse simple expression', function () {
    reader.parse('(+ 1 1)').should.eql([e(i('+'), n('1'), n('1'))]);
  });

  it('should parse nested expression', function () {
    reader.parse('(+ 1 (* 2 3))').should.eql([e(i('+'), n('1'),
      e(i('*'), n('2'), n('3')))]);
  });

  it('should parse function call', function () {
    reader.parse('(func 1 2)').should.eql([e(i('func'), n('1'), n('2'))]);
  });

  it('should ignore spaces', function () {
    reader.parse('(func   1   2)').should.eql([e(i('func'), n('1'), n('2'))]);
  });

  it('should parse strings', function () {
    reader.parse('(concat "abc" "def")').should.eql([e(i('concat'), s('abc'), s('def'))]);
  });

  it('should include spaces in strings', function () {
    reader.parse('(concat "abc def")').should.eql([e(i('concat'), s('abc def'))]);
  });

  it('should ignore special characters in strings', function () {
    reader.parse('(concat "(" ")" "\\"" "\'" \'\\\'\' \'"\')')
      .should.eql([e(i('concat'), s('('), s(')'), s('\\"'), s('\''), s('\\\''), s('"'))]);
  });

  it('should parse vectors', function () {
    reader.parse('(defn [a b c])').should.eql([e(i('defn'), v(i('a'), i('b'), i('c')))]);
  });

  function n (value) { return {kind: 'number', value: value }; }
  function s (value) { return {kind: 'string', value: value }; }
  function i (value) { return {kind: 'identifier', value: value }; }

  function e (value) {
    return {kind: 'expression', value: Array.prototype.slice.apply(arguments) };
  }

  function v (value) {
    return {kind: 'vector', value: Array.prototype.slice.apply(arguments) };
  }
});
