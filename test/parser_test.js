var parser = require('../src/parser.js')
  ;

describe('Parser', function () {
  it('should parse simple expression', function () {
    parser.parse('(+ 1 1)').should.eql([['+', '1', '1']]);
  });

  it('should parse nested expression', function () {
    parser.parse('(+ 1 (* 2 3))').should.eql([['+', '1', ['*', '2', '3']]]);
  });

  it('should parse function call', function () {
    parser.parse('(func 1 2)').should.eql([['func', '1', '2']]);
  });

  it('should ignore spaces', function () {
    parser.parse('(func   1   2)').should.eql([['func', '1', '2']]);
  });

  it('should parse strings', function () {
    parser.parse('(concat "abc" "def")').should.eql([['concat', 'abc', 'def']]);
  });

  it('should include spaces in strings', function () {
    parser.parse('(concat "abc def")').should.eql([['concat', 'abc def']]);
  });

  it('should ignore special characters in strings', function () {
    parser.parse('(concat "(" ")" "\\"" "\'" \'\\\'\' \'"\')')
      .should.eql([['concat', '(', ')', '\\"', '\'', '\\\'', '"']]);
  });
});
