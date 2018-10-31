// Ball
//
// A class to define how a ball behaves. Including bouncing on the top
// and bottom edges of the canvas, going off the left and right sides,
// and bouncing off paddles.

// Ball constructor
//
// Sets the properties with the provided arguments

function Ball() {
  this.x = width/2;
  this.y = height/2;
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
  this.lastPaddle = 0;
  
  if(random()<0.5){
    this.vx = this.speed;
  } else {
    this.vx = -this.speed;
  }
  this.vy = this.speed/2 + random(this.speed/2);
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
  this.y = constrain(this.y,0,height-this.size);

  // Check for touching upper or lower edge and reverse velocity if so
  if (this.y === 0 || this.y + this.size === height) {
    this.vy = -this.vy;
  }
}

// isOffScreen()
//
// Checks if the ball has moved off the screen and, if so, returns true.
// Otherwise it returns false.

Ball.prototype.isOffScreen = function () {
  // Check for going off screen and reset if so
  if (this.x + this.size < 0 || this.x > width) {

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

Ball.prototype.handlePaddleCollision = function(paddle) {
  // Check if the ball overlaps the paddle on x axis
  if (this.x + this.size > paddle.x && this.x < paddle.x + paddle.w) {
    // Check if the ball overlaps the paddle on y axis
    if (this.y + this.size >= paddle.y && this.y <= paddle.y + paddle.h ) {
      // If so, move ball back to previous position (by subtracting current velocity)
      if(this.vx>0){
      this.x = paddle.x-this.size-this.vx;
    }
    else if(this.vx<0){
      this.x = paddle.x+paddle.size+this.vx;
    }
      this.y -= this.vy;
      // Reverse x velocity to bounce

      this.vx = -this.vx;
    this.vy = map(paddle.y+paddle.h/2-this.y, -paddle.h/2, paddle.h/2, this.speed, -this.speed);

      this.lastPaddle = paddle;
      if(paddle===leftPaddle){

        leftPaddle.score+=1;

      }
      else   if(paddle===rightPaddle){

          rightPaddle.score+=1;

        }
    }
  }

}

// reset()
//
// Set position back to the middle of the screen

Ball.prototype.reset = function () {

  if(this.x<0){
    leftPaddle.score-=1;
  } else if(this.x>height){
    rightPaddle.score-=1;
  }
  this.x = width/2;
  this.y = height/2;
  this.collisionTimer = millis()+this.safeTime;
  this.isSafe = true;
  if(random()<this.chanceForMoreBalls){
    createBalls();
  }
  if(random()<this.chanceForFireBall){
    fireBalls.push(new FireBall());
  }
}

// handleballcollision()
//
// creates a new ant when two balls collide

Ball.prototype.handleBallCollision = function(index){

  if(this.collisionTimer<millis()){
    this.isSafe = false;
    for (var i=0; i<balls.length; i++){
      if (i!=index&&this.y + this.size > balls[i].y && this.y < balls[i].y + balls[i].size ){
        if (i!=index&&this.x + this.size > balls[i].x && this.x < balls[i].x + balls[i].size ){
          console.log("collision");

          ants.push(new Ant(balls[i].x, balls[i].y, balls[index].x, balls[index].y));

          removeBall(i);
          removeBall(index);
          drawAgain = true;
          return;
        }
      }
    }
  }
}
