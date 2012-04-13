var core = require('./clojure/core')
  ;

exports.evaluate = evaluate;

function evaluate (exprs, context) {
  var result;

  context = context || extendContext(core);

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
    case 'vector':
      return expr.value.map(function (a) { return evaluateExpression(a, context);});
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
  var func = evaluateExpression(expr.value[0], context)
    , args = expr.value.slice(1)
    ;

  if (!func.macro) {
    args = args.map(function (a) { return evaluateExpression(a, context);});
  }

  return func.apply(context, args);
}

function lookupIdentifier (name, context) {
  if (context[name]) {
    return context[name];
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
