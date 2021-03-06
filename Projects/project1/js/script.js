/******************************************************

Game - Tail chaser
Samuel Paré-Chouinard

Hello! here's my rendition of the chaser game.

Some context:
You are a dog. your tail is trying to escape your control and you fear it might
disappear forever. you are fated by this primordial stress to chase until the
end of time. enter the cycle of a dog's life.


---- game mechanics:
The idea is to have a few different game mechanics that will make the game harder
over time but also force the player to change his tactic. The first level of difficulty
is reached when the prey starts to run away consistantly. A second level of difficulty
arises when the prey starts to teleport. At first you are just moving right to the prey
in order to capture it; late in the game your only good bet is to drive the prey towards a border
and then use the border wrapping to capture it quickly from the opposide side.

The main mechanics:
- there is a random obstacle which changes location every 10 captures.
- you also get a health bonus every 10 captures
- the maximum possible obstacle size will increase gradually.
- capturing your target causes EITHER its Intellect skill to increase OR Vision Range
- vision range will increase over a long period of time. It will hit a maximum value eventually.
- first the prey slowly figures out how to run away when you enter its vision range. Initially
it thinks about running away 0% of the time.
- it will get better until it decides to run 90% of the time you are inside its vision range.
- at a certain point (70 intel) its intellect will increase more slowly, at which point the prey
learns how to teleport away once it decides you've been too close for too long.
- the time you have before it teleports will slowly decrease.
- prey speed increases slightly with each capture, making it more difficult to trap the prey late in the game, but not at first.
- health bonuses all decrease over time, eventually bringing the most experienced doggo to its knees.


---- music:
- For this project I decided to explore the p5.sound.js library and see if I could use
some basic elements to generate constantly changing music, and create some sound effects as well.

The music is made of three voices.
- one loops a given pattern
- the second voice plays the same pattern with random rhythms
- the third voice is a pulsating noise drum: each drum hit is
filtered with a new random frequency, fills are added to random
offbeats and accents are randomly placed to vary the constant
pulse. together that makes somewhat expressive drum lines.
- the first two voices are transposed up by a half step every 10 captures to
illustrate that the game is moving along.
- i also added a fourth voice for SFX, which plays three different kinds of sound which
i've tied to in-game events (capture, enemy teleport and game over)
- sprinting also affects the sound of the looping voice (by manipulating the delay effect)
- time is calculated in frames (some exceptions)



******************************************************/

// MUSIC VARIABLES

// SYN1 SYN2 SYN3 and SYN4 are OBJECTS CONTAINING PARAMETERS FOR OUR SYNTHS

var syn1={ //syn1: random rhythmic phrases
  // declare type of synth, and type of filter
  synthType: 'square',
  filtAtt: "BP",
  // envelope gain
  attackLevel: 0.8,
  releaseLevel: 0,
  // envelope time
  attackTime: 0.001,
  decayTime: 0.1,
  susPercent: 0.4,
  releaseTime: 0.2,
  // a parameter to store the envelope object
  env:0,
  // a parameter to store the oscillator object
  thisSynth:0,
  // a parameter to store the filter object
  filter:0,
  // filter frequency
  fFreq:400,
  // state no delay
  delayFX:false
}
var syn2={ //syn2: looped synth sound
  // declare type of synth, and type of filter
  synthType: 'square',
  filtAtt: "LP",
  // same basic parameters as syn1
  attackLevel: 0.1,
  releaseLevel: 0,
  attackTime: 0.01,
  decayTime: 0.1,
  susPercent: 0.3,
  releaseTime: 0.1,
  env:0,
  thisSynth:0,
  filter:0,
  fFreq:500,
  // a parameter to store the delay object
  delay:0,
  // delay parameters
  delayFX: true,
  delayLength: 0.16,
  delayFB: 0.3,
  delayFilter: 400,
}
var syn3={ //noise drum
  // declare type of synth, and type of filter
  synthType: 'pink',
  filtAtt: "BP",
  // same basic parameters as syn1
  attackLevel: 0.7,
  releaseLevel: 0,
  attackTime: 0.001,
  decayTime: 0.05,
  susPercent: 0.2,
  releaseTime: 0.2,
  env:0,
  thisSynth:0,
  filter:0,
  fFreq:400,
  // values used to constrain random filter frequency
  filterMin:1000,
  filterMax:4500,
  // a parameter to trigger drums on and off
  drumsOn:true,
  // parameters for trigger timing
  trig:0,
  nextTrig:200,
  // drums "on" duration
  trigOn:500,
  // drums "off" duration
  trigOff:200,
  // state no delay
  delayFX:false
}
var syn4={ //FX synth
  // declare type of synth, and type of filter
  synthType: 'sine',
  filtAtt: "LP",
  attackLevel: 0.4,
  releaseLevel: 0,
  attackTime: 0.001,
  decayTime: 0.6,
  susPercent: 0.4,
  releaseTime: 0.0,
  env:0,
  thisSynth:0,
  // parameters used to trigger the different sfx sounds
  upFX:false,
  downFX: false,
  tremFX: false,
  // length of sfx sounds
  FXlength: 45,
  // sfx trigger timer
  FXtimer: 0,
  // sfx filter
  filter:0,
  fFreq:400,
  // sfx starting frequency
  baseFreq: 650,
  // parameter used to increment the frequency for cool effects
  FXinc:0,
  // state no delay
  delayFX:false
}

