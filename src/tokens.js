var tokens = module.exports = {
  n: token('number', /^'?\d+/)
, i: token('identifier', /^('?)[\w|\d|\+|\-|\*|\/|\?|=]+/)
, k: token('keyword', /^'?:([\w|\d|\+|\-|\*|\/|\?]+)/)
, s: token('string', /^'?"(([^\\"]|\\\\|\\")*)/, '"')
, v: token('vector', /^'?\[/, ']', false)
, c: token('call', /^'?\(/, ')', false)
, l: token('list', /^('?)\(/, ')', false)
};

function token (kind, pattern, closeChr, terminal) {
  var f = function () {
    var args = Array.prototype.slice.call(arguments);

    return {
      kind: kind
    , value: terminal === false ? args : args[0]
    };
  };

  f.pattern = pattern;

  return f;
}
