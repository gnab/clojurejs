import { bindExprs } from './env.js'

export function _obj_type(obj) {
    if (_symbol_Q(obj)) { return 'symbol'; }
    else if (_list_Q(obj)) { return 'list'; }
    else if (_vector_Q(obj)) { return 'vector'; }
    else if (_hash_map_Q(obj)) { return 'hash-map'; }
    else if (_nil_Q(obj)) { return 'nil'; }
    else if (_true_Q(obj)) { return 'true'; }
    else if (_false_Q(obj)) { return 'false'; }
    else if (_atom_Q(obj)) { return 'atom'; }
    else {
        switch (typeof (obj)) {
            case 'number': return 'number';
            case 'function': return 'function';
            case 'string': return obj[0] == '\u029e' ? 'keyword' : 'string';
            default: throw new Error("Unknown type '" + typeof (obj) + "'");
        }
    }
}

export function _sequential_Q(lst) { return _list_Q(lst) || _vector_Q(lst); }

export function _equal_Q(a, b) {
    var ota = _obj_type(a), otb = _obj_type(b);
    if (!(ota === otb || (_sequential_Q(a) && _sequential_Q(b)))) {
        return false;
    }
    switch (ota) {
        case 'symbol': return a.value === b.value;
        case 'list':
        case 'vector':
            if (a.length !== b.length) { return false; }
            for (var i = 0; i < a.length; i++) {
                if (!_equal_Q(a[i], b[i])) { return false; }
            }
            return true;
        case 'hash-map':
            if (Object.keys(a).length !== Object.keys(b).length) { return false; }
            for (var k in a) {
                if (!_equal_Q(a[k], b[k])) { return false; }
            }
            return true;
        default:
            return a === b;
    }
}

export function _clone(obj) {
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
            throw new Error("Cannot clone a " + _obj_type(obj));
    }
    Object.defineProperty(new_obj, "__meta__", {
        enumerable: false,
        writable: true
    });
    return new_obj;
}

// Scalars
export function _nil_Q(a) { return a === null ? true : false; }
export function _true_Q(a) { return a === true ? true : false; }
export function _false_Q(a) { return a === false ? true : false; }
export function _number_Q(obj) { return typeof obj === 'number'; }
export function _string_Q(obj) {
    return typeof obj === 'string' && obj[0] !== '\u029e';
}

// Symbols
export class Symbol {
    constructor(name) {
        this.value = name;
        return this;
    }
    toString() { return this.value; }
}
export function _symbol(name) { return new Symbol(name); }
export function _symbol_Q(obj) { return obj instanceof Symbol; }


// Keywords
export function _keyword(obj) {
    if (typeof obj === 'string' && obj[0] === '\u029e') {
        return obj;
    } else {
        return "\u029e" + obj;
    }
}

export function _keyword_Q(obj) {
    return typeof obj === 'string' && obj[0] === '\u029e';
}

// Ported from clojure.walk: https://github.com/clojure/clojure/blob/master/src/clj/clojure/walk.clj
function walk(inner, outer, form) {
    if (_list_Q(form)) {
        return outer(form.map(inner))
    } else if (_vector_Q(form)) {
        let v = outer(form.map(inner))
        v.__isvector__ = true;
        return v
    } else if (form.__mapEntry__) {
        const k = inner(form[0])
        const v = inner(form[1])
        let mapEntry = [k, v]
        mapEntry.__mapEntry__ = true
        return outer(mapEntry)
    } else if (_hash_map_Q(form)) {
        const entries = seq(form).map(inner)
        let newMap = {}
        entries.forEach(mapEntry => {
            newMap[mapEntry[0]] = mapEntry[1]
        });
        return outer(newMap)
    } else {
        return outer(form)
    }
}

export function postwalk(f, form) {
    return walk(x => postwalk(f, x), f, form)
}

/* console.log(postwalk(x => {
  console.log("Walked:", x)
  return x
}, [1, 2, { a: 3, b: 4}])) */

// Functions

export function _function(Eval, ast, env, params) {
     // We want to support Clojure's `recur`.
    // Since we have real, implicit TCO,
    // we can simply walk the AST and replace any
    // `recur` with the function name.
    const fn = function () {
        return Eval(swapRecur, bindExprs(env, params, arguments))
    }
    const swapRecur = postwalk(x => {
        if (x.value == _symbol("recur")) {
           return fn
        } else {
            return x
        }
        return x
    }, ast)
    fn.__meta__ = null;
    fn.__ast__ = swapRecur;
    //   console.log("ast:", ast)
    fn.__gen_env__ = function (args) {
        return bindExprs(env, params, args)
    }
    fn._ismacro_ = false;
    return fn;
}

export function _function_Q(obj) { return typeof obj == "function"; }
Function.prototype.clone = function () {
    var that = this;
    var temp = function () { return that.apply(this, arguments); };
    for (const key in this) {
        temp[key] = this[key];
    }
    return temp;
};
export function _fn_Q(obj) { return _function_Q(obj) && !obj._ismacro_; }
export function _macro_Q(obj) { return _function_Q(obj) && !!obj._ismacro_; }


// Lists
export function _list() { return Array.prototype.slice.call(arguments, 0); }
export function _list_Q(obj) { return Array.isArray(obj) && !obj.__isvector__; }

// Vectors
export function _vector() {
    var v = Array.prototype.slice.call(arguments, 0);
    v.__isvector__ = true;
    return v;
}
export function _vector_Q(obj) { return Array.isArray(obj) && !!obj.__isvector__; }

// Hash Maps
export function _hash_map() {
    if (arguments.length % 2 === 1) {
        throw new Error("Odd number of hash map arguments");
    }
    var args = [{}].concat(Array.prototype.slice.call(arguments, 0));
    return _assoc.apply(null, args);
}

export function _hash_map_Q(hm) {
    return typeof hm === "object" &&
        !Array.isArray(hm) &&
        !(hm === null) &&
        !(hm instanceof Symbol) &&
        !(hm instanceof Atom);
}
export function _assoc(hm) {
    if (arguments.length % 2 !== 1) {
        throw new Error("Odd number of assoc arguments");
    }
    for (var i = 1; i < arguments.length; i += 2) {
        var ktoken = arguments[i],
            vtoken = arguments[i + 1];
        if (typeof ktoken !== "string") {
            throw new Error("expected hash-map key string, got: " + (typeof ktoken));
        }
        hm[ktoken] = vtoken;
    }
    return hm;
}
export function _dissoc(hm) {
    for (var i = 1; i < arguments.length; i++) {
        var ktoken = arguments[i];
        delete hm[ktoken];
    }
    return hm;
}

// Atoms
export class Atom {
    constructor(val) { this.val = val; }
}
export function _atom(val) { return new Atom(val); }
export function _atom_Q(atm) { return atm instanceof Atom; }
