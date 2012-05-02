var tasks = [
  {
    name: 
      'Simple arithmetic'
  , description:
    'Fix the assert by replacing __ with the correct operator.'
  , code: 
      '(assert (= 2 (__ 1 1)))\n\n' +
      '(println "You made it!")'
  },
  {
    name: 
      '1. List operations'
  , description:
    'Return the first element in the list.'
  , code: 
      '(assert (= 5 (__ \'(1 2 3)))\n\n' +
      '(println "You made it!")'
  },
  {
    name: 
      '2. List operations, cont'
  , description:
    'Return the fifth element in the list.'
  , code: 
      '(assert (= 5 (__ \'(0 1 2 3 4 5) __)))\n\n' +
      '(println "You made it!")'
  },
  {
    name: 
      'FizzBuzz'
  , description:
      'Make the fizzbuzz function return "Fizz", "Buzz" or "FizzBuzz" if ' +
      'n is a multiplum of 3, 5 or both, respectively, or else just return n.'
  , code: 
      '(defn fizzbuzz [n])\n\n' +
      '(assert (= 1 (fizzbuzz 1)))\n' +
      '(assert (= "Fizz" (fizzbuzz 3)))\n' +
      '(assert (= "Buzz" (fizzbuzz 5)))\n' +
      '(assert (= "Fizz" (fizzbuzz 9)))\n' +
      '(assert (= "Buzz" (fizzbuzz 10)))\n' +
      '(assert (= "FizzBuzz" (fizzbuzz 15)))\n\n' +
      '(println "You made it!")'
  }
];
