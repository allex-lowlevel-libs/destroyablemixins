module.exports = function (dummyFunc, _EventEmitter) {
  'use strict';
  function DestroyableExtender(destroyable,extendee){
    if (extendee.destroyed) {
      console.trace();
      console.error('OOOOOPSIE, destroyed already exists on extendee', extendee);
      //process.exit(0);
      throw Error('destroyed already exists on extendee');
      return;
    }
    if (!destroyable.destroyed) {
      console.trace();
      console.error('OOOOOPSIE, destroyed does not exist on destroyable', destroyable);
      throw Error('destroyed does not exist on destroyable');
      //process.exit(0);
      return;
    }
    this.extendee = extendee;
    this.extendee.destroyed = destroyable.destroyed;
    destroyable.destroyed.attachForSingleShot(this.destroy.bind(this));
  }
  DestroyableExtender.prototype.destroy = function(){
    this.extendee.destroyed = null;
    if('function' === typeof this.extendee.destroy){
      this.extendee.destroy();
    }
    this.extendee = null;
  };
  
  function Destroyable(){
    this.destroyed = new _EventEmitter();
    this.__dyingException = null;
  }
  Destroyable.prototype.destroy = function(exception){
    var d = this.destroyed, e;
    if(!d){return;}
    if (exception && !this.__dyingException) {
      this.__dyingException = exception;
    }
    if(('function'===typeof this.shouldDie) && !this.shouldDie()){
      return;
    }
    if('function' === typeof this.onAboutToDie){
      this.onAboutToDie();
    }
    this.destroyed = null;
    if ('function' != typeof d.fire) {
      console.log('dafuq is', d, '?');
    }
    if (this.__dyingException) {
      e = this.__dyingException;
      this.__dyingException = null;
      d.fire(e);
    } else {
      d.fire();
    }
    d.destroy();
    d = null;
    this.__cleanUp();
    this.__dyingException = null;
  };
  Destroyable.prototype.extendTo = function(obj){
    new DestroyableExtender(this,obj);
    return obj;
  };
  Destroyable.prototype.shouldDie = function(){
    return true;
  }
  Destroyable.prototype.onAboutToDie = dummyFunc;
  Destroyable.prototype.__cleanUp = dummyFunc; 
  return Destroyable;
};
