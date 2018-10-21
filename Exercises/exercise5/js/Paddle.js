function Paddle(side, up, down, left, right, fire){

  this.y= height/2;
  this.w= 20;
  this.h= 70;
  this.vx= 0;
  this.vy= 0;
  this.speed= 5;
  this.upKeyCode= up; // The key code for W
  this.downKeyCode= down; // The key code for S
    ///////////// NEW /////////////
  this.leftKeyCode= left; // The key code for A
  this.rightKeyCode= right; // The key code for D
  this.fireKeyCode= fire; // The key code for 1
  // a variable to keep score
  this.score= 0;
  // side= 0 is left; 1 is right.
  // this value is used to constrain horizontal movement to the
  // correct half of the screen.
  this.side=side;
  // left this's bullets
  // position
  this.bulletx=0;
  this.bullety=0;
  //size
  this.bulletsize=20;
  //velocity
  this.bulletvx=10;
  //used to keep track of whether a bullet is being fired
  this.bulletOn= false;
  this.inset=150;
  this.x= abs(width*this.side-this.inset);
}

Paddle.prototype.checkInput = function(){
  if (keyIsDown(this.upKeyCode)) {
    // Move up
    this.vy = -this.speed;
  }
  // Otherwise if the .downKeyCode is being pressed
  else if (keyIsDown(this.downKeyCode)) {
    // Move down
    this.vy = this.speed;
  }
  // i am constraining horizontal movement using thisInset as a margin on both sides.
  // this part uses this.side (0 or 1) to translate the constraints by width/2

  // if leftKeyCode is being pressed and this is within set limits
  else if (keyIsDown(this.leftKeyCode)&&this.x>this.side*width/2+this.inset) {
    // Move left
    this.vx = -this.speed;
  }
   // if rightKeyCode is being pressed and this is within set limits
  else if (keyIsDown(this.rightKeyCode)&&this.x<width/2+this.side*width/2-this.inset) {
    // Move right
    this.vx = this.speed;
  }
  else {

    this.vy = 0;
    this.vx = 0;
  }
   // If we are in the game over game, check for fire key
   if (gameIsOver===true&&keyIsDown(this.fireKeyCode)){
     // turn bullet on
     this.bulletOn=true;
     // place bullet on screen
     this.bulletx=this.x;
     this.bullety=this.y;
   }
}

Paddle.prototype.update = function(){
  this.x += this.vx;
  this.y += this.vy;
}

Paddle.prototype.checkBallCollision = function(){

    // Calculate edges of ball for clearer if statements below
    var ballTop = ball.y - ball.size/2;
    var ballBottom = ball.y + ball.size/2;
    var ballLeft = ball.x - ball.size/2;
    var ballRight = ball.x + ball.size/2;

    // Calculate edges of this for clearer if statements below
    var thisTop = this.y - this.h/2;
    var thisBottom = this.y + this.h/2;
    var thisLeft = this.x - this.w/2;
    var thisRight = this.x + this.w/2;

    // First check it is in the vertical range of the this
    if (ballBottom > thisTop && ballTop < thisBottom) {
      // Then check if it is touching the this horizontally
      if (ballLeft < thisRight && ballRight > thisLeft) {
        // Then the ball is touching the this so reverse its vx

        ///////////// NEW /////////////

        // cancel any random ball movement if ball collides with this
        if(ball.isSilly){
          ball.isSilly=false;
        }
        ///////////// END NEW /////////////

        ball.vx = -ball.vx;

        ///////////// NEW /////////////
        // update angle at which ball is sent back
        ball.vy = map(this.y-ball.y, -this.h/2, this.h/2, ball.speed, -ball.speed);
        ///////////// END NEW /////////////

        // Play our bouncing sound effect by rewinding and then playing
        beepSFX.currentTime = 0;
        beepSFX.play();

      }
    }

}

Paddle.prototype.display = function(){

  // set fill as being different from score fill
  fill(fgColor);
  ///////////// END NEW /////////////
  rect(this.x,this.y,this.w,this.h);
}

Paddle.prototype.moveBullet = function(){
  // turn bullet on
  if(this.bulletOn===true){
    // use this.side to determine in which direction to shoot the bullet
    // in this case it's the left this's bullet:
  if(this.side===0){
    // update speed
    this.bulletx+=this.bulletvx;
    // turn off once we reach the side
    if(this.bulletx>width){
      this.bulletOn=false;
    }
  } else {
    // do the same for the other this's bullet
    this.bulletx-=this.bulletvx;
    if(this.bulletx<0){
      this.bulletOn=false;
    }
  }
}
}

Paddle.prototype.displayBullet = function(){

  // check if bullet is to be displayed
    if(this.bulletOn===true){
  fill(10, 10, 230);
  // draw bullet
  rect(this.bulletx, this.bullety, this.bulletsize, this.bulletsize/2);
}
}

Paddle.prototype.checkCatCollision = function(){
  // simplify the upcoming if statement by calculating variables prior
    var catTop = gameOverCat.y - gameOverCat.size/2;
    var catBottom = gameOverCat.y + gameOverCat.size/2;
    var catLeft = gameOverCat.x - gameOverCat.size/2;
    var catRight = gameOverCat.x + gameOverCat.size/2;

  // check for bullet proximity to cat
    if(this.bulletx>catLeft&&this.bulletx<catRight&&this.bullety>catTop&&this.bullety<catBottom&&this.bulletOn) {
      // reset game
      playAgain();
      // make sure bullets are turned off when game is reset
      this.bulletOn=false;
    }

}
Paddle.prototype.reset = function(){
this.score=0;
}
