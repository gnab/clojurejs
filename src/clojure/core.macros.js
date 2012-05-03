var evaluator = require('../evaluator')
  , Namespace = require('../namespace').Namespace
  , forms = require('../forms')
  , literal = forms.literal
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

  var errorString = function (condition, extrainfo){
    return 'Assert failed: ' + condition.stringify() + 
      (extrainfo !== undefined ? "; " + extrainfo : "");
  };

  try{
    if (evaluator.evaluate([condition]).value !== true) {
      var error = new Error(errorString(condition));
      error.constructedByAssert = true;
      throw error;
    }
  } 
  catch (e) { // Catch other exceptions
    if (e.constructedByAssert){
      throw e;
    }
    throw new Error(errorString(condition, e.message));
  }
  
};

exports.assert.macro = true;
