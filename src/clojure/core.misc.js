exports['='] = function () {
  var prevArgVal;
  var currArgVal;
  var equals = true;

  Array.prototype.map.call(arguments, function (arg) {
    // Any lists making it in here are quoted, so compare
    // their stringify output do determine equality.
    currArgVal = (arg.kind === "list" ? arg.stringify() : arg);

    equals = (currArgVal === prevArgVal);
    prevArgVal = currArgVal;
  });

  return equals;
};
