module.exports = function (inheritMethods, dummyFunc) {
  'use strict';

  function SimpleDestroyable () {}
  SimpleDestroyable.prototype.destroy = function () {
    this.__cleanUp();
  };
  SimpleDestroyable.prototype.__cleanUp = dummyFunc;

  SimpleDestroyable.addMethods = function (chld) {
    inheritMethods(chld, SimpleDestroyable, 'destroy');
  };

  return SimpleDestroyable;
};
