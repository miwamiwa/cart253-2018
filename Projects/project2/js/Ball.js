// Ball
//
// A class to define how a ball behaves. Including bouncing on the top
// and bottom edges of the canvas, going off the left and right sides,
// and bouncing off paddles.

// Ball constructor
//
// Sets the properties with the provided arguments

function Ball() {
  this.x = game.width/2;
  this.y = game.height/2;
  this.size = 10;
  this.type = "ball";
  this.isSafe = true;
  this.w = this.size;
  this.h = this.size;
  this.speed = random(3, 5);
  this.safeTime = 500;
  this.collisionTimer = millis()+this.safeTime;
  this.chanceForMoreBalls= 0.2;
  this.chanceForFireBall=0.1;

  if(random()<0.5){
    this.vx = this.speed;
  } else {
    this.vx = -this.speed;
  }
  this.vy = random(-this.speed, this.speed);
}

// update()
//
// Moves according to velocity, constrains y to be on screen,
// checks for bouncing on upper or lower edgs, checks for going
// off left or right side.

Ball.prototype.update = function () {
  // Update position with velocity
  this.x += this.vx;
  this.y += this.vy;

  // Constrain y position to be on screen
  this.y = constrain(this.y,0,game.height-this.size);

  // Check for touching upper or lower edge and reverse velocity if so
  if (this.y === 0 || this.y + this.size === game.height) {
    this.vy = -this.vy;
    music.startSFX(sfx2, "downchirp");
  }
}

// isOffScreen()
//
// Checks if the ball has moved off the screen and, if so, returns true.
// Otherwise it returns false.

Ball.prototype.isOffScreen = function () {
  // Check for going off screen and reset if so
  if (this.x + this.size < 0 || this.x > game.width) {

    return true;
  }
  else {
    return false;
  }
}

// display()
//
// Draw the ball as a rectangle on the screen

Ball.prototype.display = function () {
  noStroke();
  if(this.isSafe){
    fill(25, 25, 200);
  }
  else {
    fill(255);
  }
  rect(this.x,this.y,this.size,this.size);
}

// handleCollision(paddle)
//
// Check if this ball overlaps the paddle passed as an argument
// and if so reverse x velocity to bounce
//
// EDITED to prevent ball from sticking to top.
// also have ball vy mapped to where it hit the paddle
// also adds score when hitting the ball

Ball.prototype.handlePaddleCollision = function(paddle) {

  // Check if the ball overlaps the paddle on x axis
  if (this.x + this.size > paddle.x && this.x < paddle.x + paddle.w) {
    // Check if the ball overlaps the paddle on y axis
    if (this.y + this.size >= paddle.y && this.y <= paddle.y + paddle.h ) {
      // If so, move ball back to previous position (by subtracting current velocity)

      // NEW: move ball to correct side of the paddle.
      // prevents ball from sticking to the top.

      if(this.vx>0){
        this.x = paddle.x-this.size-this.vx;
      }
      else if(this.vx<0){
        this.x = paddle.x+paddle.size+this.vx;
      }
      this.y -= this.vy;
      // Reverse x velocity to bounce

      this.vx = -this.vx;

      // map ball.vy to where it hit the paddle
      this.vy = map(paddle.y+paddle.h/2-this.y, -paddle.h/2, paddle.h/2, this.speed, -this.speed);

      // trigger SFX
      music.startSFX(sfx2, "up");

      // add score for hitting the ball
      if(paddle===leftPaddle&&!this.isSafe){
        leftPaddle.score+=1;
      }
      else if(paddle===rightPaddle&&!this.isSafe){
        rightPaddle.score+=1;
      }
    }
  }
}

// reset()
//
// Set position back to the middle of the screen
// lower score of whoever missed that ball by 1.
// balls are "safe" for a moment to avoid them turning into ants right away.
// trigger chance to create more balls
// trigger chance create fireball

Ball.prototype.reset = function () {
  // start sfx
  music.startSFX(sfx2, "chirp")

  // reduce score of appropriate player
  if(this.x<0){
    leftPaddle.score-=1;
  }
  else if(this.x>game.height){
    rightPaddle.score-=1;
  }

  //pick a random direction
  if(random()<0.5){
    this.vx=-this.vx;
  }

  // place ball in the middle of the screen
  this.x = game.width/2;
  this.y = game.height/2;

  // set safety timer
  this.collisionTimer = millis()+this.safeTime;
  this.isSafe = true;

  // trigger chance for more balls
  if(random()<this.chanceForMoreBalls){
    actions.createBalls();
    // trigger sfx
    music.startSFX(sfx2, "down");
  }
  // trigger chance for a fireball
  if(random()<this.chanceForFireBall){
    fireBalls.push(new FireBall());
  }
}

// handleballcollision()
//
// creates a new ant when two balls collide
// accepts ball index as argument. will try to find another ball in range
// then create an ant with that ball and the index's x, y positions.

Ball.prototype.handleBallCollision = function(index){

  // if safe timer is over
  if(this.collisionTimer<millis()){
    // ball is no longer safe
    this.isSafe = false;
    // check all balls
    for (var i=0; i<balls.length; i++){
      // if this ball is in range
      if (i!=index&&this.y + this.size > balls[i].y && this.y < balls[i].y + balls[i].size ){
        if (i!=index&&this.x + this.size > balls[i].x && this.x < balls[i].x + balls[i].size ){
          // create a new ant
          ants.push(new Ant(balls[i].x, balls[i].y, balls[index].x, balls[index].y));
          // remove balls
          actions.removeBall(i);
          actions.removeBall(index);
          // return to prevent more than 2 balls from merging into 1 ant
          return;
        }
      }
    }
  }
}
