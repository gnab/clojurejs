var evaluator = require('../evaluator')
  , reader = require('../reader')
  , forms = require('../forms')
  , list = forms.list;

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

exports.list = function () {
  var quotedList = list.apply(this, arguments);
  quotedList.quoted = true;
  return quotedList;
};

exports.list.macro = true;






