function extend(collection) {
  var name;

  for (name in collection) {
    exports[name] = collection[name];
  }
}

extend(require('./core.specialforms'));
extend(require('./core.primitives.numbers'));
extend(require('./core.functions'));
extend(require('./core.sequences'));

exports['true'] = true;
exports['false'] = false;
exports.nil = null;
