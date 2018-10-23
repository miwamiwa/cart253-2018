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


Paddle.prototype.reset = function(){
this.score=0;
}
