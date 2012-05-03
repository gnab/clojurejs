var evaluator = require('../evaluator')
  , Namespace = require('../namespace').Namespace
  , forms = require('../forms')
  , list = forms.list
  , literal = forms.literal
  ;

exports.def = function (name, init) {
  var context = this
    , value = (typeof init === 'undefined' ? literal(null) 
        : evaluator.evaluate([init], context))
    ;

  Namespace.current.set(name.value, value);
};

exports.def.macro = true;

exports['if'] = function (test, then, els) {
  var context = this
    , result = evaluator.evaluate([test], context)
    ;

  if (result.value !== null && result.value !== false) {
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

    return evaluator.evaluate(exprs === undefined ? [] : [exprs], context);
  };
};

exports.fn.macro = true;

exports['let'] = function (bindings, exprs) {
  var context = this
    , i
    , param
    , value
    ;

  if (bindings.value.length % 2 !== 0) {
    throw new Error('let requires an even number of forms in binding vector');
  }

  for (i = 0; i < bindings.value.length; i += 2) {
    param = bindings.value[i].value;
    value = evaluator.evaluate([bindings.value[i+1]], context);

    context.set(param, value);
  }

  return evaluator.evaluate([exprs], context);
};

exports['let'].macro = true;
