// Paddle
//
// A class that defines how a paddle behaves, including the ability
// to specify the input keys to move it up and down

// EDIT: paddles shoot fireballs.

// Paddle constructor
//
// Sets the properties with the provided arguments or defaults
function Paddle(x,y,w,h,speed,downKey,upKey,leftKey, rightKey, shootKey) {
  // position and size
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = 100;
  this.size = h-w;
  // speed
  this.vx = 0;
  this.vy = 0;
  this.speed = speed;
  // object type
  this.type = "paddle";
  // safety feature
  this.isSafe = false;
  this.safeTimer = 0;
  this.wasSabotaged = false;
  // key controls
  this.downKey = downKey;
  this.upKey = upKey;
  this.leftKey = leftKey;
  this.rightKey = rightKey;
  this.fireKey = shootKey;
  // not sure if this is used anywhere anymore
  this.sizeIncrease=0.5;
  // reload timer for shooting
  this.reloadTimer = 0;
  this.reloadLength = 200;
  // paddle round score and match points
  this.score=0;
  this.matchPoint=0;
}

// handleInput()
//
// Check if the up or down keys are pressed and update velocity
// appropriately
Paddle.prototype.handleInput = function() {
  if (keyIsDown(this.upKey)) {
    this.vy = -this.speed;
  }
  else if (keyIsDown(this.downKey)) {
    this.vy = this.speed;
  }
  else if (keyIsDown(this.leftKey)) {
    this.vx = -this.speed;
  }
  else if (keyIsDown(this.rightKey)) {
    this.vx = this.speed;
  }
  // NEW : FIRE KEY
  else if (keyIsDown(this.fireKey)) {
    // shoot a bullet
    this.shoot();
    // start reload timer
    this.reloadTimer = millis()+this.reloadLength;
  }
  else {
    this.vy = 0;
    this.vx=0;
  }
}

// update()
// Update y position based on velocity
// Constrain the resulting position to be within the canvas
Paddle.prototype.update = function() {
  this.h = constrain(this.h, 10, game.height);

  // if height falls to 10, stop reducing height
  if(this.h===10){
    this.isSafe=true;
  }
  if(this.wasSabotaged&&!this.isSafe){
    this.wasSabotaged =false;
    this.safeTimer = millis()+50;
    this.isSafe = true;
  }
  if(this.isSafe&&millis()>this.safeTimer){
    this.isSafe=false;
  }

  // update and constrain x, y position
  this.y += this.vy;
  this.y = constrain(this.y,0,game.height-this.h);
  this.x +=this.vx;
  this.y = constrain(this.y,0,game.height-this.h);
}

// display()
//
// Draw the paddle as a rectangle on the screen
Paddle.prototype.display = function() {
  noStroke();
  fill(255);
  rect(this.x,this.y,this.w,this.h);
}

// shoot()
//
// shoots a fireball at the cost of some health

Paddle.prototype.shoot = function(){
  // if reload timer is over
  if(this.reloadTimer<millis()&&this.h>20){
    // add a new fireball to array
  fireBalls.push(new FireBall());
  // reduce height by 10
  this.h-=10;
  // set y position to match paddle.y
  fireBalls[fireBalls.length-1].y = this.y+this.h/4;
  // set x position and direction to correct sides of the screen
  if(this.x<game.width/2){
    fireBalls[fireBalls.length-1].x = this.x+50;
    fireBalls[fireBalls.length-1].direction = 1;
  }
  else {
    fireBalls[fireBalls.length-1].x = this.x-50;
    fireBalls[fireBalls.length-1].direction = -1;
  }
}
}
