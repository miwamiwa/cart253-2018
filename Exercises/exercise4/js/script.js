// Pong
// by Pippin Barr
//
// A primitive implementation of Pong with no scoring system
// just the ability to play the game with the keyboard.

// Game colors
var bgColor = 0;
var fgColor = 255;

// BALL

// Basic definition of a ball object with its key properties of
// position, size, velocity, and speed
var ball = {
  x: 0,
  y: 0,
  size: 20,
  vx: 0,
  vy: 0,
  speed: 5
}

// PADDLES

// How far in from the walls the paddles should be drawn on x
var paddleInset = 150;

// LEFT PADDLE

// Basic definition of a left paddle object with its key properties of
// position, size, velocity, and speed
var leftPaddle = {
  x: 0,
  y: 0,
  w: 20,
  h: 70,
  vx: 0,
  vy: 0,
  speed: 5,
  upKeyCode: 87, // The key code for W
  downKeyCode: 83, // The key code for S
  //NEW
  score: 0,
  //END NEW
}

// RIGHT PADDLE

// Basic definition of a left paddle object with its key properties of
// position, size, velocity, and speed
var rightPaddle = {
  x: 0,
  y: 0,
  w: 20,
  h: 70,
  vx: 0,
  vy: 0,
  speed: 5,
  upKeyCode: 38, // The key code for the UP ARROW
  downKeyCode: 40, // The key code for the DOWN ARROW
  //NEW
  score: 0,
  //END NEW
}

// A variable to hold the beep sound we will play on bouncing
var beepSFX;

// a variable to control chance that game is over
var gameOverChance=0.5;
// a variable to indicate that game is over
var gameIsOver=false;

// preload()
//
// Loads the beep audio for the sound of bouncing
function preload() {
  beepSFX = new Audio("assets/sounds/beep.wav");
}

// setup()
//
// Creates the canvas, sets up the drawing modes,
// Sets initial values for paddle and ball positions
// and velocities.
function setup() {
  // Create canvas and set drawing modes
  //NEW
  // made canvas a bit wider
  createCanvas(840,480);
  textAlign(CENTER);
  //END NEW
  rectMode(CENTER);
  noStroke();
  fill(fgColor);

  setupPaddles();
  setupBall();
}

// setupPaddles()
//
// Sets the positions of the two paddles
function setupPaddles() {
  // Initialise the left paddle
  leftPaddle.x = paddleInset;
  leftPaddle.y = height/2;

  // Initialise the right paddle
  rightPaddle.x = width - paddleInset;
  rightPaddle.y = height/2;
}

// setupBall()
//
// Sets the position and velocity of the ball
function setupBall() {
  ball.x = width/2;
  ball.y = height/2;
  ball.vx = ball.speed;
  ball.vy = ball.speed;
}

// draw()
//
// Calls the appropriate functions to run the game
function draw() {
  // Fill the background
  background(bgColor);

  // Handle input
  // Notice how we're using the SAME FUNCTION to handle the input
  // for the two paddles!
  handleInput(leftPaddle);
  handleInput(rightPaddle);

  // Update positions of all objects
  // Notice how we're using the SAME FUNCTION to handle the input
  // for all three objects!
  updatePosition(leftPaddle);
  updatePosition(rightPaddle);
  updatePosition(ball);

  // Handle collisions
  handleBallWallCollision();
  handleBallPaddleCollision(leftPaddle);
  handleBallPaddleCollision(rightPaddle);

  // Handle the ball going off screen
  handleBallOffScreen();

  //NEW
  // Display the score under the other displayed elements
  displayScore();
  //END NEW

  // Display the paddles and ball
  displayPaddle(leftPaddle);
  displayPaddle(rightPaddle);
  displayBall();

  //NEW
  if(gameIsOver){
    displayGameOver();
  }
  //END NEW

}


