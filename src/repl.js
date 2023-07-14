import { createInterface } from 'node:readline';
import { read } from './reader.js';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
    result = read(input);

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
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}
