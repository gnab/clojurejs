import {read} from './reader.js';
import {evaluate} from './evaluator.js';

export function run (str) {
  var data = read(str);
  return data
  //return evaluator.evaluate(data);
}

if (typeof window !== 'undefined') {
  window.clojurejs = {
    run: run
  };
}
