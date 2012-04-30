var Token = require('./token').Token
  , SYM_HEAD = 'a-z\\*\\+\\!\\-\\_\\?\\.'
  , SYM_TAIL = SYM_HEAD + '0-9'

  , tokens = module.exports = {
      number: createTokenGenerator('number', /^'?\d+/)
    , string: createTokenGenerator('string', /^'?"(([^\\"]|\\\\|\\")*)/, '"', '"')
    , literal: createTokenGenerator('literal', /^'?(true|false|nil)$/)
    , symbol: createTokenGenerator('symbol', new RegExp(
        '^' +
        '\'?' +                                                   // Optional single-quote
        '(?:([' + SYM_HEAD + '][' + SYM_TAIL + ']*)\\/)?' +       // Optional namespace
        '([' + SYM_HEAD + '\\/|=' + '][' + SYM_TAIL + ']*)', 'i'  // Symbol
      ))
    , keyword: createTokenGenerator('keyword', new RegExp(
        '^' +
        '\'?' +                                                   // Optional single-quote
        '::?' +                                                   // 1 or 2 colons
        '(?:([' + SYM_HEAD + '][' + SYM_TAIL + ']*)\\/)?' +       // Optional namespace
        '([' + SYM_HEAD + '=' + '][' + SYM_TAIL + ']*)', 'i'      // Keyword
      ), ':')
    , vector: createTokenGenerator('vector', /^'?\[/, '[', ']', false)
    , call: createTokenGenerator('call', /^'?\(/, '(', ')', false)
    , list: createTokenGenerator('list', /^(['`])?\(/, '(', ')', false)
    , comment: createTokenGenerator('comment', /^;.*?(\n|$)/)
  };

function createTokenGenerator (kind, pattern, openChr, closeChr, terminal) {
  var generator = function () {
    var args = Array.prototype.slice.call(arguments)
      , namespace = terminal !== false && args.length === 2 ? args.shift() : undefined
      , value = terminal === false ? args : args.shift()
      ;

      return new Token(
          kind
        , namespace
        , value
        , openChr
        , closeChr
        , terminal);
  };

  generator.kind = kind;
  generator.pattern = pattern;
  generator.closeChr = closeChr;

  return generator;
}
