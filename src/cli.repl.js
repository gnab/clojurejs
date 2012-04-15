var rl = require('readline').createInterface(process.stdin, process.stdout, null)
, reader = require('./reader')
, evaluator = require('./evaluator')
, prefix = "repl> "
;

console.log("Welcome to the clojurejs REPL! Type (quit) to quit");
rl.on('line', readEvalPrompt)
  .on('close', function() {process.exit(0);});
rl.setPrompt(prefix, prefix.length);
rl.prompt();

function readEvalPrompt(input){
  input = input.trim();
  switch(input) {
  case '(quit)':
    console.log('Bye!');
    process.exit(0);
    break;
  default:
    try{
      var data = reader.read(input);
      console.log(evaluator.evaluate(data));      
    } catch (error) {
      console.log("Error: ",error);
    }
    rl.prompt();
    break;
  }  
}
