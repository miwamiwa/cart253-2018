/*
basic ant pong
*/

// Variable to contain the objects
var balls = [];
var leftPaddle;
var rightPaddle;
var totalBalls = 0;
var drawAgain = false;
var ants = [];
var fireBalls=[];
var maxBalls = 10;
var biscuit;

var biscuitChance = 0.15;
var ballIncrease =0;



// setup()
//
// Creates the ball and paddles

function setup() {

  createCanvas(800,350);
  // Create paddles
  rightPaddle = new Paddle(width-10,height/2,20,60,10,DOWN_ARROW,UP_ARROW, LEFT_ARROW, RIGHT_ARROW, 48);
  leftPaddle = new Paddle(0,height/2,20,60,10,83,87, 65, 68, 49);
  biscuit = new Biscuit();
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
  // handle biscuit

  biscuit.update();
  biscuit.display();
  biscuit.handlePaddleCollision(leftPaddle);
  biscuit.handlePaddleCollision(rightPaddle);

  // handle paddle inputs and update position
  leftPaddle.handleInput();
  rightPaddle.handleInput();
  leftPaddle.update();
  rightPaddle.update();

  // check for any fire balls
  // update position and display
  // handle paddle collision
  // handle ant collision
  // remove any fireballs off screen
  if (fireBalls.length>0){
    for(var i=0; i<fireBalls.length; i++){
      fireBalls[i].update();
      fireBalls[i].display();
      fireBalls[i].isOffScreen();
      fireBalls[i].handleCollision();
      fireBalls[i].handlePaddleCollision(leftPaddle);
      fireBalls[i].handlePaddleCollision(rightPaddle);
      if(fireBalls[i].offScreen){
        removeFireBall(i);
      }
    }
  }

  // handle ant collisions:
  // paddle collision,
  // ball collisions,
  // fireball collisions
  // round up dead ants
  if (ants.length>0){
    var deadAnts=[];
    for (var j=0; j<ants.length; j++){
      ants[j].update();
      ants[j].handleCollision(leftPaddle);
      ants[j].handleCollision(rightPaddle);
      for (var k=0; k<balls.length; k++){
        ants[j].handleCollision(balls[k]);
      }
    }
    //  remove dead ants
    if(deadAnts.length!=0){
      console.log("deadants: "+deadAnts);
      removeAnts(deadAnts);
    }
  }

  // display ants
  if (ants.length>0){
    for (var j=0; j<ants.length; j++){
      ants[j].display();
    }
  }

  // balls
  // reset ball array if needed
  for(var i=0; i<balls.length; i++){
    if(drawAgain){
      drawAgain = false;
      return;
    }

    // check if ball is off screen
    balls[i].update();
    if (balls[i].isOffScreen()) {
      balls[i].reset();
    }

    // handle ball collisions
    balls[i].handlePaddleCollision(leftPaddle);
    balls[i].handlePaddleCollision(rightPaddle);
    balls[i].handleBallCollision(i);

    // reset ball array if needed
    if(drawAgain){
      drawAgain = false;
      return;
    }

    //display balls
    balls[i].display();
  }

  // display paddles
  leftPaddle.display();
  rightPaddle.display();
}

// createballs()
//
// creates a number of balls

function createBalls(){

  // constrain random number of balls
  var numBalls = round(random(ballIncrease+2, ballIncrease+3));
  console.log("numBalls = "+numBalls);
  // create new balls
  if(balls.length<maxBalls){
    for (var i=0; i<numBalls; i++){
      balls.push(new Ball());
    }
    console.log("balls: "+balls.length);
  }
}

// removeball()
//
// removes a given ball without changing array order

function removeBall(index){
  // save length of balls array
  var length = balls.length;
  // unless this ball is the last ball on the list
  if(index!=length){
    // glue together parts of the list that come before and after this ball
    balls = concat(subset(balls, 0, index), subset(balls, index+1, length));
  }
  // if it is the last ball
  else{
    // list becomes everything until the last ball
    balls = subset(balls, 0, index);
  }
  // print new ball array size
  console.log("balls: "+balls.length);
}

// removefireball()
//
// remove fire ball from array without affecting order

function removeFireBall(index){
  // same as removeball()
  var length = fireBalls.length;
  if(index!=length){
    fireBalls = concat(subset(fireBalls, 0, index), subset(fireBalls, index+1, length));
  }
  else{
    fireBalls = subset(fireBalls, 0, index);
  }
  console.log("fireBalls: "+fireBalls.length);
}

// removeants()
//
// removes multiple ants from the array without affecting order

function removeAnt(antIndex){

  var length = ants.length;

    // if this is not the last ant
    if(antIndex!=length-1){
      // glue together ants arrays before and after this ant
      ants = concat(subset(ants, 0, antIndex), subset(ants, antIndex+1, length));
    }
    else {
      ants = subset(ants, 0, antIndex);
    }


  console.log("ants: "+ants.length);
}

// keypressed()
//
// pressing enter creates more balls

function keyPressed(){
  if(keyCode===ENTER){
    createBalls();
  }
  if(keyCode===SHIFT){
    biscuit.appear();
  }
  if(key===" "){
    ballIncrease+=1;
  }
}
