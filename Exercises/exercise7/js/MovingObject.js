// MovingObject
//
// A class that defines how a paddle behaves, including the ability
// to specify the input keys to move it up and down

// EDIT: paddles shoot fireballs.

// MovingObject constructor
//
// Sets the properties with the provided arguments or defaults
function MovingObject(x,y,w,h,speed,downKey,upKey,leftKey, rightKey, shootKey) {
  // position and size
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = 20;
  this.size = 20;
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
  this.reloadLength = 2000;
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
MovingObject.prototype.handleInput = function() {
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


MovingObject.prototype.update = function() {


  // check all obstacles
  for (var i=0; i<obstacles.length; i++){

if (obstacles[i].size>5){

    //if close to left obstacle wall, can't move right.
    if(
      this.x+this.vx<obstacles[i].x
      && this.x+this.vx+this.size>obstacles[i].x
      && this.y+this.size>obstacles[i].y
      && this.y<obstacles[i].y+obstacles[i].size
      && this.vx>0
    ){
    this.x=obstacles[i].x-this.size;
    this.vx =0;
    console.log("collided with obstacle #"+i+", on its left side");
    this.eatObstacle(i);
  }
  //if close to right obstacle wall, can't move left.
  else if(
    this.x+this.vx+this.size>obstacles[i].x+obstacles[i].size
    && this.x+this.vx<obstacles[i].x+obstacles[i].size
    && this.y+this.size>obstacles[i].y
    && this.y<obstacles[i].y+obstacles[i].size
    && this.vx<0
  ){
  this.x=obstacles[i].x+obstacles[i].size;
  this.vx =0;
  console.log("collided with obstacle #"+i+", on its right side");
    this.eatObstacle(i);
}
  // if close to top wall, can't move down
  if(
    this.y+this.vy<obstacles[i].y
    && this.y+this.vy+this.size>obstacles[i].y
    && this.x+this.size>obstacles[i].x
    && this.x<obstacles[i].x+obstacles[i].size
    && this.vy>0
  ){
  this.y=obstacles[i].y-this.size;
  this.vy =0;
  console.log("collided with obstacle #"+i+", on its upper side");
    this.eatObstacle(i);
}
  //if close to bottom obstacle wall, can't move up
  else if(
    this.y+this.vy+this.size>obstacles[i].y+obstacles[i].size
    && this.y+this.vy<obstacles[i].y+obstacles[i].size
    && this.x+this.size>obstacles[i].x
    && this.x<obstacles[i].x+obstacles[i].size
    && this.vy<0
  ){
  this.y=obstacles[i].y+obstacles[i].size;
  this.vy =0;
  console.log("collided with obstacle #"+i+", on its bottom side");
  this.eatObstacle(i);
}
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
MovingObject.prototype.display = function() {
  noStroke();
  fill(this.red, this.green, this.blu)
  rect(this.x,this.y,this.size,this.size);
  fill(this.red+40, this.green+40, this.blu+40)
  if(this.reloadTimer>millis()){
  rect(this.x,this.y,this.size,this.size-map(this.reloadTimer-millis(), 0, this.reloadLength, 0, this.size));
}
}




MovingObject.prototype.eatObstacle = function(index) {
  if(this.reloadTimer<millis()){
obstacles[index].getEaten();
this.reloadTimer = millis()+this.reloadLength;
}
}
