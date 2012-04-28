var evaluator = require('../evaluator')
  , Namespace = require('../namespace').Namespace
  ;

exports.def = function (name, init) {
  var context = this;

  Namespace.current.set(name.value, evaluator.evaluate([init], context));
};

exports.def.macro = true;

exports['if'] = function (test, then, els) {
  var context = this
    , result = evaluator.evaluate([test], context)
    ;

  if (result !== null && result !== false) {
    return evaluator.evaluate([then], context);
  }

  if (typeof els !== 'undefined') {
    return evaluator.evaluate([els], context);
  }
};

exports['if'].macro = true;

exports.fn = function (params, exprs) {
  var context = this;

  return function () {
    var args = arguments;

    params.value.map(function (arg, i) {
      context.set(arg.value, args[i]);
    });

    return evaluator.evaluate([exprs], context);
  };
};

exports.fn.macro = true;

exports.defn = function (name, args, exprs) {
  Namespace.current.set(name.value, exports.fn.call(this, args, exprs));
};

exports.defn.macro = true;
