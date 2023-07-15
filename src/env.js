// Node vs browser behavior
var env = {};
if (typeof module === 'undefined') {
    var exports = env;
}

// Env implementation
class Env {
    constructor(outer, binds, exprs) {
        this.data = {};
        this.outer = outer || null;

        if (binds && exprs) {
            // Returns a new Env with symbols in binds bound to
            // corresponding values in exprs
            // TODO: check types of binds and exprs and compare lengths
            for (var i = 0; i < binds.length; i++) {
                if (binds[i].value === "&") {
                    // variable length arguments
                    this.data[binds[i + 1].value] = Array.prototype.slice.call(exprs, i);
                    break;
                } else {
                    this.data[binds[i].value] = exprs[i];
                }
            }
        }
        return this;
    }
    find(key) {
        if (!key.constructor || key.constructor.name !== 'Symbol') {
            throw new Error("env.find key must be a symbol");
        }
        if (key.value in this.data) { return this; }
        else if (this.outer) { return this.outer.find(key); }
        else { return null; }
    }
    set(key, value) {
        if (!key.constructor || key.constructor.name !== 'Symbol') {
            throw new Error("env.set key must be a symbol");
        }
        this.data[key.value] = value;
        console.log("set value:", value)
        return value;
    }
    get(key) {
        if (!key.constructor || key.constructor.name !== 'Symbol') {
            throw new Error("env.get key must be a symbol");
        }
        var env = this.find(key);
        if (!env) { throw new Error("'" + key.value + "' not found"); }
        return env.data[key.value];
    }
}

const _Env = env.Env = Env;
export { _Env as Env };
