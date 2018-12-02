/*

EnemyObject.js
Modified MovingObject.
This one is different in that it checks if player is aligned along either axis
and sends the enemy his way. This "search and destroy" code is pretty
convoluted but i wanted to add something that at least kind of worked to the
prototype. will have to revisit that part for sure.

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
// same obstacle collision code as movingobject.update() except this works
// with random bearings instead of key controls.
// more detailed comments in movingobject.js.
// also includes game boundary collision.
// checks for obstacle collision and updates position according to bearing.

EnemyObject.prototype.update = function() {
  this.column = floor((this.x+world.w/2)/xobs);

  this.row = floor((this.y+world.h/2)/yobs);
  console.log("enemy row "+this.row+" enemy col " +this.column)
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
    if (obstacles[i].size>5 && dist(this.x, this.y, obstacles[i].x, obstacles[i].y)<foodSize*1.6){

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

  // Check for going off screen and set new bearing

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
// Draw the enemy as a rectangle on the screen

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
EnemyObject.prototype.lookOut = function(target){
  if(!this.charging){
    if(this.row === player.row){
      if(player.x<this.x){
        this.leftSideClear(target);
      }
      else if (player.x>this.x){
        this.rightSideClear(target);
      }
    }
    else if(this.column === player.column){
      if(player.y<this.y){
        this.upperSideClear(target);
      }
      else if (player.y>this.y){
        this.lowerSideClear(target);
      }
    }
  }
}

EnemyObject.prototype.leftSideClear = function(target){


  var wayIsClear =true;
console.log()
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

    EnemyObject.prototype.checkPlayerVisible = function(target, x, y, w, h){

      if(collideRectRect(x, y, w, h, target.x, target.y, target.size, target.size)){
        console.log("FOUND YE");

        return true;
      }
      else {
        return false;
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
        music.startSFX(sfx, "trem");
        // set new bearing
        this.newBearing(1, 1, 1, 1);
      }

    }
