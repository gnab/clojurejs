var Namespace = require('./namespace').Namespace
  , core = require('./clojure/core')
  , tokens = require('./tokens')
  ;

exports.evaluate = evaluate;

function evaluate (exprs, context) {
  context = context || Namespace.current;

  return exprs.map(function (e) { return evaluateExpression(e, context); }).slice(-1)[0];
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
      return expr.value.map(function (e) { return evaluateExpression(e, context);});
    case 'call':
      return evaluateCall(expr, context.extend());
  }
}

function evaluateCall (expr, context) {
  var func = evaluateExpression(expr.value[0], context)
    , args = expr.value.slice(1)
    ;

  if (!func.macro) {
    args = args.map(function (a) { return evaluateExpression(a, context);});
  }

  return func.apply(context, args);
}

function lookupIdentifier (name, context) {
  if (name === 'true') return true;
  if (name === 'false') return false;
  if (name === 'nil') return null;

  if (typeof context.get(name) !== 'undefined') {
    return context.get(name);
  }

  if (typeof window !== 'undefined' && typeof window[name] !== 'undefined') {
    return function () {
      return window[name].apply(window, arguments);
    };
  }

  if (typeof global !== 'undefined' && typeof global[name] !== 'undefined') {
    return function () {
      return global[name].apply(global, arguments);
    };
  }

  throw new Error('Unable to resolve symbol: ' + name + ' in this context');
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
