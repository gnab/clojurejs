module.exports = {
  'n': token('number')
, 's': token('string')
, 'i': token('identifier')
, 'c': token('call', true)
, 'v': token('vector', true)
};

function token (kind, passOnArgs) {
  return function () {
    var args = Array.prototype.slice.call(arguments);

    return {
      kind: kind
    , value: passOnArgs ? args : args[0]
    };
  };
}
