import * as types from './types.js'
import { read_str } from './reader.js';
import { Env } from './env.js';
import { js_to_mal, resolve_js } from './interop.js';
import { _pr_str, _println } from './printer.js'

var core = {};

// Errors/Exceptions
function mal_throw(exc) { throw exc; }

// String functions
function pr_str() {
    return Array.prototype.map.call(arguments, function (exp) {
        return _pr_str(exp, true);
    }).join(" ");
}

function str() {
    return Array.prototype.map.call(arguments, function (exp) {
        return _pr_str(exp, false);
    }).join("");
}

function print() {
    return Array.prototype.map.call(arguments, function (exp) {
        return _pr_str(exp, false);
    }).join("");
}


function prn() {
    return Array.prototype.map.call(arguments, function (exp) {
        return _pr_str(exp, false);
    }).join("");
}


function println() {
    return Array.prototype.map.call(arguments, function (exp) {
        return _pr_str(exp, false);
    }).join("");
}


function slurp(f) {
    var req = new XMLHttpRequest();
    req.open("GET", f, false);
    req.send();
    if (req.status == 200) {
        return req.responseText;
    } else {
        throw new Error("Failed to slurp file: " + f);
    }
}


// Number functions
function time_ms() { return new Date().getTime(); }


// Hash Map functions
function assoc(src) {
    if (types._vector_Q(src)) {
        const index = arguments[1]
        const newVal = arguments[2]
        let vec = types._clone(src);
        const head = vec.slice(0, index)
        const tail = vec.slice(index + 1)
        head.push(newVal)
        vec = head.concat(tail)
        vec.__isvector__ = true;
        return vec
    }
    var hm = types._clone(src);
    var args = [hm].concat(Array.prototype.slice.call(arguments, 1));
    return types._assoc.apply(null, args);
}

function dissoc(src) {
    if (types._vector_Q(src)) {
        let vec = types._clone(src);
        const index = arguments[1]
        const head = vec.slice(0, index)
        const tail = vec.slice(index + 1)
        vec = head.concat(tail)
        vec.__isvector__ = true;
        return vec
    }
    var hm = types._clone(src);
    var args = [hm].concat(Array.prototype.slice.call(arguments, 1));
    return types._dissoc.apply(null, args);
}

function get(hm, key) {
    if (hm != null && key in hm) {
        return hm[key];
    } else {
        return null;
    }
}

function contains_Q(hm, key) {
    if (key in hm) { return true; } else { return false; }
}

function keys(hm) { return Object.keys(hm); }
function vals(hm) { return Object.keys(hm).map(function (k) { return hm[k]; }); }


// Sequence functions
function cons(a, b) { return [a].concat(b); }

function concat(lst) {
    lst = lst || [];
    return lst.concat.apply(lst, Array.prototype.slice.call(arguments, 1));
}
function vec(lst) {
    if (types._list_Q(lst)) {
        var v = Array.prototype.slice.call(lst, 0);
        v.__isvector__ = true;
        return v;
    } else {
        return lst;
    }
}

function nth(lst, idx) {
    if (idx < lst.length) { return lst[idx]; }
    else { throw new Error("nth: index out of range"); }
}

