/*global "process": true */
var rl = require('readline').createInterface(process.stdin, process.stdout, null)
  , clojure = require('./clojure')
  , Namespace = require('./namespace').Namespace
  ;

console.log("Welcome to the clojurejs REPL! Type (quit) to quit");

rl.on('line', readEvalPrompt)
  .on('close', function () {process.exit(0);});

prompt();

function readEvalPrompt (input) {
  var result;

  input = input.trim();

  if (input === '(quit)') {
      console.log('Bye!');
      process.exit(0);
  }
  try {
    result = clojure.run(input);

    if (result !== undefined) {
      console.log(result);
    }
  } catch (error) {
    console.log("Error: ", error);
  }

  prompt();
}

function prompt () {
  var prefix = Namespace.current.name + '=> ';
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}
