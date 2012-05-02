var evaluator = require('../evaluator')
  , tokens = require('../tokens')
  , list = tokens.list;

exports.first = function (list) {
  return evaluator.evaluate([list.value[0]]);
};

exports.second = function (list) {
  return evaluator.evaluate([list.value[1]]);
};

exports.nth = function (list, n) {
  return evaluator.evaluate([list.value[n]]);
};

exports.rest = function (list) {
  list.value.splice(0, 1);
  return list;
};






