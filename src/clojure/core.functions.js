var evaluator = require('../evaluator')
  , specialforms = require('../../src/clojure/specialforms')
  , Namespace = require('../../src/namespace').Namespace
  ;

exports.partial = function () {
  var func = arguments[0]
    , args = Array.prototype.slice.call(arguments, 1)
    ;

  return function () {
    var context = this;

    return function () {
      Array.prototype.map.call(arguments, function (a) { args.push(a); });
      return func.apply(context, args);
    }.apply(context, arguments);
  };
};

exports.defn = function (name, args, exprs) {
  Namespace.current.set(name.value, specialforms.fn.call(this, args, exprs));
};

exports.defn.macro = true;
