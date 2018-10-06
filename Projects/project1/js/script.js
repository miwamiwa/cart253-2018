/******************************************************

Game - Chaser
Pippin Barr

A simple game of cat and mouse.

Physics-based movement, keyboard controls, health/stamina,
sprinting, random movement, screen wrap.


Samuel Paré-Chouinard

---- two major game mechanics:
- a random obstacle blocks your way but not your enemy's. the obstacle increases in size and
gets a new random shape every 10 captures.
- the enemy gets "smarter" progressively. upon capture either his vision range or his
intellect will increase. Higher intellect will lead him to run away more readily when
the player enters his field of vision. And at a certain level of intellect, the enemy
teleports away if the player stays too long in close range.

---- music:
- For this project I decided to explore the p5.sound.js library and see if I could use
some basic elements to generate background music (bgm). what we have here is a sequence
of notes played at different rhythms in two voices; one is a loop and the other comes
in and out with random rhythms. The third voice is a noise drum: each drum hit is
filtered with a new random frequency, fills are added to random offbeats and accents
are randomly placed to pace the constant pulse.
- the first three voices are transposed up by a half step every time the player "levels up"
(meaning a new random obstacle is generated)
- i also added a fourth voice for SFX, which plays three different kinds of sound which
i've tied to in game events (capture, enemy teleport and game over)

time is calculated in frames throughout




******************************************************/
// music variables
// four synth objects, one for each oscillator used for bgm (syn1,syn2 and syn3) and sfx (syn4)
var syn1={ //syn1: random rhythmic phrases
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
  fFreq:400
}
var syn2={ //syn2: looped synth sound
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
    delayLength: 0.16,
    delayFB: 0.3,
    delayFilter: 400,

}
var syn3={ //noise drum
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
    trigOff:200
}
var syn4={ //FX synth
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
  FXinc:0
}

// syn1 goes on and off, and so it is divided in phrases.
// of course because syn1 has random rhythm, each phrase has a different length

// note transposition factor.
var oct=-12;
// number of phrase repetitions
var phraseReps=0;
// length of syn1 phrase (to which i will assign array.length)
var phraseLength=0;
// contents of initial phrase
var thisPhrase=[oct+0, oct+4, oct+3, oct+0, oct+8, oct+7, oct+0, oct+5];
// section length is the number of phrases it contains
// section 1 is syn1 off and section 2 is syn1 on
var section1length=4;
var section2length=4;
// syn2 needs a var to keep track of loop position
var syn2Loop=0;

// master clock (time is measured in frames)
var frame=0;
// starting root (midi value)
var startRoot=45;
// a variable to keep track of the new transposed root.
var currentRoot=startRoot;
// nextNote is time until the next syn1 note is triggered
var nextNote=10;
// syn1loop is used to measure position within the syn1 phrase
var syn1Loop=0;

//GAME VARIABLES
// Track whether the game is over
var gameOver = false;

// Player position, size, velocity
var playerX;
var playerY;
var playerRadius = 25;
var playerVX = 0;
var playerVY = 0;
// normal and sprinting player speed
var normalSpeed = 2;
var sprintSpeed =4;
// initial speed
var playerMaxSpeed = normalSpeed;

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

// teleport timer trigger
var portTimer=0;
// teleport timer length (ms)
var timerLength=1000;
// used to trigger timer only once
var portTimerStarted=false;
// used to trigger nothing really but i might use it
var playerInVisionRange=false;
// number of captures needed to level up
var nextLevel=10;
// obstacle rectangle configuration
var obsX=100;
var obsY=100;
var obsW=100;
var obsH=100;
// variables used to increase size of obstacle
var obsIncrease=0;
var obsIncrement=50;


