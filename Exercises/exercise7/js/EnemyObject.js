// EnemyObject
//
// A class that defines how a paddle behaves, including the ability
// to specify the input keys to move it up and down

// EDIT: paddles shoot fireballs.

// EnemyObject constructor
//
// Sets the properties with the provided arguments or defaults
function EnemyObject(x,y) {
  // position and size
  this.x = x;
  this.y = y;

  this.size = 15;
  // speed
  this.vx = 0;
  this.vy = 0;
  this.speed = 5;

  // reload timer for shooting
  this.reloadTimer = 0;
  this.reloadLength = 2000;

  // fill
  this.red = random(215);
  this.green = random(125);
  this.blu = random(125);
this.charging = false;
  this.bearing = "UP";
  this.newBearing("up");
}




EnemyObject.prototype.update = function() {


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
        this.newBearing("right");
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
        this.newBearing("left");
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
        this.newBearing("down");
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
        this.newBearing("up");
      }
    }
  }

  // Check for going off screen and set new bearing if so
  if (this.x <= 0 ) {
    this.newBearing("left");
  }
  else if (this.x +this.size >= width ) {
    this.newBearing("right");
  }
  else   if (this.y <= 0 ) {
    this.newBearing("down");
  }
  else if (this.y +this.size >=height) {
    this.newBearing("up");
  }

  // update and constrain x, y position
  this.y += this.vy;
  this.y = constrain(this.y,0,height-this.size);
  this.x +=this.vx;
  this.x = constrain(this.x,0,width-this.size);
}

EnemyObject.prototype.newBearing = function(blockedBearing){
  var randomChoice = floor(random(3));
  this.speed = this.speed/2;
  switch(blockedBearing){
    case "left": if(random()<0.5){ this.vy = random(-this.speed, this.speed); } else { this.vx = random(0, this.speed); } break;
    case "right": if(random()<0.5){ this.vy = random(-this.speed,this.speed); } else { this.vx = random(-this.speed, 0); } break;
    case "up": if(random()<0.5){ this.vy = random(-this.speed,0); } else { this.vx = random(-this.speed, this.speed); } break;
    case "down": if(random()<0.5){ this.vy = random(0, this.speed); } else { this.vx = random(-this.speed, this.speed); } break;
  }
  this.speed = this.speed*2;
  this.charging = false;
}

EnemyObject.prototype.setBearing = function(axis, direction){
  this.vx=0;
  this.vy =0;
  if (axis==="x"){
    this.vx = -direction*this.speed;
  }
  else if (axis ==="y"){
    this.vy = -direction*this.speed;
  }
}

// display()
//
// Draw the paddle as a rectangle on the screen
EnemyObject.prototype.display = function() {
  noStroke();
  fill(this.red, this.green, this.blu)
  rect(this.x,this.y,this.size,this.size);
  fill(this.red+40, this.green+40, this.blu+40)
  if(this.reloadTimer>millis()){
    rect(this.x,this.y,this.size,this.size-map(this.reloadTimer-millis(), 0, this.reloadLength, 0, this.size));
  }
  noFill()
  stroke(255, 0, 0);
  ellipse(this.x+this.size/2, this.y+this.size/2, this.smellRange, this.smellRange);
  noStroke()
}

// lookout()
// modified obstacle collision function

EnemyObject.prototype.lookOut = function(target){
  if(!this.charging){
  // if enemy and player are aligned on the x axis
  if(
    this.x  <= target.x + target.size
    && this.x + this.size >= target.x
  ){
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

EnemyObject.prototype.checkObstacles = function(axis, direction, target){
  // check obstacles on the x axis
  if(axis==="x"){

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
        viewClear = false;
      }

    }
  }
  if(viewClear){
    // do something
    console.log("AXIS"+axis);
    console.log("DIRECTION"+direction);
    this.charging = true;
    this.setBearing(axis, direction);
  }
}

if(axis==="y"){
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
if(viewClear){
  // do something
  console.log("AXIS"+axis);
  console.log("DIRECTION"+direction);
  this.charging = true;
  this.setBearing(axis, direction);
}
}
}

EnemyObject.prototype.handlePlayerCollision = function(target){
  if(this.x + this.size/2 > target.x && this.x+this.size/2 < target.x + target.size){
    if(this.y + this.size/2 > target.y && this.y+this.size/2 < target.y + target.size){
      console.log("enemy and player have collided");
      this.x = random(width);
      this.y = random(height);
      this.newBearing("up");
    }
  }
}
