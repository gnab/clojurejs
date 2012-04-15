var tokens = module.exports = {
  'n': token('number')
, 's': token('string', '"')
, 'i': token('identifier')
, 'c': token('call', ')', false)
, 'v': token('vector', ']', false)
, 'l': token('list', ')', false)
};

function token (kind, closeChr, terminal) {
  var f = function () {
    var args = Array.prototype.slice.call(arguments);

    return {
      kind: kind
    , value: terminal === false ? args : args[0]
    };
  };

  return f;
}
