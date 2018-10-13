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
    //NEW
  leftKeyCode: 65, // The key code for A
  rightKeyCode: 68, // The key code for D
    fireKeyCode: 49, // The key code for 1
  score: 0,
  // side: 0 is left, 1 is right.
  // this value is used to constrain horizontal movement to the
  // correct half of the screen.
  side:0,
  bulletx:0,
  bullety:0,
  bulletsize:20,
  bulletvx:10,
  bulletOn: false,
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
  leftKeyCode:37, // The key code for left arrow
  rightKeyCode: 39, // The key code for right arrow
      fireKeyCode: 48, // The key code for 0
  score: 0,
  // side: 0 is left, 1 is right.
  // this value is used to constrain horizontal movement to the
  // correct half of the screen.
  side: 1,
  bulletx:0,
  bullety:0,
  bulletsize:20,
    bulletvx:10,
    bulletOn: false,
  //END NEW
}

// A variable to hold the beep sound we will play on bouncing
var beepSFX;


//NEW
var cat = {
  x: 0,
  y: 0,
  size: 40,
  vx: 0,
  vy: 0,
  speed: 5,
  rand:0,
  inc:0.01,
}
var armStartPos=0;
var arm={
  x:200,
  y:armStartPos,
  h:100,
  w:80,
  paw:22,
  thick:42,
 rad:40,
 rad2:15,
 move1:false,
 move2:false,
 move3: false,
 move4: false,
 moveDone:true,
 vy:0,
 speed:7,
 extend:180,
}
var head={
  x:500,
  y:200,
  ys:0.3,
  xs:0.3,
  eye:false,
  gobble:false,
  jaw:20,
  earInc:0,
  maxMvmt:20,
  jawInc:20,
  eye:0,
  dispTimer: 0,
  timerLength:1500,
}
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
var ballIsSilly=false;
var sillyChance=0.5;

// a variable to constrain the game over cat within borders
var catConstrain=50;

