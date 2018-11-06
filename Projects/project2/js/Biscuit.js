/*

Biscuit.js
this creates a biscuit that heals a paddle's height
this script handles:
- creating the biscuit constructor
- updating position
- displaying biscuit
- collision with paddle
- timed appearance

*/

function Biscuit(){
//position
this.x = random(game.width);
  this.y = random(game.height);
  // object type
    this.type = "Biscuit";
    // velocity (mapped to noise)
  this.vx = 0;
  this.vy = 0;
    this.speed = 2;
  // increment for noise()
  this.inc = 0;
  this.rate = 0.1;
//size
  this.size = 40;
  this.h = size;
  this.w = size;
// trigger movement
  this.moving = true;
  // appearance length in ms
  this.appearLength = 3000;
  this.appearTimer = this.appearLength+millis();
}

// update()
//
// update velocity based on noise
// update position based on velocity

Biscuit.prototype.update = function(){

// increment noise
  this.inc+=this.rate;
  // map noise to velocity
  this.vx = map(noise(this.inc), 0, 1, -this.speed, this.speed);
  this.vy = map(noise(this.inc), 0, 1, -this.speed, this.speed);
  // if movement is allowed
if(this.moving){
  // update position
  this.x+=this.vx;
  this.y+=this.vy;
}
}

// display()
//
// display biscuit

Biscuit.prototype.display = function(){
  // if biscuit is not supposed to be there
if(millis()>this.appearTimer&&this.moving){
  this.moving=false;
  // place off screen
  this.x = game.width*2;
  this.y = game.width*2;
} else {
  // else if biscuit is supposed to be there
  this.moving = true;
  // stylize and display
  var red = 25;
  var gre = 25;
  var blu = 185;
  stroke(red+25, gre+25, blu+25);
  strokeWeight(4);
  fill(red, gre, blu);
  rect(this.x, this.y, this.size, this.size);
  strokeWeight(1);
}
}

// handlePaddleCollision()
//
// checks for collision with paddle.
// awards health bonus to paddle and removes biscuit from play.

Biscuit.prototype.handlePaddleCollision = function(paddle){

  var padmidx = paddle.x+paddle.w/2;
  var padmidy = paddle.y+paddle.h;
  // check if paddle is overlapped
  if ( padmidx > this.x && padmidx < this.x+this.size && padmidy > this.y && paddle.y < this.y+this.size) {
    // award health
    paddle.h+=100;
    // place off screen
    this.x = game.width*2;
    this.y = game.height*2;
    // stop moving
    this.moving = false;
    // start sfx
    music.startSFX(sfx, "trem");
  }
}

// appear()
//
// set time at which biscuit should disappear
// place biscuit on screen

Biscuit.prototype.appear = function(){
  // set timer
  this.appearTimer = millis() + this.appearLength;
  // update x, y position
  this.x = random(100, game.width-100);
  this.y = random(100, game.height-100);
}
