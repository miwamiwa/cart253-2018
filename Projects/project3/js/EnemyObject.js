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


  this.size = 50;
  this.z = this.size/2;
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


    // colours
    // some are random, some are set.
    this.eyeColor = color(45, 185, 45);
    this.hairColor = color(random(125), random(185), random(255));
    this.skinColor = color(255, 213, 147);
    this.pantsColor = color(45);
    this.shirtColor = color(random(125), random(185), random(255));

    // motion
    this.legRate = 0.2;
    this.legMotion = 0;

    // part sizes
    this.legW= this.size/2-5;
    this.legH = this.size;
    this.bodSize = this.size;
    this.headSize= this.size-10;
    this.armSize = this.size-25;
    this.eyeSize = this.size/10;
}

// update()
//
// same obstacle collision code as movingobject.update() except this works
// with random bearings instead of key controls.
// more detailed comments in movingobject.js.
// also includes game boundary collision.
// checks for obstacle collision and updates position according to bearing.

EnemyObject.prototype.update = function() {
if (this.charging){
  this.legRate = 0.4;
}
else {
  this.legRate = 0.2;
}
  // check all obstacles
  for (var i=0; i<obstacles.length; i++){
// if obstacle is large enough
     // also do not bother checking if obstacle isn't within 100px
    if (obstacles[i].size>5 && dist(this.x, this.y, obstacles[i].x, obstacles[i].y)<80){

      //if close to left obstacle wall and moving right
      if(
        collideLineRect(
          obstacles[i].x,
          obstacles[i].y,
          obstacles[i].x,
          obstacles[i].y+obstacles[i].size,
          this.x+this.vx,
          this.y+this.vy,
          this.size,
          this.size)
      ){
        // can't move right.
        this.vx =0;
        // pick a new bearing
        this.newBearing(1, 1, 1, 0);
      }

      //if close to right obstacle wall and moving left
      else if(
        collideLineRect(
          obstacles[i].x+obstacles[i].size,
          obstacles[i].y,
          obstacles[i].x+obstacles[i].size,
          obstacles[i].y+obstacles[i].size,
          this.x+this.vx,
          this.y+this.vy,
          this.size,
          this.size)
      ){
        // can't move left
        this.vx =0;
        // pick a new bearing
        this.newBearing(1, 1, 0, 1);
      }
      // if close to top wall and moving down
      if(
        collideLineRect(
          obstacles[i].x,
          obstacles[i].y,
          obstacles[i].x+obstacles[i].size,
          obstacles[i].y,
          this.x+this.vx,
          this.y+this.vy,
          this.size,
          this.size)
      ){
        // can't move down
        this.vy =0;
        // pick a new bearing
        this.newBearing(1, 0, 1, 1);
      }
      //if close to bottom obstacle wall and moving up
      else if(
        collideLineRect(
          obstacles[i].x,
          obstacles[i].y+obstacles[i].size,
          obstacles[i].x+obstacles[i].size,
          obstacles[i].y+obstacles[i].size,
          this.x+this.vx,
          this.y+this.vy,
          this.size,
          this.size)
      ){
        // can't move up
        this.vy =0;
        // pick a new bearing
        this.newBearing(0, 1, 1, 1);
      }
    }
  }

  // Check for going off screen and set new bearing if so
  // if enemy hits the left wall
  if (this.x <= -world.w/2 ) {
    this.newBearing(1, 1, 0, 1);
  }
  // if enemy hits the right wall
  else if (this.x +this.size >= world.w/2 ) {
    this.newBearing(1, 1, 1, 0);
  }
  // if enemy hits the top wall
  else   if (this.y <= -world.h/2 ) {
    this.newBearing(0, 1, 1, 1);
  }
  // if enemy hits the bottom wall
  else if (this.y +this.size >=world.h/2) {
    this.newBearing(1, 0, 1, 1);
  }

  // update and constrain x, y position
  this.y += this.vy;
  this.y = constrain(this.y,-world.h/2,world.h/2-this.size);
  this.x +=this.vx;
  this.x = constrain(this.x,-world.w/2,world.w/2-this.size);

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
      this.vx=0;
    }
    else {
      // new bearing is along x-axis
      // use random() to pick direction
      this.vx = random(c*(-speed), d*speed);
      this.vy=0;
    }

  this.charging = false;
}

