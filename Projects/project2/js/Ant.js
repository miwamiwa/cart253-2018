// Ant

function Ant(x1, y1, x2, y2) {
  console.log("new ant");
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.x = 2*x1-x2;
  this.y = 2*y1-y2;
  this.size = 10;
  this.speed = 0;
  this.inc = 0;
  this.rate = 0.1;
  this.vx = 0;
  this.vy = 0;
   this.tarx = width/2;
 this.tary = height/2;
 this.tars = 10;
 this.waitTimer = 0;
 this.waitLength = 500;
 this.waiting = false;
 this.searching = true;
 this.isCarrying = false;
 this.itemPickedUp= false;
 this.stashx = width/2;
 this.stashy = height/2;
 this.stashsize = 10;
}

Ant.prototype.update = function(){
  this.inc += this.rate;
  this.speed = 1+noise(this.inc);
  // move towards target along x axis
  if(this.x<this.tarx){
    this.vx = this.speed;
  }
  else if(this.x>this.tarx+this.tars){
    this.vx = -this.speed;
  }
  else {
    this.vx = 0;
  }
  // move towards target along y axis
  if(this.y<this.tary){
    this.vy = this.speed;
  }
  else if(this.y>this.tary+this.tars){
    this.vy = -this.speed;
  }
  else {
    this.vy = 0;
  }
  // if ant has reached its target, wait a bit
  if (this.vx===0&&this.vy===0&&this.waiting===false){
    this.searching = false;
    this.waiting = true;
    this.waitTimer = millis() + this.waitLength;
  }

  // if ant is done waiting, start "searching"
  if(this.waitTimer<millis()&&this.waiting){
    if(this.isCarrying){
      this.dropItem();
    }
    this.newTarget();
    this.waiting=false;
    this.searching = true;
  }

  //update position of ant
this.x += this.vx;
this.y += this.vy;

// update position of ant parts

this.x1 = this.x + this.size + this.vx*this.size/4;
this.x2 = this.x + this.size - this.vx*this.size/4;

this.y1 = this.y + this.size + this.vy*this.size/4;
this.y2 = this.y + this.size - this.vy*this.size/4;


}

Ant.prototype.display = function(){
  noStroke();
  if(this.searching){
    fill(75);
  }
  if(this.waiting){
    fill(45, 45, 185);
  }
  if(this.itemPickedUp){
    fill(185, 45, 45);
  }
  if(this.isCarrying){
    fill(45, 185, 45);
  }


  rect(this.x1, this.y1, this.size, this.size);
  rect(this.x2, this.y2, this.size, this.size);
}

Ant.prototype.newTarget = function(){
var targetxlist = [0, width-2*this.size, leftPaddle.x, rightPaddle.x, width/2, 0, width-2*this.size];
var targetylist = [0, 0, leftPaddle.y, rightPaddle.y, height/2, height-2*this.size, height-2*this.size];
var choice = floor(random(targetxlist.length));
this.tarx = targetxlist[choice];
this.tary = targetylist[choice];
if(this.itemPickedUp){
  this.tarx = this.stashx;
  this.tary = this.stashy;
  this.tars = this.stashsize;
  console.log("item picked up");
  this.itemPickedUp=false;
  this.isCarrying=true;
}
}

Ant.prototype.handleCollision = function(thing) {
  if(this.isCarrying&&!this.itemPickedUp){
    if (this.x + this.size > thing.x && this.x < thing.x + thing.w) {
      // Check if the ant overlaps the thing on y axis
      if (this.y + this.size > thing.y && this.y < thing.y + thing.h) {

    this.dropItem();
  }}
  }
    if(thing.isSafe===false&&!this.isCarrying&&!this.itemPickedUp){
  // Check if the ant overlaps the thing on x axis
  if (this.x + this.size > thing.x && this.x < thing.x + thing.w) {
    // Check if the ant overlaps the thing on y axis
    if (this.y + this.size > thing.y && this.y < thing.y + thing.h) {

    this.tarx = thing.x;
    this.tary = thing.y;
    this.tars = thing.size;
    this.itemPickedUp = true;
    this.sabotage(thing);
    }
  }
}
}
Ant.prototype.sabotage = function(thing){
  if(thing.type==="ball"){
    for(var i=0; i<balls.length; i++){
      if(thing.x===balls[i].x&&thing.y===balls[i].y){
        removeBall(i);
      }
    }
  }
  if(thing.type==="paddle"){
  thing.h -= 10;
  thing.wasSabotaged=true;
  }
}

Ant.prototype.dropItem = function(){
  this.isCarrying = false;
  console.log("dropped");
  if(!this.waiting){
    console.log("NEW");
    balls.push(new Ball());
    balls[balls.length-1].x = this.x;
    balls[balls.length-1].y = this.y;
  }
}
