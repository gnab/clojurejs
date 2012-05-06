var forms = require('./forms')
  , formParsers = {
    number: parseNumber
  , string: parseString
  , symbol: parseSymbol
  , keyword: parseKeyword
  , vector: parseVector
  , list: parseList
  , comment: parseComment
  };

module.exports = {
  read: function (str) {
    return parseExpressions(str);
  }
};

function parseExpressions(str, cursor, closeChr) {
  var expressions = []
    , formKind
    , form
    , match
    , currentChar
    ;

  cursor = cursor || { pos: 0 };

  for (; cursor.pos < str.length; cursor.pos++) {
    currentChar = str[cursor.pos];
    for (formKind in formParsers) {
      if (forms.hasOwnProperty(formKind)) {
        if ((match = forms[formKind].pattern.exec(str.substr(cursor.pos)))) {
          form = formParsers[formKind](match, cursor, str);
          if (form) {
            expressions.push(form);
          }
          break;
        }
      }
    }

    if (currentChar === closeChr) {
      break;
    }
  }

  return expressions;
}

function parseNumber (match, cursor) {
  cursor.pos += match[0].length - 1;

  return forms.number(+match[0]);
}

function parseString (match, cursor) {
  cursor.pos += match[0].length;

  return forms.string(match[1]);
}

function parseSymbol (match, cursor) {
  cursor.pos += match[0].length - 1;

  if (isLiteral(match)) {
    return forms.literal(match[2]);
  }

  return forms.symbol(match[1], match[2]);
}

function isLiteral (match) {
  var isQualified = match[1] !== undefined;

  return !isQualified && forms.literal.pattern.exec(match[0]);
}

function parseKeyword (match, cursor) {
  cursor.pos += match[0].length - 1;

  return forms.keyword(match[1], match[2]);
}

function parseVector(match, cursor, str) {
  cursor.pos += match[0].length;

  return forms.vector.apply(forms, parseExpressions(str, cursor, forms.vector.closeChr));
}

function parseList (match, cursor, str) {
  cursor.pos += match[0].length;

  // No need to distinguish between standard and syntax-
  // quoted lists until we decide to support namespaces
  var quoted = match[1] === '\'' || match[1] === '`';

  var subExpressions = parseExpressions(str, cursor, forms.list.closeChr)
    , isCall = !quoted && subExpressions.length > 0
    , form = isCall ? forms.call : forms.list
    ;

  form = form.apply(forms, subExpressions);
  form.quoted = quoted;
  return form;
}

function parseComment (match, cursor) {
  cursor.pos += match[0].length;

  return null;
}
