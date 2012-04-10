module.exports = {
  parse: parse
};

function parse (str) {
  return parseExpression(str);
}

function parseExpression (str, cursor) {
  var expr = []
    , chr
    ;

  cursor = cursor || {i: 0, token: ''};

  for (; cursor.i < str.length; ++cursor.i) {
    chr = str[cursor.i];
    if (chr === '(' && !cursor.string) {
      ++cursor.i;
      expr.push(parseExpression(str, cursor));
    }
    else if (chr === ')' && !cursor.string) {
      pushTokenIfPresent();
      return expr;
    }
    else if (chr === '\'' || chr === '"') {
      if (chr === cursor.string) {
        delete cursor.string;
      }
      else if (cursor.string) {
        cursor.token += chr;
      }
      else {
        cursor.string = chr;
      }
    }
    else {
      if (/\s/.exec(chr)) {
        pushTokenIfPresent();
        continue;
      }

      cursor.token += chr;
    }
  }

  pushTokenIfPresent();
  return expr;

  function pushTokenIfPresent () {
    if (cursor.token) {
      expr.push(cursor.token);
      cursor.token = '';
    }
  }
}
