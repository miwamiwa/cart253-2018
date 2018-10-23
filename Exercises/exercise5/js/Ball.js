/*

Ball.js
This is the ball the game is played with.

This script handles:
- creating a new ball object
- moving the ball
- displaying the ball
- resetting the ball back to initial settings upon game restart

*/

////////////// CREATE BALL //////////////

// Ball()
//
// this function creates a new ball!
function Ball(){
  // ball position
  this.x = width/2;
  this.y = height/2;
  // ball speed
  this.speed= 5;
  // ball x and y velocity
  this.vx = this.speed;
  this.vy = this.speed;
  // size
  this.size= 20;
  // variables that handle the wobble which occurs when the cat hits the ball
  // toggle wobble on/off
  this.isWobbling=false;
  // a variable to increment noise()
  this.wobbleInc=0;
  // chance that the wobble is triggered when ball is near wall
  this.wobbleChance=0.5;
  // how much to increment wobbleInc by
  this.wobbleFact=0.05;
  // chance that a ball behind a paddle triggers game over by feline intervention
  this.gameOverChance=0.5;
  // a boolean to allow chance of game over only once per ball out
  this.gameOverChanceOn=false;
  // ball color
  this.color=255;

}

////////////// BALL MOTION //////////////

// update()
//
// updates ball position,

Ball.prototype.update = function(){

  // update ball position
  this.x += this.vx;
  this.y += this.vy;
}

// isSwatted()
//
// should the ball have been swatted by the cat,
// this function updates ball speed according to some mapped noise()

Ball.prototype.isSwatted = function(){

  // if Wobble is toggled on
  if(this.isWobbling){
    // increment noise
    this.wobbleInc+=this.wobbleFact;
    // transform velocity
    this.vy=map(noise(this.wobbleInc), 0, 1, -this.speed, +this.speed);

    // prevent the ball from bigHeading straight back into the wall
    // if ball is close to the top wall
    if(this.y<10*this.speed&&this.vy<0){
      // send the ball back down
      this.vy=abs(this.vy);
    }
    // if ball is close to bottom wall
    else  if(this.y>height-10*this.speed&&this.vy>0){
      // send the ball back up
      this.vy=-abs(this.vy);
    }
  }
}

////////////// DISPLAY //////////////

// display()
//
// pick ball color,
// display ball at x, y position
Ball.prototype.display = function(){
  // set fill to ball color
  fill(this.color);
  // if the cat heat is displayed, hide the ball (since the cat gobbles it).
  if(millis()<bigHead.dispTimer){
    // use background color.
    fill(ui.bgColor);
  }
  // draw the ball
  rect(this.x,this.y,this.size,this.size);
}

////////////// RESET //////////////

// reset()
//
// resets ball to the middle of the screen.
// called when game resets.

Ball.prototype.reset = function(){
  // reset position
  this.x = width/2;
  this.y = height/2;
  // reset speed
  this.speed= 5;
  this.vx = this.speed;
  this.vy = this.speed;
  // reset wobble
  this.isWobbling=false;
}
