/*

EnemyObject.js
Modified MovingObject.
This one is different in that it checks if player is aligned along either axis
and sends the enemy his way. This "search and destroy" code is pretty
convoluted but i wanted to add something that at least kind of worked to the
prototype. will have to revisit that part for sure.

*/

function EnemyObject(x,y) {
  // position and size
  this.x = x;
  this.y = y;

  this.size = 15;
  // speed
  this.vx = 0;
  this.vy = 0;
  this.speed = 5;

  // fill
  this.red = random(215);
  this.green = random(125);
  this.blu = random(125);

  // a boonlean to indicate enemy is charging towards the player
  this.charging = false;

  // pick a new bearing on load
  this.newBearing(0, 1, 1, 1);
}

// update()
//
// same obstacle collision code as movingobject.update() except this works
// with random bearings instead of key controls.
// more detailed comments in movingobject.js.
// also includes game boundary collision.
// checks for obstacle collision and updates position according to bearing.

EnemyObject.prototype.update = function() {

  // check all obstacles
  for (var i=0; i<obstacles.length; i++){

    if (obstacles[i].size>5){

      //if close to left obstacle wall and moving right
      if(
        this.x+this.vx<obstacles[i].x
        && this.x+this.vx+this.size>obstacles[i].x
        && this.y+this.size>obstacles[i].y
        && this.y<obstacles[i].y+obstacles[i].size
        && this.vx>0
      ){
        // can't move right.
        this.x=obstacles[i].x-this.size;
        this.vx =0;
        // pick a new bearing
        this.newBearing(1, 1, 1, 0);
      }

      //if close to right obstacle wall and moving left
      else if(
        this.x+this.vx+this.size>obstacles[i].x+obstacles[i].size
        && this.x+this.vx<obstacles[i].x+obstacles[i].size
        && this.y+this.size>obstacles[i].y
        && this.y<obstacles[i].y+obstacles[i].size
        && this.vx<0
      ){
        // can't move left
        this.x=obstacles[i].x+obstacles[i].size;
        this.vx =0;
        // pick a new bearing
        this.newBearing(1, 1, 0, 1);
      }
      // if close to top wall and moving down
      if(
        this.y+this.vy<obstacles[i].y
        && this.y+this.vy+this.size>obstacles[i].y
        && this.x+this.size>obstacles[i].x
        && this.x<obstacles[i].x+obstacles[i].size
        && this.vy>0
      ){
        // can't move down
        this.y=obstacles[i].y-this.size;
        this.vy =0;
        // pick a new bearing
        this.newBearing(1, 0, 1, 1);
      }
      //if close to bottom obstacle wall and moving up
      else if(
        this.y+this.vy+this.size>obstacles[i].y+obstacles[i].size
        && this.y+this.vy<obstacles[i].y+obstacles[i].size
        && this.x+this.size>obstacles[i].x
        && this.x<obstacles[i].x+obstacles[i].size
        && this.vy<0
      ){
        // can't move up
        this.y=obstacles[i].y+obstacles[i].size;
        this.vy =0;
        // pick a new bearing
        this.newBearing(0, 1, 1, 1);
      }
    }
  }

  // Check for going off screen and set new bearing if so
  // if enemy hits the left wall
  if (this.x <= 0 ) {
    this.newBearing(1, 1, 0, 1);
  }
  // if enemy hits the right wall
  else if (this.x +this.size >= width ) {
    this.newBearing(1, 1, 1, 0);
  }
  // if enemy hits the top wall
  else   if (this.y <= 0 ) {
    this.newBearing(0, 1, 1, 1);
  }
  // if enemy hits the bottom wall
  else if (this.y +this.size >=height) {
    this.newBearing(1, 0, 1, 1);
  }

  // update and constrain x, y position
  this.y += this.vy;
  this.y = constrain(this.y,0,height-this.size);
  this.x +=this.vx;
  this.x = constrain(this.x,0,width-this.size);
}

// newbearing()
//
// update enemy velocity along a random bearing.
// arguments: up, down, left, right.
// bearings are blocked with "0" and enabled with "1" as an argument.

EnemyObject.prototype.newBearing = function(a, b, c, d){

  var speed = this.speed/2;

    // chance that new follows either x or y axis
    if(random()<0.5){
      // new bearing is along y-axis
      // use random() to pick direction
      this.vy = random(a*(-speed), b*speed);
    }
    else {
      // new bearing is along x-axis
      // use random() to pick direction
      this.vx = random(c*(-speed), d*speed);
    }

  this.charging = false;
}

// setbearing()
//
// use to set a specific bearing when enemy rushes towards player.
// accepts axis and direction and returns proper velocity.

