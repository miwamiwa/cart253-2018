/*

EnemyObject.js
this script creates a new enemy with random colours, updates and displays it.
enemies pick new bearings when they hit a wall.
they also seek and destroy the player: if player is in front of them or
on either side, they will charge in that direction. This script also contains
the collision code to be run once enemies reach the player.

I tried making function seekout() more efficient by calculating player and
obstacles' row and column. the enemy checks for player proximity only if
player's row or column is a match, and checks for obstacles in the way
only if their column or row is a match. This way there should be less code
being called than if I was recalculating collisions with everything all the
time.
Added this idea in the final week so I don't think I will take the time to adapt
every other collision code to it, but I think it would've made my code more
efficient overall.

*/

function EnemyObject(x,y) {

  // position
  this.x = x;
  this.y = y;
  this.z = 0;

  // size
  this.size = 50;
  this.legW= this.size/2-5;
  this.legH = this.size;
  this.bodSize = this.size;
  this.headSize= this.size-10;
  this.armSize = this.size-25;
  this.eyeSize = this.size/10;

  // motion
  this.vx = 0;
  this.vy = 0;
  this.speed = 5;
  this.charging = false;
  this.newBearing(0, 1, 1, 1);

  // parts motion
  this.legRate = 0.2;
  this.legMotion = 0;
  this.row = floor(this.x/xobs);
  this.column = floor((this.y/yobs)%xobs);

  // colours
  this.eyeColor = color(45, 185, 45);
  this.hairColor = color(random(125), random(185), random(255));
  this.skinColor = color(255, 213, 147);
  this.pantsColor = color(45);
  this.shirtColor = color(random(125), random(185), random(255));
}

// update()
//
// checks for obstacle collisions
// checks for world boundary collision
// sets new bearing if necessary,
// updates position depending on velocity

EnemyObject.prototype.update = function() {

  // update column and row information
  this.column = floor((this.x+world.w/2)/xobs);
  this.row = floor((this.y+world.h/2)/yobs);

  // update leg and arm oscillation speed
  // depending on if enemy is charging or not
  if (this.charging){
    this.legRate = 0.4;
  }
  else {
    this.legRate = 0.2;
  }

  // check for COLLISION WITH ANY OBSTACLE
  for (var i=0; i<obstacles.length; i++){

    // do not bother checking if:
    // if obstacle is not large enough
    // obstacle isn't within 100px of enemy
    if (obstacles[i].size>5 && (dist(this.x, this.y, obstacles[i].x, obstacles[i].y)<foodSize*1.6)){

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
          this.size
        )
        && this.vx > 0
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
          this.size
        )
        && this.vx < 0
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
          this.size
        )
        && this.vy > 0
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
          this.size
        )
        && this.vy < 0
      ){
        // can't move up
        this.vy =0;
        // pick a new bearing
        this.newBearing(0, 1, 1, 1);
      }
    }
  }

  // Check for WORLD BOUNDARY COLLISION

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

  // UPDATE and constrain POSITION
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
    // add minimum velocity
    this.vy = this.vy + 2*abs(this.vy)/this.vy;
    this.vx=0;
  }
  else {
    // new bearing is along x-axis
    // use random() to pick direction
    this.vx = random(c*(-speed), d*speed);
    // add minimum velocity
    this.vx = this.vx + 2*abs(this.vx)/this.vx;
    this.vy=0;
  }
  // reset charging
  this.charging = false;
}



// charge(direction)
//
// charge towards a given direction

EnemyObject.prototype.charge = function(direction){

  // charge left
  if(direction==="left"&&!this.charging){
    this.vx =-this.speed;
    this.vy=0;
  }
  // charge right
  else   if(direction==="right"&&!this.charging){
    this.vx =this.speed;
    this.vy=0;
  }
  // charge up
  else   if(direction==="up"&&!this.charging){
    this.vy =-this.speed;
    this.vx=0;
  }
  // charge down
  else   if(direction==="down"&&!this.charging){
    this.vy =this.speed;
    this.vx=0;
  }
    this.charging = true;
}



// display()
//
// Draw the enemy's box parts

