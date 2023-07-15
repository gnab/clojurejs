import {_obj_type, _clone, _assoc_BANG, _dissoc_BANG, _list_Q, _vector_Q,
    _string_Q, _sequential_Q, _hash_map_Q, _function_Q, _equal_Q,
    _nil_Q, _true_Q, _false_Q, _number_Q, _symbol, _symbol_Q,
    _keyword, _keyword_Q, _fn_Q, _macro_Q, _list, _vector,
    _hash_map, _atom, _atom_Q} from './types.js'
import { read_str } from './reader.js';

var core = {};

// Errors/Exceptions
function mal_throw(exc) { throw exc; }


// String functions
function pr_str() {
    return Array.prototype.map.call(arguments,function(exp) {
        return printer._pr_str(exp, true);
    }).join(" ");
}

function str() {
    return Array.prototype.map.call(arguments,function(exp) {
        return printer._pr_str(exp, false);
    }).join("");
}

function prn() {
    printer.println.apply({}, Array.prototype.map.call(arguments,function(exp) {
        return printer._pr_str(exp, true);
    }));
}

function println() {
    printer.println.apply({}, Array.prototype.map.call(arguments,function(exp) {
        return printer._pr_str(exp, false);
    }));
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
function assoc(src_hm) {
    var hm = _clone(src_hm);
    var args = [hm].concat(Array.prototype.slice.call(arguments, 1));
    return _assoc_BANG.apply(null, args);
}

function dissoc(src_hm) {
    var hm = _clone(src_hm);
    var args = [hm].concat(Array.prototype.slice.call(arguments, 1));
    return _dissoc_BANG.apply(null, args);
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
function vals(hm) { return Object.keys(hm).map(function(k) { return hm[k]; }); }


// Sequence functions
function cons(a, b) { return [a].concat(b); }

function concat(lst) {
    lst = lst || [];
    return lst.concat.apply(lst, Array.prototype.slice.call(arguments, 1));
}
function vec(lst) {
    if (_list_Q(lst)) {
        var v = Array.prototype.slice.call(lst, 0);
        v.__isvector__ = true;
        return v;
    } else {
        return lst;
    }
}

function nth(lst, idx) {
    if (idx < lst.length) { return lst[idx]; }
    else                  { throw new Error("nth: index out of range"); }
}

function first(lst) { return (lst === null) ? null : lst[0]; }

function rest(lst) { return (lst == null) ? [] : lst.slice(1); }

function empty_Q(lst) { return lst.length === 0; }

function count(s) {
    if (Array.isArray(s)) { return s.length; }
    else if (s === null)  { return 0; }
    else                  { return Object.keys(s).length; }
}

function conj(lst) {
    if (_list_Q(lst)) {
        return Array.prototype.slice.call(arguments, 1).reverse().concat(lst);
    } else {
        var v = lst.concat(Array.prototype.slice.call(arguments, 1));
        v.__isvector__ = true;
        return v;
    }
}

function seq(obj) {
    if (_list_Q(obj)) {
        return obj.length > 0 ? obj : null;
    } else if (_vector_Q(obj)) {
        return obj.length > 0 ? Array.prototype.slice.call(obj, 0): null;
    } else if (_string_Q(obj)) {
        return obj.length > 0 ? obj.split('') : null;
    } else if (obj === null) {
        return null;
    } else {
        throw new Error("seq: called on non-sequence");
    }
}


function apply(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return f.apply(f, args.slice(0, args.length-1).concat(args[args.length-1]));
}

function map(f, lst) {
    return lst.map(function(el){ return f(el); });
}


// Metadata functions
function with_meta(obj, m) {
    var new_obj = _clone(obj);
    new_obj.__meta__ = m;
    return new_obj;
}

function meta(obj) {
    // TODO: support symbols and atoms
    if ((!_sequential_Q(obj)) &&
        (!(_hash_map_Q(obj))) &&
        (!(_function_Q(obj)))) {
        throw new Error("attempt to get metadata from: " + _obj_type(obj));
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

function js_eval(str) {
    return interop.js_to_mal(eval(str.toString()));
}

function js_method_call(object_method_str) {
    var args = Array.prototype.slice.call(arguments, 1),
        r = interop.resolve_js(object_method_str),
        obj = r[0], f = r[1];
    var res = f.apply(obj, args);
    return interop.js_to_mal(res);
}

// types.ns is namespace of type functions
export const ns = {'type': _obj_type,
          '=': _equal_Q,
          'throw': mal_throw,
          'nil?': _nil_Q,
          'true?': _true_Q,
          'false?': _false_Q,
          'number?': _number_Q,
          'string?': _string_Q,
          'symbol': _symbol,
          'symbol?': _symbol_Q,
          'keyword': _keyword,
          'keyword?': _keyword_Q,
          'fn?': _fn_Q,
          'macro?': _macro_Q,

          'pr-str': pr_str,
          'str': str,
          'prn': prn,
          'println': println,
          'read-string': read_str,
          'slurp': slurp,
          '<'  : function(a,b){return a<b;},
          '<=' : function(a,b){return a<=b;},
          '>'  : function(a,b){return a>b;},
          '>=' : function(a,b){return a>=b;},
          '+'  : function(a,b){return a+b;},
          '-'  : function(a,b){return a-b;},
          '*'  : function(a,b){return a*b;},
          '/'  : function(a,b){return a/b;},
          'inc'  : function(a){return a+1;},
          "time-ms": time_ms,

          'list': _list,
          'list?': _list_Q,
          'vector': _vector,
          'vector?': _vector_Q,
          'hash-map': _hash_map,
          'map?': _hash_map_Q,
          'assoc': assoc,
          'dissoc': dissoc,
          'get': get,
          'contains?': contains_Q,
          'keys': keys,
          'vals': vals,

          'sequential?': _sequential_Q,
          'cons': cons,
          'concat': concat,
          'vec': vec,
          'nth': nth,
          'first': first,
          'rest': rest,
          'empty?': empty_Q,
          'count': count,
          'apply': apply,
          'map': map,

          'conj': conj,
          'seq': seq,

          'with-meta': with_meta,
          'meta': meta,
          'atom': _atom,
          'atom?': _atom_Q,
          "deref": deref,
          "reset!": reset_BANG,
          "swap!": swap_BANG,

          'js-eval': js_eval,
          '.': js_method_call
};
