var tokens = require('./tokens')
  , tokenParsers = {
    n: parseNumber
  , i: parseIdentifier
  , k: parseKeyword
  , s: parseString
  , v: parseVector
  , l: parseList
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

  return tokens.n(match[0]);
}

function parseIdentifier (match, cursor) {
  cursor.pos += match[0].length - 1;

  return tokens.i(match[0]);
}

function parseKeyword (match, cursor) {
  cursor.pos += match[0].length - 1;

  return tokens.k(match[1]);
}

function parseString (match, cursor) {
  cursor.pos += match[0].length;

  return tokens.s(match[1]);
}

function parseVector(match, cursor, str) {
  cursor.pos += match[0].length;

  return tokens.v.apply(tokens, parseExpressions(str, cursor, ']'));
}

function parseList (match, cursor, str) {
  cursor.pos += match[0].length;

  var subExpressions = parseExpressions(str, cursor, ')')
    , isCall = match[1] !== '\'' && subExpressions.length > 0
    , token = isCall ? tokens.c : tokens.l
    ;

  return token.apply(tokens, subExpressions);
}
