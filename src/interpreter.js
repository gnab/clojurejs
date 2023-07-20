import { read_str } from './reader.js';
import { _pr_str } from './printer.js';
import { ns, seq } from './core.js';
import * as types from './types.js'
import * as _env from './env.js'

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
  if (!_env.findKeyInEnv(env, ast[0])) {
    return "Can't find " + ast[0] + " in env"
  }
  return types._list_Q(ast) &&
    types._symbol_Q(ast[0]) &&
    _env.findKeyInEnv(env, ast[0]) &&
    _env.getKeyInEnv(env, ast[0])._ismacro_;
}


console.log(Object.entries(_env.currentEnv))
console.log("wtf", _env.getKeyInEnv(_env.currentEnv, "apply"))

function macroexpand(ast, env) {
  //console.log("macro:", is_macro_call(ast, env))
  console.log("ast[0]:", ast[0])

 // if (is_macro_call(ast, env)) {
 //   console.log("mac:", _env.getKeyInEnv(env, ast[0]))
 // }
  /* while (is_macro_call(ast, env)) {
      var mac = _env.getKeyInEnv(env, ast[0]);
      console.log("macro:", mac)
      ast = mac.apply(mac, ast.slice(1));
  } */
  return ast;
}

function eval_ast(ast, env) {
  if (types._symbol_Q(ast)) {
    console.log(ast.value, "resolved", "in env:", env)
    //  console.log("its value is", _env.getKeyInEnv(env, ast))
    return _env.getKeyInEnv(env, ast);
  } else if (types._list_Q(ast)) {
    return ast.map(function (a) { return EVAL(a, env); });
  } else if (types._vector_Q(ast)) {
    var v = ast.map(function (a) { return EVAL(a, env); });
    v.__isvector__ = true;
    return v;
  } else if (types._hash_map_Q(ast)) {
    //console.log("Object is a hash-map")
    let new_hm = {};
    for (const k in ast) {
      // console.log("k:", k)
      new_hm[k] = EVAL(ast[k], env);
    }
    return new_hm;
  } else {
    //console.log("AST:", ast)
    return ast;
  }
}

// Let's make a function that will just thread one form into the other 
// It threads the *form* *into* the *expr*.
// `expr` must be a list.
// Example:
// `expr` -> (add-language "Clojure")
// `form` -> (new-list)
// output: (add-language (new-list) "Clojure")
// But it needs to handle cases where the expr is a list of 1.
function threadFirst(form, expr) {
  let l = expr.slice(0, 1)
  let r = expr.slice(1)[0]
  l.push(form)
  if (r) {
    l.push(r)
  }
  return l
}

// thread-last is much simpler, we just append form to expr
function threadLast(form, expr) {
  let l = expr
  l.push(form)
  return l
}

let namespace = "user"

