var tokens = require('./tokens');

exports.read = read;

function read (str) {
  return parseExpressions(str);
}

function parseExpressions(str, cursor, closingChar) {
  var expressions = []
    , subExpressions
    , currentChar
    , previousChar
    ;

  cursor = cursor || { pos: 0 , token: { value: '' } , insideString: false };

  for (; cursor.pos < str.length; cursor.pos++) {
    currentChar = str[cursor.pos];
 
    if (/\d/.exec(currentChar)) {
      expressions.push(parseNumber(str, cursor));
    }
    else if (/\w|\+|\-|\*|\//.exec(currentChar)) {
      expressions.push(parseIdentifier(str, cursor));
    }
    else if (currentChar === '"') {
      cursor.pos++;
      expressions.push(parseString(str, cursor));
    }
    else if (currentChar === '[') {
      cursor.pos++;
      expressions.push({
        value: parseExpressions(str, cursor, ']')
      , kind: 'vector'
      });
    }
    else if (currentChar === '(') {
      cursor.pos++;
      subExpressions = parseExpressions(str, cursor, ')');
      expressions.push({
        value: subExpressions
      , kind: previousChar === '\'' || subExpressions.length === 0  ? 'list' : 'call'
      });
    }
    else if (currentChar === closingChar) {
      break;
    }

    previousChar = currentChar;
  }

  return expressions;
}

function parseNumber (str, cursor) {
  var substr = str.substr(cursor.pos)
    , match = /\d+/.exec(substr)
    ;

  cursor.pos += match[0].length - 1;

  return tokens.n(match[0]);
}

function parseIdentifier (str, cursor) {
  var substr = str.substr(cursor.pos)
    , match = /(\w|\d|\+|\-|\*|\/|\?)+/.exec(substr)
    ;

  cursor.pos += match[0].length - 1;

  return tokens.i(match[0]);
}

function parseString (str, cursor) {
  var substr = str.substr(cursor.pos)
    , match = /(([^\\"]|\\\\|\\")*)"/.exec(substr)
    ;

  cursor.pos += match[0].length - 1;

  return tokens.s(match[1]);
}
