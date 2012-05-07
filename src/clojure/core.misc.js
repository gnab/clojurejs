var forms = require('../forms')
  , literal = forms.literal
  , string = forms.string
  , number = forms.number
  , keyword = forms.keyword
  ;

exports['='] = function equals() {
  var isEqual = true
    , args = Array.prototype.slice.call(arguments, 0)
    , form
    , nextForm;

  for (var i = 0; i < args.length -1; i++) {
    form = args[i];
    nextForm = args[i + 1];

    var stringNumOrKeyword = function(form) {
      return (form.kind === string.kind ||
               form.kind === number.kind ||
               form.kind === keyword.kind);
    };
    if (stringNumOrKeyword(form) || stringNumOrKeyword(nextForm)){
      if (form.kind !== nextForm.kind ||
          form.value !== nextForm.value){
        return literal(false);
      }
    }
    else if (form.value.length !== nextForm.value.length){
      return literal(false);
    }
    else {
      for (var j = 0; j < form.value.length; j ++){
        if (!equals(form.value[j], nextForm.value[j]).value){
          return literal(false);
        }
      }
    }
  }
  return literal(true);
};
