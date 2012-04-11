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
  var func = lookupFunction(expr.shift());

  return func.apply({}, expr);
}

function lookupFunction (name) {
  if (name === '+') {
    return function () {
      var i, sum = 0;

      for (i = 0; i < arguments.length; ++i) {
        sum += +arguments[i];
      }

      return sum;
    }
  }
}
