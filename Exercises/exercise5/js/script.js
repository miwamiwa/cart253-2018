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

var ball;

// PADDLES

// How far in from the walls the paddles should be drawn on x
var paddleInset = 150;

// paddles
var leftPaddle, rightPaddle;

// A variable to hold the beep sound we will play on bouncing
var beepSFX;
var bigHead;
var bigHead;


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
// this is the small cat bigHead that you shoot (with water..) during game over screen.
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
var kittyarm;
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
  bigHead = new CatHead();
  kittyarm = new CatArm();
  // Create canvas and set drawing modes
  ///////////// NEW /////////////
  // made canvas a bit wider
  createCanvas(840,480);
  textAlign(CENTER);
  // new setup functions
  setupInstruments();
  kittyarm.setup();
  ///////////// END NEW /////////////
  rectMode(CENTER);
  noStroke();
  fill(fgColor);
  setupBall();
  setupPaddles();
}

function setupBall(){
  ball=new Ball();
}
function setupPaddles(){
  leftPaddle= new Paddle(0, 87, 83, 65, 68, 49);
  rightPaddle= new Paddle(1, 38, 40, 37, 39, 48);
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
leftPaddle.checkInput();
rightPaddle.checkInput();

  // Update positions of all objects
  // Notice how we're using the SAME FUNCTION to handle the input
  // for all three objects!
leftPaddle.update();
rightPaddle.update();

  ///////////// NEW /////////////
  // if cat has swiped at the ball, mess with ball velocity
  if(ballIsSilly){
    updateSillyMovement();
  }
  ///////////// END NEW /////////////

ball.update();

ball.checkWallCollision();
leftPaddle.checkBallCollision();
rightPaddle.checkBallCollision();

ball.checkOffScreen();

  ///////////// NEW /////////////
  // Display the score under the other displayed elements
  displayScore();
  ///////////// END NEW /////////////

  // Display the paddles and ball
leftPaddle.display();
rightPaddle.display();
ball.display();

  ///////////// NEW /////////////
  // CAT leg
  // if any of the leg's triggers are active,
  // update leg position and draw leg.
  if(kittyarm.move1||kittyarm.move2||kittyarm.move3||kittyarm.move4){
  kittyarm.move();
  kittyarm.display();
}
  // CAT HEAD: GAME OVER
  // if cat bigHead timer is active, draw cat bigHead
if (millis()<bigHead.dispTimer){
bigHead.display();
bigHead.gobble=true;
bigHead.eye=true;
}

  // if the cat bigHead timer is over, load gameover settings
  // (loadGameOver runs once, while runGameOver runs in a loop)
  if(millis()>bigHead.dispTimer&&bigHead.dispTimer!=0&&gameIsOver===false){
   loadGameOver();
}
  // if cat bigHead timer is over and gameover is loaded,
  // run the gameover function
  if(gameIsOver){
    runGameOver();
    console.log("gmover")
  }
  // display controls info at the bottom of the screen
  displayControls();
  ///////////// END NEW /////////////

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

  bigHead.move();
  bigHead.display();

  // display paddles
 leftPaddle.display();
 rightPaddle.display();

  // handle bullet motion and display
  leftPaddle.moveBullet();
  rightPaddle.moveBullet();
  leftPaddle.displayBullet();
  rightPaddle.displayBullet();
  leftPaddle.checkCatCollision();
  rightPaddle.checkCatCollision();

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
// reset bigHead
bigHead.dispTimer=0;
// reset scale to fit cat which eats the ball
bigHead.xs=0.3;
bigHead.ys=0.3;
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
// prevent the ball from bigHeading straight back into the wall
// if ball is still close to the wall
  if(ball.y<10*ball.speed&&ball.vy<0){
      ball.vy=abs(ball.vy);
  } else   if(ball.y>height-10*ball.speed&&ball.vy>0){
        ball.vy=-abs(ball.vy);
    }
}

// setupcat()
//
// loads the cat bigHead for the game over game
function setupCat(){
  // cat is the object which you have to shoot. it has the characteristics of an ellipse
  cat.x=width/2;
  cat.y=height/2;
  // the image will be the cat bigHead we used earlier though.
  // since the bigHead is scalable, scale it down
  bigHead.xs=0.1;
  bigHead.ys=0.1;
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
