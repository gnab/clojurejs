var evaluator = require('../evaluator');

exports.partial = function () {
  var func = arguments[0]
    , args = Array.prototype.slice.call(arguments, 1)
    ;

  return function () {
    var context = this;

    return function () {
      Array.prototype.map.call(arguments, function (a) { args.push(a); });
      return func.apply(context, args);
    }.apply(context, arguments);
  };
};

exports.fn = function (args, exprs) {
  var context = this
    , f = function () {
      // map args
      var extargs = arguments;
      args.value.map(function (a, i) {
        context[a.value] = extargs[i];
      });
      // execute
      return evaluator.evaluate([exprs], context);
    };

  return function () {
    return f.apply(context, arguments);
  };
};

exports.fn.macro = true;