// set a smaller ball size for score display
var scoreSize=10;
//END NEW

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
  setupArm();
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

  //set bullet to OFF
  leftPaddle.bulletOn=false;
  rightPaddle.bulletOn=false;
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
//NEW
function setupArm(){
  armStartPos=height+200;
   arm.y=armStartPos;
   arm.move1=false;
}
//END NEW
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
  //NEW
  if(ballIsSilly){
    updateSillyMovement();
  }
  //END NEW
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
  if(arm.move1||arm.move2||arm.move3||arm.move4){
  moveArm();
  displayArm();
}

      if(millis()>head.dispTimer&&head.dispTimer!=0&&gameIsOver===false){
        gameOver();
      }
  // draw cat head
  if (millis()<head.dispTimer){
  drawCatHead();
  head.gobble=true;
  head.eye=true;
}
  // run the game over sequence
  if(gameIsOver){
    runGameOver();
    console.log("gmover")
  }

  displayControls();
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
  //NEW
  // check for horizontal movement
  // i am constraining horizontal movement using paddleInset on BOTH sides.

  // if leftKeyCode is being pressed and paddle is within set limits
  else if (keyIsDown(paddle.leftKeyCode)&&paddle.x>paddle.side*width/2+paddleInset) {
    // Move left
    paddle.vx = -paddle.speed;
    console.log("moving left");
  }
   // if rightKeyCode is being pressed and paddle is within set limits
  else if (keyIsDown(paddle.rightKeyCode)&&paddle.x<width/2+paddle.side*width/2-paddleInset) {
    // Move right
    paddle.vx = paddle.speed;
        console.log("moving left");
  }
  else {
    // Otherwise stop moving
    paddle.vy = 0;
    paddle.vx = 0;
  }
   if (gameIsOver===true&&keyIsDown(paddle.fireKeyCode)){
     paddle.bulletOn=true;
     paddle.bulletx=paddle.x;
     paddle.bullety=paddle.y;
   }
     //END NEW
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

  // add chance that the game ends here
  if((ball.x<paddleInset-50||ball.x>width-paddleInset+50)&&gameOverChanceOn===false){
    gameOverChanceOn=true;
    console.log("chance");
  if(random()<gameOverChance){
    if(ball.vx<0){
      head.xs=abs(head.xs);
    head.y=ball.y-570*head.ys;
    head.x=0;
    head.dispTimer=millis()+head.timerLength;
    rightPaddle.score+=1;
  } else if (ball.vx>0){
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

  // check chance of something silly happening
  // (cat interferes with the game by swatting the ball)
  if(ballTop<5&&ball.vy<0){
    moveArmTop();

    if(random()<sillyChance){
      ballIsSilly=true;

      console.log("ball is silly");
    }
  }
  if(ballBottom>height-5&&ball.vy>0){
    moveArmBottom();
    if(random()<sillyChance){
      ballIsSilly=true;

      console.log("ball is silly");
    }
  }

  // Check for ball colliding with top and bottom
  if (ballTop < 0 || ballBottom > height) {
    // If it touched the top or bottom, reverse its vy
    ball.vy = -ball.vy;
    // Play our bouncing sound effect by rewinding and then playing
    beepSFX.currentTime = 0;
    beepSFX.play();

      //NEW
      // cancel any random ball movement
      if(ballIsSilly){
        ballIsSilly=false;
      }

      //END NEW
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

      //NEW
      // cancel any random ball movement
      if(ballIsSilly){
        ballIsSilly=false;
        console.log("ball hit paddle: not silly.");
      }
      //END NEW

      ball.vx = -ball.vx;

      //NEW
      // update angle at which ball is sent back
      ball.vy = map(paddle.y-ball.y, -paddle.h/2, paddle.h/2, ball.speed, -ball.speed);
      //END NEW

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
    // If it went off left side

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
  if(millis()<head.dispTimer){fill(bgColor);}
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

function reset(direction){
  // turn silly off
  ballIsSilly=false;
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
  gameOverChanceOn=false;
}

// gameOver()
// stops the game once we reach the end condition
function gameOver(){

// set cat to middle of the screen
setupCat();
// place ball in the middle so that it doesn't interact
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
head.dispTimer=0;
head.xs=0.3;
head.ys=0.3;
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

// runGameOver()
// this is used to run the "game over" game
// hides away the regular play screen and displays other game mechanics
// which involves shooting water at a cat (the cat stole your ball, dude)
function runGameOver(){
  ball.vx=0;
  ball.vy=0;
  // draw new background to hide the regular game screen
  background(0);
  // show score so we can keep in mind who won
  displayScore();
  // now load cat
  moveCat();
  //displayCat();
  drawCatHead();
  // paddles are still here as they will shoot "water"
  // handle input will allow shooting since "gameIsOver" is now true
  handleInput(leftPaddle);
  handleInput(rightPaddle);
  // display paddles
  displayPaddle(leftPaddle);
  displayPaddle(rightPaddle);
  // handle bullet motion and display
  moveBullet(leftPaddle);
  moveBullet(rightPaddle);
  displayBullet(leftPaddle);
  displayBullet(rightPaddle);
  // check collision with cat
  handleCatCollision(leftPaddle);
  handleCatCollision(rightPaddle);
  // display game over text.
  fill(fgColor);
  //check who won and display text accordingly
  if(leftPaddle.score>rightPaddle.score) {
  text("game over. left player wins. spray cat to reclaim the ball and field. \nleft player: press 1 to shoot. right player: press 0 to shoot.", width/2, height/2);
} else if (leftPaddle.score<rightPaddle.score) {
  text("game over. right player wins. spray cat to reclaim the ball and field. \nleft player: press 1 to shoot. right player: press 0 to shoot.", width/2, height/2);
}else {
  text("game over. it's a tie. spray cat to reclaim the ball and field. \nleft player: press 1 to shoot. right player: press 0 to shoot.", width/2, height/2);
}

}

// updateSillyMovement()
// manages the random motion of ball
function updateSillyMovement(){
  // increment noise
  sillyInc+=sillyFact;
  // apply to velocity
  ball.vy=map(noise(sillyInc), 0, 1, -ball.speed, +ball.speed);
// prevent the ball from heading straight back into the wall
  if(ball.y<10*ball.speed&&ball.vy<0){
      sillyInc+=sillyFact;
      ball.vy=map(noise(sillyInc), 0, 1, 0, +ball.speed);
  } else   if(ball.y>height-10*ball.speed&&ball.vy>0){
        sillyInc+=sillyFact;
        ball.vy=map(noise(sillyInc), 0, 1, 0, -ball.speed);
    }
}

// setupcat()
// loads the cat position for game over game
function setupCat(){
  cat.x=width/2;
  cat.y=height/2;
}

// movecat()
// updates cat position following random motion
function moveCat(){
  //move cat with random velocity
  cat.rand+=cat.inc;
  noiseSeed(0);
  cat.vx=map(noise(cat.rand), 0, 1, -cat.speed, cat.speed);
  noiseSeed(1);
cat.vy=map(noise(cat.rand), 0, 1, -cat.speed, cat.speed);
  // constrain to stay on screen
  if(cat.x<catConstrain){cat.vx=abs(cat.vx);}
    if(cat.x>width-catConstrain){cat.vx=-abs(cat.vx);}
    if(cat.y<catConstrain){cat.vy=abs(cat.vy);}
      if(cat.y>height-catConstrain){cat.vy=-abs(cat.vy);}
      // update cat position
  cat.x+=cat.vx;
  cat.y+=cat.vy;
  head.eye=true;
  head.gobble=true;
  head.x=cat.x-cat.size/2;
  head.y=cat.y-470*head.xs;
  head.xs=0.1;
  head.ys=0.1;
}

// displaycat()
// display game over cat
function displayCat(){
  fill(fgColor);
  ellipse(cat.x, cat.y, cat.size, cat.size);
}

// handleCatCollision()
// based on handleBallCollision()
// resets the game if you manage to hit the cat
function handleCatCollision(paddle) {
// simplify the upcoming if statement by calculating variables prior
  var catTop = cat.y - cat.size/2;
  var catBottom = cat.y + cat.size/2;
  var catLeft = cat.x - cat.size/2;
  var catRight = cat.x + cat.size/2;

// check for bullet proximity to cat and reset game
  if(paddle.bulletx>catLeft&&paddle.bulletx<catRight&&paddle.bullety>catTop&&paddle.bullety<catBottom&&paddle.bulletOn) {
    playAgain();
    // make sure bullets are turned off when game is reset
    paddle.bulletOn=false;
  }
}

//movebullet()
//update specific bullet position
function moveBullet(paddle){
  //turn bullet on
  if(paddle.bulletOn===true){
    //use paddle.side to determine in which direction to shoot the bullet
    //in this case it's the left paddle's bullet:
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
// displays our bullet
function displayBullet(paddle){
    if(paddle.bulletOn===true){
  fill(10, 10, 230);
  ellipse(paddle.bulletx, paddle.bullety, paddle.bulletsize, paddle.bulletsize/2);
}
}
function drawCatHead(){

  if(head.gobble){
    fireGobble();
  }
  if(head.eye){
    growEye();
  }
  head.earInc+=1;
  if(head.earInc===20){head.earInc=0;}
    ear=cos(map(head.earInc, 0, 20, 0, TWO_PI))*3;
  fill(152);
  strokeWeight(0);
// lower lip
triangle(head.x+565*head.xs, head.y+(611+head.jaw)*head.ys, head.x+466*head.xs, head.y+563*head.ys, head.x+386*head.xs, head.y+646*head.ys);
triangle(head.x+466*head.xs, head.y+563*head.ys, head.x+588*head.xs, head.y+(572+head.jaw)*head.ys, head.x+565*head.xs, head.y+(611+head.jaw)*head.ys);
//upper lip
triangle(head.x+466*head.xs, head.y+563*head.ys, head.x+588*head.xs, head.y+(572-head.jaw)*head.ys, head.x+638*head.xs, head.y+464*head.ys);

triangle(head.x+638*head.xs, head.y+464*head.ys, head.x+598*head.xs, head.y+414*head.ys, head.x+466*head.xs, head.y+563*head.ys);
triangle(head.x+466*head.xs, head.y+563*head.ys, head.x+539*head.xs, head.y+318*head.ys, head.x+598*head.xs, head.y+414*head.ys);
triangle(head.x+539*head.xs, head.y+318*head.ys, head.x+370*head.xs, head.y+204*head.ys, head.x+466*head.xs, head.y+563*head.ys);
triangle(head.x+370*head.xs, head.y+204*head.ys, head.x+125*head.xs, head.y+226*head.ys, head.x+466*head.xs, head.y+563*head.ys);
triangle(head.x+386*head.xs, head.y+646*head.ys, head.x+39*head.xs, head.y+591*head.ys, head.x+363*head.xs, head.y+664*head.ys);
triangle(head.x+125*head.xs, head.y+226*head.ys, head.x+4*head.xs, head.y+325*head.ys, head.x+39*head.xs, head.y+591*head.ys);
triangle(head.x+125*head.xs, head.y+226*head.ys, head.x+466*head.xs, head.y+563*head.ys, head.x+39*head.xs, head.y+591*head.ys);
triangle(head.x+386*head.xs, head.y+646*head.ys, head.x+466*head.xs, head.y+563*head.ys, head.x+39*head.xs, head.y+591*head.ys);
fill(50);
triangle(head.x+370*head.xs, head.y+204*head.ys, head.x+421*head.xs-ear, head.y+57*head.ys, head.x+125*head.xs, head.y+226*head.ys);
triangle(head.x+263*head.xs, head.y+322*head.ys, head.x+345*head.xs+ear, head.y+27*head.ys, head.x+125*head.xs, head.y+226*head.ys);
triangle(head.x+345*head.xs+ear, head.y+27*head.ys, head.x+370*head.xs, head.y+204*head.ys, head.x+263*head.xs, head.y+322*head.ys);
fill(80);
triangle(head.x+460*head.xs, head.y+372*head.ys, head.x+512*head.xs, head.y+427*head.ys, head.x+508*head.xs, head.y+341*head.ys);
fill(0);
ellipse(head.x+505*head.xs, head.y+380*head.ys, 20*head.ys, (40+head.eye)*head.ys);
}
function fireGobble(){
  head.jawInc-=1;
  if(head.jawInc===0){head.jawInc=head.maxMvmt; head.gobble=false;}
  head.jaw=cos(map(head.jawInc, 0, head.maxMvmt, 0, TWO_PI));
  head.jaw=map(head.jaw, -1, 1, 0, 20);
}
function growEye(){
  head.eye+=1;
  if(head.eye===head.maxMvmt){head.eye=false;}
  if(head.eye===head.maxMvmt+1){head.eye=0;}
}
function moveArm(){
  if(arm.move1){
      arm.vy-=arm.speed;
      console.log("move1");
        if(arm.vy<=-arm.extend){ arm.move1=false; arm.move2=true;

        }
    }
    if(arm.move2){
      arm.vy+=arm.speed;
      console.log("move2");
      if(arm.vy>=0){
        arm.move2=false;
        arm.moveDone=true;
      }
    }
    if(arm.move3){
        arm.vy-=arm.speed;
        console.log("move3");
          if(arm.vy>=-arm.extend){ arm.move3=false; arm.move4=true;

          }
      }
      if(arm.move4){
        arm.vy+=arm.speed;
        console.log("move4");
        if(arm.vy<=0){
          arm.move4=false;
          arm.moveDone=true;
        }
      }
    arm.x=ball.x;
    arm.y=armStartPos+arm.vy;
}

function displayArm(){

    noFill()
    stroke(165);
    strokeWeight(arm.thick);
    arc(arm.x, arm.y, arm.w, 2*arm.h, 1.5*PI, 0.25*PI);
    fill(185);
    noStroke();
    ellipse(arm.x-arm.paw/2, arm.y-arm.h+arm.paw, 1.6*arm.paw, 1.6*arm.paw);
    ellipse(arm.x, arm.y-arm.h-arm.paw, 1.6*arm.paw, 1.6*arm.paw);
    ellipse(arm.x-arm.paw, arm.y-arm.h, 1.6*arm.paw, 1.6*arm.paw);
    fill(145);
    noStroke();
    ellipse(arm.x-arm.paw/2, arm.y-arm.h+arm.paw, 1*arm.paw, 1*arm.paw);
    ellipse(arm.x, arm.y-arm.h-arm.paw, 1*arm.paw, 1*arm.paw);
    ellipse(arm.x-arm.paw, arm.y-arm.h, 1*arm.paw, 1*arm.paw);
    noFill();
    stroke(215);
    strokeWeight(5);
    if(arm.paw>0){
    arc(arm.x-1.1*arm.paw, arm.y-arm.h+2*arm.paw, 30, 50, 1.25*PI, 1.5*PI);
    arc(arm.x-0.6*arm.paw, arm.y-arm.h-0.3*arm.paw, 60, 50, 1.20*PI, 1.5*PI);
    arc(arm.x-1.6*arm.paw, arm.y-arm.h+arm.paw, 50, 50, 1.25*PI, 1.5*PI);
  } else {
    arc(arm.x-1.1*arm.paw, arm.y-arm.h+2*arm.paw, 30, 50, 0.25*PI, 0.5*PI);
    arc(arm.x-0.6*arm.paw, arm.y-arm.h-0.3*arm.paw, 60, 50, 0.2*PI, 0.5*PI);
    arc(arm.x-1.6*arm.paw, arm.y-arm.h+arm.paw, 50, 50, 0.25*PI, 0.5*PI);
  }
}

function moveArmTop(){
  if(arm.moveDone){
    arm.vy=0;
    arm.move1=false;
    arm.move3=false;

    // paw facing down
    arm.paw=-abs(arm.paw);
    arm.h=-abs(arm.h);
    arm.speed=-abs(arm.speed);
    arm.extend=-abs(arm.extend);
    armStartPos=-200;
    arm.move3=true;
    arm.moveDone=false;

  }
}
function moveArmBottom(){
  if(arm.moveDone){
    arm.vy=0;
    arm.move1=false;
    arm.move3=false;

    // paw facing up
    arm.paw=abs(arm.paw);
    arm.h=abs(arm.h);
    arm.speed=abs(arm.speed);
    arm.extend=abs(arm.extend);
     armStartPos=height+200;
     arm.move1=true;
     arm.moveDone=false;
  }
}
function displayControls(){
  noStroke();
  fill(fgColor);
  text("left player: WASD. right player: Arrow keys.", width/2, height-15);
}
//END NEW