// handleInput(paddle)
//
// Updates the paddle's velocity based on whether one of its movement
// keys are pressed or not.
// Takes one parameter: the paddle to handle.
function handleInput(paddle) {

  // Set the velocity based on whether one or neither of the keys is pressed

  // NOTE how we can change properties in the object, like .vy and they will
  // actually CHANGE THE OBJECT PASSED IN, this allows us to change the velocity
  // of WHICHEVER paddle is passed as a parameter by changing it's .vy.

  // UNLIKE most variables passed into functions, which just pass their VALUE,
  // when we pass JAVASCRIPT OBJECTS into functions it's the object itself that
  // gets passed, so we can change its properties etc.

  // Check whether the upKeyCode is being pressed
  // NOTE how this relies on the paddle passed as a parameter having the
  // property .upKey
  if (keyIsDown(paddle.upKeyCode)) {
    // Move up
    paddle.vy = -paddle.speed;
  }
  // Otherwise if the .downKeyCode is being pressed
  else if (keyIsDown(paddle.downKeyCode)) {
    // Move down
    paddle.vy = paddle.speed;
  }
  else {
    // Otherwise stop moving
    paddle.vy = 0;
  }
}

// updatePosition(object)
//
// Sets the position of the object passed in based on its velocity
// Takes one parameter: the object to update, which will be a paddle or a ball
//
// NOTE how this relies on the object passed in have .x, .y, .vx, and .vy
// properties, which is true of both the two paddles and the ball
function updatePosition(object) {
  object.x += object.vx;
  object.y += object.vy;
}

// handleBallWallCollision()
//
// Checks if the ball has overlapped the upper or lower 'wall' (edge of the screen)
// and is so reverses its vy
function handleBallWallCollision() {

  // Calculate edges of ball for clearer if statement below
  var ballTop = ball.y - ball.size/2;
  var ballBottom = ball.y + ball.size/2;
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

  // Check for ball colliding with top and bottom
  if (ballTop < 0 || ballBottom > height) {
    // If it touched the top or bottom, reverse its vy
    ball.vy = -ball.vy;
    // Play our bouncing sound effect by rewinding and then playing
    beepSFX.currentTime = 0;
    beepSFX.play();
  }
}

// handleBallPaddleCollision(paddle)
//
// Checks if the ball overlaps the specified paddle and if so
// reverses the ball's vx so it bounces
function handleBallPaddleCollision(paddle) {

  // Calculate edges of ball for clearer if statements below
  var ballTop = ball.y - ball.size/2;
  var ballBottom = ball.y + ball.size/2;
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

  // Calculate edges of paddle for clearer if statements below
  var paddleTop = paddle.y - paddle.h/2;
  var paddleBottom = paddle.y + paddle.h/2;
  var paddleLeft = paddle.x - paddle.w/2;
  var paddleRight = paddle.x + paddle.w/2;

  // First check it is in the vertical range of the paddle
  if (ballBottom > paddleTop && ballTop < paddleBottom) {
    // Then check if it is touching the paddle horizontally
    if (ballLeft < paddleRight && ballRight > paddleLeft) {
      // Then the ball is touching the paddle so reverse its vx
      ball.vx = -ball.vx;
      // Play our bouncing sound effect by rewinding and then playing
      beepSFX.currentTime = 0;
      beepSFX.play();
    }
  }
}

// handleBallOffScreen()
//
// Checks if the ball has gone off screen to the left or right
// and moves it back to the centre if so
function handleBallOffScreen() {

  // Calculate edges of ball for clearer if statement below
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;
 //NEW
  // Check for ball going off one side or the other.
  // Reset it to middle
  // Save its location in the ball.out parameter.
  if (ballRight < 0 ) {
    // If it went off left side, reset it to the centre
    ball.x = width/2;
    ball.y = height/2;
    reset("right");
    // Update right paddle score
    rightPaddle.score+=1;
    // NOTE that we don't change its velocity here so it just
    // carries on moving with the same velocity after its
    // position is reset.
    // This is where we would count points etc!
  } else if (ballLeft > width) {
    // If it went off right side, reset it to the centre
    ball.x = width/2;
    ball.y = height/2;
    reset("left");
    // update left paddle score
    leftPaddle.score+=1;
  }
  //END NEW
}

