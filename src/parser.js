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

  cursor = cursor || {pos: 0, token: ''};

  for (; cursor.pos < str.length; ++cursor.pos) {
    chr = str[cursor.pos];
    if (chr === '(' && !cursor.string) {
      ++cursor.pos;
      expr.push(parseExpression(str, cursor));
    }
    else if (chr === ')' && !cursor.string) {
      pushTokenIfPresent();
      return expr;
    }
    else if (chr === '\'' || chr === '"') {
      parseString();
    }
    else {
      if (/\s/.exec(chr)) {
        pushTokenIfPresent();
        continue;
      }

      cursor.token += chr;
    }

    prevChr = chr;
  }

  pushTokenIfPresent();
  return expr;

  function pushTokenIfPresent () {
    if (cursor.token) {
      expr.push(cursor.token);
      cursor.token = '';
    }
  }

  function parseString () {
    if (cursor.string && prevChr === '\\') {
      cursor.token += chr;
    }
    else if (chr === cursor.string) {
      delete cursor.string;
    }
    else if (cursor.string) {
      cursor.token += chr;
    }
    else {
      cursor.string = chr;
    }
  }
}
