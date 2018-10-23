/*

Paddle.js
These are the paddles players use to play the game.

During the game, paddles can move in any direction.
During the gameover game, paddles can also shoot a bullet.

This script handles:
- creating a new paddle object on the left or the right
- keyboard inputs for movement and shooting
- updating paddle position according to inputs
- displaying paddle
- updating bullet position during the game over game
- displaying this paddle's bullet
- resetting the paddle's score

*/

/////////////// NEW PADDLE ///////////////

// Paddle(side, up, down, left, right, fire)
//
// This function creates a new paddle.
// required arguments:
// side: 0 (left) or 1 (right)
// up, down, left, right, fire: key controls

function Paddle(side, up, down, left, right, fire){
  // y position (x-pos is calculated last)
  this.y= height/2;
  // size
  this.w= 20;
  this.h= 70;
  // speed
  this.vx= 0;
  this.vy= 0;
  this.speed= 5;
  // controls
  this.upKeyCode= up;
  this.downKeyCode= down;
  this.leftKeyCode= left;
  this.rightKeyCode= right;
  this.fireKeyCode= fire;
  // a variable to keep score
  this.score= 0;
  // var side is used to contrain paddle movement to the
  // correct side of the screen
  this.side=side;
  // left paddle's bullets
  // position
  this.bulletx=0;
  this.bullety=0;
  //size
  this.bulletsize=20;
  //velocity
  this.bulletvx=10;
  //used to keep track of whether a bullet is being fired
  this.bulletOn= false;
  // paddle inset
  this.inset=150;
  // paddle x-position
  this.x= abs(width*this.side-this.inset);
  // paddle fill
  this.color=255;
}

/////////////// INPUTS ///////////////

// checkinput()
//
// handles key inputs for this paddle:
// left, right, up, down keys control velocity,
// and fire key shoots the bullet.

Paddle.prototype.checkInput = function(){

  ///////// MOVEMENT

  // if the .upKeyCode is being pressed
  if (keyIsDown(this.upKeyCode)) {
    // Move up
    this.vy = -this.speed;
  }
  // Otherwise if the .downKeyCode is being pressed
  else if (keyIsDown(this.downKeyCode)) {
    // Move down
    this.vy = this.speed;
  }
  // i am constraining horizontal movement using this.inset as a margin on both sides.
  // this.side is also used to constrain it on the right side of the screen.

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
    // if nothing is pressed, do not move.
    this.vy = 0;
    this.vx = 0;
  }

  ///////// FIRE

  // If we are in the game over game, check for fire key
  if (game.gameIsOver===true&&keyIsDown(this.fireKeyCode)){
    // turn bullet on
    this.bulletOn=true;
    // place bullet on the paddle
    this.bulletx=this.x;
    this.bullety=this.y;
  }
}

/////////////// PADDLE MOTION AND DISPLAY ///////////////

// update()
//
// updates paddle position using velocity

Paddle.prototype.update = function(){
  // add velocity to position
  this.x += this.vx;
  this.y += this.vy;
}


// display()
//
// displays the paddle

Paddle.prototype.display = function(){
  // set fill as paddle fill
  fill(this.color);
  // display paddle
  rect(this.x,this.y,this.w,this.h);
}

/////////////// BULLET MOTION AND DISPLAY ///////////////

// movebullet()
//
// updates bullet position

Paddle.prototype.moveBullet = function(){
  // if bullet is activated
  if(this.bulletOn===true){
    // use this.side to determine in which direction to shoot the bullet

    // if its the left paddle's bullet:
    if(this.side===0){
      // shoot bullet to the right
      this.bulletx+=this.bulletvx;
      // turn off once we reach the side
      if(this.bulletx>width){
        this.bulletOn=false;
      }
    }
    else {
      // if its the right paddle's bullet:
      // shoot it to the left
      this.bulletx-=this.bulletvx;
      // turn off after side is reached
      if(this.bulletx<0){
        this.bulletOn=false;
      }
    }
  }
}

// displaybullet()
//
// displays this paddle's bullet.

Paddle.prototype.displayBullet = function(){
  // check if bullet is active
  if(this.bulletOn===true){
    // set to blue. we are only shooting water at this poor cat.
    fill(10, 10, 230);
    // draw bullet
    rect(this.bulletx, this.bullety, this.bulletsize, this.bulletsize/2);
  }
}

/////////////// RESET SCORE ///////////////

// reset()
//
// called when game is reset.
// resets paddle score.

Paddle.prototype.reset = function(){
  // this paddle's score is 0.
  this.score=0;
}
