exports['+'] = function () {
  var sum = 0;

  Array.prototype.map.call(arguments, function (n) {
    sum += +n;
  });

  return sum;
};
exports['-'] = function () {
  var sum = arguments[0];

  Array.prototype.map.call(Array.prototype.slice.call(arguments, 1), function (n) {
    sum -= +n;
  });

  return sum;
};
exports['*'] = function () {
  var product = 1;

  Array.prototype.map.call(arguments, function (n) {
    product *= +n;
  });

  return product;
};
exports['/'] = function () {
  var product = arguments[0];

  Array.prototype.map.call(Array.prototype.slice.call(arguments, 1), function (n) {
    product /= +n;
  });

  return product;
};