// displayBall()
//
// Draws ball on screen based on its properties
function displayBall() {
  //NEW
  // set fill as being different from score fill
  fill(fgColor);
  //END NEW
  rect(ball.x,ball.y,ball.size,ball.size);
}

// displayPaddle(paddle)
//
// Draws the specified paddle on screen based on its properties
function displayPaddle(paddle) {
  //NEW
  // set fill as being different from score fill
  fill(fgColor);
  //END NEW
  rect(paddle.x,paddle.y,paddle.w,paddle.h);
}
//NEW
function displayScore(){
  // display score as rows of balls.
  // set fill for this entire function
  fill(fgColor-100);
  // divide score into rows (set row length)
  var row=4;
  // set a smaller ball size for score display
  var ballSize=ball.size/2;
  // check left paddle's score
  for(var i=0; i<leftPaddle.score; i++){
    // for each point, display a ball.
    // determine which row this ball falls into
    var leftScoreRow = floor(i/row);
    // determine x pos depending on score and row size
    var leftScoreX = ballSize+1.5*i*ballSize-leftScoreRow*(1.5*row*ballSize);
    // determine y pos depending on score and row size
    var leftScoreY = ballSize+leftScoreRow*1.5*ballSize;
    // display ball
    rect(leftScoreX, leftScoreY,ballSize,ballSize);
  }
  // check right paddle's score,
  // and do the same.
  for(var i=0; i<rightPaddle.score; i++){
    var rightScoreRow = floor(i/row);
    var rightScoreX = width-(ballSize+1.5*i*ballSize-rightScoreRow*(1.5*row*ballSize));
    var rightScoreY = ballSize+rightScoreRow*1.5*ballSize;
    rect(rightScoreX, rightScoreY,ballSize,ballSize);
  }

}

function reset(direction){
  // get a new random speed based on initial ball speed parameter
  ball.vy=random(1, 2*ball.speed);
  // set new direction for ball
if(direction==="left"){
  ball.vx=-abs(ball.vx);
} else if(direction==="right"){
  ball.vx=abs(ball.vx);
}
  // place ball at the center of the screen
  ball.x = width/2;
  ball.y = height/2;

  // add chance that the game ends here
  if(random()<gameOverChance){
    gameOver();
  }
}

// gameOver()
// stops the game once we reach the end condition
function gameOver(){
  // stop the ball
ball.vx=0;
ball.vy=0;
// place it in the middle so that it doesn't interact
ball.x=width/2;
ball.y=height/2;
// indicate that game is over. this will fire the game over screen in draw.
gameIsOver=true;
}

// playAgain()
// a function to reset the game
function playAgain(){
  // indicate that game is no longer over (removes the game over screen display)
gameIsOver=false;
// reset ball and paddles to initial settings
setupBall();
setupPaddles();
// reset score.
leftPaddle.score=0;
rightPaddle.score=0;
}

// keyPressed()
// using this to trigger the game reset (for now at least)
function keyPressed(){
  // if key pressed is ENTER key
  if(keyCode===RETURN){
    // reset game
    playAgain();
  }
}

// displayGameOver()
// a function to cover up the game play and display game over information.
function displayGameOver(){
  background(0);
  displayScore();
  fill(fgColor);
  if(leftPaddle.score>rightPaddle.score) {
  text("game over! left player wins", width/2, height/2);
} else if (leftPaddle.score<rightPaddle.score) {
  text("game over! right player wins", width/2, height/2);
}else {
  text("game over! it's a tie!", width/2, height/2);
}
}
//END NEW
