export function Namespace (name) {
  this.name = name;
  this.vars = {};
}

Namespace.get = function (name) {
  return Namespace.all[name];
};

Namespace.set = function (name) {
  if (!Namespace.all[name]) {
    var namespace = new Namespace(name);
    Namespace.all[name] = namespace;
  }

  Namespace.current = Namespace.all[name];
};

Namespace.reset = function () {
  Namespace.all = [];
  Namespace.set('user');
};

Namespace.prototype.use = function (ns) {
  var name;

  for (name in ns.vars) {
    this.set(name, ns.get(name));
  }
};

Namespace.prototype.get = function (name) {
  return this.vars[name];
};

Namespace.prototype.set = function (name, value) {
  this.vars[name] = value;
};

Namespace.prototype.extend = function () {
  var ns = new Namespace();
  
  function Vars () {}
  Vars.prototype = this.vars;
 
  ns.vars = new Vars();

  return ns;
};

Namespace.reset();
