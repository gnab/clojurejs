var forms = require('../forms')
  , list = forms.list
;

exports.map = function (f, coll) {
  if (coll.kind === "list"){
    return Array.prototype.map.call(coll.value, function(elem){
      return f(elem.value);  
    });
  }

  var result = coll.value.map(f);

  return result;
};

exports.concat = function () {
  var concatList = [];

  Array.prototype.map.call(arguments, function(coll) {
      concatList = concatList.concat(coll.value);                           
  });

  return list.apply(this, concatList);
};

exports.cons = function (element, list) {
  list.value.splice(0, 0, element);
  return list;
};

// todo: Remove this, figure out how to handle
// the arguments properly
exports.cons.macro = true;
