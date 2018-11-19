function Obs(x, y){
  this.x = x;
  this.y = y;
  this.z = 0;
  this.size = 50;
  this.r = 0;
  this.g = 255;
  this.b = 0;

  if(random()<0.5){
    this.edible = true;
  }
  else {
    this.edible = false;
  }
}

Obs.prototype.display = function(){
push();
translate(this.x, this.y, this.z);
if(this.edible){
  texture(yumTexture);
}
else {
  specularMaterial(this.r, this.g, this.b);
}

box(this.size);
pointLight(this.r, this.g, this.b, this.x, this.y, this.size);
pop();
}
