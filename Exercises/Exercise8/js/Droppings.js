function Droppings(x, y){
  this.x = x;
  this.y = y;
  this.z = 0;
  this.size = 20;

  if(random()<0.5){
    this.healthy = true;
  }
  else {
    this.healthy = false;
  }
}

Droppings.prototype.display = function(){
push();
translate(this.x, this.y, this.z);
if(this.healthy){
  texture(healthyTexture);
}
else {
  texture(sickTexture);
}

box(this.size);

pop();
}
