/*
Obstacle.js

In this game obstacles are anything that the player can't move across.
This script handles creating unhealthy and healthy foods, and wall obstacles.
*/

// Obstacle.js
//
// creates the obstacle objects. randomizes the type:
// obstacle or food (and which food).

function Obstacle(index, obstacleindex){

  // give this obstacle an index number
  this.index = obstacleindex;

  // object size
  this.size = foodSize;

  // object position on the grid
  this.row = floor(index/xobs);
  this.column = floor(index%xobs);
  this.healthy = true;

  // calculate x, y coordinates from grid position
  this.x = map(this.column*this.size, 0, world.w, -world.w/2, world.w/2);
  this.y = map(this.row*this.size, 0, world.h, -world.h/2, world.h/2);

  // randomize object type.
  // 0 is an obstacle/wall
  // anything over 0: odd numbers are bad food, even numbers are good food.

  // first determine which obstacles are walls

  if(random()>chanceForFood){
    this.type =0;
  }
  else{
    this.type = floor(random(kindsOfObs-1))+1;
  }

  // then load healthy and healthy foods

  if(this.type===0){
    this.edible = false; this.size = obsSize;
  }
  else if(this.type%2===0){
    this.loadHealthyObs();
  }
  else {
    this.loadUnhealthyObs();
  }

  // give size depending on obstacle type
  this.z =this.size/2;

  // colour
  this.r = 185;
  this.g = 0;
  this.b = 185;

  // calculate row and column
  this.column = floor((this.x+world.w/2)/xobs);
  this.row = floor((this.y+world.h/2)/yobs);
}



// leadhealthyobs()
//
// mark this obstacle as healthy and edible.
// count healthy obstacles.

Obstacle.prototype.loadHealthyObs = function(){
  this.edible = true;
  this.healthy = true;
  healthyobs ++;
}



// leadunhealthyobs()
//
// mark this obstacle as unhealthy but edible.

Obstacle.prototype.loadUnhealthyObs = function(){
  this.edible = true;
  this.healthy = false;

}



// display()
//
// displays the obstacle as a box() with appropriate texture.

Obstacle.prototype.display = function(){

  // move to this obstacle's position
  push();
  translate(this.x, this.y, this.z);
  stroke(0);

  // pick correct texture
  if(this.edible){
    texture(yumTexture);
  }
  else {
    texture(obsTexture)
  }

  // display obstacle
  box(this.size);

  // create spotlight over the obstacle
  pointLight(this.r, this.g, this.b, this.x, this.y, this.size);
  pop();
}



// getEaten()
//
// called when player eats and obstacle.
// remove a bit of size from this obstacle.

Obstacle.prototype.getEaten = function(){
  music.startSFX(sfx, "downchirp");
  this.size-=damageToObstacles;
  player.increaseSize();
}
