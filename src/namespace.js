exports.Namespace = Namespace;

Namespace.all = [];

function Namespace (name) {
  this.__name__ = name;
  this.__vars__ = {};

  if (name) {
    Namespace.all[name] = this;
  }
}

Namespace.prototype.use = function (ns) {
  var name;

  for (name in ns.__vars__) {
    this.set(name, ns.get(name));
  }
};

Namespace.prototype.get = function (name) {
  return this.__vars__[name];
};

Namespace.prototype.set = function (name, value) {
  this.__vars__[name] = value;
};

Namespace.prototype.extend = function () {
  var ns = new Namespace();
  
  function Vars () {}
  Vars.prototype = this.__vars__;
 
  ns.__vars__ = new Vars();

  return ns;
};
