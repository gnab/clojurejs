if (typeof exports !== 'undefined') {
  exports.read = read;
}

function read (str) {
  return parseExpression(str);
}

function parseExpression (str, cursor, closeChar) {
  var expr = []
    , chr
    , prevChr
    ;

  cursor = cursor || { pos: 0, token: { value: '' } };

  for (; cursor.pos < str.length; ++cursor.pos) {
    chr = str[cursor.pos];

    // Strings
    if (isStrChr(chr) && prevChr !== '\\') {
      if (!cursor.inStrChr) {
        cursor.inStrChr = chr;
      }
      else if (chr === cursor.inStrChr) {
        pushTokenIfPresent('string');
        delete cursor.inStrChr;
      }
      else {
        cursor.token.value += chr;
      }
    }

    // Lists / Vectors
    else if ((chr === '(' || chr === '[') && !cursor.inStrChr) {
      ++cursor.pos;
      expr.push({
        value: parseExpression(str, cursor, chr === '(' ? ')' : ']')
      , kind: chr === '(' ? 'expression' : 'vector'
      });
    }
    else if (chr === closeChar && !cursor.inStrChr) {
      pushTokenIfPresent();
      return expr;
    }
    
    // Characters
    else {
      if (/\s/.exec(chr) && !cursor.inStrChr) {
        pushTokenIfPresent();
        continue;
      }

      cursor.token.value += chr;
    }

    prevChr = chr;
  }

  return expr;

  function pushTokenIfPresent (kind) {
    if (cursor.token.value) {
      cursor.token.kind = kind || (isNumeric(cursor.token.value) ? 'number' : 'identifier');
      expr.push(cursor.token);
      cursor.token = { value: '' };
    }
  }

  function isStrChr (chr) {
     return chr === '\'' || chr === '"';
  }

  function isNumeric (value) {
    return !!/^\d/.exec(value);
  }
}
