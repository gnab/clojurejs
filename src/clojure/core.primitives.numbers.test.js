var forms = require('../forms')
  , literal = forms.literal
  ;

exports['odd?'] = function (n) {
  return literal(n % 2 === 1);
};

exports['even?'] = function (n) {
  return literal(n % 2 === 0);
};
