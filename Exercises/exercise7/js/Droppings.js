function Droppings(x, y, goodOrBad, size){
  this.x = x;
  this.y = y;
  this.isHealthy = goodOrBad;
  this.size = 10+2*size;
}

Droppings.prototype.display = function (){
  if(this.isHealthy){
    fill(45, 185, 35);
  }
  else {
    fill(185, 35, 35);
  }
  rect(this.x, this.y, this.size, this.size);
}
