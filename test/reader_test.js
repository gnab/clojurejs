var reader = require('../src/reader.js')
  ;

describe('Reader', function () {
  it('should parse simple expression', function () {
    reader.parse('(+ 1 1)').should.eql([['+', '1', '1']]);
  });

  it('should parse nested expression', function () {
    reader.parse('(+ 1 (* 2 3))').should.eql([['+', '1', ['*', '2', '3']]]);
  });

  it('should parse function call', function () {
    reader.parse('(func 1 2)').should.eql([['func', '1', '2']]);
  });

  it('should ignore spaces', function () {
    reader.parse('(func   1   2)').should.eql([['func', '1', '2']]);
  });

  it('should parse strings', function () {
    reader.parse('(concat "abc" "def")').should.eql([['concat', 'abc', 'def']]);
  });

  it('should include spaces in strings', function () {
    reader.parse('(concat "abc def")').should.eql([['concat', 'abc def']]);
  });

  it('should ignore special characters in strings', function () {
    reader.parse('(concat "(" ")" "\\"" "\'" \'\\\'\' \'"\')')
      .should.eql([['concat', '(', ')', '\\"', '\'', '\\\'', '"']]);
  });

  it('should parse vectors', function () {
    reader.parse('(defn [a b c])').should.eql([['defn', ['a', 'b', 'c']]]);
  });
});
