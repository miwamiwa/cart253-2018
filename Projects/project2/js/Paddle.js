// Paddle
//
// A class that defines how a paddle behaves, including the ability
// to specify the input keys to move it up and down

// Paddle constructor
//
// Sets the properties with the provided arguments or defaults
function Paddle(x,y,w,h,speed,downKey,upKey,leftKey, rightKey, shootKey) {
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.type = "paddle";
  this.isSafe = false;
  this.w = w;
  this.h = 100;
  this.size = h-w;
  this.speed = speed;
  this.downKey = downKey;
  this.upKey = upKey;
  this.leftKey = leftKey;
  this.rightKey = rightKey;
  this.fireKey = shootKey;
  this.wasSabotaged=false;
  this.safeTimer=0;
  this.safeLength=1000;
  this.sizeIncrease=0.5;
  this.maxSize=150;
  this.damaged = false;
  this.reloadTimer = 0;
  this.reloadLength = 200;
  this.score=0;
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
  else if (keyIsDown(this.fireKey)) {
    this.shoot();
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
  this.h = constrain(this.h, 10, height);
  if(this.wasSabotaged){
    this.isSafe=true;
    this.safeTimer = millis() + this.safeLength;
    this.wasSabotaged = false;
  }
  if(this.safeTimer < millis()){
    this.isSafe = false;
  }
  if(this.h===10){
    this.isSafe=true;
  }
  this.y += this.vy;
  this.y = constrain(this.y,0,height-this.h);
  this.x +=this.vx;
}

// display()
//
// Draw the paddle as a rectangle on the screen
Paddle.prototype.display = function() {
  noStroke();
  fill(255);
  rect(this.x,this.y,this.w,this.h);
}


Paddle.prototype.shoot = function(){
  if(this.reloadTimer<millis()&&this.h>20){
  fireBalls.push(new FireBall());
  this.h-=10;
  fireBalls[fireBalls.length-1].y = this.y+this.h/4;
  if(this.x<width/2){
    fireBalls[fireBalls.length-1].x = this.x+50;
    fireBalls[fireBalls.length-1].direction = 1;
  }
  else {
    fireBalls[fireBalls.length-1].x = this.x-50;
    fireBalls[fireBalls.length-1].direction = -1;
  }
}
}
