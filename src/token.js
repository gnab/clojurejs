exports.Token = Token;
 
function Token (kind, namespace, value, openChr, closeChr, terminal) {
  this.kind = kind;
  this.namespace = namespace;
  this.value = value;
  this.openChr = openChr;
  this.closeChr = closeChr;
  this.terminal = terminal;
  this.quoted = false;
}

Token.prototype.stringify = function () {
  var value;

  if (this.terminal !== false) {
    value =  this.value;
  }
  else {
    value = this.value.map(function (t) { return t.stringify(); }).join(' ');
  }

  return (this.openChr || '') + value + (this.closeChr || '');
};

Token.prototype.toString = function() {
  return this.stringify();
};