// THINGS THAT DEAL WITH TIME

// master clock (time is measured in frames)
var frame=0;
// syn2 needs a var to keep track of loop position
var syn2Loop=0;
// syn1 needs a var to keep track of loop position
var syn1Loop=0;
// nextNote is time until the next syn1 note is triggered
var nextNote=10;
// section length is the number of phrases it contains
// section 1 is syn1 off and section 2 is syn1 on
var section1length=4;
var section2length=4;
// length of syn1 phrase (to which i will assign array.length)
var phraseLength=0;
// number of phrase repetitions
var phraseReps=0;


// THINGS THAT DEAL WITH PITCH

// note transposition factor.
var oct=-12;
// contents of initial phrase
var thisPhrase=[oct+0, oct+4, oct+3, oct+0, oct+8, oct+7, oct+0, oct+5];
// starting root (midi value)
var startRoot=45;
// a variable to keep track of the new transposed root.
var currentRoot=startRoot;
// a variable to convert root note to root frequency
var rootFreq=0;

// EDIT
let soundStarted = false;

//GAME VARIABLES

// SETUP VALUES (declared separately as they will be manipulated then reset)
var initVisionRange=100;
var initPreyMaxSpeed=3.5;
var initPreyMaxHealth=50;
var initHealthBonus=0.5;
var initPlayerRadius=75;
var initPreyRadius=100;
var initTimerLength=2000;
var initPreyIntelIncrement=0.08;

// PLAYER

// Player position, size, velocity
var playerX;
var playerY;
var playerRadius = initPlayerRadius;
var playerVX = 0;
var playerVY = 0;
// normal and sprinting player speed
var normalSpeed = 3;
var sprintSpeed =5;
// initial speed
var playerMaxSpeed = normalSpeed;
// Player health
var playerHealth;
var playerMaxHealth = 1000;
// Rate of health loss
var lossFactor=0.5;
// health bonus awarded for leveling up
var healthBonus=initHealthBonus;
// Rate of health loss while player is sprinting
var sprintLossFactor=1;
// Player fill color
var playerFill = 50;
// var that toggles sprint on and off
var sprintOn=false;

// PREY

// Prey position, size, velocity
var preyX;
var preyY;
var preyRadius = initPreyRadius;
var preyVX;
var preyVY;
var preyMaxSpeed = initPreyMaxSpeed;
// Prey health
var preyHealth;
var preyMaxHealth = initPreyMaxHealth;
// Prey fill color
var normalPreyFill = 200;
var preyFill=normalPreyFill;
var specialPreyFill=100;
// position within a Perlin noise sequence
var noisePos=0;
// rate of change of Perlin noise position
var noiseInc=0.01;
// distance at which the prey might see you
var visionRange=initVisionRange;
// how smart the prey is
var preyIntel=0.1;

// "WIGGLE" (the tail and jaw wiggle animations)

// distance wiggled
var wiggleDist=0;
// variable used to increment the wiggle effect
var wiggleIncrement=0;
// point at which the wiggling part starts to move back
var maxWiggle=20;
// a variable to trigger the wiggle reset
var wiggleReset=0;

// EATING AND LEVELS (PACE OF GAME)

// Track whether the game is over
var gameOver = false;
// Amount of health obtained per frame of "eating" the prey
var eatHealth = 5;
// Number of prey eaten during the game
var preyEaten = 0;
// increment by which prey skills increase upon capture
var preyIntelIncrement=initPreyIntelIncrement;
var preyIntelPlateau=0.7;
var preyMaxIntel=0.9;
var preyIntelFinalIncrement=0.02;
var visionRangeIncrement=3;
// level of prey intel at which prey levels up
var preyLevelUp=preyIntelPlateau;
// number of captures needed to level up
var nextLevel=10;

// PREY TELEPORTING

// teleport timer trigger
var portTimer=0;
// teleport timer length (ms)
var timerLength=initTimerLength;
// used to trigger timer only once
var portTimerStarted=false;
// this avoids me re-writing a dist() function somewhere but tbh i only used it once and could use it more
var playerInVisionRange=false;

// OBSTACLE

// obstacle rectangle configuration
var obsX=100;
var obsY=100;
var obsW=100;
var obsH=100;
// variables used to increase size of obstacle
var obsIncrease=0;
var obsIncrement=50;

// BACKGROUND STUFF

// background color
var bgRed=200;
var bgGreen=100;
var bgBlue=100;
// background ellipse coordinates
var bgEllipseSize=[10];
var bgEllipseX=[10];
var bgEllipseY=[10];