function range(start, end) {
    if (!end) {
        return range(0, start)
    }
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

function first(lst) { return (lst === null) ? null : lst[0]; }
function last(lst) { return (lst === null) ? null : lst.slice(-1)[0]; }

function rest(lst) { return (lst == null) ? [] : lst.slice(1); }

function empty_Q(lst) { return lst.length === 0; }

function count(s) {
    if (Array.isArray(s)) { return s.length; }
    else if (s === null) { return 0; }
    else { return Object.keys(s).length; }
}

function conj(lst) {
    if (types._list_Q(lst)) {
        return Array.prototype.slice.call(arguments, 1).reverse().concat(lst);
    } else {
        var v = lst.concat(Array.prototype.slice.call(arguments, 1));
        v.__isvector__ = true;
        return v;
    }
}

function pop(lst) {
    if (types._list_Q(lst)) {
        return lst.slice(1);
    } else {
        var v = lst.slice(0, -1);
        v.__isvector__ = true;
        return v;
    }
}

export function seq(obj) {
    if (types._list_Q(obj)) {
        return obj.length > 0 ? obj : null;
    } else if (types._vector_Q(obj)) {
        return obj.length > 0 ? Array.prototype.slice.call(obj, 0) : null;
    } else if (types._string_Q(obj)) {
        return obj.length > 0 ? obj.split('') : null;
    } else if (types._hash_map_Q(obj)) {
        let kvs = []
        Object.entries(obj).forEach(kv => {
            kv.__mapEntry__ = true;
            kvs.push(kv)
        })
        return kvs
    } else if (obj === null) {
        return null;
    } else {
        throw new Error("seq: called on non-sequence");
    }
}


function apply(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return f.apply(f, args.slice(0, args.length - 1).concat(args[args.length - 1]));
}

function map(f, lst) {
    return lst.map(function (el) { return f(el); });
}


// Metadata functions
function with_meta(obj, m) {
    var new_obj = types._clone(obj);
    new_obj.__meta__ = m;
    return new_obj;
}

function meta(obj) {
    // TODO: support symbols and atoms
    if ((!types._sequential_Q(obj)) &&
        (!(types._hash_map_Q(obj))) &&
        (!(types._function_Q(obj)))) {
        throw new Error("attempt to get metadata from: " + types._obj_type(obj));
    }
    return obj.__meta__;
}

// Atom functions
function deref(atm) { return atm.val; }
function reset_BANG(atm, val) { return atm.val = val; }
function swap_BANG(atm, f) {
    var args = [atm.val].concat(Array.prototype.slice.call(arguments, 2));
    atm.val = f.apply(f, args);
    return atm.val;
}

export function js_eval(str) {
    return js_to_mal(eval(str.toString()));
}

function js_method_call(object_method_str) {
    var args = Array.prototype.slice.call(arguments, 1),
        r = resolve_js(object_method_str),
        obj = r[0], f = r[1];
    var res = f.apply(obj, args);
    return js_to_mal(res);
}

export const ns = {
    'type': types._obj_type,
    '=': types._equal_Q,
    'throw': mal_throw,
    'nil?': types._nil_Q,
    'true?': types._true_Q,
    'false?': types._false_Q,
    'number?': types._number_Q,
    'string?': types._string_Q,
    'symbol': types._symbol,
    'symbol?': types._symbol_Q,
    'keyword': types._keyword,
    'keyword?': types._keyword_Q,
    'fn?': types._fn_Q,
    'macro?': types._macro_Q,

    'pr-str': pr_str,
    'print': print,
    'str': str,
    'prn': prn,
    'println': println,
    'read-string': read_str,
    'slurp': slurp,
    '<': function (a, b) { return a < b; },
    '<=': function (a, b) { return a <= b; },
    '>': function (a, b) { return a > b; },
    '>=': function (a, b) { return a >= b; },
    '+': function (a, b) { return a + b; },
    '-': function (a, b) { return a - b; },
    '*': function (a, b) { return a * b; },
    '/': function (a, b) { return a / b; },
    'inc': function (a) { return a + 1; },
    "time-ms": time_ms,

    'list': types._list,
    'list?': types._list_Q,
    'vector': types._vector,
    'vector?': types._vector_Q,
    'hash-map': types._hash_map,
    'map?': types._hash_map_Q,
    'assoc': assoc,
    'dissoc': dissoc,
    'get': get,
    'contains?': contains_Q,
    'keys': keys,
    'vals': vals,

    'sequential?': types._sequential_Q,
    'cons': cons,
    'concat': concat,
    'vec': vec,
    'nth': nth,
    'first': first,
    'last': last,
    'rest': rest,
    'empty?': empty_Q,
    'count': count,
    'apply': apply,
    'map': map,
    'range': range,

    'conj': conj,
    'seq': seq,
    'pop': pop,

    'with-meta': with_meta,
    'meta': meta,
    'atom': types._atom,
    'atom?': types._atom_Q,
    "deref": deref,
    "reset!": reset_BANG,
    "swap!": swap_BANG,

    'js-eval': js_eval,
    '.': js_method_call
};
