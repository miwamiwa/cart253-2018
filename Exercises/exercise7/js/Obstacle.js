function Obstacle(index, obstacleindex){
  this.size = random(2, 3)*obsSize;
  this.row = floor(index/xobs);
  this.xpos = index%xobs;
  this.x = this.xpos*this.size;
  this.y = this.row*this.size;
  this.type = floor(random(kindsOfObs));
  this.index = obstacleindex;
  if(this.type===0){
    this.edible = false;
  } else {
    this.edible = true;
  }
}

Obstacle.prototype.display = function(){
  if(obsMode){
    fill(75*this.type);
  }
  else {
    if(this.type===0){
      fill(0);
    }
    else {
      fill(185);
    }
  }

  rect(this.x, this.y, this.size, this.size);
}

Obstacle.prototype.getEaten = function(){
  this.size-=10;
}