EnemyObject.prototype.charge = function(direction){
  this.charging = true;
  if(direction==="left"){
    this.vx =-this.speed;
    this.vy=0;
  }
  else   if(direction==="right"){
      this.vx =this.speed;
      this.vy=0;
    }
    else   if(direction==="up"){
        this.vy =-this.speed;
        this.vx=0;
      }
      else   if(direction==="down"){
          this.vy =this.speed;
          this.vx=0;
        }
}

// setbearing()
//
// use to set a specific bearing when enemy rushes towards player.
// accepts axis and direction and returns proper velocity.
/*
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
*/

// display()
//
// Draw the enemy as a rectangle on the screen

EnemyObject.prototype.display = function() {
  // set up motion
  // increment motion (arm motion is just reversed leg motion)
  this.legMotion += this.legRate;
  // maximum leg motion
  var legTranslate = 5;
  // calculate change in leg position
  var leg1 = cos(this.legMotion)*legTranslate;

  // draw human
 push();
  // move to player position
  translate(this.x, this.y, this.z);

  // place a red spotlight over the human
  pointLight(255, 0, 0, this.x, this.y, this.size*4);

  // rotate according to velocity
  if(this.vx>0){
    rotateZ(3*PI/2)
  }
  else if(this.vx<0){
    rotateZ(PI/2)
  }
  else if(this.vy<0){
    rotateZ(PI)
  }
  else if(this.vy>0){
    rotateZ( 0)
  }
  else if(this.vx===0&&this.vy===0){
    rotateZ(0);
  }

  push();

  // display legs

  // leg1
  specularMaterial(this.pantsColor);
  translate(this.legW, leg1, this.legH/2);
  box(this.legW, this.legW, this.legH);
  // leg2
  translate(-2*this.legW, -2*leg1, 0);
  box(this.legW, this.legW, this.legH);
  pop();

  // display body

  specularMaterial(this.shirtColor);
  translate(0, 0, this.legH+this.bodSize/2);
  push();
  box(this.bodSize);

  // display arms

  // arm1
  push()
  translate(this.bodSize/2, -leg1, 0);
  box(this.armSize);
  pop();

  // arm2
  push();
  translate(-this.bodSize/2, leg1, 0);
  box(this.armSize);
  pop();

  // display head

  // head
  push();
  specularMaterial(this.skinColor);
  translate(0, 0, this.size);
  box(this.headSize);
  push();

  // display facial features

  // nose
  translate(0, this.headSize/2+this.eyeSize/2, 0)
  box(this.eyeSize);
  pop();

  // eye1
  push();
  specularMaterial(this.eyeColor);
  translate(this.eyeSize*2, this.headSize/2+this.eyeSize/2, this.headSize/4);
  box(this.eyeSize);
  pop();

  // eye1
  push()
  specularMaterial(this.eyeColor);
  translate(-this.eyeSize*2, this.headSize/2+this.eyeSize/2, this.headSize/4);
  box(this.eyeSize);
  pop();

  // hair
  push()
  specularMaterial(this.hairColor);
  translate(0, 0, 3*this.headSize/8);
  box(this.headSize+2, this.headSize+2, 2*this.headSize/8+2);
  pop();
  pop();
  pop();
  pop();

}

// lookout()
//
// modified obstacle collision function
// this is supposed to allow the enemy to spot the player if they align
// along either axis.
// doesn't entirely work (i think right now only one side of each axis works),
// but it's a start.

