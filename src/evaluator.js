if (typeof exports !== 'undefined') {
  exports.evaluate = evaluate;
}

function evaluate (exprs) {
  var result;

  exprs.map(function (e) { result = evaluateExpression(e); });

  return result;
}

function evaluateExpression (expr) {
  switch (expr.kind) {
    case 'number':
      return +expr.value;
    case 'string':
      return expr.value;
    case 'identifier':
      return lookupIdentifier(expr.value);
    case 'expression':
      return evaluateFunction(expr);
  }
}

function evaluateFunction (expr) {
  var func = evaluateExpression(expr.value[0]);

  return func.apply({}, expr.value.slice(1).map(evaluateExpression));
}

function lookupIdentifier (name) {
  if (name === '+') {
    return function () {
      var sum = 0;

      Array.prototype.map.call(arguments, function (n) {
        sum += +n;
      });

      return sum;
    };
  }
  else if (name === '*') {
    return function () {
      var product = 1;

      Array.prototype.map.call(arguments, function (n) {
        product *= +n;
      });

      return product;
    };
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
