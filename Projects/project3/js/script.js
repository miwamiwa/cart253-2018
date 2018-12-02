// game screen
var canvas;

// game objects
var world;
var player;
var obstacles = [];
var droppings = [];
var enemies = [];
// sound
var synths = [];
var drums;
var music;
var perc = [];
var sfx;
var sfx2;

// number of obstacles on an axis
var xobs = 0;
var yobs = 0;
var obsMode = false;
var healthyobs =0;
var sicklyobs =0;
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
var pic1, pic2, pic3, pic4, pic5, pic6;

// game settings
var playerIsFullThreshold = 2;
var initialHealth =10;
var healthyPoopBonus = 1;
var unhealthyPoopPenalty = 1;
var enemyCaughtPlayerPenalty = 1;
var numEnemies = 0;
// food size affects grid size, and the goodposition() function
var foodSize= 80;
var damageToObstacles = foodSize;
var chanceForFood = 0.5;
var obstacleDensity = 0.1;
var playerSizeIncrease = 3;
var levelTarget = level+3;
// start level
var level =0;
var levelComplete = false;
var titleimg, gameoverimg, nextlvlimg, startimg, controlsimg, instructionsimg;
var gameOn = false;
var obsCol = [];
var obsRow = [];

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
  obsTexture = loadImage("images/xbox.jpg")
  /*
  pic1 = loadImage("images/1.jpg")
  pic2 = loadImage("images/2.jpg")
  pic3 = loadImage("images/3.jpg")
  pic4 = loadImage("images/4.jpg")
  pic5 = loadImage("images/5.jpg")
  pic6 = loadImage("images/6.jpg")
  */
  // load drums sounds
  clap = loadSound("sound/clap.mp3");
  kick = loadSound("sound/kick.mp3");
  cowbell = loadSound("sound/cowbell.mp3");
  tick = loadSound("sound/tick.mp3");
  titleimg = loadImage("images/title.jpg");
  gameoverimg = loadImage("images/gameover.jpg")
  nextlvlimg = loadImage("images/nextlevel.jpg");
  startimg = loadImage("images/start.jpg");
  controlsimg = loadImage("images/controls.jpg");
  instructionsimg = loadImage("images/instructions.jpg");

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


  document.getElementById("7").innerHTML = player.roomLeft;
  displayHealth();

  // set no stroke by default
  noStroke();
  setupMenu();
}

function setupMenu(){

  menu1 = new MenuObject(200, -30, instructionsimg, false);
  menu2 = new MenuObject(-200, 00, controlsimg, false);
  menu3 = new MenuObject(00, 30, titleimg, true);

}

// draw()
//
// loops the main game elements

function draw() {
  if(gameOn){
   runGame();
  }
  else {
    runMenu();
  }

  runSound();

}

function menuAction(){
  gameOn = true;
}
 function setupLevelMenu(){

   menu1 = new MenuObject(200, -30, instructionsimg, false);
   menu2 = new MenuObject(-200, 00, controlsimg, false);
   menu3 = new MenuObject(00, 30, nextlvlimg, true);

 }

function runMenu(){
  background(255);
  camera();
  menu1.update();
  menu2.update();
  menu3.update();

}

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
  //sfx.playSFX();
  //sfx2.playSFX();

  // increment musical time
  music.musicInc+=music.musicSpeed;
}

function displayLevelInfo(){
  // display level
  document.getElementById("1").innerHTML = level;
  // display objective
    document.getElementById("2").innerHTML = levelTarget-player.healthydroppings;
  // display number of healthy foods and number of unhealthy foods
var healthyfoods =0;
var unhealthyfoods =0;
  if(kindsOfObs%2===0){
    healthyfoods = (kindsOfObs-2)/2;
    unhealthyfoods = healthyfoods+1;
      document.getElementById("3").innerHTML = healthyfoods;
      document.getElementById("4").innerHTML = unhealthyfoods;
  }
  else {
    healthyfoods = (kindsOfObs-1)/2;
    unhealthyfoods = healthyfoods;
      document.getElementById("3").innerHTML = healthyfoods;
      document.getElementById("4").innerHTML = unhealthyfoods;
  }
  // display number of enemies
  document.getElementById("5").innerHTML = numEnemies;
  // display health
  displayHealth();
  // display room left
  player.updateRoomLeft();
}

// displayhealth()
//
// update health displayed below game screen

function displayHealth(){

  document.getElementById("6").innerHTML = player.health;
}


// displayscore()
//
// update number of healthy and unhealthy droppings below the game screen

