var reader = require('./reader')
  , evaluator = require('./evaluator')
  ;

exports.run = function (str) {
  var data = reader.read(str);
  return evaluator.evaluate(data);
};

if (typeof window !== 'undefined') {
  window.clojurejs = {
    run: exports.run
  };
}
