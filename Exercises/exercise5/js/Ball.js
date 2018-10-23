// This function creates a new ball!
//
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

}

// update()
//
// updates ball position,
// then checks for game over by feline intervention.
//
// game over is decided here rather than in handleballoffscreen()
// since I want the cat head to come in before the ball
// leaves the screen
Ball.prototype.update = function(){

  // update ball position
  this.x += this.vx;
  this.y += this.vy;

}



Ball.prototype.display = function(){
  // set fill as being different from score fill
  fill(fgColor);
  if(millis()<bigHead.dispTimer){fill(bgColor);}
  ///////////// END NEW /////////////
  rect(this.x,this.y,this.size,this.size);

}

Ball.prototype.reset = function(direction){
  // turn silly this off
  this.isWobbling=false;
  // get a new random speed based on initial this speed parameter
  this.vy=random(1, 2*this.speed);
  // set new direction for this
  // to the left
if(direction==="left"){
  this.vx=-abs(this.vx);
  // to the right
} else if(direction==="right"){
  this.vx=abs(this.vx);
}
  // place this at the center of the screen
  this.x = width/2;
  this.y = height/2;
  // reset gameover chance
  this.gameOverChanceOn=false;
}

Ball.prototype.isSwatted = function(){
  if(this.isWobbling){
  // increment noise
  this.wobbleInc+=this.wobbleFact;
  // apply to velocity
  this.vy=map(noise(this.wobbleInc), 0, 1, -this.speed, +this.speed);
// prevent the ball from bigHeading straight back into the wall
// if ball is still close to the wall
  if(this.y<10*this.speed&&this.vy<0){
      this.vy=abs(this.vy);
  } else   if(this.y>height-10*this.speed&&this.vy>0){
        this.vy=-abs(this.vy);
    }
  }
}
Ball.prototype.reload = function(){
  this.x = width/2;
  this.y = height/2;
    this.speed= 5;
    this.vx = this.speed;
    this.vy = this.speed;
    this.isWobbling=false;
}
