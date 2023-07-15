import { read_str } from './reader.js';
import { _pr_str } from './printer.js';
import { Env} from './env.js';
import { ns } from './core.js';
import { _symbol, _list_Q, _symbol_Q, _vector_Q, _hash_map_Q, _function, _clone } from './types.js';

// read
function READ(str) {
  return read_str(str);
}

// eval
function qqLoop (acc, elt) {
  if (_list_Q(elt) && elt.length
      && _symbol_Q(elt[0]) && elt[0].value == 'splice-unquote') {
      return [_symbol("concat"), elt[1], acc];
  } else {
      return [_symbol("cons"), quasiquote (elt), acc];
  }
}
function quasiquote(ast) {
  if (_list_Q(ast) && 0<ast.length
      && _symbol_Q(ast[0]) && ast[0].value == 'unquote') {
      return ast[1];
  } else if (_list_Q(ast)) {
      return ast.reduceRight(qqLoop,[]);
  } else if (_vector_Q(ast)) {
      return [_symbol("vec"), ast.reduceRight(qqLoop,[])];
  } else if (_symbol_Q(ast) || _hash_map_Q(ast)) {
      return [_symbol("quote"), ast];
  } else {
      return ast;
  }
}

function is_macro_call(ast, env) {
  return _list_Q(ast) &&
         _symbol_Q(ast[0]) &&
         env.find(ast[0]) &&
         env.get(ast[0])._ismacro_;
}

function macroexpand(ast, env) {
  while (is_macro_call(ast, env)) {
      var mac = env.get(ast[0]);
      ast = mac.apply(mac, ast.slice(1));
  }
  return ast;
}

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

  // apply list
  ast = macroexpand(ast, env);
  if (!_list_Q(ast)) {
      return eval_ast(ast, env);
  }
  if (ast.length === 0) {
      return ast;
  }

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
  case "quote":
      return a1;
  case "quasiquoteexpand":
      return quasiquote(a1);
  case "quasiquote":
      ast = quasiquote(a1);
      break;
  case 'defmacro!':
      var func = _clone(EVAL(a2, env));
      func._ismacro_ = true;
      return env.set(a1, func);
  case 'macroexpand':
      return macroexpand(a1, env);
  case "try*":
      try {
          return EVAL(a1, env);
      } catch (exc) {
          if (a2 && a2[0].value === "catch*") {
              if (exc instanceof Error) { exc = exc.message; }
              return EVAL(a2[2], new Env(env, [a2[1]], [exc]));
          } else {
              throw exc;
          }
      }
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
  //console.log("EVAL", result)
  return (typeof result !== "undefined") ? result : null;
}

// repl
const repl_env = new Env();
export const evalString = function(str) { return _pr_str(EVAL(READ(str), repl_env)) };

// core.js: defined using javascript
for (var n in ns) { repl_env.set(_symbol(n), ns[n]); }
repl_env.set(_symbol('eval'), function(ast) {
    return EVAL(ast, repl_env); });
repl_env.set(_symbol('*ARGV*'), []);

// core.mal: defined using the language itself
evalString("(def! not (fn* (a) (if a false true)))");
