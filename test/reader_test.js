var reader = require('../src/reader')
  , tokens = require('../src/tokens')
  , c = tokens.c, i = tokens.i, n = tokens.n, v = tokens.v, s = tokens.s, l = tokens.l
  ;

describe('Reader', function () {
  describe('numbers', function () {
    it('should read integers', function () {
      reader.read('42').should.eql([n('42')]);
    });
  });

  describe('identifiers', function () {
    it('should read alphanumeric identifiers', function () {
      reader.read('a1').should.eql([i('a1')]);
    });

    it('should read identifiers with special characters', function () {
      reader.read('+').should.eql([i('+')]);
      reader.read('-').should.eql([i('-')]);
      reader.read('*').should.eql([i('*')]);
      reader.read('/').should.eql([i('/')]);
      reader.read('=').should.eql([i('=')]);

      reader.read('odd?').should.eql([i('odd?')]);
    });
  });

  describe('strings', function () {
    it('should read strings', function () {
      reader.read('"clojure"').should.eql([s('clojure')]);
    });

    it('should read strings with escapes', function () {
      reader.read('"clo\\"jure"').should.eql([s('clo\\"jure')]);
    });
  });

  describe('vectors', function () {
    it('should read vectors', function () {
      reader.read('[42 "clojure"]').should.eql([v(n('42'), s('clojure'))]);
    });
  });

  describe('lists', function () {
    it('should read empty lists', function () {
      reader.read('()').should.eql([l()]);
    });

    it('should read lists', function () {
      reader.read('\'(42 "clojure")').should.eql([l(n('42'), s('clojure'))]);
    });
  });

  describe('calls', function () {
    it('should read no-argument calls', function () {
      reader.read('(func)').should.eql([c(i('func'))]);
    });

    it('should read calls with arguments', function () {
      reader.read('(+ 1 1)').should.eql([c(i('+'), n('1'), n('1'))]);
    });

    it('should read nested calls', function () {
      reader.read('(+ 1 (* 2 3) 4)').should.eql([c(i('+'), n('1'),
        c(i('*'), n('2'), n('3')), n('4'))]);
    });
  });
});
