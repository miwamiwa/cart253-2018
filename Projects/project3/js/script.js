
var player;
var enemy;

var canvas;
var world;
var obstacles = [];
var totalobs = 0;
var kindsOfObs = 3;

var droppings = [];
var enemies = [];

var healthyobs =0;
var sicklyobs =0;
// sound
var synths = [];
var drums;
var music;

var obsMode = false;

// number of obstacles on an axis
var xobs = 0;
var yobs = 0;

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

var playerIsFullThreshold = 2;
var initialHealth =10;
var healthyPoopBonus = 1;
var unhealthyPoopPenalty = 1;
var enemyCaughtPlayerPenalty = 1;
var numEnemies = 5;
var foodSize= 60;
var obsSize = 50;

// preload()
//
// loads images to be used for textures

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
  obsTexture = loadImage("images/xbox.jpg")
}

// setup()
//
// Creates the game objects

function setup() {

  // create canvas:

  canvas = createCanvas(window.innerWidth, window.innerHeight-100, WEBGL);

  canvas.parent('sketch-holder');

  // load music objects
  drums = new Drum("white");
  music = new Music();
  music.setupInstruments();

  world = new World();

  newLevel();

  noStroke();
displayObstaclesLeft();
  document.getElementById("3").innerHTML = player.healthyFoodEaten;
  document.getElementById("4").innerHTML = player.sicklyFoodEaten;
  displayHealth();
}

// draw()
//
// loops the main game elements

function draw() {

  document.getElementById("7").innerHTML = player.roomLeft;
  console.log("healthy food sources: "+healthyobs+", unhealthy food sources: "+sicklyobs+", healthy food eaten: "+player.healthyFoodEaten+", unhealthy food eaten: "+player.sicklyFoodEaten);
  runGame();
//  runSound();
}

function displayHealth(){
  document.getElementById("6").innerHTML = player.health;
}

function displayObstaclesLeft(){
  document.getElementById("1").innerHTML = healthyobs;
  document.getElementById("2").innerHTML = sicklyobs;
}

// rungame()
//
// handles inputs, movement, collisions, game mechanics.

function runGame(){

  background(255);
  world.display();


  // OBSTACLES

  // for all obstacles in play
  for(var i=0; i<obstacles.length; i++){
    // display
    obstacles[i].display();
  }

  // DROPPINGS

  // for all droppings in play (if any)
  if(droppings.length!=0){
    for(var i=0; i<droppings.length; i++){
      // display
      droppings[i].display();
    }
  }
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





  // display score over everything else
  //displayScore();
  if(mouseIsPressed){
    // trigger zoom out
    updateCam();
  }

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
  /*
  // create a backdrop
  fill(185, 100, 100);
  rect(0, 0, 250, 15);
  // display text
  fill(0);
  */
  console.log("healthy droppings: "+player.healthydroppings+", sickly droppings: "+player.sickdroppings, 10, 10);
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

// udpateCam()
//
// zoom out function called upon clicking mouse.
// click on top of screen to zoom in.
// click on bottom of screen to zoom out.

function updateCam(){
  changeCamView = true;
  //  camOffsetZ -= (mouseX-width/2)/width*10;
  camOffsetY -= (mouseY-height/2)/height*10;
  //  camOffsetZ = constrain(camOffsetZ, -100, 100);
  camOffsetY = constrain(camOffsetY, -300, 350);
}

// findgoodposition()
//
// finds a random position for a player or enemy
// avoids clipping them onto an obstacle.

function findGoodPosition(target) {
  var positionGood = false;
  while (!positionGood){
    target.x = random(-world.w/2, world.w/2);
    target.y = random(-world.h/2, world.h/2);
  var positionNoGood = false;
  for(var i=0; i < obstacles.length; i++){
    if(
      target.x>=obstacles[i].x-obstacles[i].size/2-obsSize/2
    && target.x<=obstacles[i].x+obstacles[i].size/2+obsSize/2
    && target.y>=obstacles[i].y-obstacles[i].size/2-obsSize/2
    && target.y<=obstacles[i].y+obstacles[i].size/2+obsSize/2
  ){
    positionNoGood=true;
  }
  }
  if(!positionNoGood){
    positionGood = true;
  }
}
}

function newLevel(){

  // create new player objects
  player = new MovingObject(0,height/2,3,83,87, 65, 68);

  // create a given number of enemies
  for (var i=0; i<numEnemies; i++){
    enemies[i] = new EnemyObject(50, 50);
  }

  // create a new synthesizor object for each kind of food in play
  for (var i=0; i<kindsOfObs-1; i++){
    synths[i] = new Synth("sine");
  }


  // create a random array of obstacles.
  // obstacles can be any type of food, or an actual obstacle
  // this is determined randomly in the Obstacle() constructor

  // let's start by creating a grid along which obstacles are placed.
  // this way there are no overlaps

  // calculate how many obstacles can fit into the grid
  // on the x-axis
  xobs = (world.w)/40;
  // on the y-axis
  yobs = (world.h)/40;

  // create a var to index each obstacle.
  // this way a specific obstacle can be found without having to search
  // through the obstacles[] array.
  var obstacleindex =0;
  healthyobs =0;
  sicklyobs =0;

  // for each point on the grid

  for (var i=0; i<xobs*yobs; i++){
    // random chance of generating an obstacle object
    if(random()<0.04){
      // count total obstacles
      totalobs+=1;
      // create a new obstacle at this point and give it an index number.
      obstacles.push(new Obstacle(i, obstacleindex));
      // increment index
      obstacleindex +=1;
    }
  }

  // position player and enemies around obstacles.
  findGoodPosition(player);
  for (var i=0; i<numEnemies; i++){
  findGoodPosition(enemies[i]);
  }

  // start sound
    music.launchPart1();
}
