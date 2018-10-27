// Paddle
//
// A class that defines how a paddle behaves, including the ability
// to specify the input keys to move it up and down

// Paddle constructor
//
// Sets the properties with the provided arguments or defaults
function Paddle(x,y,w,h,speed,downKey,upKey) {
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
  this.wasSabotaged=false;
  this.safeTimer=0;
  this.safeLength=1000;
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
  else {
    this.vy = 0;
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
}

// display()
//
// Draw the paddle as a rectangle on the screen
Paddle.prototype.display = function() {
  noStroke();
  fill(255);
  rect(this.x,this.y,this.w,this.h);
}
