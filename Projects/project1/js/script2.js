/******************************************************

Game - Chaser
Pippin Barr

A simple game of cat and mouse.

Physics-based movement, keyboard controls, health/stamina,
sprinting, random movement, screen wrap.

******************************************************/

// Track whether the game is over
var gameOver = false;

// Player position, size, velocity
var playerX;
var playerY;
var playerRadius = 25;
var playerVX = 0;
var playerVY = 0;
var normalSpeed = 2;
var playerMaxSpeed = normalSpeed;
var sprintSpeed =4;
// Player health
var playerHealth;
var playerMaxHealth = 800;
// Rate of health loss
var lossFactor=1;
// Rate of health loss while player is sprinting
var sprintLossFactor=2;
// Player fill color
var playerFill = 50;

// Prey position, size, velocity
var preyX;
var preyY;
var preyRadius = 25;
var preyVX;
var preyVY;
var preyMaxSpeed = 4;
// Prey health
var preyHealth;
var preyMaxHealth = 100;
// Prey fill color
var normalPreyFill = 200;
var preyFill=normalPreyFill;
var specialPreyFill=100;

// Amount of health obtained per frame of "eating" the prey
var eatHealth = 10;
// Number of prey eaten during the game
var preyEaten = 0;

// position within a Perlin noise sequence
var noisePos=0;
// rate of change of Perlin noise position
var noiseInc=0.1;

// var that toggles sprint on and off
var sprintOn=false;

// distance at which the prey might see you
var visionRange=100;

// how smart the prey is
var preyIntel=0.1;

// increment by which prey skills increase upon capture
var preyIntelIncrement=0.05;
var visionRangeIncrement=10;

// level of prey intel at which prey levels up
var preyLevelUp=0.15;

// capture timer related stuff
var captureTimer=0;
var timerLength=2000;
var captureTimerStarted=false;
var playerInVisionRange=false;

// setup()
//
// Sets up the basic elements of the game
function setup() {
  createCanvas(500,500);

  noStroke();

  setupPrey();
  setupPlayer();
}

// setupPrey()
//
// Initialises prey's position, velocity, and health
function setupPrey() {
  preyX = width/5;
  preyY = height/2;
  preyVX = -preyMaxSpeed;
  preyVY = preyMaxSpeed;
  preyHealth = preyMaxHealth;
}

// setupPlayer()
//
// Initialises player position and health
function setupPlayer() {
  playerX = 4*width/5;
  playerY = height/2;
  playerHealth = playerMaxHealth;
}

// draw()
//
// While the game is active, checks input
// updates positions of prey and player,
// checks health (dying), checks eating (overlaps)
// displays the two agents.
// When the game is over, shows the game over screen.
function draw() {

  background(100,100,200);

  if (!gameOver) {
    handleInput();

    movePlayer();
    movePrey();

    updateHealth();
    checkEating();

    drawPrey();
    drawPlayer();

    drawUI();
  }
  else {
    showGameOver();
  }
}

// handleInput()
//
// Checks arrow keys and adjusts player velocity accordingly
function handleInput() {
  // check for shift key press
  if(keyIsDown(SHIFT)){
    sprintOn=true;
    playerMaxSpeed=sprintSpeed;
    lossFactor=sprintLossFactor;
  } else {
    sprintOn=false;
    playerMaxSpeed=normalSpeed;
    lossFactor=1;
  }
  // Check for horizontal movement
  if (keyIsDown(LEFT_ARROW)) {
    playerVX = -playerMaxSpeed;
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    playerVX = playerMaxSpeed;
  }
  else {
    playerVX = 0;
  }

  // Check for vertical movement
  if (keyIsDown(UP_ARROW)) {
    playerVY = -playerMaxSpeed;
  }
  else if (keyIsDown(DOWN_ARROW)) {
    playerVY = playerMaxSpeed;
  }
  else {
    playerVY = 0;
  }



}

// movePlayer()
//
// Updates player position based on velocity,
// wraps around the edges.
function movePlayer() {
  // Update position
  playerX += playerVX;
  playerY += playerVY;

  // Wrap when player goes off the canvas
  if (playerX < 0) {
    playerX += width;
  }
  else if (playerX > width) {
    playerX -= width;
  }

  if (playerY < 0) {
    playerY += height;
  }
  else if (playerY > height) {
    playerY -= height;
  }
}

// updateHealth()
//
// Reduce the player's health (every frame)
// Check if the player is dead
function updateHealth() {
  // Reduce player health, constrain to reasonable range
  playerHealth = constrain(playerHealth - 0.5*lossFactor,0,playerMaxHealth);
  // Check if the player is dead
  if (playerHealth === 0) {
    // If so, the game is over
    gameOver = true;
  }
}

