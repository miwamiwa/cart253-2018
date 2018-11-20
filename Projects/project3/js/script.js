
var player;
var enemy;

var canvas;

var obstacles = [];
var totalobs = 0;
var kindsOfObs = 3;
var playerIsFullThreshold = 1;
var droppings = [];
var enemies = [];
var numEnemies = 3;

// sound
var synths = [];
var drums;
var music;

var obsMode = false;

// number of obstacles on an axis
var xobs = 0;
var yobs = 0;

var obsSize= 15;

// setup()
//
// Creates the game objects

function setup() {

  // create canvas:
  canvas = createCanvas(900, 450);
  canvas.parent('sketch-holder');

  // create new player objects
  player = new MovingObject(0,height/2,4,83,87, 65, 68);

  // create a given number of enemies
  for (var i=0; i<numEnemies; i++){
    enemies[i] = new EnemyObject(random(width), random(height));
  }

  // create a new synthesizor object for each kind of food in play
  for (var i=0; i<kindsOfObs-1; i++){
    synths[i] = new Synth("sine");
    console.log("new synth");
  }

  // load remaining music objects
  drums = new Drum("white");
  music = new Music();
  music.setupInstruments();
  music.launchPart1();

  // create a random array of obstacles.
  // obstacles can be any type of food, or an actual obstacle
  // this is determined randomly in the Obstacle() constructor

  // let's start by creating a grid along which obstacles are placed.
  // this way there are no overlaps

  // calculate how many obstacles can fit into the grid
  // on the x-axis
  xobs = floor((width-50)/obsSize);
  // on the y-axis
  yobs = floor((height-50)/obsSize);

  // create a var to index each obstacle.
  // this way a specific obstacle can be found without having to search
  // through the obstacles[] array.
  var obstacleindex =0;

  // for each point on the grid
  for (var i=0; i<xobs*yobs; i++){
    // random chance of generating an obstacle object
    if(random()<0.2){
      // count total obstacles
      totalobs+=1;
      // create a new obstacle at this point and give it an index number.
      obstacles.push(new Obstacle(i, obstacleindex));
      // increment index
      obstacleindex +=1;
    }
  }
}

// draw()
//
// loops the main game elements

function draw() {

  runGame();
  runSound();

}

// rungame()
//
// handles inputs, movement, collisions, game mechanics.

function runGame(){

  background(255);

  // PLAYER

  // update player position
  player.handleInput();
  player.update();
  // digest any foods eaten
  player.digest();
  // look out for recognized smells
  player.sniffOut();
  // display player object
  player.display();

  // ENEMIES

  // for all enemies in play
  for (var i=0; i<numEnemies; i++){
    // update position and display
    enemies[i].update();
    enemies[i].display();
    // look out for the player
    enemies[i].lookOut(player);
    // listen for collision with player
    enemies[i].handlePlayerCollision(player);
  }

  // DROPPINGS

  // for all droppings in play (if any)
  if(droppings.length!=0){
    for(var i=0; i<droppings.length; i++){
      // display
      droppings[i].display();
    }
  }

  // OBSTACLES

  // for all obstacles in play
  for(var i=0; i<obstacles.length; i++){
    // display
    obstacles[i].display();
  }

  // display score over everything else
  displayScore();


}

// runsound()
//
// a place to toggle voices on and off

function runSound(){

  // check for any known objects in range
  for (var i=0; i<player.knownObjectsInRange.length; i++){
    var whichobject = player.knownObjectsInRange[i]-1;
    // toggle sound/smell of nearby known objects on and off
    synths[whichobject].playMusic();
  }

  // play drums
  drums.handleDrums();
  // increment musical time
  music.musicInc+=music.musicSpeed;
}


// displayscore()
//
// display number of healthy and unhealthy droppings

function displayScore(){
  // create a backdrop
  fill(185, 100, 100);
  rect(0, 0, 250, 15);
  // display text
  fill(0);
  text("healthy droppings: "+player.healthydroppings+", sickly droppings: "+player.sickdroppings, 10, 10);
}

// TEST FUNCTIONS

// keypressed()
//
// a place to test functions

function keyPressed(){
  switch(key){
    case " ": playerIsFullThreshold +=1; break;
    case "q": toggleObsMode(); break;
  }
}

// toggleObsMode()
//
// for testing purposes
// display different foods with a different colour (or not)

function toggleObsMode(){
  if(obsMode){
    obsMode = false;
  } else {
    obsMode = true;
  }
}
