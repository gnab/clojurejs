var clojure = require('../../src/clojure')
  , Namespace = require('../../src/namespace').Namespace
  ;

describe('Namespace', function () {
  it('ns', function () {
    clojure.run('(ns some-namespace)');

    Namespace.current.name.should.equal('some-namespace');
  });
});
