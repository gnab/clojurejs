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
