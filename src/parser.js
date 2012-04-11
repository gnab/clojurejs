module.exports = {
  parse: parse
};

function parse (str) {
  return parseExpression(str);
}

function parseExpression (str, cursor) {
  var expr = []
    , chr
    , prevChr
    ;

  cursor = cursor || { pos: 0, token: '' };

  for (; cursor.pos < str.length; ++cursor.pos) {
    chr = str[cursor.pos];

    // Strings
    if (isStrChr(chr) && prevChr !== '\\') {
      if (!cursor.inStrChr) {
        cursor.inStrChr = chr;
      }
      else if (chr === cursor.inStrChr) {
        pushTokenIfPresent();
        delete cursor.inStrChr;
      }
      else {
        cursor.token += chr;
      }
    }

    // Lists
    else if (chr === '(' && !cursor.inStrChr) {
      ++cursor.pos;
      expr.push(parseExpression(str, cursor));
    }
    else if (chr === ')' && !cursor.inStrChr) {
      pushTokenIfPresent();
      return expr;
    }

    // Character
    else {
      if (/\s/.exec(chr)) {
        pushTokenIfPresent();
        continue;
      }

      cursor.token += chr;
    }

    prevChr = chr;
  }

  return expr;

  function pushTokenIfPresent () {
    if (cursor.token) {
      expr.push(cursor.token);
      cursor.token = '';
    }
  }

  function isStrChr (chr) {
     return chr === '\'' || chr === '"';
  }
}
