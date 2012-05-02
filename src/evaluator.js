var Namespace = require('./namespace').Namespace
  , specialforms = require('./clojure/specialforms')
  , tokens = require('./tokens')
  , number = tokens.number
  , string = tokens.string
  , literal = tokens.literal
  , symbol = tokens.symbol
  , vector = tokens.vector
  , list = tokens.list
  , call = tokens.call
  ;

exports.evaluate = evaluate;

function evaluate (exprs, context) {
  context = context || Namespace.current;

  return exprs.map(function (e) { return evaluateExpression(e, context); }).slice(-1)[0];
}

function evaluateExpression (expr, context) {
  switch (expr.kind) {
    case number.kind:
      return +expr.value;
    case string.kind:
      return expr.value;
    case literal.kind:
      return lookupLiteral(expr.value);
    case symbol.kind:
      return lookupSymbol(expr.value, expr.namespace, context);
    case vector.kind:
      return expr.value.map(function (e) { return evaluateExpression(e, context);});
    case call.kind:
      return evaluateCall(expr, context.extend());
    case list.kind:
      return expr;
  }
};

function evaluateCall (expr, context) {
  var func = evaluateExpression(expr.value[0], context)
    , args = expr.value.slice(1)
    ;

  if (!func.macro) {
    args = args.map(function (a) { return evaluateExpression(a, context);});
  }

  return func.apply(context, args);
}

function lookupLiteral (name) {
  if (name === 'true') return true;
  if (name === 'false') return false;
  if (name === 'nil') return null;
}

function lookupSymbol (name, namespace, context) {
  var symbol
    , lookups = [
        lookupQualifiedSymbol
      , lookupSpecialForm
      , lookupContextSymbol
      , lookupWindowSymbol
      , lookupGlobalSymbol
      , throwLookupError
      ];

  lookups.find(function (lookup) {
    return (symbol = lookup.call(this, name, namespace, context)) !== undefined;
  });

  return symbol;
}

function lookupQualifiedSymbol (name, namespace) {
  if (namespace !== undefined) {
    if (Namespace.get(namespace) === undefined) {
      throw new Error('No such namespace: ' + namespace);
    }

    return Namespace.get(namespace).get(name);
  }
}

function lookupSpecialForm (name, namespace) {
  if (namespace !== undefined) {
    return;
  }

  var form = specialforms[name];

  if (typeof form === 'function') {
    return form;
  }
}

function lookupContextSymbol (name, namespace, context) {
  if (context.get(name) !== undefined) {
    return context.get(name);
  }
}

function lookupWindowSymbol (name) {
  if (typeof window !== 'undefined' && window[name] !== undefined) {
    return function () {
      return window[name].apply(window, arguments);
    };
  }
}

function lookupGlobalSymbol (name) {
  if (typeof global !== 'undefined' && global[name] !== undefined) {
    return function () {
      return global[name].apply(global, arguments);
    };
  }
}

function throwLookupError (name, namespace, context) {
  if (namespace !== undefined) {
    throw new Error('No such var: ' + namespace + '/' + name);
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

Array.prototype.find = Array.prototype.find || function (f) {
  var i
    ;

  for (i = 0; i < this.length; ++i) {
    if (f(this[i])) {
      return this[i];
    }
  }
};
