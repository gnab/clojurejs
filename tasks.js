var tasks = [
  {
    name: 
      'Simple arithmetic'
  , description:
    'Fix the asserts by replacing __ with the correct operator.'
  , code: 
      '(assert (= 3 (__ 1 2)))\n' +
      '(assert (= 20 (__ 4 5)))\n\n' +
      '(println "You made it!")'
  },
  {
    name: 
      'List operations'
  , description:
    'Fix the asserts by replacing __ with the correct list operations'
  , code: 
      '(assert (= 1 (__ \'(1 2 3))))\n' +
      '(assert (= 2 (__ \'(1 2 3))))\n\n' +
      '(assert (= \'(1 2 3 4 5) (__ \'(0 1 2 3 4 5))))\n' +
      '(assert (= \'(1 2 3) (__ 1 \'(2 3))))\n' +
      '(assert (= \'(1 2 3 4 5 6) (__ \'(1 2 3) \'(4 5 6))))\n\n' +
      '(println "You made it!")'
  },
  {
    name: 
      'Functions, intro'
  , description:
    'Complete the very exotic add-nums function.'
  , code: 
      '(defn add-nums [num1 num2] __)\n' +
      '(assert (= 10 (add-nums 5 5))\n\n' +
      '(println "You made it!")'
  },
  {
    name: 
      'Functions, super-advanced'
  , description:
    "Create the concat-and-double function: concatenate and multiply each value in two lists given as arguments, and return the value. Remember, '(defn [arg1, arg2] body)..."
  , code: 
      '(assert (= \'(2 4 6 8) (concat-and-double \'(1 2) \'(3 4))))\n\n' +
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
