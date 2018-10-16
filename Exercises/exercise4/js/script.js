/*
kame-pong by samuel paré-chouinard
this is my version of the pong game:

meet kamehameha, my roommate's cat.
in this version, she tries to mess with your game.
she will send the ball wobbling away if it gets too close to the side,
and she has a chance of eating the ball if it goes out of bounds, bringing the game to an end.
gently spray kame with a bit of water and she will return the ball and leave the playing field.

left player moves with WASD and shoots with 1
right player moves with arrow keys and shoots with 0
shooting is enabled when game over starts. shoot the cat to restart
or press enter at anytime to restart
*/

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
    ///////////// NEW /////////////
  leftKeyCode: 65, // The key code for A
  rightKeyCode: 68, // The key code for D
  fireKeyCode: 49, // The key code for 1
  // a variable to keep score
  score: 0,
  // side: 0 is left, 1 is right.
  // this value is used to constrain horizontal movement to the
  // correct half of the screen.
  side:0,
  // left paddle's bullets
  // position
  bulletx:0,
  bullety:0,
  //size
  bulletsize:20,
  //velocity
  bulletvx:10,
  //used to keep track of whether a bullet is being fired
  bulletOn: false,
  ///////////// END NEW /////////////
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
    ///////////// NEW /////////////
  leftKeyCode:37, // The key code for left arrow
  rightKeyCode: 39, // The key code for right arrow
  fireKeyCode: 48, // The key code for 0
  score: 0,
  side: 1,
  bulletx:0,
  bullety:0,
  bulletsize:20,
  bulletvx:10,
  bulletOn: false,
  ///////////// END NEW /////////////
}

// A variable to hold the beep sound we will play on bouncing
var beepSFX;


///////////// NEW /////////////
//MUSIC
// the music related code in here is mostly copy-pasted from project 1.
// this time around the composition is not random, the following three
// synths read through set parts at set rhythms.
var syn1={
  // declare type of synth, and type of filter
  synthType: 'sine',
  filtAtt: "LP",
  // envelope setup
  attackLevel: 0.2,
  releaseLevel: 0,
  attackTime: 0.01,
  decayTime: 0.2,
  susPercent: 0.42,
  releaseTime: 0.9,
  // next 4 parameters hold p5.sound.js objects
  env:0,
  thisSynth:0,
  filter:0,
  delay:0,
  // filter frequency
  fFreq:500,
  // delay parameters
  delayFX: false,
  delayLength: 0.16,
  delayFB: 0.3,
  delayFilter: 400,
  // phrase and loop
  phrase: 0,
  loop: 0,
  // loop rate
  rate: 80,
  // note values
  notes:[0],
  oct:0,
}
var syn2={ //same as syn1
  synthType: 'square',
  filtAtt: "LP",
  //envelope
  attackLevel: 0.4,
  releaseLevel: 0,
  attackTime: 0.1,
  decayTime: 0.1,
  susPercent: 0.2,
  releaseTime: 0.5,
  //p5 objects
  delay:0,
  env:0,
  thisSynth:0,
  filter:0,
  //filter frequency
  fFreq:500,
  //delay
  delayFX: false,
  delayLength: 0.16,
  delayFB: 0.3,
  delayFilter: 400,
  // phrase and loop
  phrase: 0,
  loop: 0,
  // loop rate
  rate: 20,
  // note values
  notes:[0],
  oct:0,
}

var syn3={ // same as syn1
  synthType: 'square',
  filtAtt: "LP",
  // envelope
  attackLevel: 0.7,
  releaseLevel: 0,
  attackTime: 0.01,
  decayTime: 0.2,
  susPercent: 0.2,
  releaseTime: 0.5,
  // p5 objects
  env:0,
  thisSynth:0,
  filter:0,
  delay:0,
  //filter frequency
  fFreq:800,
  // delay parameters
  delayFX: true,
  delayLength: 0.33,
  delayFB: 0.2,
  delayFilter: 1500,
  // phrase and loop
  phrase: 0,
  loop: 0,
  // loop rate
  rate: 40,
  // note values
  notes:[0],
  // octave at which the synth plays
  oct:0,
}

// root key midi value
var rootNote=60;

// MUSICAL TIME:
// incremented value used to keep track of time
var musicInc=0;
// speed at which to increment. will increase on gameover screen.
var musicSpeed=1;
// phrases to be played:
var phrase1=[0, 0, 0, 0, 0, 2, 4, 5, 0, 0, 0, 0, 0, 5, 4, 2];
var phrase2=[9, 4, 9, 2, 9, 9, 4, 2];
var phrase3=[0, 0, 2, 2, 5, 5, 5, 2];