// setup()
//
// Sets up the basic elements of the game
function setup() {

  createCanvas(700,600);

  newBg();
  setupDisplays();

  setupPrey();
  setupPlayer();
  newObstacle();

}

function mousePressed(){

  if(!soundStarted){
    loadAnInstrument(syn1);
    loadAnInstrument(syn2);
    loadAnInstrument(syn3);
    loadAnInstrument(syn4);
    soundStarted = true;
  }

}

// setupdisplays()
// initializes display and color settings
// or really just keep stuff outside of setup()
function setupDisplays(){
  rootFreq=midiToFreq(currentRoot);
  textFont("Courier");
  textStyle(BOLD);
  phraseLength=thisPhrase.length;
  ellipseMode(CENTER);
  rectMode(CORNER);
  noStroke();
  //color
  preyFill=color(25, 200, 75);
  playerFill=color(25, 45, 215);
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
  preyIntel=0;
}

// setupPlayer()
//
// Initialises player position and health
function setupPlayer() {
  preyEaten=0;
  playerX = 4*width/5;
  playerY = height/2;
  playerHealth = playerMaxHealth;
}

// draw()
// While draw is active, play music
// While the game is active, checks input
// updates positions of prey and player,
// checks health (dying), checks eating (overlaps)
// displays the two agents.
// displays the text above the screen
// displays the obstacle
// When the game is over, shows the game over screen.

function draw() {
  //console.log(playerHealth)
  frame+=1;
  if(soundStarted) handleMusic();
  drawBg();

  if (!gameOver) {
    handleInput();
    generateWiggle();
    movePlayer();
    movePrey();
    updateHealth();
    checkRange();
    drawPrey();
    drawPlayer();
    drawObstacle();
    drawUI();
  }
  else {
    showGameOver();
  }

textSize(30);
  if(!soundStarted) text("CLICK TO START SOUND!", width/2-100, height/2);
}

// drawBg()
// draws background and ellipses using values set or reset in newBg()
function drawBg(){
  //
  background(bgRed, bgGreen, bgBlue);
  fill(bgRed+20, bgGreen+20, bgBlue+20);
  for(var i=0; i<10; i++){
    ellipse(bgEllipseX[i], bgEllipseY[i], bgEllipseSize[i], bgEllipseSize[i]);
  }
}

// newBg()
// generates a new background color and random ellipse locations
function newBg(){
  // start with a rather random red value
  bgRed=random(25, 220);
  // 50% chance that green value is its inverse
  if(random()>0.5){
    bgGreen=220-bgRed;
    // in that case set blue to a random low value
    bgBlue=random(25, 60);
  } else {
    // or let blue be the inverse
    bgBlue=220-bgRed;
    // then green will be a random low value
    bgGreen=random(25, 60);
    // this way we have a somewhat constrained color palet.
  }
  // generate random ellipse X and Y pos, and size.
  for (var i=0; i<10; i++){
  bgEllipseX[i]=random(width);
  bgEllipseY[i]=random(height);
  bgEllipseSize[i]=random(width/2);
}
}

// generateWiggle()
// creates the "wiggle" oscillation which animates the avatars
function generateWiggle(){
  // if frame is below reset marker increment the wiggle
  if(frame<=wiggleReset+maxWiggle){
    wiggleIncrement+=1;
  } else {
// if reset marker is reached reset the wiggle motion
     wiggleReset=frame;
     wiggleIncrement=0;
   }
     // apply sin function for smoothe motion
  wiggleDist=sin(PI*wiggleIncrement/maxWiggle)*20;
}

