var parser = require('../src/parser.js')
  ;

describe('Parser', function () {
  it('should parse simple arithmetic expression', function () {
    parser.parse('(+ 1 1)').should.eql([['+', '1', '1']]);
  });

  it('should parse simple function call', function () {
    parser.parse('(func 1 2)').should.eql([['func', '1', '2']]);
  });

  describe('strings', function () {
    it('should parse strings', function () {
      parser.parse('(concat "abc(" ")def")').should.eql([['concat', 'abc(', ')def']]);
    });

    it('should ignore strings inside strings', function () {
      parser.parse('(alert \'ab"cd"ef\')').should.eql([['alert', 'ab"cd"ef']]);
    });

    it('should ignore escaped strings', function () {
      parser.parse('(alert "ab\\"cd")').should.eql([['alert', 'ab\\"cd']]);
    });
  });

});
