/*
basic ANT PONG!
by Samuel Pare-Chouinard

GAME:

On the weekend i started this project, i had an ant outbreak in my bathtub..
when life gives you lemons, you make ant pong.
In this version of PONG colliding balls will transform into ants.

- ants are born to cause trouble: they will take balls away from play and eat
parts of your paddle.
- you can shoot them with a ball of fire, but that also takes away some of your
paddle length.
- biscuits which restore your paddle length have a chance of appearing throughout
the game, but only if ants are eating things.
- individual ants get more destructive as they eat (you will see their color
change), and as they survive through rounds. They usually wander around randomly,
but if one of their brothers is harmed, they will gang up on a random target.
- try to find a balance between defending your side and defending the play area
from these ants!

Score is hits minus misses.
Reach the target score to win the match and access the next difficulty level.

MUSIC:

Music in this game is again generated with p5.sound.js. This time I have three
synth voices: two which loop through an array of notes at a set pulse rate, and
one which plays melody using a rhythm array.

Drums are random! I'm using code i put together for my cart 211 final project.
It's a kind of skewed probability system inspired by passages of Robert Rowe's
Machine Musicianship which I read parts of last year.

There are also two SFX synths handling 5 different sounds each. Each synth can
only play 1 sound at a time, which is not too bad considering that if every
event in this game always got an individual sound, there would be way too much
going on.

*/

// DECLARE VARIABLES

// music objects
var music;
var synth1;
var synth2;
var synth3;
var drum;
var sfx;
var sfx2;
// game objects
var game;
var balls = [];
var leftPaddle;
var rightPaddle;
var ants = [];
var fireBalls=[];
var biscuit;
var actions;
// game variables
var maxBalls = 3;
var drawAgain = false;
var biscuitChance = 0.15;
var ballIncrease =1;
var level=0;
var winScore=10;
var minBalls =1;
var gameOverScore = -25;
var antEatingBonus=2;
var canvas;
var currentScreen = "menu";


let soundStarted = false;

// setup()
//
// Creates the ball and paddles

function setup() {

  // create canvas:
  canvas = createCanvas(900, 450);
  canvas.parent('sketch-holder');

  // create objects:
  // framework objects
  actions = new Actions();

  game = new Game();

  // paddles
  rightPaddle = new Paddle(game.width-10,game.height/2,20,60,10,DOWN_ARROW,UP_ARROW, LEFT_ARROW, RIGHT_ARROW, 48);
  leftPaddle = new Paddle(0,game.height/2,20,60,10,83,87, 65, 68, 49);

  // load the menu screen

  game.setupMenuScreen();



}

function mousePressed(){
if(!soundStarted){
  // bgm
  synth1 = new Synth('sine');
  synth2 = new Synth('square');
  synth3 = new Synth('square');
  drums = new Drum('white');
  // sfx
  sfx = new SFX('sine', 400);
  sfx2 = new SFX('white', 400);

  music = new Music();
  // setup audio effects parameters,
  // start audio
  music.setupInstruments();
  // assign appropriate musical material
  music.launchPart2();
  soundStarted = true;
}

}

// draw()
//
// loops sound and  displays either game or menu screen

function draw() {

  // play sound
if(soundStarted)  playSound();

  // run menu screen
  if(currentScreen==="menu"){
    game.runMenuScreen();
  }
  // or run game
  else if(currentScreen==="game"){
    runGame();
  }

  textSize(30);
  fill(255, 0, 0);
    if(!soundStarted) text("CLICK TO START SOUND!", width/2-100, height/4);

}

// rungame()
//
// handles inputs, movement, collisions, game mechanics.

function runGame(){

  /////////// GAME ///////////

  // draw background
  // display background
  fill(game.menuBGcolor); stroke(0); rect(0, 0, game.width-1, game.height-1);
  // display text at the bottom of the screen
  game.displayScore();

  // if both paddles' score falls below the gameOverScore, game is over.
  if(leftPaddle.score<gameOverScore&&rightPaddle.score<gameOverScore){
    gameOver();
  }

  // if a paddle reaches the target score, this round is over
  matchWon();

  /////////// BISCUIT ///////////

  // move biscuit
  biscuit.update();
  // display (or not)
  biscuit.display();
  // check for collision with paddle
  biscuit.handlePaddleCollision(leftPaddle);
  biscuit.handlePaddleCollision(rightPaddle);

  /////////// PADDLE  ///////////

  // handle paddle inputs and update position
  leftPaddle.handleInput();
  rightPaddle.handleInput();
  leftPaddle.update();
  rightPaddle.update();

  // display paddles
  leftPaddle.display();
  rightPaddle.display();

  /////////// FIRE BALL ///////////

  // check for any fire balls currently on screen
  if (fireBalls.length>0){
    for(var i=0; i<fireBalls.length; i++){
      // update position and display
      fireBalls[i].update();
      fireBalls[i].display();
      // handle ant collision
      fireBalls[i].handleCollision();
      // handle paddle collision
      fireBalls[i].handlePaddleCollision(leftPaddle);
      fireBalls[i].handlePaddleCollision(rightPaddle);
      // remove any fireballs off screen
      fireBalls[i].isOffScreen();
      if(fireBalls[i].offScreen){
        actions.removeFireBall(i);
      }
    }
  }

  /////////// ANTS ///////////

  // if there are any ants on screen,
  if (ants.length>0){
    // for all ants
    for (var j=0; j<ants.length; j++){
      // update position
      ants[j].update();
      // check collisions:
      // paddle collision,
      ants[j].handleCollision(leftPaddle);
      ants[j].handleCollision(rightPaddle);
      // ball collisions,
      for (var k=0; k<balls.length; k++){
        ants[j].handleCollision(balls[k]);
      }
      // display ants
      ants[j].display();
    }
  }

  /////////// BALL ///////////

  // If there are not enough balls create more balls
  if(balls.length<=minBalls){
    actions.createBalls();
  }

  // for all balls in balls array
  for(var i=0; i<balls.length; i++){

    // update ball position
    balls[i].update();

    // check if ball is off screen then reset
    if (balls[i].isOffScreen()) {
      balls[i].reset();
    }

    // handle ball collisions
    // ball-paddle collision
    balls[i].handlePaddleCollision(leftPaddle);
    balls[i].handlePaddleCollision(rightPaddle);
    // ball+ball = ant
    // balls that merge into an ant are removed from balls array
    balls[i].handleBallCollision(i);
  }

  // declare balls.length again in case its value
  // changed when ants were created
  for (var i=0; i<balls.length; i++){
    //display balls
    balls[i].display();
  }
}