// CAT:
// this is the small cat head that you shoot (with water..) during game over screen.
// structured like ball, with some parameters used to generate the random movement.
var cat = {
  x: 0,
  y: 0,
  size: 40,
  vx: 0,
  vy: 0,
  speed: 5,
  // noise seed
  rand:0,
  // noise increment
  inc:0.01,
}

// starting position for the leg (once canvas is loaded it is set to under the screen)
var legStartPos=0;

// this is the cat leg that swipes at the ball when it reaches the side walls
var leg={
  //position
x:200,
  y:legStartPos,
  // height and width (used to scale the image)
  h:100,
  w:80,
  // paw width
  paw:22,
  // leg thickness
  thick:42,
 // finger radius
 rad:40,
 // finger inner radius
 rad2:15,
 // movement triggers
 // move from bottom of screen upward
 move1:false,
 //and back again
 move2:false,
 // move from top of the screen downward
 move3: false,
 // and back again
 move4: false,
 // finished moving trigger
 moveDone:true,
 // velocity
 vy:0,
 speed:7,
 // how long to extend the leg
 extend:180,
}
// this is the cat head that eats your pong ball
var head={
  //position (bottom left corner)
  x:500,
  y:200,
  // scaling: the triangles were mapped in another code with a larger image, so they need scaling
  // y-scaling.
  ys:0.3,
  // x-scaling. used to scale but also to flip the image
  xs:0.3,
  // enlarging eye animation
  eye:false,
  // gobbling jaw animation
  gobble:false,
  // length of jaw movement
  jaw:20,
  // increment for ear movement
  earInc:0,
  // stopper for ear increment
  maxMvmt:20,
  // stopper for jaw increment
  jawMax:20,
  // growing eye increment
  eye:0,
  // a variable to create a display timer
  dispTimer: 0,
  // length of display timer
  timerLength:1500,
}

// GAME SETTINGS
// a variable to control chance that game is over
var gameOverChance=0.5;
// a boolean to allow chance of game over only once per ball out
var gameOverChanceOn=false;
// a variable to indicate that game is over
var gameIsOver=false;

// a variable to save perlin noise increment
var sillyInc=0;
// a variable to change perlin noise position
var sillyFact=0.05;
// a trigger for the silly movement
var ballIsSilly=false;
// chance that cat takes a swipe at the ball
var sillyChance=0.5;

// a variable to constrain the game over cat within borders
var catConstrain=50;

// set a smaller ball size for score display
var scoreSize=10;
///////////// END NEW /////////////

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
  ///////////// NEW /////////////
  // made canvas a bit wider
  createCanvas(840,480);
  textAlign(CENTER);
  // new setup functions
  setupInstruments();
  setupleg();
  ///////////// END NEW /////////////
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
  ///////////// NEW /////////////
  //set bullet to OFF
  leftPaddle.bulletOn=false;
  rightPaddle.bulletOn=false;
  ///////////// END NEW /////////////
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

///////////// NEW /////////////
// setupInstruments();
// set phrase length,
// load each instrument and start sound.
function setupInstruments(){
  // set at which octave each voice will play
  syn1.oct=12;
  syn3.oct=-24;
  syn2.oct=0;
  // assign phrasesto each synth
  syn2.notes=phrase1;
  syn1.notes=phrase2;
  syn3.notes=phrase3;
  loadAnInstrument(syn2);
  loadAnInstrument(syn1);
  loadAnInstrument(syn3);
}

//setupleg();
//
// sets leg position now that canvas is drawn
function setupleg(){
  legStartPos=height+200;
   leg.y=legStartPos;
}

