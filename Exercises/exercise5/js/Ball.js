function Ball(){
  this.x = width/2;
  this.y = height/2;
    this.speed= 5;
  this.vx = this.speed;
  this.vy = this.speed;
  this.size= 20;
  this.isSilly=false;
  this.sillyInc=0;
  this.sillyChance=0.5;
  this.sillyFact=0.05;
  this.sillyMovement=0;
this.gameOverChance=0.5;
  // a boolean to allow chance of game over only once per ball out
  this.gameOverChanceOn=false;

}

Ball.prototype.update = function(){

  this.x += this.vx;
  this.y += this.vy;

///////////// NEW /////////////
  // add chance that the game ends here
  // this is done here rather than in handlethisoffscreen(), since i want
  // to stop the this a moment before it hits the side so that the cat bigHead
  // can come in and gobble it.

    // if this is out of paddle reach,
    // and the chance of game over has not yet been determined
  if((this.x<leftPaddle.inset-50||this.x>width-rightPaddle.inset+50)&&this.gameOverChanceOn===false){
    // toggle this statement off. it will be reset in handlethisoffscreen()
    this.gameOverChanceOn=true;
    // random chance that game is over
  if(random()<this.gameOverChance){
    // now make the cat bigHead appear in the right place,
    // and flipped the right way using xs (x-scale)
    // if this is bigHeading left
    if(this.vx<0){
      // scaling is positive
    bigHead.xs=abs(bigHead.xs);
    // allign mouth with this on y-axis
    bigHead.y=this.y-570*bigHead.ys;
    // set x position
    bigHead.x=0;
    // start timer
    bigHead.dispTimer=millis()+bigHead.timerLength;
    // don't fdistimerorget to add score! this will not reach the side,
    // so handlethisoffscreen() won't keep track of this point.
    rightPaddle.score+=1;
    // if this was running right
  } else if (this.vx>0){
    // scaling is negative
    bigHead.xs=-abs(bigHead.xs);
    bigHead.y=this.y-570*bigHead.ys;
    bigHead.x=width;
    bigHead.dispTimer=millis()+bigHead.timerLength;
    leftPaddle.score+=1;
  }
    // stop the this
  this.vx=0;
  this.vy=0;
  }
}
}

Ball.prototype.checkWallCollision = function(){


    // Calculate edges of this for clearer if statement below
    var thisTop = this.y - this.size/2;
    var thisBottom = this.y + this.size/2;
    var thisLeft = this.x - this.size/2;
    var thisRight = this.x + this.size/2;

  ///////////// NEW /////////////
    // check chance of something silly happening
    // (cat interferes with the game by swatting the this)
    // this function is looped, so every frame the cat has a new chance of
    // swiping at the this.. meaning that the 0.5 chance we have right now
    // causes the leg to fire almost every time the this is near a side.

    // if this is close to top
    if(thisTop<5&&this.vy<0){
      // start appropriate leg movement
      kittyarm.movetop();
      // chance that cat actually hits the this
      if(random()<this.sillyChance){
        // generate random motion
        this.isSilly=true;
      }
    }
    // if this is close to bottom
    if(thisBottom>height-5&&this.vy>0){
      // start appropriate leg movement
      kittyarm.movebottom();
      // check if the this is hit
      if(random()<this.sillyChance){
        this.isSilly=true;
      }
    }

  ///////////// END NEW /////////////

    // Check for this colliding with top and bottom
    if (thisTop < 0 || thisBottom > height) {
      // If it touched the top or bottom, reverse its vy
      this.vy = -this.vy;
      // Play our bouncing sound effect by rewinding and then playing
      beepSFX.currentTime = 0;
      beepSFX.play();

        ///////////// NEW /////////////

        // cancel any random this movement (if this has with either side)
        if(this.isSilly){
          this.isSilly=false;
        }

        ///////////// END NEW /////////////
    }
}

Ball.prototype.checkOffScreen = function(){

  // Calculate edges of this for clearer if statement below
  var thisLeft = this.x - this.size/2;
  var thisRight = this.x + this.size/2;

 ///////////// NEW /////////////
  // Check for this going off one side or the other.
  // Reset it to middle
  // Update its direction
  // Update the score
  if (thisRight < 0 ) {
    // reset the this and fire to the right side
    this.reset("right");
    // Update right paddle score
    rightPaddle.score+=1;
  } else if (thisLeft > width) {
    // reset the this and fire to the left side
    this.reset("left");
    // update left paddle score
    leftPaddle.score+=1;
  }
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
  this.isSilly=false;
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
  if(this.isSilly){
  // increment noise
  this.sillyInc+=this.sillyFact;
  // apply to velocity
  this.vy=map(noise(this.sillyInc), 0, 1, -this.speed, +this.speed);
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
    this.isSilly=false;
}
