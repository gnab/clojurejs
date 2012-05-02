var evaluator = require('../evaluator');

exports.first = function (list) {
  return evaluator.evaluate([list.value[0]]);
};

exports.second = function (list) {
  return evaluator.evaluate([list.value[1]]);
};





