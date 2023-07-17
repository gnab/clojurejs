import { read_str } from './reader.js';
import { _pr_str } from './printer.js';
import { init_env, currentEnv, addToEnv, getKeyInEnv, newScope, findKeyInEnv, setInEnv } from './env.js';
import { ns } from './core.js';
import * as types from './types.js'

// read
function READ(str) {
  return read_str(str);
}

// eval
function qqLoop(acc, elt) {
  if (types._list_Q(elt) && elt.length
    && types._symbol_Q(elt[0]) && elt[0].value == 'splice-unquote') {
    return [types._symbol("concat"), elt[1], acc];
  } else {
    return [types._symbol("cons"), quasiquote(elt), acc];
  }
}
function quasiquote(ast) {
  if (types._list_Q(ast) && 0 < ast.length
    && types._symbol_Q(ast[0]) && ast[0].value == 'unquote') {
    return ast[1];
  } else if (types._list_Q(ast)) {
    return ast.reduceRight(qqLoop, []);
  } else if (types._vector_Q(ast)) {
    return [types._symbol("vec"), ast.reduceRight(qqLoop, [])];
  } else if (types._symbol_Q(ast) || types._hash_map_Q(ast)) {
    return [types._symbol("quote"), ast];
  } else {
    return ast;
  }
}

function is_macro_call(ast, env) {
  if (!findKeyInEnv(env, ast[0])) {
    return "Can't find " + ast[0] + "in env"
  }
  return types._list_Q(ast) &&
         types._symbol_Q(ast[0]) &&
         findKeyInEnv(env, ast[0]) &&
         getKeyInEnv(env, ast[0])._ismacro_;
}

function macroexpand(ast, env) {
  while (is_macro_call(ast, env)) {
      var mac = getKeyInEnv(env, ast[0]);
      ast = mac.apply(mac, ast.slice(1));
  }
  return ast;
}

function eval_ast(ast, env) {
  if (types._symbol_Q(ast)) {
    //console.log(ast, "is a symbol")
    return getKeyInEnv(env, ast);
  } else if (types._list_Q(ast)) {
    return ast.map(function (a) { return EVAL(a, env); });
  } else if (types._vector_Q(ast)) {
    var v = ast.map(function (a) { return EVAL(a, env); });
    v.__isvector__ = true;
    return v;
  } else if (types._hash_map_Q(ast)) {
    var new_hm = {};
    for (k in ast) {
      new_hm[k] = EVAL(ast[k], env);
    }
    return new_hm;
  } else {
    console.log("AST:", ast)
    return ast;
  }
}

function _EVAL(ast, env) {
  console.log("trying to Eval:", ast, "in env:", env)
  while (true) {

    if (!types._list_Q(ast)) {
      console.log("_EVAL:", eval_ast(ast, env))
      return eval_ast(ast, env);
    }

    // apply list
    //ast = macroexpand(ast, env);
    if (!types._list_Q(ast)) {
      console.log("_EVAL:", eval_ast(ast, env))
      return eval_ast(ast, env);
    }
    if (ast.length === 0) {
      return ast;
    }

    var a0 = ast[0], a1 = ast[1], a2 = ast[2], a3 = ast[3];
    //console.log("a0.value:", a0.value)
    switch (a0.value) {
      case "def":
        var res = EVAL(a2, env);
        return addToEnv(env, a1, res);
      case "let":
        var let_env = newScope(env);
        for (var i = 0; i < a1.length; i += 2) {
         setInEnv(let_env, a1[i], EVAL(a1[i + 1], let_env));
        }
        ast = a2;
        currentEnv = let_env = let_env;
        break;
      case "quote":
        return a1;
      case "quasiquoteexpand":
        return quasiquote(a1);
      case "quasiquote":
        ast = quasiquote(a1);
        break;
      case 'defmacro':
        var func = types._clone(EVAL(a2, env));
        func._ismacro_ = true;
        return env.set(a1, func);
      case 'macroexpand':
        return macroexpand(a1, env);
      case "try":
        try {
          return EVAL(a1, env);
        } catch (exc) {
          if (a2 && a2[0].value === "catch") {
            if (exc instanceof Error) { exc = exc.message; }
            return EVAL(a2[2], bindExprs(env, [a2[1]], [exc]));
          } else {
            throw exc;
          }
        }
      case "do":
        eval_ast(ast.slice(1, -1), env);
        ast = ast[ast.length - 1];
        break;
      case "if":
        var cond = EVAL(a1, env);
        if (cond === null || cond === false) {
          ast = (typeof a3 !== "undefined") ? a3 : null;
        } else {
          ast = a2;
        }
        break;
      case "fn":
        return types._function(EVAL, a2, env, a1);
      default:
        var el = eval_ast(ast, env), f = el[0];
        console.log("el:", el)
        if (f.__ast__) {
          ast = f.__ast__;
          env = f.__gen_env__(el.slice(1));
        } else {
          return f.apply(f, el.slice(1));
        }
    }
  }
}

function EVAL(ast, env) {
  //console.log("env:", env)
  var result = _EVAL(ast, env);
  //console.log("EVAL", result)
  return (typeof result !== "undefined") ? result : null;
}

export function evalString (str) { 
  return _pr_str(EVAL(READ(str), currentEnv)) 
}

// core.js: defined using javascript
for (var n in ns) { addToEnv(init_env, types._symbol(n), ns[n]); }

// core.mal: defined using the language itself
evalString("(def not (fn (a) (if a false true)))", currentEnv);
//evalString("(defmacro cond (fn* (& xs) (if (> (count xs) 0) (list 'if (first xs) (if (> (count xs) 1) (nth xs 1) (throw \"odd number of forms to cond\")) (cons 'cond (rest (rest xs)))))))");