function _EVAL(ast, env) {
  //console.log("Walking AST:", walk(x => x*2, x => x, ast))
  while (true) {

    if (!types._list_Q(ast)) {
      //    console.log("ast:", ast)
      //   console.log("eval_ast:", eval_ast(ast, env))
      return eval_ast(ast, env);
    }

    // apply list
    ast = macroexpand(ast, env);
    console.log("expanded:", ast)
    if (ast.length === 0) {
      return ast;
    }

    var a0 = ast[0], a1 = ast[1], a2 = ast[2], a3 = ast[3];
    // Special forms:
    switch (a0.value) {
      case "ns":
        namespace = a1
        return null
      case "def":
        var res = EVAL(a2, env);
        _env.addToEnv(env, a1, res);
        return "#'" + namespace + "/" + a1
      case "defn":
        const fn = types._function(EVAL, a3, env, a2);
        _env.addToEnv(env, a1, fn)
        return "#'" + namespace + "/" + a1
      case "let":
        var let_env = _env.newScope(env);
        for (var i = 0; i < a1.length; i += 2) {
          _env.setInEnv(let_env, a1[i], EVAL(a1[i + 1], let_env));
        }
        ast = a2;
        env = let_env;
        // console.log("let_env:", let_env)
        break;
      case "->":
        // First element in the AST, a0, is the actual thread-first operator (`->`)
        // so a1 is the first form to be threaded into the following exprs
        const first = a1
        // Make a new list of just the forms to be *threaded*,
        // i.e. the ones that have forms threaded *into* them.
        // so we slice it at 2
        const rest = ast.slice(2)
        let lists = []
        // make each form to be threaded into a list
        // if it is not a list already
        // remember, we actually mean arrays here in the AST
        // which the printer then prints as lists.
        for (let i = 0; i < rest.length; i++) {
          if (types._list_Q(rest[i])) {
            lists.push(rest[i])
          } else {
            lists.push([rest[i]])
          }
        }
        console.log("lists:", lists)
        let threaded = first
        console.log(first)
        for (let i = 0; i < lists.length; i++) {
          threaded = threadFirst(threaded, lists[i])
          console.log(threaded)
        }
        return EVAL(threaded, env)
      case "->>":
        const first2 = a1
        const rest2 = ast.slice(2)
        let lists2 = []
        for (let i = 0; i < rest2.length; i++) {
          if (types._list_Q(rest2[i])) {
            lists2.push(rest2[i])
          } else {
            lists2.push([rest2[i]])
          }
        }
        let threaded2 = first2
        for (let i = 0; i < lists2.length; i++) {
          threaded2 = threadLast(threaded2, lists2[i])
        }
        return EVAL(threaded2, env)
      case "dispatch":
        let fun = [types._symbol('fn')]
        const args = ast.toString().match(/%\d?/g).map(types._symbol)
        let body = ast.slice(1)[0]
        fun.push(args)
        fun.push(body)
        return types._function(EVAL, body, env, args);
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
        return _env.setInEnv(env, a1, func);
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
        // not a special form, so a regular function call. 
        // first we use `eval_ast()` to resolve the individual
        // elements and get another ast
        const el = eval_ast(ast, env)
        // fn `f` is the first element of this new ast
        const f = el[0]
        // console.log("el:", el)
        // check if function was defined with `fn`
        if (f.__ast__) {
          // if it is, set the ast to the one passed to it
          // when it was defined
          ast = f.__ast__;
          //console.log("f.__ast__", ast)
          // and set the env to the scope in which it was defined.
          // and pass it the arguments
          env = f.__gen_env__(el.slice(1));
          // notice there's no return value. Instead it loops again
          // with newly defined ast and env
          // console.log("ast:", ast)
        } else {
          //  console.log("f.apply:", f.apply(f, el.slice(1)))
          return f.apply(f, el.slice(1));
        }
    }
  }
}

function EVAL(ast, env) {
  //console.log("Evaluating", ast, " in", env)
  var result = _EVAL(ast, env);
  //console.log("EVAL", result)
  return (typeof result !== "undefined") ? result : null;
}

export function evalString(str) {
  return _pr_str(EVAL(READ(str), _env.currentEnv))
}

// core.js: defined using javascript
for (var n in ns) { _env.addToEnv(_env.init_env, types._symbol(n), ns[n]); }

// core.mal: defined using the language itself
evalString("(def not (fn (a) (if a false true)))", _env.currentEnv);
evalString(`(def reduce
  (fn (f init xs)
    (if (empty? xs)
      init
      (reduce f (f init (first xs)) (rest xs)))))`)
evalString(`(defmacro cond 
  (fn (& xs) 
    (if (> (count xs) 0) 
       (list 'if (first xs) 
                (if (> (count xs) 1) 
                    (nth xs 1) 
                    (throw \"odd number of forms to cond\"))
                (cons 'cond (rest (rest xs)))))))`, _env.currentEnv);
//evalString("(def gensym (let [counter (atom 0)] (fn [] (symbol (str \"G__\" (swap! counter inc))))))", _env.currentEnv)
//evalString("(defmacro or (fn (& xs) (if (empty? xs) nil (if (= 1 (count xs)) (first xs) (let (condvar (gensym)) `(let (~condvar ~(first xs)) (if ~condvar ~condvar (or ~@(rest xs)))))))))", _env.currentEnv)