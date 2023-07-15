import { read_str } from './reader.js';
import { _pr_str } from './printer.js';
import { Env } from './env.js';
import { ns } from './core.js';
import { _symbol, _list_Q, _symbol_Q, _vector_Q, _hash_map_Q, _function } from './types.js';

// read
function READ(str) {
  return read_str(str);
}

// eval
function eval_ast(ast, env) {
  if (_symbol_Q(ast)) {
      return env.get(ast);
  } else if (_list_Q(ast)) {
      return ast.map(function(a) { return EVAL(a, env); });
  } else if (_vector_Q(ast)) {
      var v = ast.map(function(a) { return EVAL(a, env); });
      v.__isvector__ = true;
      return v;
  } else if (_hash_map_Q(ast)) {
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
  while (true) {

  //printer.println("EVAL:", printer._pr_str(ast, true));
  if (!_list_Q(ast)) {
      return eval_ast(ast, env);
  }
  if (ast.length === 0) {
      return ast;
  }

  // apply list
  var a0 = ast[0], a1 = ast[1], a2 = ast[2], a3 = ast[3];
  switch (a0.value) {
  case "def!":
      var res = EVAL(a2, env);
      return env.set(a1, res);
  case "let*":
      var let_env = new Env(env);
      for (var i=0; i < a1.length; i+=2) {
          let_env.set(a1[i], EVAL(a1[i+1], let_env));
      }
      ast = a2;
      env = let_env;
      break;
  case "do":
      eval_ast(ast.slice(1, -1), env);
      ast = ast[ast.length-1];
      break;
  case "if":
      var cond = EVAL(a1, env);
      if (cond === null || cond === false) {
          ast = (typeof a3 !== "undefined") ? a3 : null;
      } else {
          ast = a2;
      }
      break;
  case "fn*":
      return _function(EVAL, Env, a2, env, a1);
  default:
      var el = eval_ast(ast, env), f = el[0];
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
  var result = _EVAL(ast, env);
  console.log("EVAL", result)
  return (typeof result !== "undefined") ? result : null;
}

// print
function PRINT(exp) {
  return _pr_str(exp, true);
}

// repl
const repl_env = new Env();
export const evalString = function(str) { return EVAL(READ(str), repl_env).toString(); };
const rep = function(str) { return PRINT(EVAL(READ(str), repl_env)); };

// core.js: defined using javascript
for (var n in ns) { repl_env.set(_symbol(n), ns[n]); }
// core.mal: defined using the language itself
rep("(def! not (fn* (a) (if a false true)))");
