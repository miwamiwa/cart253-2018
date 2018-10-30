// Ant

function Ant(x1, y1, x2, y2) {
  console.log("new ant");
  this.index=0;
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.x = 2*x1-x2;
  this.y = 2*y1-y2;
  this.size = 10;
  this.speed = 0;
  this.inc = 0;
  this.rate = 0.1;
  this.vx = 0;
  this.vy = 0;
  this.tarx = width/2;
  this.tary = height/2;
  this.tars = 10;
  this.waitTimer = 0;
  this.waitLength = 500;
  this.waiting = false;
  this.searching = true;
  this.isCarrying = false;
  this.itemPickedUp= false;
  this.stashx = width/2;
  this.stashy = height/2;
  this.stashsize = 10;
  this.antIsDead = false;
  this.migrating = false;
}

// update()
//
// update this ant's position

Ant.prototype.update = function(){

  // update speed
  this.inc += this.rate;
  this.speed = 1+noise(this.inc);

  // move ant towards its target along x axis:
  // if target is to the right
  if(this.x<this.tarx){
    // move right
    this.vx = this.speed;
  }
  // if target is to the left
  else if(this.x>this.tarx+this.tars){
    // move left
    this.vx = -this.speed;
  }
  else {
    // else do not move
    this.vx = 0;
    this.migrating=false;
  }
  // move ant towards its target along y axis:
  // if target is below
  if(this.y<this.tary){
    // move down
    this.vy = this.speed;
  }
  // if target is above
  else if(this.y>this.tary+this.tars){
    // move up
    this.vy = -this.speed;
  }
  // else do not move
  else {
    this.vy = 0;
    this.migrating=false;
  }

  // if ant has reached its target, wait a bit
  if (this.vx===0&&this.vy===0&&this.waiting===false){
    // turn searching off and waiting on
    this.searching = false;
    this.waiting = true;
    // start wait timer
    this.waitTimer = millis() + this.waitLength;
  }

  // if ant is done waiting, start "searching"
  // if wait timer is over
  if(this.waitTimer<millis()&&this.waiting){
    // if ant was carrying something, drop it
    if(this.isCarrying){
      this.dropItem();
    }
    // set a new target for the ant to reach
    this.newTarget();
    // turn waiting off and searching on
    this.waiting=false;
    this.searching = true;
  }

  //update position of ant
  this.x += this.vx;
  this.y += this.vy;

  // update position of ant parts
  var ascale = 3;
  this.x1 = this.x + ascale*this.vx;
  this.x2 = this.x - ascale*this.vx;
  this.y1 = this.y + ascale*this.vy;
  this.y2 = this.y - ascale*this.vy;

}

Ant.prototype.display = function(){
  /*
  strokeWeight(5);
  stroke(255);
  noFill();
  rect(this.x, this.y, this.size, this.size);
  */
  noStroke();
  // set fill depending on ant's current action
  if(this.searching){
    // default grey
    fill(75);
  }
  if(this.waiting){
    // blue if waiting
    fill(45, 45, 185);
  }
  if(this.itemPickedUp){
    // red if picking something up
    fill(185, 45, 45);
  }
  if(this.isCarrying){
    // if it's carrying something, display it.
    fill(255);
    rect(this.x+this.size/2, this.y+this.size/2, 10, 10);
    // and color ant green
    fill(45, 185, 45);
  }

  // display ant parts
  rect(this.x1, this.y1, this.size, this.size);
  rect(this.x2, this.y2, this.size, this.size);
}

// newtarger()
//
// pick a new target point to reach from a list of places to go.

Ant.prototype.newTarget = function(){

  // set list:
  // possible targets are the four corners, the two paddles, and the middle of the screen.
  var targetxlist = [0, width-2*this.size, leftPaddle.x, rightPaddle.x, width/2, 0, width-2*this.size];
  var targetylist = [0, 0, leftPaddle.y, rightPaddle.y, height/2, height-2*this.size, height-2*this.size];

  // pick a random number
  var choice = floor(random(targetxlist.length));
  // set new target x, y position
  this.tarx = targetxlist[choice];
  this.tary = targetylist[choice];

  // if ant picked something up, the new target is the stash
  if(this.itemPickedUp){
    // set target x, y position to stash x, y position
    this.tarx = this.stashx;
    this.tary = this.stashy;
    this.tars = this.stashsize;
    console.log("item picked up");
    // set carrying to true and picking up to false.
    this.itemPickedUp=false;
    this.isCarrying=true;
  }
}

// handlecollision()
//
// handles collision with paddle and ball.

Ant.prototype.handleCollision = function(thing) {

  if(thing.isSafe===false&&!this.isCarrying&&!this.itemPickedUp){
    // Check if the ant overlaps the thing on x axis
    if (this.x + this.size > thing.x && this.x < thing.x + thing.w) {
      // Check if the ant overlaps the thing on y axis
      if (this.y + this.size > thing.y && this.y < thing.y + thing.h) {

        this.tarx = thing.x;
        this.tary = thing.y;
        this.tars = thing.size;
        this.itemPickedUp = true;
        this.sabotage(thing);
      }
    }
  }
}
Ant.prototype.sabotage = function(thing){
  if(thing.type==="ball"){
    for(var i=0; i<balls.length; i++){
      if(thing.x===balls[i].x&&thing.y===balls[i].y){
        removeBall(i);
      }
    }
  }
  if(thing.type==="paddle"){
    thing.h -= 10;
    thing.wasSabotaged=true;
  }
}

//dropitem()
//
// ant drops the item it is carrying.
// causes a chance for the biscuit to appear
Ant.prototype.dropItem = function(){
  this.isCarrying = false;
  this.searching=true;
  this.newTarget();
  console.log("dropped");
  console.log("chance that biscuit appears");

  if(random()<biscuitChance){
    console.log("biscuit appeared!");
    biscuit.appear();
  }
}