EnemyObject.prototype.setBearing = function(axis, direction){
  // set both velocities to 0.
  this.vx=0;
  this.vy =0;

  // pick axis, then set velocity to match direction.
  if (axis==="x"){
    this.vx = -direction*this.speed;
  }
  else if (axis ==="y"){
    this.vy = -direction*this.speed;
  }
}

// display()
//
// Draw the enemy as a rectangle on the screen

EnemyObject.prototype.display = function() {

  noStroke();
  fill(this.red, this.green, this.blu)
  rect(this.x,this.y,this.size,this.size);

}

// lookout()
//
// modified obstacle collision function
// this is supposed to allow the enemy to spot the player if they align
// along either axis.
// doesn't entirely work (i think right now only one side of each axis works),
// but it's a start.

EnemyObject.prototype.lookOut = function(target){
  if(!this.charging){
  // if enemy and player are aligned on the x axis
  if(
    this.x  <= target.x + target.size
    && this.x + this.size >= target.x
  ){
    // set direction which enemy will look towards
    direction = (this.y-target.y)/abs(this.y-target.y);
    // check for obstacles in the way
    this.checkObstacles("y", direction, target);
  }

  // if enemy and player are aligned on the y axis
  else if(
    this.y <= target.y + target.size
    && this.y+this.size >= target.y
  ){
    direction = (this.x-target.x)/abs(this.x-target.x);
    // check for obstacles in the way
    this.checkObstacles("x", direction, target);
  }
}
}

// checkobstacles()
//
// should the enemy detect the player on, check if any obstacles are
// in the way.
// this doesn't always work either (obstacles not always detected
// though they are in the way), but it's also a starting point.
// might also be an issue with only one side being checked.
// maybe it's just an issue with lookOut().

// also i'm pretty sure i'm doing something complicated here for no reason, but
// i just wanted this to work somewhat for the prototype.
// will revisit this code.

EnemyObject.prototype.checkObstacles = function(axis, direction, target){

  // check obstacles on the x axis
  if(axis==="x"){

    // viewClear indicates whether or not obstacles are in the way
    var viewClear = true;
    // for all obstacles
    for(var i=0; i<obstacles.length; i++){
      // if the obstacle is aligned with enemy along the y axis
      if(
        ( this.y < obstacles[i].y
        && this.y+this.size > obstacles[i].y )
        ||
        ( this.y + this.size > obstacles[i].y + obstacles[i].size
        && this.y < obstacles[i].y + obstacles[i].size )
      ){   if (
        // and if this obstacle is closer than the player along the x-axis
        (this.x - obstacles[i].x < this.x - target.x && direction ===1)
        || (this.x - obstacles[i].x > this.x - target.x && direction ===-1)
      ){
        console.log("OBSTACLES IN THE WAY")
        // if there are any obstacles, set view to NOT clear.
        viewClear = false;
      }
    }
  }

  // if view is clear (there are no obstacles in the way),
  // send the enemy charging towards the player.

  if(viewClear){
    // toggle charging mode
    this.charging = true;
    // set a specific bearing
    this.setBearing(axis, direction);
  }
}

// DO THE SAME CHECKUP FOR THE Y-AXIS.

else if(axis==="y"){
  var viewClear = true;
  // for all obstacles
  for(var i=0; i<obstacles.length; i++){
    // if the obstacle is aligned with enemy along the y axis
    if(
      ( this.x < obstacles[i].x
      && this.x+this.size > obstacles[i].x )
      ||
      ( this.x + this.size > obstacles[i].x + obstacles[i].size
      && this.x < obstacles[i].x + obstacles[i].size )
    ){   if (
      // and if this obstacle is closer than the player along the x-axis
      (this.y - obstacles[i].y < this.y - target.y && direction ===1)
      || (this.y - obstacles[i].y > this.y - target.y && direction ===-1)
    ){
        console.log("OBSTACLES IN THE WAY")
      viewClear = false;
    }
  }
}

// If view is clear send the enemy charging towards the player.
if(viewClear){
  this.charging = true;
  this.setBearing(axis, direction);
}
}
}

// handleplayercollision()
//
// check for overlap with player.
// do something (right now all this does is teleport the enemy away)

EnemyObject.prototype.handlePlayerCollision = function(target){
  // if enemy and player overlap on the x axis
  if(this.x + this.size/2 > target.x && this.x+this.size/2 < target.x + target.size){
    // if enemy and player overlap on the y axis
    if(this.y + this.size/2 > target.y && this.y+this.size/2 < target.y + target.size){

      // set new position
      this.x = random(width);
      // set new bearing
      this.newBearing("up");
    }
  }
}
