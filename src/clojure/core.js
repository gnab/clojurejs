function extend(collection) {
  var name;

  for (name in collection) {
    exports[name] = collection[name];
  }
}

// Namespaces based on http://clojure.org/cheatsheet
extend(require('./core.specialforms'));
extend(require('./core.primitives.numbers.arithmetic'));
extend(require('./core.primitives.numbers.test'));
extend(require('./core.functions'));
extend(require('./core.sequences'));
extend(require('./core.misc'));
extend(require('./core.macros'));

exports['true'] = true;
exports['false'] = false;
exports.nil = null;
