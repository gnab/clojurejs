module.exports = {
  'n': function (value) { return { kind: 'number', value: value }; }
, 's': function (value) { return { kind: 'string', value: value }; }
, 'i': function (value) { return { kind: 'identifier', value: value }; }
, 'e': function (value) {
    return { kind: 'expression', value: Array.prototype.slice.apply(arguments) };
  }
, 'v': function (value) {
    return { kind: 'vector', value: Array.prototype.slice.apply(arguments) };
  }
};