///////////// END NEW /////////////
// draw()
//
// Calls the appropriate functions to run the game
function draw() {
  // Fill the background
  background(bgColor);
  ///////////// NEW /////////////
  // load music first
  musicInc+=musicSpeed;
  handleMusic(syn1);
  handleMusic(syn2);
  handleMusic(syn3);
  ///////////// END NEW /////////////

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

  ///////////// NEW /////////////
  // if cat has swiped at the ball, mess with ball velocity
  if(ballIsSilly){
    updateSillyMovement();
  }
  ///////////// END NEW /////////////

  updatePosition(ball);

  // Handle collisions
  handleBallWallCollision();
  handleBallPaddleCollision(leftPaddle);
  handleBallPaddleCollision(rightPaddle);

  // Handle the ball going off screen
  handleBallOffScreen();

  ///////////// NEW /////////////
  // Display the score under the other displayed elements
  displayScore();
  ///////////// END NEW /////////////

  // Display the paddles and ball
  displayPaddle(leftPaddle);
  displayPaddle(rightPaddle);
  displayBall();

  ///////////// NEW /////////////
  // CAT leg
  // if any of the leg's triggers are active,
  // update leg position and draw leg.
  if(leg.move1||leg.move2||leg.move3||leg.move4){
  moveleg();
  displayLeg();
}
  // CAT HEAD: GAME OVER
  // if cat head timer is active, draw cat head
if (millis()<head.dispTimer){
drawCatHead();
head.gobble=true;
head.eye=true;
}

  // if the cat head timer is over, load gameover settings
  // (loadGameOver runs once, while runGameOver runs in a loop)
  if(millis()>head.dispTimer&&head.dispTimer!=0&&gameIsOver===false){
   loadGameOver();
}
  // if cat head timer is over and gameover is loaded,
  // run the gameover function
  if(gameIsOver){
    runGameOver();
    console.log("gmover")
  }
  // display controls info at the bottom of the screen
  displayControls();
  ///////////// END NEW /////////////

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

  ///////////// NEW /////////////
  // check for left-right keys
  // i am constraining horizontal movement using paddleInset as a margin on both sides.
  // this part uses paddle.side (0 or 1) to translate the constraints by width/2

  // if leftKeyCode is being pressed and paddle is within set limits
  else if (keyIsDown(paddle.leftKeyCode)&&paddle.x>paddle.side*width/2+paddleInset) {
    // Move left
    paddle.vx = -paddle.speed;
  }
   // if rightKeyCode is being pressed and paddle is within set limits
  else if (keyIsDown(paddle.rightKeyCode)&&paddle.x<width/2+paddle.side*width/2-paddleInset) {
    // Move right
    paddle.vx = paddle.speed;
  }
  else {

    // Otherwise stop moving
    paddle.vy = 0;
    paddle.vx = 0;
  }
   // If we are in the game over game, check for fire key
   if (gameIsOver===true&&keyIsDown(paddle.fireKeyCode)){
     // turn bullet on
     paddle.bulletOn=true;
     // place bullet on screen
     paddle.bulletx=paddle.x;
     paddle.bullety=paddle.y;
   }
     ///////////// END NEW /////////////
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

///////////// NEW /////////////
  // add chance that the game ends here
  // this is done here rather than in handleballoffscreen(), since i want
  // to stop the ball a moment before it hits the side so that the cat head
  // can come in and gobble it.

    // if ball is out of paddle reach,
    // and the chance of game over has not yet been determined
  if((ball.x<paddleInset-50||ball.x>width-paddleInset+50)&&gameOverChanceOn===false){
    // toggle this statement off. it will be reset in handleballoffscreen()
    gameOverChanceOn=true;
    // random chance that game is over
  if(random()<gameOverChance){
    // now make the cat head appear in the right place,
    // and flipped the right way using xs (x-scale)
    // if ball is heading left
    if(ball.vx<0){
      // scaling is positive
    head.xs=abs(head.xs);
    // allign mouth with ball on y-axis
    head.y=ball.y-570*head.ys;
    // set x position
    head.x=0;
    // start timer
    head.dispTimer=millis()+head.timerLength;
    // don't forget to add score! ball will not reach the side,
    // so handleballoffscreen() won't keep track of this point.
    rightPaddle.score+=1;
    // if ball was running right
  } else if (ball.vx>0){
    // scaling is negative
    head.xs=-abs(head.xs);
    head.y=ball.y-570*head.ys;
    head.x=width;
    head.dispTimer=millis()+head.timerLength;
    leftPaddle.score+=1;
  }
    // stop the ball
  ball.vx=0;
  ball.vy=0;
  }
}
///////////// END NEW /////////////
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

///////////// NEW /////////////
  // check chance of something silly happening
  // (cat interferes with the game by swatting the ball)
  // this function is looped, so every frame the cat has a new chance of
  // swiping at the ball.. meaning that the 0.5 chance we have right now
  // causes the leg to fire almost every time the ball is near a side.

  // if ball is close to top
  if(ballTop<5&&ball.vy<0){
    // start appropriate leg movement
    moveLegTop();
    // chance that cat actually hits the ball
    if(random()<sillyChance){
      // generate random motion
      ballIsSilly=true;
    }
  }
  // if ball is close to bottom
  if(ballBottom>height-5&&ball.vy>0){
    // start appropriate leg movement
    movelegBottom();
    // check if the ball is hit
    if(random()<sillyChance){
      ballIsSilly=true;
    }
  }

///////////// END NEW /////////////

  // Check for ball colliding with top and bottom
  if (ballTop < 0 || ballBottom > height) {
    // If it touched the top or bottom, reverse its vy
    ball.vy = -ball.vy;
    // Play our bouncing sound effect by rewinding and then playing
    beepSFX.currentTime = 0;
    beepSFX.play();

      ///////////// NEW /////////////

      // cancel any random ball movement (if ball has with either side)
      if(ballIsSilly){
        ballIsSilly=false;
      }

      ///////////// END NEW /////////////
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

      ///////////// NEW /////////////

      // cancel any random ball movement if ball collides with paddle
      if(ballIsSilly){
        ballIsSilly=false;
      }
      ///////////// END NEW /////////////

      ball.vx = -ball.vx;

      ///////////// NEW /////////////
      // update angle at which ball is sent back
      ball.vy = map(paddle.y-ball.y, -paddle.h/2, paddle.h/2, ball.speed, -ball.speed);
      ///////////// END NEW /////////////

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

 ///////////// NEW /////////////
  // Check for ball going off one side or the other.
  // Reset it to middle
  // Update its direction
  // Update the score
  if (ballRight < 0 ) {
    // reset the ball and fire to the right side
    reset("right");
    // Update right paddle score
    rightPaddle.score+=1;
  } else if (ballLeft > width) {
    // reset the ball and fire to the left side
    reset("left");
    // update left paddle score
    leftPaddle.score+=1;
  }
  ///////////// END NEW /////////////
}

// displayBall()
//
// Draws ball on screen based on its properties
function displayBall() {
  ///////////// NEW /////////////
  // set fill as being different from score fill
  fill(fgColor);
  if(millis()<head.dispTimer){fill(bgColor);}
  ///////////// END NEW /////////////
  rect(ball.x,ball.y,ball.size,ball.size);
}

// displayPaddle(paddle)
//
// Draws the specified paddle on screen based on its properties
function displayPaddle(paddle) {
  ///////////// NEW /////////////
  // set fill as being different from score fill
  fill(fgColor);
  ///////////// END NEW /////////////
  rect(paddle.x,paddle.y,paddle.w,paddle.h);
}


///////////// NEW /////////////
// FUNCTIONS!!

// displayscore()
//
// display score as rows of balls.
function displayScore(){

  // set fill for this entire function
  fill(fgColor-100);
  // divide score into rows (set row length)
  var row=4;
  // check left paddle's score
  for(var i=0; i<leftPaddle.score; i++){
    // for each point, display a ball.
    // determine which row this ball falls into
    var leftScoreRow = floor(i/row);
    // determine x pos depending on score and row size
    var leftScoreX = scoreSize+1.5*i*scoreSize-leftScoreRow*(1.5*row*scoreSize);
    // determine y pos depending on score and row size
    var leftScoreY = scoreSize+leftScoreRow*1.5*scoreSize;
    // display ball
    rect(leftScoreX, leftScoreY,scoreSize,scoreSize);
  }
  // check right paddle's score,
  // and do the same.
  for(var i=0; i<rightPaddle.score; i++){
    var rightScoreRow = floor(i/row);
    var rightScoreX = width-(scoreSize+1.5*i*scoreSize-rightScoreRow*(1.5*row*scoreSize));
    var rightScoreY = scoreSize+rightScoreRow*1.5*scoreSize;
    rect(rightScoreX, rightScoreY,scoreSize,scoreSize);
  }

}

// reset(direction);
//
// sets the ball to the middle
// and shoots it towards the player that scored.
function reset(direction){
  // turn silly ball off
  ballIsSilly=false;
  // get a new random speed based on initial ball speed parameter
  ball.vy=random(1, 2*ball.speed);
  // set new direction for ball
  // to the left
if(direction==="left"){
  ball.vx=-abs(ball.vx);
  // to the right
} else if(direction==="right"){
  ball.vx=abs(ball.vx);
}
  // place ball at the center of the screen
  ball.x = width/2;
  ball.y = height/2;
  // reset gameover chance
  gameOverChanceOn=false;
}

// loadGameOver()
//
// loads the gameover sequence once we reach the end condition
// this function is run only once. once gameIsOver becomes true,
// this function will no longer run and runGameOver will run in a loop.
function loadGameOver(){

// set cat to middle of the screen
setupCat();

// place ball in the middle so that it doesn't interact
ball.x=width/2;
ball.y=height/2;

// speed up the music!
musicSpeed=2;
// if musicInc is not a multiple of 2 it will mess up my note triggers,
// so make it an even number if it isn't already
if(musicInc%2!=0){musicInc+=1;}


// indicate that game is over. this will fire the game over screen in draw.
gameIsOver=true;
}

// runGameOver()
// this is used to run the "game over" game
// hides away the regular play screen and displays other this gameover game
// which involves shooting water at a cat (the cat stole your ball, dude)
function runGameOver(){

  // overwrite ball position
  ball.x=width/2;
  ball.y=width/2;

  // draw new background to hide the regular game screen
  background(0);
  // show score so we can keep in mind who won
  displayScore();

  // now load cat
  moveCat();
  drawCatHead();

  // display paddles
  displayPaddle(leftPaddle);
  displayPaddle(rightPaddle);

  // handle bullet motion and display
  moveBullet(leftPaddle);
  moveBullet(rightPaddle);
  displayBullet(leftPaddle);
  displayBullet(rightPaddle);

  // check bullet's collision with cat
  handleCatCollision(leftPaddle);
  handleCatCollision(rightPaddle);

  // display game over text:
  // the winner, and instructions to shoot water at the cat
  fill(fgColor);
  //check who won
  if(leftPaddle.score>rightPaddle.score) {
    // left player won
  text("game over. left player wins. spray cat to reclaim the ball and field. \nleft player: press 1 to shoot. right player: press 0 to shoot.", width/2, height/2);
} else if (leftPaddle.score<rightPaddle.score) {
  // right player won
  text("game over. right player wins. spray cat to reclaim the ball and field. \nleft player: press 1 to shoot. right player: press 0 to shoot.", width/2, height/2);
}else {
  // tie
  text("game over. it's a tie. spray cat to reclaim the ball and field. \nleft player: press 1 to shoot. right player: press 0 to shoot.", width/2, height/2);
}
}

// playAgain()
//
// a function to reset the game
function playAgain(){
  // indicate that game is no longer over (removes the game over screen display)
gameIsOver=false;
// reset music speed
  musicSpeed=1;
// reset head
head.dispTimer=0;
// reset scale to fit cat which eats the ball
head.xs=0.3;
head.ys=0.3;
// reset ball and paddles
setupBall();
setupPaddles();
// reset score.
leftPaddle.score=0;
rightPaddle.score=0;
}

// keyPressed()
//
// using this to trigger the game reset (for now at least)
function keyPressed(){
  // if key pressed is ENTER key
  if(keyCode===RETURN){
    // reset game
    playAgain();
  }
}



// updateSillyMovement()
//
// manages the random motion of ball
function updateSillyMovement(){
  // increment noise
  sillyInc+=sillyFact;
  // apply to velocity
  ball.vy=map(noise(sillyInc), 0, 1, -ball.speed, +ball.speed);
// prevent the ball from heading straight back into the wall
// if ball is still close to the wall
  if(ball.y<10*ball.speed&&ball.vy<0){
      ball.vy=abs(ball.vy);
  } else   if(ball.y>height-10*ball.speed&&ball.vy>0){
        ball.vy=-abs(ball.vy);
    }
}

// setupcat()
//
// loads the cat head for the game over game
function setupCat(){
  // cat is the object which you have to shoot. it has the characteristics of an ellipse
  cat.x=width/2;
  cat.y=height/2;
  // the image will be the cat head we used earlier though.
  // since the head is scalable, scale it down
  head.xs=0.1;
  head.ys=0.1;
}

// movecat()
// updates cat position following random motion
function moveCat(){
  //increment noise value
  cat.rand+=cat.inc;
  // pick seed for x velocity
  noiseSeed(0);
  // set random velocity
  cat.vx=map(noise(cat.rand), 0, 1, -cat.speed, cat.speed);
  // pick seed for y velocity
  noiseSeed(1);
  // set random velocity
  cat.vy=map(noise(cat.rand), 0, 1, -cat.speed, cat.speed);
  // constrain to stay on screen
  // left side
  if(cat.x<catConstrain){cat.vx=abs(cat.vx);}
  // right side
  if(cat.x>width-catConstrain){cat.vx=-abs(cat.vx);}
  // top
  if(cat.y<catConstrain){cat.vy=abs(cat.vy);}
  // bottom
  if(cat.y>height-catConstrain){cat.vy=-abs(cat.vy);}
  // update cat position
  cat.x+=cat.vx;
  cat.y+=cat.vy;
  // set head x and y position to match cat x and y position
  head.x=cat.x-cat.size/2;
  head.y=cat.y-470*head.xs;

}

// handleCatCollision()
//
// based on handleBallCollision()
// resets the game if you manage to hit the cat with your bullet
function handleCatCollision(paddle) {
// simplify the upcoming if statement by calculating variables prior
  var catTop = cat.y - cat.size/2;
  var catBottom = cat.y + cat.size/2;
  var catLeft = cat.x - cat.size/2;
  var catRight = cat.x + cat.size/2;

// check for bullet proximity to cat
  if(paddle.bulletx>catLeft&&paddle.bulletx<catRight&&paddle.bullety>catTop&&paddle.bullety<catBottom&&paddle.bulletOn) {
    // reset game
    playAgain();
    // make sure bullets are turned off when game is reset
    paddle.bulletOn=false;
  }
}

// movebullet()
//
// update bullet position specific to left or right paddle
function moveBullet(paddle){
  // turn bullet on
  if(paddle.bulletOn===true){
    // use paddle.side to determine in which direction to shoot the bullet
    // in this case it's the left paddle's bullet:
  if(paddle.side===0){
    // update speed
    paddle.bulletx+=paddle.bulletvx;
    // turn off once we reach the side
    if(paddle.bulletx>width){
      paddle.bulletOn=false;
    }
  } else {
    // do the same for the other paddle's bullet
    paddle.bulletx-=paddle.bulletvx;
    if(paddle.bulletx<0){
      paddle.bulletOn=false;
    }
  }
}
}

// displayBullet()
//
// displays our bullet
function displayBullet(paddle){
  // check if bullet is to be displayed
    if(paddle.bulletOn===true){
  fill(10, 10, 230);
  // draw bullet
  rect(paddle.bulletx, paddle.bullety, paddle.bulletsize, paddle.bulletsize/2);
}
}


// looking at my cat head now i'm struck with the feeling that here were
// probably easier ways to depict a cat head.. anyhow the reason why it is designed
// this way is because while trying to draw it using shapes i remembered this
// processing code i wrote last summer that i used to draw out triangles (and lock
// the points together to make a solid shape) over a background image, then shoot out
// ready made triangle() functions in the console with all the coordinates filled in.
// that's what i used here.
//
// drawcatHead();
//
// draws the triangles that make up the cat head,
// animate the parts

function drawCatHead(){
  // animations were placed in different function since
  // at first i wanted them to run at specific times only.
  // in the end continuous motion looks pretty nice.
// check if jaw gobbling motion is active
  if(head.gobble){
    // if so update gobble motion
    moveJaw();
  }
  // check for eye motion
  if(head.eye){
    // grow the eye
    growEye();
  }
  // increment ear motion
  head.earInc+=1;
  // reset ear motion
  if(head.earInc===20){
    head.earInc=0;
  }
  // smoothe out the motion using a cos() function
    ear=cos(map(head.earInc, 0, 20, 0, TWO_PI))*3;
  // now draw the cat head
  fill(152);
  strokeWeight(0);
  // head.jaw is added to the y-coordinates of four points of
  // the following three triangles to create the jaw motion
// lower jaw
triangle(head.x+565*head.xs, head.y+(611+head.jaw)*head.ys, head.x+466*head.xs, head.y+563*head.ys, head.x+386*head.xs, head.y+646*head.ys);
triangle(head.x+466*head.xs, head.y+563*head.ys, head.x+588*head.xs, head.y+(572+head.jaw)*head.ys, head.x+565*head.xs, head.y+(611+head.jaw)*head.ys);
//upper jaw
triangle(head.x+466*head.xs, head.y+563*head.ys, head.x+588*head.xs, head.y+(572-head.jaw)*head.ys, head.x+638*head.xs, head.y+464*head.ys);

// head
triangle(head.x+638*head.xs, head.y+464*head.ys, head.x+598*head.xs, head.y+414*head.ys, head.x+466*head.xs, head.y+563*head.ys);
triangle(head.x+466*head.xs, head.y+563*head.ys, head.x+539*head.xs, head.y+318*head.ys, head.x+598*head.xs, head.y+414*head.ys);
triangle(head.x+539*head.xs, head.y+318*head.ys, head.x+370*head.xs, head.y+204*head.ys, head.x+466*head.xs, head.y+563*head.ys);
triangle(head.x+370*head.xs, head.y+204*head.ys, head.x+125*head.xs, head.y+226*head.ys, head.x+466*head.xs, head.y+563*head.ys);
triangle(head.x+386*head.xs, head.y+646*head.ys, head.x+39*head.xs, head.y+591*head.ys, head.x+363*head.xs, head.y+664*head.ys);
triangle(head.x+125*head.xs, head.y+226*head.ys, head.x+4*head.xs, head.y+325*head.ys, head.x+39*head.xs, head.y+591*head.ys);
triangle(head.x+125*head.xs, head.y+226*head.ys, head.x+466*head.xs, head.y+563*head.ys, head.x+39*head.xs, head.y+591*head.ys);
triangle(head.x+386*head.xs, head.y+646*head.ys, head.x+466*head.xs, head.y+563*head.ys, head.x+39*head.xs, head.y+591*head.ys);
// ears. var ear is added to x-coordinate of three points in the following three triangles
fill(50);
triangle(head.x+370*head.xs, head.y+204*head.ys, head.x+421*head.xs-ear, head.y+57*head.ys, head.x+125*head.xs, head.y+226*head.ys);
triangle(head.x+263*head.xs, head.y+322*head.ys, head.x+345*head.xs+ear, head.y+27*head.ys, head.x+125*head.xs, head.y+226*head.ys);
triangle(head.x+345*head.xs+ear, head.y+27*head.ys, head.x+370*head.xs, head.y+204*head.ys, head.x+263*head.xs, head.y+322*head.ys);
// eye socket
fill(80);
triangle(head.x+460*head.xs, head.y+372*head.ys, head.x+512*head.xs, head.y+427*head.ys, head.x+508*head.xs, head.y+341*head.ys);
// eye ellipse. adds head.eye to height of ellipse to grow the eye.
fill(0);
ellipse(head.x+505*head.xs, head.y+380*head.ys, 20*head.ys, (40+head.eye)*head.ys);
}

// movejaw();
//
// cos function to move the jaw
function moveJaw(){
  // start from the top and increment down (jaw starts open)
  head.jawMax-=1;
  // if 0 is reached
  if(head.jawMax===0){
    // stop motion
    head.jawMax=head.maxMvmt;
    head.gobble=false;
  }
  // apply cosine motion
  head.jaw=cos(map(head.jawMax, 0, head.maxMvmt, 0, TWO_PI));
  // map to match correct jaw width
  head.jaw=map(head.jaw, -1, 1, 0, 20);
}

// groweye();
//
// grow pupil size. cats do that..
function growEye(){
  // increment size
  head.eye+=1;
  // stop motion and reset
  if(head.eye===head.maxMvmt){head.eye=false;}
  if(head.eye===head.maxMvmt+1){head.eye=0;}
}

// moveleg()
//
// sets appropriate direction for leg motion
function moveleg(){
  // if move1 is active
  if(leg.move1){
    // move leg up
      leg.vy-=leg.speed;
      // once leg has reached maximum extension,
      // turn this trigger off and turn next one on.
        if(leg.vy<=-leg.extend){
           leg.move1=false;
           leg.move2=true;
        }
    }
    // if move2 is active
    if(leg.move2){
      // move leg down
      leg.vy+=leg.speed;
      // once motion has reached its end
      // stop all leg motion
      if(leg.vy>=0){
        leg.move2=false;
        leg.moveDone=true;
      }
    }

    // move3 is active
    if(leg.move3){
      // move leg down
        leg.vy+=leg.speed;
        // motion finished:
      // stop move3 and start move4
          if(leg.vy>=-leg.extend){
            leg.move3=false;
            leg.move4=true;
          }
      }
      // move4 is active
      if(leg.move4){
        // move leg up
        leg.vy-=leg.speed;
        // motion finished:
        // stop all motion.
        if(leg.vy<=0){
          leg.move4=false;
          leg.moveDone=true;
        }
      }
      // set leg.x to match where the ball is
    leg.x=ball.x;
    // update leg position according to velocity
    leg.y=legStartPos+leg.vy;
}

// displayLeg()
//
// the leg is more simple. there are no animations but
// i tried to make it as "reversible" as possible to use the same
// function to display the leg at the top and bottom of the screen.
// inverting var leg.h and var paw does the trick to flip the image over,
// except for the claws which need separate arc() functions for both positions.
function displayLeg(){
    // leg
    noFill()
    stroke(165);
    strokeWeight(leg.thick);
    arc(leg.x, leg.y, leg.w, 2*leg.h, 1.5*PI, 0.25*PI);
    // paw
    // outer circle
    fill(185);
    noStroke();
    ellipse(leg.x-leg.paw/2, leg.y-leg.h+leg.paw, 1.6*leg.paw, 1.6*leg.paw);
    ellipse(leg.x, leg.y-leg.h-leg.paw, 1.6*leg.paw, 1.6*leg.paw);
    ellipse(leg.x-leg.paw, leg.y-leg.h, 1.6*leg.paw, 1.6*leg.paw);
    // inner circle
    fill(145);
    noStroke();
    ellipse(leg.x-leg.paw/2, leg.y-leg.h+leg.paw, 1*leg.paw, 1*leg.paw);
    ellipse(leg.x, leg.y-leg.h-leg.paw, 1*leg.paw, 1*leg.paw);
    ellipse(leg.x-leg.paw, leg.y-leg.h, 1*leg.paw, 1*leg.paw);
    // claws
    noFill();
    stroke(215);
    strokeWeight(5);
    // if leg is on bottom side
    if(leg.paw>0){
      // display claws
    arc(leg.x-1.1*leg.paw, leg.y-leg.h+2*leg.paw, 30, 50, 1.25*PI, 1.5*PI);
    arc(leg.x-0.6*leg.paw, leg.y-leg.h-0.3*leg.paw, 60, 50, 1.20*PI, 1.5*PI);
    arc(leg.x-1.6*leg.paw, leg.y-leg.h+leg.paw, 50, 50, 1.25*PI, 1.5*PI);
  } else {
    // if leg on top side display these claws instead
    arc(leg.x-1.1*leg.paw, leg.y-leg.h+2*leg.paw, 30, 50, 0.25*PI, 0.5*PI);
    arc(leg.x-0.6*leg.paw, leg.y-leg.h-0.3*leg.paw, 60, 50, 0.2*PI, 0.5*PI);
    arc(leg.x-1.6*leg.paw, leg.y-leg.h+leg.paw, 50, 50, 0.25*PI, 0.5*PI);
  }
}

// moveLegTop
//
// gets called once before initiating motion
// prepares leg motion
// flips cat leg to the top side
function moveLegTop(){
  if(leg.moveDone){
    // reset motion
    leg.vy=0;
    leg.move1=false;
    leg.move3=false;

    // paw facing down
    // invert shapes
    leg.paw=-abs(leg.paw);
    leg.h=-abs(leg.h);
    leg.extend=-abs(leg.extend);
    // set position
    legStartPos=-200;
    // start motion
    leg.move3=true;
    leg.moveDone=false;

  }
}

// movelegbottom();
//
// prepares leg motion
// flips cat lef to the bottom side
function movelegBottom(){
  if(leg.moveDone){
    // reset motion
    leg.vy=0;
    leg.move1=false;
    leg.move3=false;
    // paw facing up
    // set shapes to initial direction
    leg.paw=abs(leg.paw);
    leg.h=abs(leg.h);
    leg.extend=abs(leg.extend);
    // position
     legStartPos=height+200;
     // start motion
     leg.move1=true;
     leg.moveDone=false;
  }
}

// displayControls()
// displays text at the bottom of the screen during game play
function displayControls(){
  noStroke();
  fill(fgColor);
  text("left player: WASD. right player: Arrow keys.", width/2, height-15);
}

// MUSIC FUNCTIONS

// handleMusic()
//
// fires notes of a given synth according to loop position and phrase length
//
// this is based on what i had in project1, but
// all the synths are bunched up in one function now!!!
// i wasn't going to edit the music functions i grabbed from project1 at first, but
// this is quite nice. instead of using a steady pusle to fire each voice,
// i could also make synx.rate an array of values representing time until next note.
// with an array for time, and an array for pitches, the next music piece with set
// notes will be easy as pie.
// perhaps i could generate the note values with another code and a midi keyboard??
// like on p5? or processing? something? probably.

function handleMusic(synx){

// musicInc is incremented by musicSpeed in draw()
// if musicInc reaches the synth's pulse rate
if(musicInc%synx.rate===0){
      // convert midi to frequency
      var newNote =midiToFreq(rootNote+synx.oct+synx.notes[synx.loop]);
      // set frequency
      synx.thisSynth.freq(newNote);
      // play synth
       synx.env.play();
       // increment appropriate loop
       synx.loop+=1;
       // if loop has reached maximum limit reset loop
       if(synx.loop===synx.phrase){
         synx.loop=0;
          }
  }
}

// this is a straight copy-paste from my project1, except for the first line.
// loadAnInstrument();
//
// sets up a given instrument with appropriate oscillator, envelope, filter and delay.
// starts audio (but not envelope)
function loadAnInstrument(synx){
  // set phrase length
  synx.phrase=synx.notes.length;
  // for any instrument namedm synx (syn1, syn2, syn3 or syn4)
  // load envelope
  synx.env=new p5.Env();
  // setup envelope parameters
  synx.env.setADSR(synx.attackTime, synx.decayTime, synx.susPercent, synx.releaseTime);
  synx.env.setRange(synx.attackLevel, synx.releaseLevel);
  // check which filter to use
  if(synx.filtAtt==="BP"){
    // if the filter attribute says BP load a band pass filter
    synx.filter= new p5.BandPass();
  }
   // if the filter attribute says LP load a low pass filter
  if(synx.filtAtt==="LP"){
    synx.filter=new p5.LowPass();
  }
  // set initial filter frequency
  synx.filter.freq(synx.fFreq);
 // now load the type of oscillator used. syn3 is the only one which uses
 // something else than the standard oscillator, so this exception is dealt with first:
 // if the synth type is "pink" then we have a noise synth.
  if(synx.synthType==='pink'){
    synx.thisSynth=new p5.Noise(synx.synthType);
    // if anything else (square or sine) then we have an oscillator
  } else {
  synx.thisSynth=new p5.Oscillator(synx.synthType);
  }
  // plug-in the amp, which will be monitored using the envelope (env) object
  synx.thisSynth.amp(synx.env);
  // disconnect this sound from audio output
  synx.thisSynth.disconnect();
  // reconnect it with the filter this time
  synx.thisSynth.connect(synx.filter);
  // start audio
  synx.thisSynth.start();
  // set the initial frequency. do not set if this is the noise drum.
  if(synx.synthType!='pink'){synx.thisSynth.freq(rootNote);
  }
  // if delayFX is true, then there is also a delay object to load
  if(synx.delayFX){
    synx.delay = new p5.Delay();
    synx.delay.process(synx.thisSynth, synx.delayLength, synx.delayFB, synx.delayFilter);
  }
}

///////////// END NEW /////////////
