var tokens = require('../tokens')
  , list = tokens.list
;

exports.map = function (f, coll) {
  return coll.map(f);
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