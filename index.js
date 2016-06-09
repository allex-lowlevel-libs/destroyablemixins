module.exports = function (inheritlib, dummyFunc, _EventEmitter) {
  'use strict';
  var Destroyable = require('./Destroyable.js')(dummyFunc, _EventEmitter);
  return {
    Destroyable:Destroyable,
    ComplexDestroyable:require('./ComplexDestroyable.js')(inheritlib.inherit, Destroyable),
    SimpleDestroyable : require('./SimpleDestroyable.js')(inheritlib.inheritMethods, dummyFunc)
  };
};
