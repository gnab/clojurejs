var evaluator = require('../evaluator')
  , Namespace = require('../namespace').Namespace
  ;

exports.defmacro = function (name, params, list) {
  
  var context = this
    , f = function() {

      // expand 
      var expandedList = { kind: 'call', value: [] };
      var extArgs = arguments;
      expandedList.value = list.value.map(function(expr){
        for (var i = 0; i < params.value.length; i++){
          var param = params.value[i];
          if (expr.value === param.value){
            return extArgs[i];
          }
        }
        return expr;
      });

      // evalute 
      return evaluator.evaluate([expandedList], context);
    };
  
  var macro = function() {
    return f.apply(context, arguments);
  };
  macro.macro = true; 
  Namespace.current.set(name.value, macro);
};

exports.defmacro.macro = true;

exports.assert = function (condition) {
  var throwAssertError = function (condition){
    throw new Error('Assert failed: ' + condition.stringify());
  };

  try{
    if (evaluator.evaluate([condition]) !== true) {
      throwAssertError(condition);
    }
  } 
  catch (x) {
    throwAssertError(condition);
  }
  
};

exports.assert.macro = true;
