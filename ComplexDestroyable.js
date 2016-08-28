module.exports = function(inherit, Destroyable, _EventEmitter) {
  var __id = 0;
  function ComplexDestroyable(){
    //this.__id = ++__id;
    Destroyable.call(this);
    this.aboutToDie = new _EventEmitter();
    //console.log(process.pid, this.__id, 'created', this.destroyed);
  };
  inherit(ComplexDestroyable,Destroyable);
  ComplexDestroyable.prototype.destroy = function(exception){
    if (!this.destroyed) {
      return;
    }
    var d = this.aboutToDie;
    this.aboutToDie = null;
    if(d){
      //console.log(this.__id,'was not dying before, startTheDyingProcedure');
      d.fire(this);
      d.destroy();
      this.startTheDyingProcedure();
    }
    if (this.shouldDie()) {
      //console.log(process.pid, this.__id, 'ComplexDestroyable dying', this.destroyed);
      if (arguments.length) {
        Destroyable.prototype.destroy.call(this, exception);
      } else {
        Destroyable.prototype.destroy.call(this);
      }
    }
  };
  ComplexDestroyable.prototype.__cleanUp = function(){
    if (this.aboutToDie) {
      throw Error("aboutToDie cannot exist in ComplexDestroyable cleanup");
    }
    Destroyable.prototype.__cleanUp.call(this);
  };
  ComplexDestroyable.prototype.shouldDie = function () {
    return this.aboutToDie == null && this.dyingCondition();
  };
  /* this needs to be implemented in Revivable
  ComplexDestroyable.prototype.revive = function(){
    if(this.destroyed){
      //console.error(this.__id,'reviving');
      this.aboutToDie = new _EventEmitter();
      this.revived.fire();
      this.__dyingException = null;
    }else{
      console.error(this.__id,'revive called too late');
    }
  };
  */
  ComplexDestroyable.prototype.maybeDie = function(){
    if(this.aboutToDie === null){
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
