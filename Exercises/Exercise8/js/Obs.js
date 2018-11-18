function Obs(x, y){
  this.x = x;
  this.y = y;
  this.z = 0;
  this.size = 50;
}

Obs.prototype.display = function(){
push();
fill(0, 255, 0);
translate(this.x, this.y, this.z);
box(this.size);
pop();
}