// setup()
//
// Sets up the basic elements of the game
function setup() {
  createCanvas(500,500);
  noStroke();

  loadInstruments();
  setupPrey();
  setupPlayer();
  newObstacle();

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
  frame=0;
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
// When the game is over, shows the game over screen.

function draw() {
  frame+=1;
  handleMusic();
  background(100,100,200);

  if (!gameOver) {
    handleInput();

    movePlayer();
    movePrey();

    updateHealth();
    checkEating();

    drawPrey();
    drawPlayer();
    drawObstacle();
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
    // if shift key is pressed, player is sprinting.
    // this triggers a different avatar color for the sprinting player
    sprintOn=true;
    // while shift it pressed, manipulate the delay object to hear a different sound
    syn2.delayFB=0.7;
    syn2.delayFilter=1500;
    //process the sound
    syn2.delay.process(syn2.thisSynth, syn2.delayLength, syn2.delayFB, syn2.delayFilter);
    // switch speed to sprinting speed
    playerMaxSpeed=sprintSpeed;
    // increase rate of health loss during sprint
    lossFactor=sprintLossFactor;
  } else {
    // if shift is not pressed, player doesn't sprint
    // display regular avatar color
    sprintOn=false;
    // set delay back to normal settings
    syn2.delayFB=0.3;
    syn2.delayFilter=400;
    syn2.delay.process(syn2.thisSynth, syn2.delayLength, syn2.delayFB, syn2.delayFilter);
    // set speed and health loss to normal settings
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

  // first we check if the player is close to an obstacle wall
  // in that case he can't move into the obstacle
  // the first four elements of the if statements check proximity to the wall,
  // and the last element checks for movement towards the wall
  // if all the conditions are met movement is prevented.

  //if close to left obstacle wall can't move right.
  if(playerX+playerVX<obsX && playerX+playerVX>obsX-playerRadius && playerY>obsY-10 && playerY<obsY+obsH+10 && playerVX>0){
  playerVX=0;
}
//if close to right obstacle wall can't move left.
if(playerX+playerVX>obsX+obsW && playerX+playerVX<obsX+obsW+playerRadius && playerY>obsY-10 && playerY<obsY+obsH+10 && playerVX<0){
playerVX=0;
}
// if close to top wall cant move down
if(playerY+playerVY<obsY && playerY+playerVY>obsY-playerRadius && playerX>obsX-10 && playerX<obsX+obsW+10 && playerVY>0){
playerVY=0;
}
//if close to bottom obstacle wall can't move up
if(playerY+playerVY>obsY+obsH && playerY+playerVY<obsY+obsH+playerRadius && playerX>obsX-10 && playerX<obsX+obsW+10 && playerVY<0){
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

// checkEating()
// Check if player overlaps with vision range and trigger prey's teleport timer
// (the actual prey position will be updated in move prey)
// Check if the player overlaps the prey and updates health of both
function checkEating() {
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
      //update music
      if(preyEaten%nextLevel===0){
      levelUp();
      }
      // trigger FX
      triggerUpFX();
      // update prey vision skill or vision range
      if(random()>0.5){
        // chance to increase intellect skill
      preyIntel+=preyIntelIncrement;
      preyIntel=constrain(preyIntel, 0, 1);
    } else {
      // chance to increase vision range
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
  /*
    // Set velocity based on random values to get a new direction
    // and speed of movement
    // Use map() to convert from the 0-1 range of the random() function
    // to the appropriate range of velocities for the prey

    constrain movement of prey away from the borders unless the player is nearby

  */
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
  // this will overwrite the prey velocity generated above.
  // prey has a random chance of knowing to run away
  // the likeliness of this event increases with intellect
  // the following if statement checks if the prey will run away,
  // and also if player is within vision range
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
// Draw the prey as an ellipse with alpha based on health
function drawPrey() {
  fill(preyFill,preyHealth);
    if(portTimer&&portTimerStarted){
      fill(225, 25, 25);
    }
  ellipse(preyX,preyY,preyRadius*2);
  noStroke();
  fill(255, 25);
  ellipse(preyX, preyY, visionRange*2);
  noStroke();
  fill(255);
  text("brains: "+round(preyIntel*100), preyX, preyY+preyRadius*3);
  if(portTimer&&portTimerStarted){
    fill(255);
    var timerleft=round(abs(millis()-portTimer)/300);
    text(timerleft, preyX, preyY);
  }


}
//Draw obstacle
function drawObstacle(){
  fill(0);
  rect(obsX, obsY, obsW, obsH);
}
// drawPlayer()
//
// Draw the player as an ellipse with alpha based on health
function drawPlayer() {
  // fill(playerFill,playerHealth);

  fill(playerFill);
  if(sprintOn){fill(180, 180, 10);}
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
textAlign(LEFT);
var scoreText="score: "+preyEaten+", enemy vision: "+round(visionRange)+", enemy brains: "+round(preyIntel*100);
if(sprintOn){
  scoreText="score: "+preyEaten+", enemy vision: "+round(visionRange)+", enemy brains: "+round(preyIntel*100)+" ..SPRINT ACTIVE!";

}
text(scoreText, 10, 20);

}
function levelUp(){
  newObstacle();
  rootPlus();
}

function newObstacle(){
  obsW=random(10, 200+obsIncrease);
  obsH=200+obsIncrease-obsW;
  obsX=random(10, width-10-obsW);
  obsY=random(10, height-10-obsH);
  obsIncrease+=obsIncrement;
}

function loadInstruments(){
  phraseLength=thisPhrase.length;


  syn1.env = new p5.Env();
  syn2.env = new p5.Env();
  syn3.env = new p5.Env();
  syn4.env = new p5.Env();
  syn1.env.setADSR(syn1.attackTime, syn1.decayTime, syn1.susPercent, syn1.releaseTime);
  syn1.env.setRange(syn1.attackLevel, syn1.releaseLevel);
  syn2.env.setADSR(syn2.attackTime, syn2.decayTime, syn2.susPercent, syn2.releaseTime);
  syn2.env.setRange(syn2.attackLevel, syn2.releaseLevel);
  syn3.env.setADSR(syn3.attackTime, syn3.decayTime, syn3.susPercent, syn3.releaseTime);
  syn3.env.setRange(syn3.attackLevel, syn3.releaseLevel);
  syn4.env.setADSR(syn4.attackTime, syn4.decayTime, syn4.susPercent, syn4.releaseTime);
  syn4.env.setRange(syn4.attackLevel, syn4.releaseLevel);

  syn1.filter = new p5.BandPass();
  syn2.filter = new p5.LowPass();
  syn3.filter = new p5.BandPass();
    syn4.filter = new p5.LowPass();
  syn2.filter.freq(syn2.fFreq);
  syn3.filter.freq(syn3.fFreq);
    syn4.filter.freq(syn4.fFreq);
  //no syn4 filter because it's a sine wave

  var rootFreq=midiToFreq(currentRoot);

  syn1.thisSynth=new p5.Oscillator('square');
  syn1.thisSynth.amp(syn1.env);
  syn1.thisSynth.disconnect();
  syn1.thisSynth.connect(syn1.filter);
  syn1.thisSynth.start();
  syn1.thisSynth.freq(rootFreq);

  syn2.thisSynth = new p5.Oscillator('square');
  syn2.thisSynth.amp(syn2.env);
  syn2.thisSynth.disconnect();
  syn2.thisSynth.connect(syn2.filter);
  syn2.thisSynth.start();
  syn2.thisSynth.freq(rootFreq);
  syn2.delay = new p5.Delay();
  syn2.delay.process(syn2.thisSynth, syn2.delayLength, syn2.delayFB, syn2.delayFilter);

  syn3.thisSynth = new p5.Noise('pink');
  syn3.thisSynth.amp(syn3.env);
  syn3.thisSynth.disconnect();
  syn3.thisSynth.connect(syn3.filter);
  syn3.thisSynth.start();

  syn4.thisSynth=new p5.Oscillator();
  syn4.thisSynth.amp(syn4.env);
  syn4.thisSynth.disconnect();
  syn4.thisSynth.connect(syn4.filter);
  syn4.thisSynth.start();
  syn4.thisSynth.freq(rootFreq);
}

function handleMusic(){

  // DRUM TRIGGERS
  // THIS TRIGGERS DRUM PART ON AND OFF
  if(frame>syn3.trig){
    syn3.drumsOn=!syn3.drumsOn;
    if(syn3.drumsOn){
      syn3.nextTrig=syn3.trigOn;
    }else{
      syn3.nextTrig=syn3.trigOff;
    }
    syn3.trig=frame+syn3.nextTrig;
  }
  // THIS TRIGGERS DRUM NOTES
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
        syn3.env.play();
        //REGULAR
        syn3.env.setADSR(syn3.attackTime, syn3.decayTime, syn3.susPercent, syn3.releaseTime);
        syn3.env.setRange(syn3.attackLevel, syn3.releaseLevel);
      } else{syn3.env.play();}
  }
  if(random()>0.6){
    if(frame%5===0){
      // PLAY FILLS ON THE OFFBEAT SOMETIMES
      syn3.env.play();
    }
  }
  }

  // SYN2 LOOP
  if(frame%10===0){
    // PLAY SYN2 FOLLOWING SAME 10 FRAME PULSE
    var newNote =midiToFreq(currentRoot+thisPhrase[syn2Loop]-oct);
    syn2.thisSynth.freq(newNote);
     syn2.env.play();
     // INCREMENT LOOP
       syn2Loop+=1;
       // RESET LOOP
         if(syn2Loop===phraseLength+5){syn2Loop=0;}
  }

  // SYN1 TRIGGERS
    if(frame===nextNote){
      // RANDOMLY ALTERNATE RHYTHM
      if(random()>0.5){
        nextNote=frame+30;
      } else { nextNote=frame+10;
      }
      // TRIGGER NOTE FUNCTION
     playEnv();
  }

  //FX TRIGGERS
  if(syn4.upFX){
  console.log("works");
    console.log("frame :"+frame+"timer :"+syn4.FXtimer);
    if(frame<syn4.FXtimer){

      syn4.FXinc+=1;
      syn4.thisSynth.freq(syn4.baseFreq+5*syn4.FXinc);
      syn4.env.play();
    } else {
      syn4.upFX=false;
    }
  }
  if(syn4.downFX){
    if(frame<syn4.FXtimer){
      syn4.FXinc+=1;
      syn4.thisSynth.freq(syn4.baseFreq-5*syn4.FXinc);
      syn4.env.play();
    } else {
      syn4.downFX=false;
    }
  }
  if(syn4.tremFX){
    if(frame<syn4.FXtimer){
      syn4.FXinc+=1;
      if(syn4.FXinc%8===0){
        syn4.thisSynth.freq(syn4.baseFreq+5*syn4.FXinc);
      } else if(syn4.FXinc%4===0) {
        syn4.thisSynth.freq(syn4.baseFreq-5*syn4.FXinc);
      }
      syn4.env.play();
    } else {
      syn4.tremFX=false;
    }
  }
}

function playEnv(){
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
syn1.env.play();
}

//KEY TRIGGERS
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

function triggerUpFX(){
  syn4.FXinc=0;
  syn4.FXtimer=frame+syn4.FXlength;
syn4.upFX=true;

}
function triggerDownFX(){
  syn4.FXinc=0;
  syn4.FXtimer=frame+syn4.FXlength;
syn4.downFX=true;
}
function triggerTremFX(){
  syn4.FXinc=0;
  syn4.FXtimer=frame+syn4.FXlength;
syn4.tremFX=true;
}

// MOVE ROOT ONE HALF STEP UP
// AND CHANGES MUSICAL IDEA
function rootPlus(){
  currentRoot+=1;
  console.log("root"+currentRoot);
  if(currentRoot>=startRoot+20){currentRoot=startRoot;}
  if(currentRoot%2===0){
  thisPhrase=[oct+0, oct+2, oct+3, oct+0, oct+5, oct+7, oct+0, oct+3];
} else {
  thisPhrase=[oct+0, oct+4, oct+3, oct+0, oct+8, oct+7, oct+0, oct+5];
}
}
function resetEverything(){
  setupPrey();
  setupPlayer();
  newObstacle();
  gameOver=false;
  obsIncrease=0;
  visionRange=100;
  intel=0;

}
