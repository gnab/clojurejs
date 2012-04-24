var evaluator = require('../evaluator');
var fn = require('./core.specialforms').fn;

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
  evaluator.globalContext[name.value] = macro;

};

exports.defmacro.macro = true;
