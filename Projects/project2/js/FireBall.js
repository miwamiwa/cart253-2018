/*

Fireball.js
fireballs kill ants and damage paddles too
this is a variation on ball.js

This script handles:
- creating the fireball constructor
- updating fireball position
- displaying the fireball
- checking for and removing off screen fireballs
- collision with a ball
- collision with a paddle

*/

// fireball()
//
// initialize constructor
// pick direction in which fireball will travel

function FireBall(){

// pick direction
  if(random()<0.5){
    this.x=0.2*game.width;
    this.direction = 1;
  } else {
    this.x = game.width-0.2*game.width;
    this.direction = -1;
  }

  // object type
  this.type = "fireball";
  // y-position
  this.y = game.height/2;
  // velocity
  this.vx = 0;
  this.vy = 0;
    this.speed = 2;
    // noise will be used to wobble along the y axis
// these variables are to increment noise
  this.inc = 0;
  this.rate = 0.1;
// fireball size
  this.size = 40;
  this.h = size;
  this.w = size;
  // trigger off screen
  this.offScreen = false;
}

// update()
//
// update velocity and position

FireBall.prototype.update = function(){

// update x-velocity using speed
  this.vx = this.speed*this.direction;
  // update y velocity using noise
  this.inc+=this.rate;
  this.vy = map(noise(this.inc), 0, 1, -this.speed, this.speed)*2;
// update position and constrain along the y axis
  this.x+=this.vx;
  this.y+=this.vy;
  this.y = constrain(this.y, 0, game.height);
}

// display()
//
// display the fireball

FireBall.prototype.display = function(){
  console.log("fireballs"+fireBalls.length);
  // set fill
  var red = 225;
  var gre = 25;
  var blu = 25;
  stroke(red+25, gre+25, blu+25);
  strokeWeight(4);
  fill(red, gre, blu);
  rect(this.x, this.y, this.size, this.size);
  strokeWeight(1);
}

// isoffscreen()
//
// same as for ball.js.

FireBall.prototype.isOffScreen = function () {
  // Check for going off screen and reset if so
  if (this.x + this.size < 0 || this.x > game.width) {
    console.log("fireball off");
    this.offScreen = true;
    return true;
  }
  else {
    return false;
  }
}

// handlecollision()
//
// handles collision with ants.
// destroys any ants in the way.

FireBall.prototype.handleCollision = function(){
  var deadAnts = [];
  // for all ants
for (var i=0; i<ants.length; i++){
  // check ant x and y position
  var antmidx = ants[i].x+ants[i].size/2;
  var antmidy = ants[i].y+ants[i].size/2;
  // if there's an overlap, add to list of ants to kill
  if ( antmidx > this.x && antmidx < this.x+this.size && antmidy > this.y && antmidy < this.y+this.size) {
    deadAnts.push(i);
  }
}
// kill ants on the list
  for (var j=0; j<deadAnts.length; j++){
    actions.removeAnt(deadAnts[j]);
    // trigger sfx
    music.startSFX(sfx, "chirp");
  }

}

// handleaddlecollision()
//
// remove health of colliding with paddle

FireBall.prototype.handlePaddleCollision = function(paddle){
// get paddle position
  var padmidx = paddle.x+paddle.w/2;
  var padmidy = paddle.y+paddle.h/2;
  // if there's an overlap
  if ( padmidx > this.x && padmidx < this.x+this.size && padmidy > this.y && paddle.y < this.y+this.size) {
    // remove a bit of health
    paddle.h-=2;
  }
}
