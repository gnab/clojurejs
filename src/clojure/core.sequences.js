var tokens = require('../tokens')
  , list = tokens.list
;

exports.map = function (f, coll) {
  return coll.map(f);
};

exports.concat = function (coll1, coll2) {
  return coll1.value.concat(coll2.value);
};
