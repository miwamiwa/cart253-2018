function Obstacle(index){
  this.size = random()*obsSize;
  this.row = floor(index/xobs);
  this.xpos = index%xobs;
  this.x = this.xpos*this.size;
  this.y = this.row*this.size;
}

Obstacle.prototype.display = function(){
  fill(0);
  rect(this.x, this.y, this.size, this.size);
}

Obstacle.prototype.getEaten = function(){
  this.size-=10;
}
