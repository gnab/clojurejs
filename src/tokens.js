var SYM_HEAD = 'a-z\\*\\+\\!\\-\\_\\?\\.'
  , SYM_TAIL = SYM_HEAD + '0-9'

  , tokens = module.exports = {
      number: token('number', /^'?\d+/)
    , symbol: token('symbol', new RegExp(
        '^' +
        '\'?' +                                                   // Optional single-quote
        '(?:([' + SYM_HEAD + '][' + SYM_TAIL + ']*)\\/)?' +       // Optional namespace
        '([' + SYM_HEAD + '\\/|=' + '][' + SYM_TAIL + ']*)', 'i'  // Symbol
      ))
    , keyword: token('keyword', new RegExp(
        '^' +
        '\'?' +                                                   // Optional single-quote
        '::?' +                                                   // 1 or 2 colons
        '(?:([' + SYM_HEAD + '][' + SYM_TAIL + ']*)\\/)?' +       // Optional namespace
        '([' + SYM_HEAD + '=' + '][' + SYM_TAIL + ']*)', 'i'      // Keyword
      ))
    , string: token('string', /^'?"(([^\\"]|\\\\|\\")*)/, '"')
    , vector: token('vector', /^'?\[/, ']', false)
    , call: token('call', /^'?\(/, ')', false)
    , list: token('list', /^(['`])?\(/, ')', false)
  };

function token (kind, pattern, closeChr, terminal) {
  var f = function () {
    var args = Array.prototype.slice.call(arguments);

    return {
      kind: kind
    , namespace: terminal !== false && args.length === 2 ? args.shift() : undefined
    , value: terminal === false ? args : args.shift()
    };
  };

  f.kind = kind;
  f.pattern = pattern;

  return f;
}
