var forms = require('../forms')
  , literal = forms.literal
  , string = forms.string
  , number = forms.number
  , keyword = forms.keyword
  ;

exports['='] = function equals() {

  var args = Array.prototype.slice.call(arguments, 0);
  var prevForm = args.shift();
  var isEqual = true;

  Array.prototype.map.call(args, function (form) {
    if (form.kind !== prevForm.kind){
      isEqual = false;
      return;
    }
    else if (form.kind === string.kind || form.kind === number.kind || form.kind === form.keyword ){
      if (form.value !== prevForm.value){
        isEqual = false;
      }
    }
    else { // Assuming we're dealing with some sort of list
      if (form.value.length !== prevForm.value.length){
        isEqual = false;
        return;
      }
      else {
        for (var i = 0; i < form.value.length; i ++){
          if (equals(form.value[i], prevForm.value[i]).value === false){
            isEqual = false;
            return;
          }
        }
      }
    }
    prevForm = form;
  });

  return literal(isEqual);
};
