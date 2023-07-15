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

function readEvalPrompt (input) {
  var result;

  input = input.trim();

  if (input === '(quit)') {
      console.log('Bye!');
      process.exit(0);
  }
  try {
    result = read_str(input)

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
