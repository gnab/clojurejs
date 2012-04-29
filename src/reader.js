var tokens = require('./tokens')
  , tokenParsers = {
    number: parseNumber
  , string: parseString
  , literal: parseLiteral
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

function parseExpressions(str, cursor, closingChar) {
  var expressions = []
    , token
    , match
    , currentChar
    ;

  cursor = cursor || { pos: 0 , token: { value: '' } , insideString: false };

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

    if (currentChar === closingChar) {
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

function parseLiteral (match, cursor) {
  cursor.pos += match[0].length;

  return tokens.literal(match[1]);
}

function parseSymbol (match, cursor) {
  cursor.pos += match[0].length - 1;

  return tokens.symbol(match[1], match[2]);
}

function parseKeyword (match, cursor) {
  cursor.pos += match[0].length - 1;

  return tokens.keyword(match[1], match[2]);
}

function parseVector(match, cursor, str) {
  cursor.pos += match[0].length;

  return tokens.vector.apply(tokens, parseExpressions(str, cursor, ']'));
}

function parseList (match, cursor, str) {
  cursor.pos += match[0].length;

  // No need to distinguish between standard and syntax-
  // quoted lists until we decide to support namespaces
  var quoted = match[1] === '\'' || match[1] === '`';

  var subExpressions = parseExpressions(str, cursor, ')')
    , isCall = !quoted && subExpressions.length > 0
    , token = isCall ? tokens.call : tokens.list
    ;

  return token.apply(tokens, subExpressions);
}
