// General functions

function _obj_type(obj) {
    if      (_symbol_Q(obj)) {   return 'symbol'; }
    else if (_list_Q(obj)) {     return 'list'; }
    else if (_vector_Q(obj)) {   return 'vector'; }
    else if (_hash_map_Q(obj)) { return 'hash-map'; }
    else if (_nil_Q(obj)) {      return 'nil'; }
    else if (_true_Q(obj)) {     return 'true'; }
    else if (_false_Q(obj)) {    return 'false'; }
    else if (_atom_Q(obj)) {     return 'atom'; }
    else {
        switch (typeof(obj)) {
        case 'number':   return 'number';
        case 'function': return 'function';
        case 'string': return obj[0] == '\u029e' ? 'keyword' : 'string';
        default: throw new Error("Unknown type '" + typeof(obj) + "'");
        }
    }
}

function _sequential_Q(lst) { return _list_Q(lst) || _vector_Q(lst); }


function _equal_Q (a, b) {
    var ota = _obj_type(a), otb = _obj_type(b);
    if (!(ota === otb || (_sequential_Q(a) && _sequential_Q(b)))) {
        return false;
    }
    switch (ota) {
    case 'symbol': return a.value === b.value;
    case 'list':
    case 'vector':
        if (a.length !== b.length) { return false; }
        for (var i=0; i<a.length; i++) {
            if (! _equal_Q(a[i], b[i])) { return false; }
        }
        return true;
    case 'hash-map':
        if (Object.keys(a).length !== Object.keys(b).length) { return false; }
        for (var k in a) {
            if (! _equal_Q(a[k], b[k])) { return false; }
        }
        return true;
    default:
        return a === b;
    }
}


function _clone (obj) {
    var new_obj;
    switch (_obj_type(obj)) {
    case 'list':
        new_obj = obj.slice(0);
        break;
    case 'vector':
        new_obj = obj.slice(0);
        new_obj.__isvector__ = true;
        break;
    case 'hash-map':
        new_obj = {};
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) { new_obj[k] = obj[k]; }
        }
        break;
    case 'function':
        new_obj = obj.clone();
        break;
    default:
        throw new Error("clone of non-collection: " + _obj_type(obj));
    }
    Object.defineProperty(new_obj, "__meta__", {
        enumerable: false,
        writable: true
    });
    return new_obj;
}


// Scalars
function _nil_Q(a) { return a === null ? true : false; }
function _true_Q(a) { return a === true ? true : false; }
function _false_Q(a) { return a === false ? true : false; }
function _number_Q(obj) { return typeof obj === 'number'; }
function _string_Q(obj) {
    return typeof obj === 'string' && obj[0] !== '\u029e';
}


// Symbols
function Symbol(name) {
    this.value = name;
    return this;
}
Symbol.prototype.toString = function() { return this.value; }
export function _symbol(name) { return new Symbol(name); }
function _symbol_Q(obj) { return obj instanceof Symbol; }


// Keywords
export function _keyword(obj) {
    if (typeof obj === 'string' && obj[0] === '\u029e') {
        return obj;
    } else {
        return "\u029e" + obj;
    }
}
function _keyword_Q(obj) {
    return typeof obj === 'string' && obj[0] === '\u029e';
}


// Functions
function _function(Eval, Env, ast, env, params) {
    var fn = function() {
        return Eval(ast, new Env(env, params, arguments));
    };
    fn.__meta__ = null;
    fn.__ast__ = ast;
    fn.__gen_env__ = function(args) { return new Env(env, params, args); };
    fn._ismacro_ = false;
    return fn;
}
function _function_Q(obj) { return typeof obj == "function"; }
Function.prototype.clone = function() {
    var that = this;
    var temp = function () { return that.apply(this, arguments); };
    for( key in this ) {
        temp[key] = this[key];
    }
    return temp;
};
function _fn_Q(obj) { return _function_Q(obj) && !obj._ismacro_; }
function _macro_Q(obj) { return _function_Q(obj) && !!obj._ismacro_; }


// Lists
function _list() { return Array.prototype.slice.call(arguments, 0); }
function _list_Q(obj) { return Array.isArray(obj) && !obj.__isvector__; }


// Vectors
export function _vector() {
    var v = Array.prototype.slice.call(arguments, 0);
    v.__isvector__ = true;
    return v;
}
function _vector_Q(obj) { return Array.isArray(obj) && !!obj.__isvector__; }



// Hash Maps
export function _hash_map() {
    if (arguments.length % 2 === 1) {
        throw new Error("Odd number of hash map arguments");
    }
    var args = [{}].concat(Array.prototype.slice.call(arguments, 0));
    return _assoc_BANG.apply(null, args);
}
function _hash_map_Q(hm) {
    return typeof hm === "object" &&
           !Array.isArray(hm) &&
           !(hm === null) &&
           !(hm instanceof Symbol) &&
           !(hm instanceof Atom);
}
function _assoc_BANG(hm) {
    if (arguments.length % 2 !== 1) {
        throw new Error("Odd number of assoc arguments");
    }
    for (var i=1; i<arguments.length; i+=2) {
        var ktoken = arguments[i],
            vtoken = arguments[i+1];
        if (typeof ktoken !== "string") {
            throw new Error("expected hash-map key string, got: " + (typeof ktoken));
        }
        hm[ktoken] = vtoken;
    }
    return hm;
}
function _dissoc_BANG(hm) {
    for (var i=1; i<arguments.length; i++) {
        var ktoken = arguments[i];
        delete hm[ktoken];
    }
    return hm;
}


// Atoms
function Atom(val) { this.val = val; }
function _atom(val) { return new Atom(val); }
function _atom_Q(atm) { return atm instanceof Atom; }