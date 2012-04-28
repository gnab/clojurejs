var Namespace = require('../namespace').Namespace
  , core = require('./core')
  ;

exports.ns = function (name) {
  var ns = new Namespace(name.value);
  ns.use(core);

  Namespace.current = ns;
};

exports.ns.macro = true;
