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
  this.size = obsSize;

  // object position on the grid
  this.row = floor(index/xobs);
  this.column = index%xobs;

  // calculate x, y coordinates from grid position
  this.x = this.column*this.size;
  this.y = this.row*this.size;

  // randomize object type.
  // right now 0 is an obstacle/wall, 1 is good food and 2 is bad food.

  this.type = floor(random(kindsOfObs));

  // tell me if this object is edible or not
  // (an obstacle/wall is not edible, our racoon is not a rat)
  if(this.type===0){
    this.edible = false;
  } else {
    this.edible = true;
  }

  // colour
  this.r = 185;
  this.g = 0;
  this.b = 185;
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

    // pick correct texture or fill
    if(this.edible){
      texture(yumTexture);
    }
    else {
      specularMaterial(this.r, this.g, this.b);
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
  this.size-=10;
}
