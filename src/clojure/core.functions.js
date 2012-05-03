var evaluator = require('../evaluator')
  , specialforms = require('./specialforms')
  , Namespace = require('../namespace').Namespace
  , forms = require('../forms')
  , literal = forms.literal
  ;

exports.partial = function () {
  var func = arguments[0]
    , args = Array.prototype.slice.call(arguments, 1)
    ;

  return function () {
    var context = this;

    return function () {
      var result;
      Array.prototype.map.call(arguments, function (a) { args.push(a); });
      result = func.apply(context, args);
      if (result === undefined || result === null) {
        return literal(null);
      }
      return result;
    }.apply(context, arguments);
  };
};

exports.defn = function (name, args, exprs) {
  Namespace.current.set(name.value, specialforms.fn.call(this, args, exprs));
};

exports.defn.macro = true;
