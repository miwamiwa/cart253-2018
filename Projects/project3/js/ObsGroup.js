function ObsGroup(dir){
  this.direction = dir;
  this.pos = [];
}

ObsGroup.prototype.addNew = function(obs){
  if(this.direction ===0){
    this.pos.push(obs.x);
  }
  if(this.direction ===1){
    this.pos.push(obs.y);
  }
}
