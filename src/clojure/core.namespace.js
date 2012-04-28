var Namespace = require('../namespace').Namespace
  ;

exports.ns = function (name) {
  Namespace.set(name.value);
};

exports.ns.macro = true;
