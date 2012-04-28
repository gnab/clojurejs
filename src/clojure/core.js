var Namespace = require('../namespace').Namespace
  , core = module.exports = new Namespace('clojure.core')
  ;

core.set('true', true);
core.set('false', false);
core.set('nil', null);

// Based on http://clojure.org/cheatsheet
use(require('./core.specialforms'));
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
