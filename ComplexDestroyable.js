module.exports = function(inherit, Destroyable) {
  var __id = 0;
  function ComplexDestroyable(){
    //this.__id = ++__id;
    Destroyable.call(this);
    this.__dying = false;
    this.__dyingException = null;
    //console.log(process.pid, this.__id, 'created', this.destroyed);
  };
  inherit(ComplexDestroyable,Destroyable);
  ComplexDestroyable.prototype.destroy = function(exception){
    if (!this.destroyed) {
      return;
    }
    var d = this.__dying;
    this.__dying = true;
    if (!this.__dyingException) {
      this.__dyingException = exception;
    }
    if(!d){
      //console.log(this.__id,'was not dying before, startTheDyingProcedure');
      this.startTheDyingProcedure();
    }
    if (this.shouldDie()) {
      //console.log(process.pid, this.__id, 'ComplexDestroyable dying', this.destroyed);
      if (this.__dyingException) {
        Destroyable.prototype.destroy.call(this, this.__dyingException);
      } else {
        Destroyable.prototype.destroy.call(this);
      }
    }
  };
  ComplexDestroyable.prototype.__cleanUp = function(){
    this.__dyingException = null;
    this.__dying = null;
    Destroyable.prototype.__cleanUp.call(this);
  };
  ComplexDestroyable.prototype.revive = function(){
    if(this.destroyed){
      //console.error(this.__id,'reviving');
      this.__dying = false;
      this.__dyingException = null;
    }/*else{
      console.error(this.__id,'revive called too late');
    }*/
  };
  ComplexDestroyable.prototype.shouldDie = function(){
    return this.__dying && this.dyingCondition();
  };
  ComplexDestroyable.prototype.maybeDie = function(){
    if(this.__dying){
      this.destroy();
    }
  };
  ComplexDestroyable.prototype.startTheDyingProcedure = function(){
  };
  ComplexDestroyable.prototype.dyingCondition = function(){
    return true;
  };
  return ComplexDestroyable;
};
