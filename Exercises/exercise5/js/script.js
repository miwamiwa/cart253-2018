/*
kame-pong by samuel paré-chouinard
this is my oop-version of the pong game:

meet kamehameha, my roommate's cat.
in this version, she tries to mess with your game.
she will send the ball wobbling away if it gets too close to the side,
and she has a chance of eating the ball if it goes out of bounds, bringing the game to an end.
gently spray kame with a bit of water and she will return the ball and leave the playing field.

----------------------------------------------

script.js
This is the main script.

First the objects are set up,
then the draw() function calls either runGame() or runGameOver()
There are really two games here, a game and another game on the gameover screen.
Once the gameover game is complete, playAgain() returns the game to its original setup.
playSound() is also called in draw(). this is where the synth objects are played.
The three synths use the same Synth object. In order to give them an unique sound, they
are set up individually in setupInstruments().

POST SCRIPTUM
I realised rather late in the process that I hadn't paid enough attention to the
instructions. I started with my exercise 4 file and transformed into its current oop
form rather than starting with the exercise5.zip material. All I can say at this point is
oops.. It's a bit late to do something about that now. I can try to point out which parts of the
code come from the original ex4 file if that's any good.

*/

// declare a variable for each object:
var ball;
var leftPaddle;
var rightPaddle;
var bigHead;
var gameOverCat;
var catArm;
var synth1;
var synth2;
var synth3;
var ui;
var beepSFX;
var game;


// preload()
//
// Loads the beep audio for the sound of bouncing

function preload() {

  beepSFX = new Audio("assets/sounds/beep.wav");
}

// setup()
//
// create playing area
// load game objects
// setup instruments

function setup() {

  // create our playing area
  createCanvas(840,480);
  // load the object which will display background, score and instructions
  ui= new Interface();
  // load cat parts
  bigHead = new CatHead();
  catArm = new CatArm();
  gameOverCat= new GOCat();
  // load new instruments and set them up
  synth1 = new Synth('sine');
  synth2 = new Synth('square');
  synth3 = new Synth('square');
  setupInstruments();
  // load ball and paddles
  ball=new Ball();
  leftPaddle= new Paddle(0, 87, 83, 65, 68, 49);
  rightPaddle= new Paddle(1, 38, 40, 37, 39, 48);
  // load game triggers
  game= new Game();
}

// draw()
//
// play sound,
// handle inputs,
// display either game or game over screen
// display score and controls information

function draw() {

  // play sound
  playSound();
  // check user inputs
  handleInputs();
  // load an empty screen
  ui.loadBg();

  // check if game is running or over
  // if game is over:
  if(game.gameIsOver) {
    // run Game Over sequence and display appropriate objects
    runGameOver();
  }
  // if game is running:
  else {
    // run Game sequence and display appropriate objects
    runGame();
  }
  // display instructions and score
  ui.displayControls();
  ui.displayScore();
}

// playsound()
//
// keep time
// play individual instruments

function playSound(){

  game.musicInc+=game.musicSpeed;
  synth1.playMusic();
  synth2.playMusic();
  synth3.playMusic();
}

// handleinputs()
//
// check inputs for each paddle
// update paddle movement

function handleInputs(){

  leftPaddle.checkInput();
  rightPaddle.checkInput();
  // update paddle position
  leftPaddle.update();
  rightPaddle.update();
}

// rungame()
//
// update ball movement,
// check for collision with wall or paddle, or ball off-screen
// display ball and paddles
// make cat appear when triggered

function runGame(){

  // update ball position and check for ball events
  ball.isSwatted();
  ball.update();
  game.checkWallCollision();
  game.checkOffScreen();
  // check for paddle events
  game.checkBallPaddleCollision(leftPaddle);
  game.checkBallPaddleCollision(rightPaddle);
  // display paddles and ball
  leftPaddle.display();
  rightPaddle.display();
  ball.display();
  // handle cat actions
  game.moveCatArm();
  game.catHeadAppears();
  game.checkGameOver();
}

// rungameover()
//
// update paddles' bullet position
// display paddles, game over cat and bullet
// display gameover text

function runGameOver(){

  // update cat position
  gameOverCat.move();
  // update bullet position
  leftPaddle.moveBullet();
  rightPaddle.moveBullet();
  // check if bullet hits cat
  game.checkCatCollision(leftPaddle);
  game.checkCatCollision(rightPaddle);
  // display text, cat, paddles and bullets
  ui.displayGameOverText();
  gameOverCat.display();
  leftPaddle.display();
  rightPaddle.display();
  leftPaddle.displayBullet();
  rightPaddle.displayBullet();
}

// playagain()
//
// cancel game over screen
// reset music speed
// reset game elements

function playAgain(){

  game.gameIsOver=false;
  game.musicSpeed=1;
  bigHead.reset();
  ball.reset();
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

// setupinstruments()
//
// here the values which will define the different
// instruments' sound are declared. notes to be played
// are also set here.

function setupInstruments(){

  // phrases to be played:
  var phrase1=[0, 0, 0, 0, 0, 2, 4, 5, 0, 0, 0, 0, 0, 5, 4, 2];
  var phrase2=[9, 4, 9, 2, 9, 9, 4, 2];
  var phrase3=[0, 0, 2, 2, 5, 5, 5, 2];

  // synth1 setup
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

  // synth2 setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  synth2.setEnvelope(0.1, 0.1, 0.5, 0.4, 0.2, 0);
  // function(filterType, frequency)
  synth2.setFilter("LP", 500);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth2.setDelay(false, 0, 0, 0)
  // function(noteList, octave, loopLength)
  synth2.setNotes(phrase1, 0, 20);
  // load it
  synth2.loadInstrument();

  // synth3 setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
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