// keypressed()
//
// a place to test functions

function keyPressed(){
  if(keyCode===ENTER){
    // creates a bunch of new balls
    actions.createBalls();
  }
  if(keyCode===SHIFT){
    // triggers a health biscuit
    biscuit.appear();
  }
  switch(key){
    // sfx triggers
    case "4": music.startSFX(sfx2, "up");  break;
    case "5": music.startSFX(sfx2, "down");  break;
    case "6": music.startSFX(sfx2, "trem");  break;
    case "9": music.startSFX(sfx2, "chirp");  break;
    case "0": music.startSFX(sfx2, "downchirp");  break;
    // cause ants to swarm towards either paddle
    case "7": actions.swarm("left");  break;
    case "8": actions.swarm("right");  break;
    // reset game
    case "r": gameReset(); break;
  }
  // press spacebar to do something
  if(key===" "){
  }
}

// playsound()
//
// keep time
// play individual instruments
// play sound effects

function playSound(){

  // bgm:
  // play drums
  drums.handleDrums();
  // play synths
  synth1.playMusic();
  synth2.playMusic();
  synth3.playMusic();

  // sfx:
  sfx.playSFX();
  sfx2.playSFX();

  // increment musical time
  music.musicInc+=music.musicSpeed;

}

// gamereset()
//
// resets game back to initial state
// launches start menu screen

function gameReset(){

  // empty ants array
  ants = [];

  // reset difficulty level
  level=0;
  winScore=10;
  ballIncrease=1;
  maxBalls=3;
  minBalls=1;
  antEatingBonus=1;
  biscuitChance=0.15;

  // create new paddles
  // this resets size, score and match points.
  rightPaddle = new Paddle(game.width-10,game.height/2,20,60,10,DOWN_ARROW,UP_ARROW, LEFT_ARROW, RIGHT_ARROW, 48);
  leftPaddle = new Paddle(0,game.height/2,20,60,10,83,87, 65, 68, 49);

  // setup menu screen
  game.setupMenuScreen();
  currentScreen= "menu";
  // set correct header text
  game.menuText[0] = "ant pong! click screen to start.";

  // set menu screen music
  music.launchPart2();
}

// gameover()
//
// when game is over, determine who won.
// return to main menu and display the gameover header text.

function gameOver(){
  // text to include in menu header
  var winner;
  // if right player wins
  if(leftPaddle.matchPoint<rightPaddle.matchPoint){
    // set appropriate text
    winner = "right player wins!";
  }
  // if left player wins
  else if(rightPaddle.matchPoint<leftPaddle.matchPoint){
    // set appropriate text
    winner = "left player wins!";
  }
  // if it's a tie
  else if(rightPaddle.matchPoint===leftPaddle.matchPoint){
    // set appropriate text
    winner = "it's a tie!";
  }
  // reset game and launch menu screen
  gameReset();
  // set header text to reflect that it's game over and who won.
  game.menuText[0] = "Game over.. "+winner+" \n reached level "+level+". click to restart.";
}

// setuplevel()
//
// prepares a new level.
// increases difficulty by increasing number of balls generated with createBalls()
// also increases maximum and minimum number of balls on screen
// increases the score needed to win this match.
// levels up all ants on screen by increasing their damage
// increases health bonus ants get from eating
// heals the paddles a little

function setupLevel(){

  // set menu music
  music.launchPart0();
  // launch menu screen
  game.setupMenuScreen();
  currentScreen="menu";

  // increment level and difficulty
  level+=1;
  winScore+=level*2;
  ballIncrease+=1;
  maxBalls+=1;
  minBalls+=0.5;
  antEatingBonus+=1;
  biscuitChance-=0.01

  // heal paddles by increasing height
  leftPaddle.h +=40;
  rightPaddle.h +=40;

  // increase damage for all ants
  for(var i=0; i<ants.length; i++){
    ants[i].damage+=5;
    // constrain damage so it doesn't excede 30
    ants[i].damage = constrain(ants[i].damage, 10, 30);
  }
}

// matchWon()
//
// check if this round is over

function matchWon(){
  // if right paddle reached target score
  if(rightPaddle.score>=winScore){
    // setup new level
    setupLevel();
    // add match point
    rightPaddle.matchPoint+=1;
    // set correct menu text
    game.menuText[0] = "Match! Right player wins. \nclick to continue to level "+level+".";
  }
  // if left paddle reached target score
  else if(leftPaddle.score>=winScore){
    // setup new level
    setupLevel();
    // add match point
    leftPaddle.matchPoint+=1;
    //set menu text
    game.menuText[0] = "Match! Left player wins. \nclick to continue to level "+level+".";
  }
}
