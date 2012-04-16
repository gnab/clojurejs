exports['='] = function () {
  var prevArg;
  var equals = true;

  Array.prototype.map.call(arguments, function (arg) {
    equals = (arg === prevArg);
    prevArg = arg;                         
  });

  return equals;
};
