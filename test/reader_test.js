var reader = require('../src/reader')
  , forms = require('../src/forms')
  , number = forms.number
  , string = forms.string
  , literal = forms.literal
  , symbol = forms.symbol
  , keyword = forms.keyword
  , vector = forms.vector
  , list = forms.list
  , call = forms.call
  ;

describe('Reader', function () {
  describe('number parsing', function () {
    it('should read integers', function () {
      reader.read('42').should.eql([number(42)]);
    });
  });

  describe('string parsing', function () {
    it('should read strings', function () {
      reader.read('"clojure"').should.eql([string('clojure')]);
    });

    it('should read strings with escapes', function () {
      reader.read('"clo\\"jure"').should.eql([string('clo\\"jure')]);
    });
  });

  describe('literal parsing', function () {
    it('should read true', function () {
      reader.read('true').should.eql([literal('true')]);
    });

    it('should read false', function () {
      reader.read('false').should.eql([literal('false')]);
    });

    it('should read nil', function () {
      reader.read('nil').should.eql([literal('nil')]);
    });

    it('should ignore symbols with leading literal names', function () {
      reader.read('nil?').should.eql([symbol('nil?')]);
    });
  });

  describe('symbol parsing', function () {
    it('should read alphanumeric symbols', function () {
      reader.read('a1').should.eql([symbol('a1')]);
    });

    it('should read symbols with special characters', function () {
      reader.read('*+!-_?').should.eql([symbol('*+!-_?')]);
      reader.read('/').should.eql([symbol('/')]);
      reader.read('=').should.eql([symbol('=')]);
      reader.read('.').should.eql([symbol('.')]);
    });

    it('should read namespaced symbols', function () {
      reader.read('a.b.c/d').should.eql([symbol('a.b.c', 'd')]);
    });
  });

  describe('keyword parsing', function () {
    it('should read keywords', function () {
      reader.read(':clojure').should.eql([keyword('clojure')]);
    });

    it('should read namespaced keywords', function () {
      reader.read(':a.b.c/d').should.eql([keyword('a.b.c', 'd')]);
    });
  });

  describe('vector parsing', function () {
    it('should read vectors', function () {
      reader.read('[42 "clojure"]').should.eql([vector(number(42), string('clojure'))]);
    });
  });

  describe('list parsing', function () {
    it('should read empty lists', function () {
      reader.read('()').should.eql([list()]);
    });

    it('should read quoted lists', function () {
      var expList = list(number(42), string('clojure'));
      expList.quoted = true;
      reader.read('\'(42 "clojure")').should.eql([expList]);
    });
    it('should read syntax-quoted lists', function () {
      var expList = list(number(42), string('clojure'));
      expList.quoted = true;
      reader.read('`(42 "clojure")').should.eql([expList]);
    });
    it('numbers in quoted lists should get handled correctly', function () {
      reader.read('\'(1 2 3)')[0].value[0].value.should.equal(1);
    });
  });

  describe('call parsing', function () {
    it('should read no-argument calls', function () {
      reader.read('(func)').should.eql([call(symbol('func'))]);
    });

    it('should read calls with arguments', function () {
      reader.read('(+ 1 1)').should.eql([call(symbol('+'), number(1), number(1))]);
    });

    it('should read nested calls', function () {
      var expCall = call(symbol('+'), number(1),
        call(symbol('*'), number(2), number(3)), number(4));
      expCall.quoted = false;
      reader.read('(+ 1 (* 2 3) 4)').should.eql([expCall]);
    });
  });

  describe('comment parsing', function () {
    it('should ignore comments', function () {
      reader.read(';ignore this line').should.eql([]);
    });
  });

  describe('map parsing', function () {
    it('should read maps', function () {
    });
  });
});
