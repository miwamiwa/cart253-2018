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

  this.size = 20;
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

  this.bearing = "UP";
  this.newBearing();
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
  // update and constrain x, y position
  this.y += this.vy;
  this.y = constrain(this.y,0,height-this.size);
  this.x +=this.vx;
  this.x = constrain(this.x,0,width-this.size);
}

EnemyObject.prototype.newBearing = function(blockedBearing){
var randomChoice = floor(random(3));
switch(blockedBearing){
  case "left": if(random()<0.5){ this.vy = random(-speed, speed); } else { this.vx = random(0, speed); } break;
  case "right": if(random()<0.5){ this.vy = random(-speed, speed); } else { this.vx = random(-speed, 0); } break;
  case "up": if(random()<0.5){ this.vy = random(-speed,0); } else { this.vx = random(-speed, speed); } break;
  case "down": if(random()<0.5){ this.vy = random(0, speed); } else { this.vx = random(-speed, speed); } break;
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


EnemyObject.prototype.lookOut = function(target){

      //if close to left obstacle wall, can't move right.
      if(
        this.x+this.vx<target.x
        && this.x+this.vx+this.size>target.x
        && this.y+this.size>target.y
        && this.y<target.y+target.size
        && this.vx>0
      ){
      this.x=target.x-this.size;
      this.vx =0;
      console.log("collided with obstacle #"+i+", on its left side");
      this.eatObstacle(i);
    }
    //if close to right obstacle wall, can't move left.
    else if(
      this.x+this.vx+this.size>target.x+target.size
      && this.x+this.vx<target.x+target.size
      && this.y+this.size>target.y
      && this.y<target.y+target.size
      && this.vx<0
    ){
    this.x=target.x+target.size;
    this.vx =0;
    console.log("collided with obstacle #"+i+", on its right side");
      this.eatObstacle(i);
  }
    // if close to top wall, can't move down
    if(
      this.y+this.vy<target.y
      && this.y+this.vy+this.size>target.y
      && this.x+this.size>target.x
      && this.x<target.x+target.size
      && this.vy>0
    ){
    this.y=target.y-this.size;
    this.vy =0;
    console.log("collided with obstacle #"+i+", on its upper side");
      this.eatObstacle(i);
  }
    //if close to bottom obstacle wall, can't move up
    else if(
      this.y+this.vy+this.size>target.y+target.size
      && this.y+this.vy<target.y+target.size
      && this.x+this.size>target.x
      && this.x<target.x+target.size
      && this.vy<0
    ){
    this.y=target.y+target.size;
    this.vy =0;
    console.log("collided with obstacle #"+i+", on its bottom side");
    this.eatObstacle(i);
  }

}
