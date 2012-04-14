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