// handleInput()
//
// Checks arrow keys and adjusts player velocity accordingly
// checks for sprint and sends the player sprinting
// fire delay effect when sprinting
function handleInput() {
  // check for shift key press
  if(keyIsDown(SHIFT)){
    // if shift key is pressed, player is sprinting.
    // this triggers a different avatar color for the sprinting player
    sprintOn=true;

    if(soundStarted){
      // while shift it pressed, manipulate the delay object to hear a different sound
      syn2.delayFB=0.7;
      syn2.delayFilter=1500;
      //process the sound
      syn2.delay.process(syn2.thisSynth, syn2.delayLength, syn2.delayFB, syn2.delayFilter);
    }

    // switch speed to sprinting speed
    playerMaxSpeed=sprintSpeed;
    // increase rate of health loss during sprint
    lossFactor=sprintLossFactor;
  } else {
    // if shift is not pressed, player doesn't sprint
    // display regular avatar color
    sprintOn=false;
    if(soundStarted){
      // set delay back to normal settings
      syn2.delayFB=0.3;
      syn2.delayFilter=400;
      syn2.delay.process(syn2.thisSynth, syn2.delayLength, syn2.delayFB, syn2.delayFilter);
    }

    // set speed and health loss to normal settings
    playerMaxSpeed=normalSpeed;
    lossFactor=0.5;
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

  // first we check if the player is close to an obstacle wall:
  // in that case he shouldn't be able to move into the obstacle.
  // the first four elements of the following if statements check proximity to the wall
  // (more specifically it checks for player's presence within a thin rectangle beside the wall),
  // and the last element checks for movement towards the wall.
  // if all the conditions are met, movement command is prevented.

  //if close to left obstacle wall, can't move right.
  if(playerX-playerVX<obsX && playerX+playerVX>obsX-playerRadius/3 && playerY>obsY-10 && playerY<obsY+obsH+10 && playerVX>0){
  playerVX=0;
}
//if close to right obstacle wall, can't move left.
else if(playerX+playerVX>obsX+obsW && playerX+playerVX<obsX+obsW+playerRadius/3 && playerY>obsY-10 && playerY<obsY+obsH+10 && playerVX<0){
playerVX=0;
}
// if close to top wall, can't move down
else if(playerY+playerVY<obsY && playerY+playerVY>obsY-playerRadius/3 && playerX>obsX-10 && playerX<obsX+obsW+10 && playerVY>0){
playerVY=0;
}
//if close to bottom obstacle wall, can't move up
else if(playerY+playerVY>obsY+obsH && playerY+playerVY<obsY+obsH+playerRadius/3 && playerX>obsX-10 && playerX<obsX+obsW+10 && playerVY<0){
playerVY=0;
}

// move player
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
// play game over sound if that's the case
function updateHealth() {
  // Reduce player health, constrain to reasonable range
  playerHealth = constrain(playerHealth - 0.5*lossFactor,0,playerMaxHealth);
  // Check if the player is dead
  if (playerHealth === 0) {
    // If so, the game is over
    gameOver = true;
   // trigger game over sound
   triggerDownFX();
  }
}


// checkRange()
// formerly known as checkEating()
// Check if player overlaps with vision range and trigger prey's teleport timer
// (the actual prey position will be updated in move prey)
// Check if the player overlaps the prey and updates health of both
function checkRange() {

  // Get distance of player to prey
  var d = dist(playerX,playerY,preyX,preyY);
  // first we see if prey should teleport out
  // if player is within vision range and prey has reached 2nd level of intellect
  if (d< visionRange&&preyIntel>preyLevelUp){
    // indicate that player is in range
    playerInVisionRange=true;
    // check if timer had started (used to fire it only once)
    if(!portTimerStarted){
      // set timer limit. if limit is reached, prey teleports
    portTimer=millis()+timerLength;
    // indicate a timer was started
    portTimerStarted=true;
    timerLength-=10;
    timerLength=constrain(timerLength, 800, 2000);
  }
  } else {
    // if player is out of range
    // set boolean off
    playerInVisionRange=false;
    // reset timer
    portTimer=0;
    portTimerStarted=false;
}
  // now check for eating
  // Check if it's an overlap
  if (d < (playerRadius + preyRadius)/2) {
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
      // Pick new bg color
      newBg();
      // update preySpeed
      preyMaxSpeed+=0.005;
      //update music
      if(preyEaten%nextLevel===0){
      levelUp();
      }
      // trigger FX
      triggerUpFX();
      // update prey vision skill or vision range
      if(random()>0.55){
        // chance to increase intellect skill
        if(preyIntel>preyIntelPlateau){
          preyIntelIncrement=preyIntelFinalIncrement;
        }
      preyIntel+=preyIntelIncrement;
      preyIntel=constrain(preyIntel, 0, preyMaxIntel);

    } else {
      // chance to increase vision range
      visionRange+=visionRangeIncrement;
      visionRange=constrain(visionRange, 0, 0.35*width);
    }
    }
  }
}


// movePrey()
//
// Moves the prey based on perlin noise function
// constrain movement of prey away from the borders unless the player is in vision range
// move prey away from player if player is in vision range and depending on intel skill
// if teleport timer is over, teleport the prey
// handle border wrapping
function movePrey() {

  // move up Perlin noise position by increment
  noisePos=noisePos+noiseInc;
  noiseSeed(0);
  // update velocity of prey based on noise value
  preyVX= map(noise(noisePos), 0, 1, -preyMaxSpeed, preyMaxSpeed);
  noiseSeed(1);
  preyVY= map(noise(noisePos), 0, 1, -preyMaxSpeed, preyMaxSpeed);

  //if prey is close to edges, overwrite speed to move towards the center
  // unless player is within vision range

  if(abs(dist(playerX, playerY, preyX, preyY))>visionRange){
    // check if prey is near left wide of the screen
  if(preyX<0.1*width){
    // manipulate speed to send prey towards the right
    preyVX=abs(preyVX);
  }
  // check for right side
  if(preyX>0.9*width){
    // send to left
    preyVX=-abs(preyVX);
  }
  //check for top of the screen
  if(preyY<0.1*height){
    preyVY=abs(preyVY);
  }
  // check for bottom of the screen
  if(preyY>0.9*height){
    preyVY=-abs(preyVY);
  }
}
  // random chance for prey to run away
  // chance increases with intel skill (that's this part: if random()>1-preyIntel )
  // player must be in vision range
 if(random()>=1-preyIntel&&playerInVisionRange){
   console.log("prey is running away");
   // preyX-playerX=0 would break the division that follows so rule it out.
if(preyX-playerX!=0&&preyY-playerY!=0){
  // send the prey away from the player
  preyVX=(preyX-playerX)/abs(preyX-playerX)*preyMaxSpeed;
  preyVY=(preyY-playerY)/abs(preyY-playerY)*preyMaxSpeed;
// if prey teleport timer has reached its end
  if(millis()>portTimer&&portTimerStarted){
    // pick a random position for the prey
    preyX=random(width);
    preyY=random(height);
    // trigger SFX
    triggerTremFX();
    console.log("ported");
    // if prey has moved in range of player
    while(dist(preyX, preyY, playerX, playerY)<visionRange){
      // move to another place
      preyX=random(width);
      preyY=random(height);
    }
  }
}
  }
  // finally, move the prey!
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
// Draw the dog body
// wiggle the tail
// draw the health bar
function drawPrey() {
  //PREY
  //draw vision range
  fill(225, 125);
  ellipse(preyX, preyY, visionRange*2, visionRange*2);
  // draw white backdrop
  fill(255);
  ellipse(preyX, preyY, 1.2*preyRadius, 1.2*preyRadius);
  //draw health bar
  fill(200, 85, 15);
  arc(preyX, preyY, 1.15*preyRadius, 1.15*preyRadius, 0, preyHealth/preyMaxHealth*1.99*PI);
  // encasehealth bar
  fill(255);
  ellipse(preyX, preyY, 1.05*preyRadius, 1.05*preyRadius);
  // pick backdrop color
  fill(preyFill);
  // if teleport timer active
  if(portTimer&&portTimerStarted){
    fill(255);
    var timerleft=round(abs(millis()-portTimer)/300);
    textSize(visionRange/2-10);
    // display countdown
    text(timerleft, preyX, preyY+preyRadius);
    // change prey color
    fill(225, 25, 25);
  }
  // display color backdrop
  ellipse(preyX, preyY, preyRadius, preyRadius);
  // draw body
  fill(255, 204, 137);
  rect(preyX, preyY-0.15*preyRadius, -0.45*preyRadius, 0.3*preyRadius);
  arc(preyX-0.225*preyRadius, preyY-0.14*preyRadius, 0.5*preyRadius, 0.1*preyRadius, PI, 0);
  arc(preyX, preyY, preyRadius, preyRadius,0.85*PI, 1.1*PI);
  ellipse(preyX, preyY, preyRadius/4, preyRadius/2);
  ellipse(preyX-0.1*preyRadius, preyY, 0.2*preyRadius, 0.45*preyRadius);
  rect(preyX-0.02*preyRadius, preyY, preyRadius/16, 0.4*preyRadius);
  rect(preyX-0.12*preyRadius, preyY, 3*preyRadius/64, 0.4*preyRadius);
  arc(preyX-0.02*preyRadius, preyY+0.40*preyRadius, preyRadius/16, preyRadius/16, PI, 1.5*PI);
  arc(preyX-0.12*preyRadius, preyY+0.4*preyRadius, preyRadius/16, preyRadius/16, PI, 1.5*PI);
  //wiggling tail
  triangle(preyX-preyRadius/16, preyY-preyRadius/8, preyX+preyRadius/16, preyY-preyRadius/8, preyX+wiggleDist, preyY-3*preyRadius/8);


}

//Draw obstacle
function drawObstacle(){
  stroke(255);
  strokeWeight(5);
  fill(bgRed-25, bgGreen-25, bgBlue-25);
  rect(obsX, obsY, obsW, obsH);
  noStroke();
}

// drawPlayer()
// draw the dog head
// draw the wiggling jaw
// draw the health bar
function drawPlayer() {
  // fill(playerFill,playerHealth);


  //PLAYER - HEAD
  //white backdrop
  fill(255);
  ellipse(playerX, playerY, 1.2*playerRadius, 1.2*playerRadius);
  // health bar
  fill(200, 85, 15);
  arc(playerX, playerY, 1.15*playerRadius, 1.15*playerRadius, 0, playerHealth/playerMaxHealth*1.99*PI);
  // encasing health bar
  fill(255);
  ellipse(playerX, playerY, 1.05*playerRadius, 1.05*playerRadius);
  // pick backdrop color
  fill(playerFill);
  // if sprint is on change color
    if(sprintOn){fill(180, 180, 10);}
    //display color backdrop
  ellipse(playerX, playerY, playerRadius, playerRadius);
  //draw head
  fill(255, 204, 137);
  noStroke();
  var triWidth=playerRadius/8;
  var triHeight=playerRadius/8;
  quad(playerX, playerY, playerX+triWidth/4, playerY-triHeight,playerX+3*triWidth/4, playerY-triHeight, playerX+triWidth, playerY);
  quad(playerX+triWidth, playerY, playerX+1.25*triWidth, playerY-triHeight, playerX+1.75*triWidth, playerY-triHeight, playerX+2*triWidth, playerY);
  //draw wiggling ears
  // the ears wiggle repending on left/right and up/down motion
  if(playerVX>0){
    // if player moving right wiggle first ear one way
    triangle( playerX+triWidth/4, playerY-triHeight, playerX+triWidth/8, playerY-1.75*triHeight,playerX+3*triWidth/4, playerY-triHeight )

  } else if (playerVX<0){
    // if player moving left wiggle first ear the other way
    triangle( playerX+triWidth/4, playerY-triHeight, playerX+0.85*triWidth, playerY-1.75*triHeight,playerX+3*triWidth/4, playerY-triHeight )

  } else {
    // if player not moving on horizontal axis dont wiggle
    triangle( playerX+triWidth/4, playerY-triHeight, playerX+triWidth/2, playerY-2*triHeight,playerX+3*triWidth/4, playerY-triHeight );
  }
  if(playerVY>0){ // if player moves down wiggle ear
    triangle( playerX+5*triWidth/4, playerY-triHeight, playerX+1.125*triWidth, playerY-1.75*triHeight,playerX+7*triWidth/4, playerY-triHeight )

  } else if (playerVY<0){ //if player moves up wiggle ear
    triangle( playerX+5*triWidth/4, playerY-triHeight, playerX+1.85*triWidth, playerY-1.75*triHeight,playerX+7*triWidth/4, playerY-triHeight )

  } else { // if player not moving on vertical axis dont wiggle
    triangle( playerX+5*triWidth/4, playerY-triHeight, playerX+1.375*triWidth, playerY-2*triHeight,playerX+7*triWidth/4, playerY-triHeight );
  }
  //draw the rest of the face
  arc(playerX+playerRadius/4, playerY, playerRadius/2, playerRadius/8, PI, 0);
  rect(playerX, playerY, 3*playerRadius/8, playerRadius/4);
  arc(playerX, playerY, playerRadius, playerRadius, 0, 0.3*PI)
  quad(playerX, playerY, playerX, playerY+3*playerRadius/16, playerX-0.35*playerRadius, playerY+3*playerRadius/16-wiggleDist/3, playerX-0.35*playerRadius, playerY+playerRadius/8-wiggleDist/3);
  quad(playerX+playerRadius/4-wiggleDist, playerY+0.2*playerRadius, playerX-0.30*playerRadius, playerY+playerRadius/4+wiggleDist/2, playerX-0.3*playerRadius, playerY+0.3*playerRadius+wiggleDist/2, playerX+0.275*playerRadius+wiggleDist/2, playerY+0.35*playerRadius-wiggleDist/2);
// draw eyeball
  fill(25);
  ellipse(playerX+playerRadius/8, playerY+playerRadius/16, playerRadius/16, playerRadius/16);

}

// showGameOver()
//
// Display text about the game being over!
// make a fun end game display
function showGameOver() {
  textSize(20);
  textAlign(CENTER,CENTER);
  fill(0);
  // display game over text
  var gameOverText = "GAME OVER! ";
  gameOverText += "You found your tail " + preyEaten + " times\n";
  text(gameOverText,width/2,height/2+32);
  // display game over instructions
  text("press 4 to reset. 1-3: SFX. arrow keys: ears", width/2, height-32);
  // set player icon at the top of the screen
  playerX=width/2;
  playerY=150;
  playerRadius=200;
  // set prey at bottom of the screen
  visionRange=50;
  preyX=width/2;
  preyY=height-150;
  // fire display functions
  generateWiggle();
  handleInput();
  drawPlayer();
  // make sure we are not moving
  preyVX=0;
  preyVY=0;
  drawPrey();
  playerVX=0;
  playerVY=0;
}

// displays informational text on top of the screen
function drawUI(){
  //stylize text
fill(255);
textSize(15);
textAlign(LEFT);
// pick either regular text
var scoreText="score: "+preyEaten+", enemy vision: "+round(visionRange)+", enemy brains: "+round(preyIntel*100);
// check if sprint is active
if(sprintOn){
  // or this text which displays that sprint is active
  scoreText="score: "+preyEaten+", enemy vision: "+round(visionRange)+", enemy brains: "+round(preyIntel*100)+" ..SPRINT ACTIVE!";
}
//display text
text(scoreText, 10, 20);

}

// this function bunches together functions to fire upon leveling up (capturing 10)
// updates health bonus received upon eating, etc.
function levelUp(){
  //give player some health
  playerHealth+=healthBonus*playerMaxHealth;
  healthBonus-=0.03;
  playerHealth = constrain(playerHealth,0,playerMaxHealth);
  preyMaxHealth-=4;
  preyMaxHealth=constrain(preyMaxHealth, 20, 50);
  console.log("new prey health: "+preyHealth);
  console.log("new health bonus: "+healthBonus*playerMaxHealth);
  // randomize the obstacle
  newObstacle();
  // transpose music
  rootPlus();
}

// this function randomizes obstacle configuration
function newObstacle(){
  // first generate width. overall size increases with obsIncrease.
  obsW=random(10, 200+obsIncrease);
  // derive height from width, keeping the obstacle contained
  obsH=200+obsIncrease-obsW;
  // pick suitable X and Y coordinates
  obsX=random(10, width-10-obsW);
  obsY=random(25, height-10-obsH);
  // increase size of next obstacle
  obsIncrease+=obsIncrement;
}


// loadAnInstrument();
// This function is meant to load any of the four instruments used
// it is meant to replace the overarching "loadInstruments()" function which
// i had originally written, which loaded everything individually and resulted
// in almost 4x the text.
function loadAnInstrument(synx){
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
  if(synx.synthType!='pink'){synx.thisSynth.freq(rootFreq);
  }
  // if delayFX is true, then there is also a delay object to load
  if(synx.delayFX){
    synx.delay = new p5.Delay();
    synx.delay.process(synx.thisSynth, synx.delayLength, synx.delayFB, synx.delayFilter);
  }
}



// handleMusic()
// a home for the the music handling functions

function handleMusic(){

  handleDrums();
  handleSynth1();
  handleSynth2();
  handleFX();

}

function handleFX(){
  // FX TRIGGERS
  // there are three FX triggers. they are fired by switching a boolean on,
  // which in turn starts a timer and switches the boolean off. this way I
  // am sure the sound FX are fired only once when they are supposed to.

  // if upFX is triggered

  if(syn4.upFX){
    // for the duration of the FX timer
    if(frame<syn4.FXtimer){
      // use FXinc(rement) to keep track of time during the FX
      syn4.FXinc+=1;
      // increase frequency by increment
      syn4.thisSynth.freq(syn4.baseFreq+5*syn4.FXinc);
      // play syn4
    //  syn4.env.play();
    } else {
      // if timer is over stop syn4
      syn4.upFX=false;
    }
  }
  if(syn4.downFX){
    // trigger down effect
    if(frame<syn4.FXtimer){
      syn4.FXinc+=1;
      // increment frequency downward
      syn4.thisSynth.freq(syn4.baseFreq-5*syn4.FXinc);
      //play syn4
      // syn4.env.play();
    } else {
      // stop syn4
      syn4.downFX=false;
    }
  }
  if(syn4.tremFX){
    // trigger tremolo effect
    // FYI "tremolo" means rapidly alternating two separate pitches
    // this is not exactly a tremolo since the pitches change over time but hey
    if(frame<syn4.FXtimer){
      // start incrementing the increment variable
      syn4.FXinc+=1;
      // alternate between adding and subtracting the increment.
      // change pitch only when the increment is a multiple of 4 (or 8)
      if(syn4.FXinc%8===0){
        syn4.thisSynth.freq(syn4.baseFreq+5*syn4.FXinc);
      } else if(syn4.FXinc%4===0) {
        syn4.thisSynth.freq(syn4.baseFreq-5*syn4.FXinc);
      }
      // play syn4. syn4 will actually get played again every 4 frames in this case.
      // but it sounds nice that way okay
      syn4.env.play();
    } else {
    //  stop syn4
      syn4.tremFX=false;
    }
  }
}
function handleSynth2(){

    // SYN2 LOOP
    if(frame%10===0){
      // PLAY SYN2 FOLLOWING SAME 10 FRAME PULSE
      // pick out the current note from the Phrase (list)
      var newNote =midiToFreq(currentRoot+thisPhrase[syn2Loop]-oct);
      // set frequency
      syn2.thisSynth.freq(newNote);
      // play syn2
       syn2.env.play();
       // INCREMENT LOOP
         syn2Loop+=1;
         // RESET LOOP
           if(syn2Loop===phraseLength+5){syn2Loop=0;}
    }
}

function handleSynth1(){
  // SYN1 TRIGGERS
    if(frame===nextNote){
      // RANDOMLY ALTERNATE RHYTHM
      if(random()>0.5){
        nextNote=frame+30;
      } else { nextNote=frame+10;
      }
      // TRIGGER NOTE FUNCTION

      // TRIGGERS SYN1 ON AND OFF
      //INCREMENT LOOP
    syn1Loop+=1;
    // COUNT SECTIONS
    if(syn1Loop===phraseLength){syn1Loop=0; phraseReps+=1;}
    // RESET SECTIONS LOOP
    if(phraseReps>section1length+section2length-1){
      phraseReps=0;
      // ON RESET SET NEW RANDOM SECTION SIZE
      // silent section
      section1length=random(1,2);
      // playing section
      section2length=random(1,6);
    }
    // IF SYN1 IS OFF, RETURN
    if(phraseReps<section1length){
      return;
      }
      // OR ELSE PLAY NOTES
      var newNote = midiToFreq(currentRoot+thisPhrase[syn1Loop]);
    syn1.thisSynth.freq(newNote);
    // play syn1
    syn1.env.play();
  }
}

function handleDrums(){

     // DRUM TRIGGERS
    /////////// THIS TRIGGERS DRUM PART ON AND OFF

    // if we pass syn3's trigger value
    if(frame>syn3.trig){
      // toggle drum on/off sections
      syn3.drumsOn=!syn3.drumsOn;
      // if syn3 is on
      if(syn3.drumsOn){
        // set duration of this drum break
        syn3.nextTrig=syn3.trigOn;
      }else{
        // if sin3 is off set duration of the silence
        syn3.nextTrig=syn3.trigOff;
      }
      // set the next section trigger
      syn3.trig=frame+syn3.nextTrig;
    }

    /////////////// THIS TRIGGERS INDIVIDUAL DRUM NOTES
    if(syn3.drumsOn){
      // STEADY 10 FRAME PULSATION
      if(frame%10==0){
      // SET RANDOM FILTER Value
        syn3.filter.freq(random(syn3.filterMin, syn3.filterMax));
        // ON BEAT PLAY EITHER LONG NOTES (ACCENTS) OR REGULAR NOTES
        if(random()<0.6){
          //LONG
          syn3.env.setADSR(syn3.attackTime,0.9, 0.8, 1);
          syn3.env.setRange(syn3.attackLevel+0.1, syn3.releaseLevel);
          // play syn3
          syn3.env.play();
          //REGULAR
          syn3.env.setADSR(syn3.attackTime, syn3.decayTime, syn3.susPercent, syn3.releaseTime);
          syn3.env.setRange(syn3.attackLevel, syn3.releaseLevel);
        } else{
          // play syn3
          syn3.env.play();}
    }
    if(random()>0.6){
      if(frame%5===0){
        // PLAY FILLS ON THE OFFBEAT SOMETIMES
        //play syn3
        syn3.env.play();
      }
    }
    }
}


//KEY TRIGGERS
// these were used to trigger sounds for test purposes,
// as well as the reset command..
// see no reason to remove it
function keyPressed(){
  if(key==="1"){
    triggerUpFX();
  }
  if(key==='2'){
    triggerDownFX();
  }
  if(key==='3'){
    triggerTremFX();
  }
  if(key==='4'){
    resetEverything();
  }
}

// THE FOLLOWING THREE functions
// are used to prepare (reset) syn4 before firing the SFX
// the env.play() method is fired here rather than inside the handleFX() function,
// because handleFX repeats with a slight difference everytime, i don't actually want
// to fire play multiple amplitude envelopes, just change the frequency within ONE envelope.
// this does not apply to the tremolo effect though. i want that one to be longer.
function triggerUpFX(){
  // reset increment
  syn4.FXinc=0;
  // set timer to current frame value + length of timer
  syn4.FXtimer=frame+syn4.FXlength;
  // start playing the envelope
  syn4.env.play();
  // indicate that we've started this sound.
  syn4.upFX=true;

}
// see triggerupfx description
function triggerDownFX(){
  syn4.FXinc=0;
  syn4.FXtimer=frame+syn4.FXlength;
  syn4.env.play();
  syn4.downFX=true;
}
// see triggerupfx description
function triggerTremFX(){
  syn4.FXinc=0;
  syn4.FXtimer=frame+syn4.FXlength;
  // env.play() is not fired here. it is located in the handleFX function.
  syn4.tremFX=true;
}

// MOVE ROOT ONE HALF STEP UP
// AND CHANGES MUSICAL IDEA
function rootPlus(){
  // move root up a half step
  currentRoot+=1;
  console.log("root"+currentRoot);
  // if root has reached a ceiling, reset to initial root
  if(currentRoot>=startRoot+20){
    currentRoot=startRoot;
  }
  // alternate between two musical phrases
  if(currentRoot%2===0){
  thisPhrase=[oct+0, oct+2, oct+3, oct+0, oct+5, oct+7, oct+0, oct+3];
} else {
  thisPhrase=[oct+0, oct+4, oct+3, oct+0, oct+8, oct+7, oct+0, oct+5];
}
}

// function used to reset game
function resetEverything(){
  newBg();
  setupPrey();
  setupPlayer();
  obsIncrease=0;
  newObstacle();
  gameOver=false;
  visionRange=initVisionRange;
  preyMaxSpeed=initPreyMaxSpeed;
  preyMaxHealth=initPreyMaxHealth;
  healthBonus=initHealthBonus;
  playerRadius=initPlayerRadius;
  preyRadius=initPreyRadius;
  timerLength=initTimerLength;
  preyIntelIncrement=initPreyIntelIncrement;
  preyIntel=0;
  wiggleReset=0;
  wiggleDist=0;
  wiggleIncrement=0;

}