EnemyObject.prototype.lookOut = function(target){
  // enemy not already charging
  if(!this.charging){

// enemy and player are aligned on the y axis
if(collideLineRect(this.x, -world.h/2, this.x, world.h/2, target.x, target.y, target.size, target.size)){
  // player is above and enemy is not heading down
  if(target.y<this.y && this.vy<=0 ){
    this.nearestHigherObstacle(target);
    console.log("PLAYER ALIGNED ");
  }
  // player is below and enemy is not heading up
  if(target.y>this.y && this.vy>=0 ){
    this.nearestLowerObstacle(target);
    console.log("PLAYER ALIGNED ");
  }

}

// enemy and player are aligned on the x axis
if(collideLineRect(-world.w/2, this.y, world.w/2, this.y, target.x, target.y, target.size, target.size)){
  // player is to the left and enemy is not heading right
  if(target.x<this.x && this.vx<=0 ){
    this.nearestLeftObstacle(target);
    console.log("PLAYER ALIGNED ");

  }
  // player is to the right and enemy is not heading left
  if(target.x>this.x && this.vx>=0 ){
    this.nearestRightObstacle(target);
    console.log("PLAYER ALIGNED ");
  }
}
}

}

EnemyObject.prototype.nearestLeftObstacle = function(target){


  var wayIsClear =true;

  for(var i=0; i<obstacles.length; i++){
    if(obstacles[i].x<this.x
      && obstacles[i].x > target.x
      && obstacles[i].y > this.y - this.size/2
      && obstacles[i].y < this.y + this.size/2){


      wayIsClear = false;
    }
  }

  if(wayIsClear){
    if(this.checkPlayerVisible(target, -world.w/2, this.y, this.x+world.w/2, this.size)){
      this.charge("left");
    }
  }
}

EnemyObject.prototype.nearestRightObstacle = function(target){


  var wayIsClear =true;

  for(var i=0; i<obstacles.length; i++){
    if(obstacles[i].x>this.x
      && obstacles[i].x < target.x
      && obstacles[i].y > this.y - this.size/2
      && obstacles[i].y < this.y + this.size/2){


      wayIsClear = false;
    }
  }

  if(wayIsClear){
    if(this.checkPlayerVisible(target, this.x, this.y, world.w/2, this.size)){
      this.charge("right");
    }
  }
}

EnemyObject.prototype.nearestHigherObstacle = function(target){


  var wayIsClear =true;

  for(var i=0; i<obstacles.length; i++){
    if(obstacles[i].y<this.y
      && obstacles[i].y > target.y
      && obstacles[i].x > this.x - this.size/2
      && obstacles[i].x < this.x + this.size/2){


      wayIsClear = false;
    }
  }

  if(wayIsClear){
    if(this.checkPlayerVisible(target, this.x, -world.h/2, this.size, this.y+world.h/2)){
      this.charge("up");
    }
  }
}

EnemyObject.prototype.nearestLowerObstacle = function(target){

    var wayIsClear =true;

    for(var i=0; i<obstacles.length; i++){
      if(obstacles[i].y>this.y
        && obstacles[i].y < target.y
        && obstacles[i].x > this.x - this.size/2
        && obstacles[i].x < this.x + this.size/2){

        wayIsClear = false;
      }
    }

    if(wayIsClear){
      if(this.checkPlayerVisible(target, this.x, this.y, this.size, world.h/2)){
        this.charge("down");
      }
    }
}

EnemyObject.prototype.checkPlayerVisible = function(target, x, y, w, h){

  if(collideRectRect(x, y, w, h, target.x, target.y, target.size, target.size))
  {
    console.log("FOUND YE");

    return true;
  }
  else {
    return false;
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
// teleports the player away

EnemyObject.prototype.handlePlayerCollision = function(target){
  // if enemy and player overlap on the x axis
  if(collideRectRect(target.x, target.y, target.size, target.size, this.x, this.y, this.size, this.size)){


      // set new position
      findGoodPosition(player);

      player.wasHitTimer = millis() + player.wasHitTimerLength;
      player.health -= enemyCaughtPlayerPenalty;
      displayHealth();
      this.charging = false;
      // set new bearing
      this.newBearing(0, 1, 0, 0);
    }

}
