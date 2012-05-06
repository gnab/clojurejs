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

    // Do 'simple' check if primitive form value
    if (form.kind === string.kind ||
        form.kind === number.kind ||
        form.kind === keyword.kind ){
      if (form.value !== nextForm.value ||
          form.kind !== nextForm.kind){
        return literal(false);
      }
    }
     // Both of the arguments are vectors or lists
    else {
      // Check length
      if (form.value.length !== nextForm.value.length){
        return literal(false);
      }
      else { // Check equality recursively
        for (var j = 0; j < form.value.length; j ++){
          if (!equals(form.value[j], nextForm.value[j]).value){
            return literal(false);
          }
        }
      }
    }
  }
  return literal(true);
};
