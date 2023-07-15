import { createInterface } from 'node:readline';
import { read_str } from './reader.js';
import { _pr_str } from './printer.js';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to the clojurejs REPL! Type (quit) to quit");

readline.on('line', readEvalPrompt)
  .on('close', function () {process.exit(0);});

prompt();

// read
function READ(str) {
  return read_str(str);
}

// eval
function EVAL(ast, env) {
  return ast;
}

// print
function PRINT(exp) {
  return _pr_str(exp, true);
}

// repl
var re = function(str) { return EVAL(READ(str), {}); };
var rep = function(str) { return PRINT(EVAL(READ(str), {})); };

function readEvalPrompt (input) {
  var result;

  input = input.trim();

  if (input === '(quit)') {
      console.log('Bye!');
      process.exit(0);
  }
  try {
    result = rep(input)

    if (result !== undefined) {
      console.log(result);
    }
  } catch (error) {
    console.log("Error: ", error);
  }

  prompt();
}

function prompt () {
  var prefix = 'user=> ';
  readline.setPrompt(prefix, prefix.length);
  readline.prompt();
}
