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
  this.h = 20;
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
  // fill
  this.red = random(215);
  this.green = random(125);
  this.blu = random(125);
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
    console.log("down")
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
  for (var i=0; i<obstacles.length; i++){
    //if close to left obstacle wall, can't move right.
    if(
      this.x+this.vx<obstacles[i].x 
      && this.x+this.vx>obstacles[i].x-this.size/3
      && this.y>obstacles[i].y-10
      && this.y<obstacles[i].y+obstacles[i].size+10
      && this.vx>0
    ){
    this.vx=0;
  }
  //if close to right obstacle wall, can't move left.
  else if(
    this.x-this.vx>obstacles[i].x+obstacles[i].size
    && this.x-this.vx<obstacles[i].x+obstacles[i].size+this.size/3
    && this.y>obstacles[i].y-10
    && this.y<obstacles[i].y+obstacles[i].size+10
    && this.vx<0
  ){
  this.vx=0;
  }
  // if close to top wall, can't move down
  else if(
    this.y+this.vy<obstacles[i].y
    && this.y+this.vy>obstacles[i].y-this.size/3
    && this.x>obstacles[i].x-10
    && this.x<obstacles[i].x+obstacles[i].size+10
    && this.vy>0
  ){
  this.vy=0;
  }
  //if close to bottom obstacle wall, can't move up
  else if(
    this.y-this.vy>obstacles[i].y+obstacles[i].size
    && this.y-this.vy<obstacles[i].y+obstacles[i].size+this.size/3
    && this.x>obstacles[i].x-10
    && this.x<obstacles[i].x+obstacles[i].size+10
    && this.vy<0
  ){
  this.vy=0;
  }
}

  // update and constrain x, y position
  this.y += this.vy;
  this.y = constrain(this.y,0,height-this.h);
  this.x +=this.vx;
  this.x = constrain(this.x,0,width-this.w);
}

// display()
//
// Draw the paddle as a rectangle on the screen
Paddle.prototype.display = function() {
  noStroke();
  fill(this.red, this.green, this.blu)
  rect(this.x,this.y,this.w,this.h);
  fill(this.red+40, this.green+40, this.blu+40)
  rect(this.x+5,this.y+5,this.w-10,this.h-10);
}
