var clojure = require('../../src/clojure')
  , Namespace = require('../../src/namespace').Namespace
  ;

describe('Namespace', function () {
  describe('ns', function () {
    it('should create namespace and make it current namespace', function () {
      clojure.run('(ns some-namespace)');

      Namespace.current.__name__.should.equal('some-namespace');
    });
  });
});
