var tokens = module.exports = {
  'n': token('number')
, 's': token('string', '"')
, 'i': token('identifier')
, 'c': token('call', ')', false)
, 'v': token('vector', ']', false)
};

tokens.byOpenChar = {
  '"': tokens.s
, '(': tokens.c
, '[': tokens.v
};

function token (kind, closeChr, terminal) {
  var f = function () {
    var args = Array.prototype.slice.call(arguments);

    return {
      kind: kind
    , value: terminal === false ? args : args[0]
    };
  };

  f.kind = kind;
  f.closeChr = closeChr;
  f.terminal = typeof terminal === 'undefined' ? true : false;
  f.insideString = closeChr === '"';

  return f;
}
