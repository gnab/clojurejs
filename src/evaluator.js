if (typeof exports !== 'undefined') {
  exports.evaluate = evaluate;
}

function evaluate (exprs) {
  var id
    , result;

  for (id in exprs) {
    if (exprs.hasOwnProperty(id)) {
      result = evaluateExpression(exprs[id]);
    }
  }

  return result;
}

function evaluateExpression (expr) {
  switch (expr.kind) {
    case 'number':
      return +expr.value;
    case 'string':
      return expr.value;
    case 'identifier':
      return lookupFunction(expr.value);
    case 'expression':
      return evaluateFunction(expr);
  }

  var func = lookupFunction(expr.shift());

  return func.apply({}, expr);
}

function evaluateFunction (expr) {
  var func = evaluateExpression(expr.value.shift())
    , args = []
    ;

  while (expr.value.length) {
    args.push(evaluateExpression(expr.value.shift()));
  }

  return func.apply({}, args);
}

function lookupFunction (name) {
  if (name === '+') {
    return function () {
      var i, sum = 0;

      for (i = 0; i < arguments.length; ++i) {
        sum += +arguments[i];
      }

      return sum;
    };
  }
}