EnemyObject.prototype.display = function() {

  // set up motion
  // increment motion (arm motion is just reversed leg motion)
  this.legMotion += this.legRate;
  // maximum leg motion
  var legTranslate = 5;
  // calculate change in leg position
  var leg1 = cos(this.legMotion)*legTranslate;
  stroke(85)


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
// check if player's column or row matches that of enemy's.
// will ultimately trigger charging.
// trigger checking for obstacles in the way depending on player position.

EnemyObject.prototype.lookOut = function(target){

  // if enemy is not already charging
  if(!this.charging){
    // if row is a match
    if(this.row === player.row){
      if(player.x<this.x){
        // check for obstacles on the left
        this.leftSideClear(target);
      }
      // check for obstacles on the right
      else if (player.x>this.x){
        this.rightSideClear(target);
      }
    }
    // if column in a match
    else if(this.column === player.column){
      // check for obstacles above
      if(player.y<this.y){
        this.upperSideClear(target);
      }
      // check for obstacles below
      else if (player.y>this.y){
        this.lowerSideClear(target);
      }
    }
  }
}


// leftsideclear()
//
// determine if there are any obstacles between enemy and player
// in the current row or column
// trigger charge if no obstacles are in the way.

EnemyObject.prototype.leftSideClear = function(target){

  var wayIsClear =true;

  for(var i=0; i<obsRow[this.row].pos.length; i++){
    if(
    obsRow[this.row].pos[i] > target.x
    && obsRow[this.row].pos[i] < this.x
    ){
        wayIsClear = false;
        return;
      }
    }

    if(wayIsClear){
      this.charge("left");
    }
  }



  // rightsideclear()
  //
  // determine if there are any obstacles between enemy and player
  // in the current row or column
  // trigger charge if no obstacles are in the way.

  EnemyObject.prototype.rightSideClear = function(target){

    var wayIsClear =true;

    for(var i=0; i<obsRow[this.row].pos.length; i++){
      if(
      obsRow[this.row].pos[i] < target.x
      && obsRow[this.row].pos[i] > this.x
      ){
        wayIsClear = false;
        return;
      }
    }

    if(wayIsClear){
      this.charge("right");
    }
  }


  // uppersideclear()
  //
  // determine if there are any obstacles between enemy and player
  // in the current row or column
  // trigger charge if no obstacles are in the way.

  EnemyObject.prototype.upperSideClear = function(target){

    var wayIsClear =true;

    for(var i=0; i<obsCol[this.column].pos.length; i++){
      if(
      obsCol[this.column].pos[i] > target.y
      && obsCol[this.column].pos[i] < this.y
      ){
        wayIsClear = false;
        return;
      }
    }

    if(wayIsClear){
      this.charge("up");
    }
  }



  // lowersideclear()
  //
  // determine if there are any obstacles between enemy and player
  // in the current row or column
  // trigger charge if no obstacles are in the way.

  EnemyObject.prototype.lowerSideClear = function(target){

    var wayIsClear =true;

    for(var i=0; i<obsCol[this.column].pos.length; i++){
      if(
      obsCol[this.column].pos[i] < target.y
      && obsCol[this.column].pos[i] > this.y
      ){
          wayIsClear = false;
          return;
        }
      }

      if(wayIsClear){
        this.charge("down");
      }
    }


    // handleplayercollision()
    //
    // check for overlap with player.
    // teleports the player away, decreases his health.
    /// check if game is over 
    // trigger appropriate sfx

    EnemyObject.prototype.handlePlayerCollision = function(target){

      // if enemy and player overlap on the x axis
      if(collideRectRect(target.x, target.y, target.size, target.size, this.x, this.y, this.size, this.size)){
        // set new position
        findGoodPosition(player);
        player.wasHitTimer = millis() + player.wasHitTimerLength;
        player.health -= enemyCaughtPlayerPenalty;
        displayHealth();
        this.charging = false;
        music.startSFX(sfx, "trem");
        // set new bearing
        this.newBearing(1, 1, 1, 1);
      }


        // check if player's health has reached 0
        checkGameOver();
    }