function displayScore(){

  document.getElementById("2").innerHTML = levelTarget-player.healthydroppings;
  player.updateRoomLeft();

}

// checklevelcomplete()
//
// check if level object is met, then trigger a new level.

function checkLevelComplete(){

  if(player.healthydroppings >= levelTarget){
    levelComplete = true;
    level +=1;
    newLevel();
    setupLevelMenu();
    gameOn = false;
  }
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

// toggleObsMode()
//
// for testing purposes
// toggle cheat mode where obstacle types are visible

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
// click on top or bottom of screen to update camera Y offset
// click on left or right of screen to update camera Z offset
// camera() function is called inside MovingObject.js

function updateCam(){

  changeCamView = true;
  camOffsetY -= (mouseY-height/2)/height*10;
  camOffsetZ -= (mouseX-width/2)/width*10;
  camOffsetY = constrain(camOffsetY, -300, 350);
  camOffsetZ = constrain(camOffsetZ, -300, 350);
}

// findgoodposition()
//
// finds a random position for a player or enemy that's not inside an obstacle

function findGoodPosition(target) {

  var positionGood = false;
  // repeat until a good position is found
  while (!positionGood){
    // pick a new position
    target.x = random(-world.w/2, world.w/2);
    target.y = random(-world.h/2, world.h/2);
    var positionNoGood = false;
    // check if target would overlap with any obstacles
    for(var i=0; i < obstacles.length; i++){
      if(
        target.x>=obstacles[i].x-obstacles[i].size/2-foodSize/2
        && target.x<=obstacles[i].x+obstacles[i].size/2+foodSize/2
        && target.y>=obstacles[i].y-obstacles[i].size/2-foodSize/2
        && target.y<=obstacles[i].y+obstacles[i].size/2+foodSize/2
      ){
        positionNoGood=true;
      }
    }
    // if the position answers the criteria above, stop looping
    if(!positionNoGood){
      positionGood = true;
    }
  }
}

// newlevel()
//
// start a new level: load player, enemies, obstacles.
// set this level's target, based on number of obstacles in play
// load an oscillator for each type of obstacle in the level
// place the player and enemies away from obstacles
// update info below the screen

function newLevel(){

  levelComplete = false;

  // add an additional type of food for each level
  kindsOfObs = level+3;
  numEnemies +=1;

  // load player
  player = new MovingObject(0,height/2,3,83,87, 65, 68);

  // load enemies
  for (var i=0; i<numEnemies; i++){
    enemies[i] = new EnemyObject(50, 50);
  }

  // create a random array of obstacles.
  // new obstacles have a chance to be a wall-type object or a food object.

  // create a grid based on size of food objects
  obsRow = [];
  obsCol = [];
  xobs = (world.w)/foodSize;
  yobs = (world.h)/foodSize;
  console.log(xobs);
  for(var i=0; i<(xobs+1)*4; i++){
    obsCol.push(new ObsGroup(0));

  }
  for(var i=0; i<(yobs+1)*4; i++){
    obsRow.push(new ObsGroup(1));

  }

  // reset obstacles array, number of healthy obstacles and number
  // of unhealthy obstacles.
  healthyobs =0;
  sicklyobs =0;
  obstacles = [];

  // a variable to index obstacle position on the grid
  var obstacleindex =0;

  // for each point on the grid
  for (var i=0; i<xobs*yobs; i++){
    // random chance of generating an obstacle object
    if(random()<obstacleDensity){
      obstacles.push(new Obstacle(i, obstacleindex));
      // increment index
      console.log(obstacles[obstacleindex].column)
      var row = obstacles[obstacleindex].row;
      var col = obstacles[obstacleindex].column;
      obsRow[row].addNew(obstacles[obstacleindex]);
      obsCol[col].addNew(obstacles[obstacleindex]);
        obstacleindex +=1;
    }
  }

  // get this level's target (objective) based on number of
  // healthy obstacles in play
  levelTarget = floor(healthyobs/2-2);

  // position player and enemies around obstacles.
  findGoodPosition(player);
  for (var i=0; i<numEnemies; i++){
    findGoodPosition(enemies[i]);
  }

  // create a new synthesizor object for each kind of food in play
  for (var i=0; i<kindsOfObs-1; i++){
    synths[i] = new Synth("sine");
    console.log("newsynth")
  }
  // setup instruments
  music.setupInstruments();
  // start sound
  music.launchPart1();

  // update info below screen
  displayLevelInfo()
}



// windowresized()
//
// resize canvas upon resizing screen

function windowResized(){

  canvas = createCanvas(window.innerWidth, window.innerHeight-100, WEBGL);
  noStroke();
}
