/*
RACOON RUN
By Samuel Paré-Chouinard

- In this game you are a racoon and you scavenge for food.
- Each level has a number of good and bad food types available.
- You recognize good and bad foods by learning then detecting their "smell"
(represented as short looping musical phrases).
- each new level introduces a new kind of good or bad food, and randomizes
their smells.
- Avoid humans and fill yer belly!

I'm handing in a bit of a work in progress, but at some point you gotta draw
a line on some details (and finish up your other final projects). This version
is very playable. Here are a few issues I was working on at the time I'm
turning this in:

- levels are limited by the 6 musical phrases i created
- sound works great but sound design was a bit overlooked because of time spent
on collisions and visuals. sfx not used very extensively, and musical phrases
were thrown together quickly
- obstacle collisions are clunky. player gets glued all over the place and
has to change directions all the time.
- late in the process i tried changing the manner in which collisions were
checked, in an effort to enhance performance (necessary for slow computers
like mine). Updated only one collision-checking function (EnemyObject.lookOut())
in the interest of time, so not everything is as efficient as it could be.
The old system checks distance to all obstacles, then checks collisions
with nearby obstacles only, while the new system has obstacles, enemies and the
player organised in rows and columns and checks for collisions only within
matching rows or columns.
- texture image files were crunched to tiny sizes also to optimize performance.
my computer was not a fan of these more hi-res textures which were working fine
on school computers.
- i feel like i probably missed something but i don't know how to
display text in 3d, so i have objects with text images as texture :)

this script handles:
- declaring global variables
- main p5.js function such as preload, setup and draw
- built-in p5.js listeners such as keypressed, mousepressed, windowresized
- three main game functions: runMenu(), runGame(), runSound()
anything else is contained either in an object script or in events.js

*/

// game screen
var canvas;

// game objects
var world;
var player;
var obstacles = [];
var droppings = [];
var enemies = [];

// sound objects
var synths = [];
var drums;
var music;
var perc = [];
var sfx;
var sfx2;

// obstacle configuration
// obstacle slots per axis
var xobs = 0;
var yobs = 0;
// arrays to save obstacle position in each column and row
var obsCol = [];
var obsRow = [];
// healthy obstacle counter
var healthyobs =0;
// wall obstacle size
var obsSize = 50;
// kinds of food + obstacle (foods + 1)
var kindsOfObs = 7;

// camera settings
var camOffsetX = 0;
var camOffsetY = 0;
var camOffsetZ = 0;
var changeCamView = false;
var camYAngle = -250;

// textures
var yumTexture;
var racTexture;
var racTexture2;
var healthyTexture;
var sickTexture;
var backgroundImage ;
var groundTexture ;
var obsTexture;
var titleimg, gameoverimg, nextlvlimg, startimg, controlsimg, instructionsimg;

// game settings
var playerIsFullThreshold = 2;
var initialHealth =7;
var healthyPoopBonus = 1;
var unhealthyPoopPenalty = 1;
var enemyCaughtPlayerPenalty = 2;
var numEnemies = 0;
var foodSize= 80;
var damageToObstacles = foodSize;
var chanceForFood = 0.5;
var obstacleDensity = 0.08;
var playerSizeIncrease = 3;
var levelTarget = level+3;
var minHealthyFood = 7;

// levels, game states
var level =0;
var levelComplete = false;
var gameOn = false;
var gameOver = false;

// preload()
//
// loads texture images and drum sounds

function preload() {

  // load images
  yumTexture = loadImage("images/yum2.jpg");
  racTexture = loadImage("images/racoon2.jpg");
  racTexture2 = loadImage("images/racoon3.jpg");
  healthyTexture = loadImage("images/healthy.jpg");
  sickTexture = loadImage("images/sickly.jpg");
  backgroundImage = loadImage("images/far.jpg");
  lowergroundImage = loadImage("images/lower.jpg");
  groundTexture = loadImage("images/ground.jpg");
  obsTexture = loadImage("images/xbox.jpg");
  titleimg = loadImage("images/title.jpg");
  gameoverimg = loadImage("images/gameover.jpg")
  nextlvlimg = loadImage("images/nextlevel.jpg");
  startimg = loadImage("images/start.jpg");
  controlsimg = loadImage("images/controls.jpg");
  instructionsimg = loadImage("images/instructions.jpg");

  // load drums sounds
  clap = loadSound("sound/clap.mp3");
  kick = loadSound("sound/kick.mp3");
  cowbell = loadSound("sound/cowbell.mp3");
  tick = loadSound("sound/tick.mp3");

}

// setup()
//
// Creates the game objects

function setup() {

  // create canvas:
  canvas = createCanvas(window.innerWidth, window.innerHeight-100, WEBGL);
  canvas.parent('sketch-holder');

  // load music objects
  drums = new Drum();
  music = new Music();
  bass = new Synth("square");
  sfx = new SFX('sine', 400);
  sfx2 = new SFX('white', 400);

  // create world
  world = new World();

  // create this level and its objects
  newLevel();

  // prepare menu page with appropriate image files
  setupMenu();

  // set no stroke by default
  noStroke();
}

// draw()
//
// displays game or menu, plays sound.

function draw() {

  // display either game or menu
  if(gameOn){
    runGame();
  }
  else {
    runMenu();
  }

  // run sound
  runSound();
}

// runmenu()
//
// display menu screen elements over a background.

function runMenu(){

  background(255);
  camera();
  menu1.update();
  menu2.update();
  menu3.update();
}

// mousepressed()
//
// if game is not running (menu is running) check if a menu object was clicked.

function mousePressed(){

  if(!gameOn){
    menu1.check();
    menu2.check();
    menu3.check();
  }
}

// rungame()
//
// handles inputs, movement, collisions, game mechanics.

function runGame(){

  // display world
  world.display();

  // display all obstacles (food and actual obstacles)
  for(var i=0; i<obstacles.length; i++){
    obstacles[i].display();
  }

  // display droppings
  if(droppings.length!=0){
    for(var i=0; i<droppings.length; i++){
      droppings[i].display();
    }
  }

  // update and display enemies
  for (var i=0; i<numEnemies; i++){
    enemies[i].update();
    enemies[i].display();
    // look out for the player
    enemies[i].lookOut(player);
    enemies[i].handlePlayerCollision(player);
  }

  // update and display player,
  // "sniff out" any known smells
  player.handleInput();
  player.update();
  // trigger digestion
  player.digest();
  player.sniffOut();
  player.display();

  // handle dragging mouse to update camera position
  if(mouseIsPressed){
    updateCam();
  }
}


// runsound()
//
// checks which known objects are in range,
// play that object type's voice.
// play drums and bass.
// play sfx
// keep track of time

function runSound(){

  // check for any known objects in range
  for (var i=0; i<player.knownObjectsInRange.length; i++){
    var whichobject = player.knownObjectsInRange[i]-1;
    // play sound
    synths[whichobject].playMusic();
  }

  // play bgm
  drums.handleDrums();
  bass.playMusic();

  // play sfx:
  sfx.playSFX();
  sfx2.playSFX();

  // increment musical time
  music.musicInc+=music.musicSpeed;
}

// keypressed()
//
// a place to test stuff,
// but also handles pressing x to teleport the player out of an obstacle

function keyPressed(){

  switch(key){
    case " ": playerIsFullThreshold +=1; break;
    case "z": toggleObsMode(); break;
    // player stuck key
    case "x": findGoodPosition(player); break;
  }
}


// windowresized()
//
// resize canvas upon resizing screen

function windowResized(){

  canvas = createCanvas(window.innerWidth, window.innerHeight-100, WEBGL);
  noStroke();
}
