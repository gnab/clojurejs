var parser = require('../src/parser.js')
  ;

describe('Parser', function () {
  it('should parse simple arithmetic expression', function () {
    parser.parse('(+ 1 1)').should.eql([['+', '1', '1']]);
  });

  it('should parse simple function call', function () {
    parser.parse('(func 1 2)').should.eql([['func', '1', '2']]);
  });

  it('should parse strings', function () {
    parser.parse('(concat "abc(" ")def")').should.eql([['concat', 'abc(', ')def']]);
  });
});
