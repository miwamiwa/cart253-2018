function World() {
  this.x = width/2;
  this.y = height/2;
  this.z = -30;
  this.w = width;
  this.h = height;

}

World.prototype.display = function(){
  push();
  translate(this.x, this.y, this.z);
  ambientMaterial(215);
  box(width, height, 10);
  pop();
}
