// Basic OO Pong
// by Pippin Barr
//
// A primitive implementation of Pong with no scoring system
// just the ability to play the game with the keyboard.
//
// Arrow keys control the right hand paddle, W and S control
// the left hand paddle.
//
// Written with JavaScript OOP.

// Variable to contain the objects representing our ball and paddles
var balls = [];
var leftPaddle;
var rightPaddle;
var totalBalls = 0;
var drawAgain = false;
var ants = [];

// setup()
//
// Creates the ball and paddles
function setup() {
  createCanvas(800,350);
  // Create the right paddle with UP and DOWN as controls
  rightPaddle = new Paddle(width-10,height/2,10,60,10,DOWN_ARROW,UP_ARROW);
  // Create the left paddle with W and S as controls
  // Keycodes 83 and 87 are W and S respectively
  leftPaddle = new Paddle(0,height/2,10,60,10,83,87);
}

// draw()
//
// Handles input, updates all the elements, checks for collisions
// and displays everything.
function draw() {
  background(0);
  // Create a ball
  if(balls.length<=1){
    createBalls();
  }
  leftPaddle.handleInput();
  rightPaddle.handleInput();
  leftPaddle.update();
  rightPaddle.update();
  if (ants.length>0){
    for (var j=0; j<ants.length; j++){
      ants[j].display();
    }
  }
  for(var i=0; i<balls.length; i++){
    if(drawAgain){
      drawAgain = false;
      return;
    }

  balls[i].update();
  if (balls[i].isOffScreen()) {
    balls[i].reset();
  }

  balls[i].handlePaddleCollision(leftPaddle);
  balls[i].handlePaddleCollision(rightPaddle);
  balls[i].handleBallCollision(i);
    if(drawAgain){
      drawAgain = false;
      return;
    }
  balls[i].display();
}

  leftPaddle.display();
  rightPaddle.display();
}

function createBalls(){
  var numBalls = round(random(8, 10));
  console.log("numBalls = "+numBalls);
  for (var i=0; i<numBalls; i++){
  balls.push(new Ball());
}
 console.log("balls: "+balls.length);
}

function removeBall(index){
  var length = balls.length;
  if(index!=length){
  balls = concat(subset(balls, 0, index), subset(balls, index+1, length));
}
else{
  balls = subset(balls, 0, index);
}
   console.log("balls: "+balls.length);
}
