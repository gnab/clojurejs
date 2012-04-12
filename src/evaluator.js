var core = require('./clojure/core')
  ;

exports.evaluate = evaluate;

function evaluate (exprs) {
  var context = {}
    , result
    ;

  exprs.map(function (e) { result = evaluateExpression(e, context); });

  return result;
}

function evaluateExpression (expr, context) {
  switch (expr.kind) {
    case 'number':
      return +expr.value;
    case 'string':
      return expr.value;
    case 'identifier':
      return lookupIdentifier(expr.value, context);
    case 'expression':
      return evaluateFunction(expr, extendContext(context));
  }
}

function extendContext(context) {
  function C () {}

  C.prototype = context;

  return new C();
}

function evaluateFunction (expr, context) {
  var func = evaluateExpression(expr.value[0], context);

  return func.apply(context, expr.value.slice(1).map(evaluateExpression));
}

function lookupIdentifier (name, context) {
  if (context[name]) {
    return context[name];
  }

  if (core[name]) {
    return core[name];
  }

  if (typeof window !== 'undefined' && window[name]) {
    return window[name];
  }
}

Array.prototype.map = Array.prototype.map || function (f) {
  var i
    , result = []
    ;

  for (i = 0; i < this.length; ++i) {
    result.push(f(this[i]));
  }

  return result;
};
