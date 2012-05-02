var evaluator = require('../evaluator');

exports.first = function (list) {
  return evaluator.evaluate([list.value[0]]);
};

exports.first.macro = true;

exports.second = function (list) {
  return evaluator.evaluate([list.value[1]]);
};

exports.second.macro = true;


