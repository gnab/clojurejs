var reader = require('../reader')
  , evaluator = require('../evaluator')
  , api
  ;

var data = reader.read(process.argv[2]);
console.log(evaluator.evaluate(data));