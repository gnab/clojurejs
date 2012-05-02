var Namespace = require('../namespace').Namespace
  , core = module.exports = new Namespace('clojure.core')
  ;

// Based on http://clojure.org/cheatsheet
use(require('./core.collections.lists'));
use(require('./core.primitives.numbers.arithmetic'));
use(require('./core.primitives.numbers.test'));
use(require('./core.functions'));
use(require('./core.sequences'));
use(require('./core.misc'));
use(require('./core.macros'));
use(require('./core.io'));
use(require('./core.namespace'));

function use (vars) {
  var name;

  for (name in vars) {
    core.set(name, vars[name]);
  }
}
