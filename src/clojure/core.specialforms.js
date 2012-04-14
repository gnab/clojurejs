var evaluator = require('../evaluator');

exports.def = function (name, init) {
  evaluator.globalContext[name] = init;
};

exports['if'] = function (test, then, els) {
  var context = this
    , result = evaluator.evaluate([test], context)
    ;

  if (result !== null && result !== false) {
    return evaluator.evaluate([then], context);
  }

  if (typeof els !== 'undefined') {
    return evaluator.evaluate([els], context);
  }
};

exports['if'].macro = true;
