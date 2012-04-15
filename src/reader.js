var tokens = require('./tokens');

exports.read = read;

function read (insideString) {
  return parseExpressions(insideString);
}

function parseExpressions (insideString, cursor, closeChar) {
  var expressions = []
    , currentChar
    , previousChar
    , token
    , subTokens
    ;

  cursor = cursor || { pos: 0 , token: { value: '' } , insideString: false };
  closeChar = closeChar || ')';

  for (; cursor.pos < insideString.length; cursor.pos++) {
    currentChar = insideString[cursor.pos];

    if (!cursor.insideString && (token = tokens.byOpenChar[currentChar])) {
      cursor.pos++;
      cursor.insideString = token.insideString;
      subTokens = parseExpressions(insideString, cursor, token.closeChr);
      expressions.push(token.terminal ? subTokens[0] : {
        value: subTokens
      , kind: token.kind
      });
      cursor.insideString = false;
    }
    else if (currentChar === closeChar && !cursor.insideString) {
      pushToken();
      return expressions;
    }
    else if (currentChar === closeChar && cursor.insideString && previousChar !== '\\') {
      pushToken('string');
      return expressions;
    }
    else {
      if (/\s/.exec(currentChar) && !cursor.insideString) {
        pushToken();
        continue;
      }

      cursor.token.value += currentChar;
    }

    previousChar = currentChar;
  }

  return expressions;

  function pushToken (kind) {
    if (cursor.token.value) {
      cursor.token.kind = kind || (isNumeric(cursor.token.value) ? 'number' : 'identifier');
      expressions.push(cursor.token);
      cursor.token = { value: '' };
    }
  }

  function isNumeric (value) {
    return !!/^\d/.exec(value);
  }
}
