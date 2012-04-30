var tokens = require('./tokens')
  , tokenParsers = {
    number: parseNumber
  , string: parseString
  , symbol: parseSymbol
  , keyword: parseKeyword
  , vector: parseVector
  , list: parseList
  };

module.exports = {
  read: function (str) {
    return parseExpressions(str);
  }
};

function parseExpressions(str, cursor, closeChr) {
  var expressions = []
    , token
    , match
    , currentChar
    ;

  cursor = cursor || { pos: 0 };

  for (; cursor.pos < str.length; cursor.pos++) {
    currentChar = str[cursor.pos];
    for (token in tokenParsers) {
      if (tokens.hasOwnProperty(token)) {
        if ((match = tokens[token].pattern.exec(str.substr(cursor.pos)))) {
          expressions.push(tokenParsers[token](match, cursor, str));
          break;
        }
      }
    }

    if (currentChar === closeChr) {
      break;
    }
  }

  return expressions;
}

function parseNumber (match, cursor) {
  cursor.pos += match[0].length - 1;

  return tokens.number(match[0]);
}

function parseString (match, cursor) {
  cursor.pos += match[0].length;

  return tokens.string(match[1]);
}

function parseSymbol (match, cursor) {
  cursor.pos += match[0].length - 1;

  if (isLiteral(match)) {
    return tokens.literal(match[2]);
  }

  return tokens.symbol(match[1], match[2]);
}

function isLiteral (match) {
  var isQualified = match[1] !== undefined;

  return !isQualified && tokens.literal.pattern.exec(match[0]);
}

function parseKeyword (match, cursor) {
  cursor.pos += match[0].length - 1;

  return tokens.keyword(match[1], match[2]);
}

function parseVector(match, cursor, str) {
  cursor.pos += match[0].length;

  return tokens.vector.apply(tokens, parseExpressions(str, cursor, tokens.vector.closeChr));
}

function parseList (match, cursor, str) {
  cursor.pos += match[0].length;

  // No need to distinguish between standard and syntax-
  // quoted lists until we decide to support namespaces
  var quoted = match[1] === '\'' || match[1] === '`';

  var subExpressions = parseExpressions(str, cursor, tokens.list.closeChr)
    , isCall = !quoted && subExpressions.length > 0
    , token = isCall ? tokens.call : tokens.list
    ;

  return token.apply(tokens, subExpressions);
}
