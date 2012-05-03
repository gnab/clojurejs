var Namespace = require('./namespace').Namespace
  , specialforms = require('./clojure/specialforms')
  , forms = require('./forms')
  , number = forms.number
  , string = forms.string
  , literal = forms.literal
  , symbol = forms.symbol
  , vector = forms.vector
  , list = forms.list
  , call = forms.call
  ;

exports.evaluate = evaluate;

function evaluate (exprs, context) {
  context = context || Namespace.current;

  var result = exprs.map(function (e) { return evaluateExpression(e, context); })
    .slice(-1)[0];

  return result === undefined ? literal(null) : result;
}

function evaluateExpression (form, context) {
  if (form.quoted) {
    return form;
  }

  switch (form.kind) {
    case number.kind:
      return number(+form.value);
    case literal.kind:
      return literal(lookupLiteral(form.value));
    case symbol.kind:
      return lookupSymbol(form.value, form.namespace, context);
    case vector.kind:
      return vector.apply(forms, form.value.map(function (e) { return evaluateExpression(e, context);}));
    case call.kind:
      return evaluateCall(form, context.extend());
    default:
      return form;
  }
}

function evaluateCall (form, context) {
  var func = evaluateExpression(form.value[0], context)
    , args = form.value.slice(1)
    ;

  if (!func.macro) {
    args = args.map(function (arg) { 
      return evaluateExpression(arg, context);
    });
  }

  return (typeof func === 'function' ? func : func.value).apply(context, args);
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
