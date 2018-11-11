
var player

var canvas;

var obstacles = [];
var totalobs = 0;
var kindsOfObs = 3;
var playerIsFullThreshold = 1;
var droppings = [];

// sound
var synths = [];
var drums;
var music;

var obsMode = true;

// number of obstacles on an axis
var xobs = 0;
var yobs = 0;

var obsSize= 15;

// setup()
//
// Creates the ball and paddles

function setup() {
  // create canvas:
  canvas = createCanvas(900, 450);
  canvas.parent('sketch-holder');
  player = new MovingObject(0,height/2,20,60,4,83,87, 65, 68, 49);
  for (var i=0; i<kindsOfObs-1; i++){
    synths[i] = new Synth("sine");
    console.log("new synth");
  }

  drums = new Drum("white");
  music = new Music();
  music.setupInstruments();
  music.launchPart1();
  xobs = floor((width-50)/obsSize);
  yobs = floor((height-50)/obsSize);

var obstacleindex =0;
  for (var i=0; i<xobs*yobs; i++){
    if(random()<0.1){
      totalobs+=1;

      obstacles.push(new Obstacle(i, obstacleindex));
      obstacleindex +=1;
    }
  }

}

// draw()
//
// loops sound and  displays either game or menu screen

function draw() {

  runGame();

runSound();
}

// rungame()
//
// handles inputs, movement, collisions, game mechanics.

function runGame(){

  background(255);

  player.handleInput();

 player.update();

player.digest();
player.sniffOut();
  player.display();
  displayScore();

  if(droppings.length!=0){
    for(var i=0; i<droppings.length; i++){
      droppings[i].display();
    }
  }



for(var i=0; i<obstacles.length; i++){
  obstacles[i].display();
}


}

function runSound(){
  for (var i=0; i<player.knownObjectsInRange.length; i++){
    var whichobject = player.knownObjectsInRange[i]-1;
    synths[whichobject].playMusic();
  }
  drums.handleDrums();
  // increment musical time
  music.musicInc+=music.musicSpeed;
}

// keypressed()
//
// a place to test functions

function keyPressed(){
switch(key){
  case " ": playerIsFullThreshold +=1; break;
  case "q": toggleObsMode(); break;
}
}

function toggleObsMode(){
  if(obsMode){
    obsMode = false;
  } else {
    obsMode = true;
  }
}
function removeObstacle(index){
console.log("OBSTACLEREMOVED");
    // save length of balls array
    var length = obstacles.length;
    // unless this ball is the last ball on the list
    if(index!=length){
      // glue together parts of the list that come before and after this ball
      obstacles = concat(subset(obstacles, 0, index), subset(obstacles, index+1, length));
    }
    // if it is the last ball
    else{
      // list becomes everything until the last ball
      obstacles = subset(obstacles, 0, index);
    }
    // print new ball array size
    console.log("balls: "+obstacles.length);

}

function displayScore(){

  fill(0);
  text("healthy droppings: "+player.healthydroppings+", sickly droppings: "+player.sickdroppings, 10, 10);
}
