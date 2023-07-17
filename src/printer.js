import {_obj_type} from './types.js'

export function _println() {
    console.log.apply(console, arguments)
}

export function _pr_str(obj, print_readably) {
    if (typeof print_readably === 'undefined') { print_readably = true; }
    var _r = print_readably;
    var ot = _obj_type(obj);
    switch (ot) {
    case 'list':
        var ret = obj.map(function(e) { return _pr_str(e,_r); });
        return "(" + ret.join(' ') + ")";
    case 'vector':
        var ret = obj.map(function(e) { return _pr_str(e,_r); });
        return "[" + ret.join(' ') + "]";
    case 'hash-map':
        var ret = [];
        for (var k in obj) {
            ret.push(_pr_str(k,_r), _pr_str(obj[k],_r));
        }
        return "{" + ret.join(' ') + "}";
    case 'string':
        if (obj[0] === '\u029e') {
            return ':' + obj.slice(1);
        } else if (_r) {
            return '"' + obj.replace(/\\/g, "\\\\")
                .replace(/"/g, '\\"')
                .replace(/\n/g, "\\n") + '"'; // string
        } else {
            return obj;
        }
    case 'keyword':
        return ':' + obj.slice(1);
    case 'nil':
        return "nil";
    case 'atom':
        return "(atom " + _pr_str(obj.val,_r) + ")";
    default:
        return obj.toString();
    }
}