// checkEating()
//
// Check if the player overlaps the prey and updates health of both
function checkEating() {
  // Get distance of player to prey
  var d = dist(playerX,playerY,preyX,preyY);
  if (d< visionRange&&preyIntel>preyLevelUp){
    playerInVisionRange=true;
    preyFill=specialPreyFill;

    if(!captureTimerStarted){
    captureTimer=millis()+timerLength;
    captureTimerStarted=true;
    preyFill=normalPreyFill;
  }
  } else {
    playerInVisionRange=false;
    captureTimer=0;
  captureTimerStarted=false;
}
  // Check if it's an overlap
  if (d < playerRadius + preyRadius) {
    // Increase the player health
    playerHealth = constrain(playerHealth + eatHealth,0,playerMaxHealth);
    // Reduce the prey health
    preyHealth = constrain(preyHealth - eatHealth,0,preyMaxHealth);

    // Check if the prey died
    if (preyHealth === 0) {
      // Move the "new" prey to a random position
      preyX = random(0,width);
      preyY = random(0,height);
      // Give it full health
      preyHealth = preyMaxHealth;
      // Track how many prey were eaten
      preyEaten++;
      // update prey vision skill or vision range
      if(random()>0.5){
      preyIntel+=preyIntelIncrement;
      preyIntel=constrain(preyIntel, 0, 1);
    } else {
      visionRange+=visionRangeIncrement;
      visionRange=constrain(visionRange, 0, width/3);
    }
    }
  }
}

// movePrey()
//
// Moves the prey based on random velocity changes
function movePrey() {
  // Change the prey's velocity at random intervals
  // random() will be < 0.05 5% of the time, so the prey
  // will change direction on 5% of frames
  /* if (random() < 0.05) {
    // Set velocity based on random values to get a new direction
    // and speed of movement
    // Use map() to convert from the 0-1 range of the random() function
    // to the appropriate range of velocities for the prey
    preyVX = map(random(),0,1,-preyMaxSpeed,preyMaxSpeed);
    preyVY = map(random(),0,1,-preyMaxSpeed,preyMaxSpeed);
  }
  */
  // move up Perlin noise position by increment
  noisePos=noisePos+noiseInc;
  noiseSeed(0);
  // update velocity of prey based on noise value
  preyVX= map(noise(noisePos), 0, 1, -preyMaxSpeed, preyMaxSpeed);
  noiseSeed(1);
  preyVY= map(noise(noisePos), 0, 1, -preyMaxSpeed, preyMaxSpeed);

  // random chance for prey to run away
  // this will overwrite the prey velocity generated above.
 if(random()>=1-preyIntel&&abs(dist(playerX, playerY, preyX, preyY))<visionRange){
   console.log("prey is running away");
if(preyX-playerX!=0&&preyY-playerY!=0){
  preyVX=(preyX-playerX)/abs(preyX-playerX)*0.5*preyMaxSpeed;
  preyVY=(preyY-playerY)/abs(preyY-playerY)*0.5*preyMaxSpeed;
// if prey has leveled up add that teleporty thingy
  if(preyIntel>=preyLevelUp&&millis()>captureTimer&&captureTimerStarted){

    preyX=random(width);
    preyY=random(height);
    preyFill=color(255, 25, 25);
    console.log("ported");
    while(dist(preyX, preyY, playerX, playerY)<visionRange){
      preyX=random(width);
      preyY=random(height);
    }

  }
}

  }



  // Update prey position based on velocity
  preyX += preyVX;
  preyY += preyVY;

  // Screen wrapping
  if (preyX < 0) {
    preyX += width;
  }
  else if (preyX > width) {
    preyX -= width;
  }

  if (preyY < 0) {
    preyY += height;
  }
  else if (preyY > height) {
    preyY -= height;
  }
}

// drawPrey()
//
// Draw the prey as an ellipse with alpha based on health
function drawPrey() {
  fill(preyFill,preyHealth);
  ellipse(preyX,preyY,preyRadius*2);
  stroke(255);
  noFill();
  ellipse(preyX, preyY, visionRange*2);
  noStroke();
  fill(255);
  text("brains: "+round(preyIntel*100), preyX, preyY+preyRadius*3);


}

// drawPlayer()
//
// Draw the player as an ellipse with alpha based on health
function drawPlayer() {
  // fill(playerFill,playerHealth);
  fill(playerFill);
  ellipse(playerX,playerY,playerRadius*2);
  fill(playerFill/2);
  arc(playerX, playerY, playerRadius*2, playerRadius*2, -HALF_PI, map(playerHealth, playerMaxHealth, 0, -HALF_PI, PI+HALF_PI));

}

// showGameOver()
//
// Display text about the game being over!
function showGameOver() {
  textSize(32);
  textAlign(CENTER,CENTER);
  fill(0);
  var gameOverText = "GAME OVER\n";
  gameOverText += "You ate " + preyEaten + " prey\n";
  gameOverText += "before you died."
  text(gameOverText,width/2,height/2);
}
function drawUI(){
fill(255);
textSize(15);
text("score: "+preyEaten, 10, 20);

}
