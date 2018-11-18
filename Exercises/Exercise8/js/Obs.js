function Obs(x, y){
  this.x = x;
  this.y = y;
  this.z = 0;
  this.size = 50;
}

Obs.prototype.display = function(){
push();
translate(this.x, this.y, this.z);
specularMaterial(0, 255, 0);
box(this.size);
pop();
}
