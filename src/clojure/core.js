exports.extend = function (collection) {
  var func;

  for (func in collection) {
    exports[func] = collection[func];
  }
};

exports.extend(require('./core.primitives.numbers'));
exports.extend(require('./core.functions'));
