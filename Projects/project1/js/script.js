/******************************************************

Game - Chaser
Pippin Barr

A simple game of cat and mouse.

Physics-based movement, keyboard controls, health/stamina,
sprinting, random movement, screen wrap.

******************************************************/
// music variables:
var syn1={ //random rhythmic phrases
  attackLevel: 0.8,
  releaseLevel: 0,
  attackTime: 0.001,
  decayTime: 0.1,
  susPercent: 0.4,
  releaseTime: 0.2,
  env:0,
  thisSynth:0,
  filter:0,
  fFreq:400
}
var syn2={ //loop
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
    delay:0,
    delayLength: 0.16,
    delayFB: 0.3,
    delayFilter: 400,

}
var syn3={ //noise drum
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
    filterMin:1000,
    filterMax:4500,
    drumsOn:true,
    trig:0,
    nextTrig:200,
    trigOn:500,
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
  upFX:false,
  downFX: false,
  tremFX: false,
  FXlength: 45,
  FXtimer: 0,
  filter:0,
  fFreq:400,
  baseFreq: 650,
  FXinc:0
}

var phraseReps=0;
var frame=0;
var startRoot=45;
var currentRoot=startRoot;
var nextNote=10;
var syn1Loop=0;
var oct=-12;
var thisPhrase=[oct+0, oct+4, oct+3, oct+0, oct+8, oct+7, oct+0, oct+5];
var phraseLength=0;
var section1length=4;
var syn2Loop=0;
var section2length=4;

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
var timerLength=1000;
var captureTimerStarted=false;
var playerInVisionRange=false;

// setup()
//
// Sets up the basic elements of the game
function setup() {
  createCanvas(500,500);

  noStroke();
  loadInstruments();
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
//
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
    syn2.delayFB=0.7;
    syn2.delayFilter=1500;
    syn2.delay.process(syn2.thisSynth, syn2.delayLength, syn2.delayFB, syn2.delayFilter);
    playerMaxSpeed=sprintSpeed;
    lossFactor=sprintLossFactor;
  } else {
    sprintOn=false;
    syn2.delayFB=0.3;
    syn2.delayFilter=400;
    syn2.delay.process(syn2.thisSynth, syn2.delayLength, syn2.delayFB, syn2.delayFilter);
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
   // trigger game over sound
   triggerDownFX();
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
      //update music
      if(preyEaten%5===0){
      rootPlus();
      }
      // trigger FX
      triggerUpFX();
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
    triggerTremFX();
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
    if(captureTimer&&captureTimerStarted){
      fill(225, 25, 25);
    }
  ellipse(preyX,preyY,preyRadius*2);
  stroke(255);
  noFill();
  ellipse(preyX, preyY, visionRange*2);
  noStroke();
  fill(255);
  text("brains: "+round(preyIntel*100), preyX, preyY+preyRadius*3);
  if(captureTimer&&captureTimerStarted){
    fill(255);
    var timerleft=round(abs(millis()-captureTimer)/300);
    text(timerleft, preyX, preyY);
  }


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
text("score: "+preyEaten, 10, 20);

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
  section1length=random(0, 6);
  section2length=random(6);
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
  gameOver=false;

}
