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
var fireBalls=[];
var maxBalls = 4;

var stopAnts=false;

// setup()
//
// Creates the ball and paddles
function setup() {
  createCanvas(800,350);
  // Create the right paddle with UP and DOWN as controls
  rightPaddle = new Paddle(width-10,height/2,10,60,10,DOWN_ARROW,UP_ARROW, LEFT_ARROW, RIGHT_ARROW);
  // Create the left paddle with W and S as controls
  // Keycodes 83 and 87 are W and S respectively
  leftPaddle = new Paddle(0,height/2,10,60,10,83,87, 65, 68);
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
  if (fireBalls.length>0){
    for(var i=0; i<fireBalls.length; i++){
      fireBalls[i].update();
      fireBalls[i].display();
      fireBalls[i].isOffScreen();
      if(fireBalls[i].offScreen){
        removeFireBall(i);
      }
    }
  }
  if (ants.length>0){
    var deadAnts=[];
    for (var j=0; j<ants.length; j++){
      ants[j].update();
      ants[j].handleCollision(leftPaddle);
      ants[j].handleCollision(rightPaddle);
      for (var k=0; k<balls.length; k++){
        ants[j].handleCollision(balls[k]);
      }
      if(fireBalls.length>0){

      for (var l=0; l<fireBalls.length; l++){
        ants[j].handleCollision(fireBalls[l]);
        if(ants[j].antIsDead){
          deadAnts.push([j]);
        }
      }

    }

    //  ants[j].display();
    }
    if(deadAnts.length!=0){
      console.log("deadants: "+deadAnts);
    removeAnts(deadAnts);
  }
  }
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
  var numBalls = round(random(2, 3));
  console.log("numBalls = "+numBalls);
  if(balls.length<maxBalls){
  for (var i=0; i<numBalls; i++){
  balls.push(new Ball());
}
 console.log("balls: "+balls.length);
}
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
function removeFireBall(index){
  var length = fireBalls.length;
  if(index!=length){
  fireBalls = concat(subset(fireBalls, 0, index), subset(fireBalls, index+1, length));
}
else{
  fireBalls = subset(fireBalls, 0, index);
}
   console.log("fireBalls: "+fireBalls.length);
}
function removeAnts(antList){
  var length = antList.length;
  var antindex=0;
    console.log("ANTS ARE DED");
  for(var i=0; i<antList.length; i++){
    if(antList[i]!=length-1){
  ants = concat(subset(ants, 0, antList[i]-antindex), subset(ants, antList[i]+1-antindex, length));
  antindex+=1;
} else {
  ants = subset(ants, 0, antList[i]-antindex);
}
}

   console.log("ants: "+ants.length);
}

function keyPressed(){
  if(keyCode===ENTER){
    createBalls();
  }
}
