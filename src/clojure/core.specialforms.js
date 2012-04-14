var evaluator = require('../evaluator');

exports.def = function (name, init) {
  evaluator.globalContext[name] = init;
};
