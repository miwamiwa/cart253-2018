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
var leftPaddle, rightPaddle;
var bigHead;
var gameOverCat;
var kittyarm;
var synth1, synth2, synth3;
var ui;
var beepSFX;

// incremented value used to keep track of time
var musicInc=0;
// speed at which to increment. will increase on gameover screen.
var musicSpeed=1;

// phrases to be played:
var phrase1=[0, 0, 0, 0, 0, 2, 4, 5, 0, 0, 0, 0, 0, 5, 4, 2];
var phrase2=[9, 4, 9, 2, 9, 9, 4, 2];
var phrase3=[0, 0, 2, 2, 5, 5, 5, 2];

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
function setup() {

  createCanvas(840,480);

  ui= new Ui();

  bigHead = new CatHead();
  kittyarm = new CatArm();
  gameOverCat= new GOCat();

  synth1 = new Synth('sine');
  synth2 = new Synth('square');
  synth3 = new Synth('square');
  setupInstruments();

  ball=new Ball();
  leftPaddle= new Paddle(0, 87, 83, 65, 68, 49);
  rightPaddle= new Paddle(1, 38, 40, 37, 39, 48);

}

function draw() {

  playSound();
  handleInputs();
  ui.loadBg();

  if(gameIsOver){
    runGameOver();
  }
  else {
    runGame();
  }

  ui.displayControls();
  ui.displayScore();
}

function playSound(){
  musicInc+=musicSpeed;
  synth1.playMusic();
  synth2.playMusic();
  synth3.playMusic();
}

function handleInputs(){
  leftPaddle.checkInput();
  rightPaddle.checkInput();
  leftPaddle.update();
  rightPaddle.update();
}

function runGame(){

  ball.isSwatted();
  ball.update();
  ball.checkWallCollision();
  ball.checkOffScreen();

  leftPaddle.checkBallCollision();
  rightPaddle.checkBallCollision();

  leftPaddle.display();
  rightPaddle.display();
  ball.display();

  kittyarm.appear();
  bigHead.appear();
}

function runGameOver(){

  gameOverCat.move();
  leftPaddle.moveBullet();
  rightPaddle.moveBullet();

  leftPaddle.checkCatCollision();
  rightPaddle.checkCatCollision();

  ui.displayGameOverText();
  gameOverCat.display();
  leftPaddle.display();
  rightPaddle.display();
  leftPaddle.displayBullet();
  rightPaddle.displayBullet();
}


function playAgain(){
  // indicate that game is no longer over (removes the game over screen display)
gameIsOver=false;
// reset music speed
musicSpeed=1;

bigHead.reset();
ball.reload();
leftPaddle.reset();
rightPaddle.reset();
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

function setupInstruments(){
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  synth1.setEnvelope(0.01, 0.4, 0.9, 0.4, 0.52, 0);
  // function(filterType, frequency)
  synth1.setFilter("LP", 500);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth1.setDelay(false, 0, 0, 0)
  // function(noteList, octave, loopLength)
  synth1.setNotes(phrase2, 12, 80);
  // load it
  synth1.loadInstrument();

  synth2.setEnvelope(0.1, 0.1, 0.5, 0.4, 0.2, 0);
  // function(filterType, frequency)
  synth2.setFilter("LP", 500);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth2.setDelay(false, 0, 0, 0)
  // function(noteList, octave, loopLength)
  synth2.setNotes(phrase1, 0, 20);
  // load it
  synth2.loadInstrument();

  synth3.setEnvelope(0.01, 0.2, 0.5, 0.4, 0.2, 0);
  // function(filterType, frequency)
  synth3.setFilter("LP", 800);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth3.setDelay(true, 0.165, 0.3, 1500);
  // function(noteList, octave, loopLength)
  synth3.setNotes(phrase3, -24, 40);
  // load it
  synth3.loadInstrument();
}
