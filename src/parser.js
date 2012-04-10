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
    if (chr === '(') {
      ++cursor.i;
      expr.push(parseExpression(str, cursor));
    }
    else if (chr === ')') {
      pushWordIfPresent();
      return expr;
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
