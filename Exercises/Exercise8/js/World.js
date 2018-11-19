function World() {
  this.x = width/2;
  this.y = height/2;
  this.z = -30;
  this.w = width*2;
  this.h = height*2;

}

World.prototype.display = function(){
  push();
  translate(this.x, this.y, this.z);
  ambientMaterial(255);
  box(this.w, this.h, 10);
  pop();
}
