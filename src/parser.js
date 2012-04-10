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

  cursor = cursor || {i: 0, word: ''};

  for (; cursor.i < str.length; ++cursor.i) {
    chr = str[cursor.i];
    if (chr === '(' && !cursor.string) {
      ++cursor.i;
      expr.push(parseExpression(str, cursor));
    }
    else if (chr === ')' && !cursor.string) {
      pushWordIfPresent();
      return expr;
    }
    else if (chr === '\'' || chr === '"') {
      if (chr === cursor.string) {
        delete cursor.string;
      }
      else {
        cursor.string = chr;
      }
    }
    else {
      if (/\s/.exec(chr)) {
        pushWordIfPresent();
        continue;
      }

      cursor.word += chr;
    }
  }

  pushWordIfPresent();
  return expr;

  function pushWordIfPresent () {
    if (cursor.word) {
      expr.push(cursor.word);
      cursor.word = '';
    }
  }
}

console.log(parse('(+ 1 1)'));
