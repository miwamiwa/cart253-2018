/*
Obstacle.js
In this game obstacles are anything that the player can't move across.
This includes foods and actual obstacles.

this script handles:
- creating a new obstacle at a given position on the grid
- displaying the obstacle
- removing a chunk when this obstacle gets eaten
*/

// Obstacle.js
//
// creates the obstacle objects. randomizes the type:
// obstacle or food (and which food).

function Obstacle(index, obstacleindex){

  // give this obstacle an index number
  this.index = obstacleindex;

  // right now obstacles have a set size but randomizing size could be
  // interesting too which is why commented out this line and left it there:
  // this.size = random(2, 3)*obsSize;

  // object size
  this.size = foodSize;

  // object position on the grid
  this.row = floor(index/xobs);
  this.column = index%xobs;
  this.healthy = true;

  // calculate x, y coordinates from grid position
  this.x = map(this.column*this.size, 0, world.w, -world.w/2, world.w/2);
  this.y = map(this.row*this.size, 0, world.h, -world.h/2, world.h/2);
  this.z =this.size/2;

  // randomize object type.
  // right now 0 is an obstacle/wall, 1 is good food and 2 is bad food.
  if(random()>chanceForFood){
    this.type =0;
  }
  else{
  this.type = floor(random(kindsOfObs-1))+1;
}
  // tell me if this object is edible or not
  // (an obstacle/wall is not edible, our racoon is not a rat)
  // also count up healthy and sickly obstacles

  switch(this.type){
    case 0: this.edible = false; this.size = obsSize; break;
    case 1: this.loadHealthyObs(); break;
    case 2: this.loadUnhealthyObs(); break;
    case 3: this.loadUnhealthyObs(); break;
    case 4: this.loadHealthyObs(); break;
    case 5: this.loadHealthyObs(); break;
    case 6: this.loadUnhealthyObs(); break;
    case 7: this.loadUnhealthyObs(); break;
    case 8: this.loadHealthyObs(); break;
    case 9: this.loadUnhealthyObs(); break;
    case 10: this.loadHealthyObs(); break;
    case 11: this.loadUnhealthyObs(); break;
  }

  // colour
  this.r = 185;
  this.g = 0;
  this.b = 185;
}


Obstacle.prototype.loadHealthyObs = function(){
   this.edible = true;
   this.healthy = true;
   healthyobs ++;
}
Obstacle.prototype.loadUnhealthyObs = function(){
  this.edible = true;
  this.healthy = false;
  sicklyobs ++;
}
// display()
//
// set fill according to ObsMode (which toggles whether or not we can
// visualize the different kinds of foods).
// displays the obstacle as a rect()

Obstacle.prototype.display = function(){

    // move to this obstacle's position

    push();
    translate(this.x, this.y, this.z);
  stroke(0);
    // pick correct texture or fill
    if(this.edible){
      texture(yumTexture);
      if(obsMode){
        switch(this.type){
          case 1: texture(pic1); break;
          case 2: texture(pic2); break;
          case 3: texture(pic3); break;
          case 4: texture(pic4); break;
          case 5: texture(pic5); break;
          case 6: texture(pic6); break;

        }
      }
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
// remove a bit of size from this obstacle.

Obstacle.prototype.getEaten = function(){
    music.startSFX(sfx, "downchirp");
  this.size-=damageToObstacles;
player.increaseSize();
}
