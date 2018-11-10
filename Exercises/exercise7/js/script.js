
var player

var canvas;

var obstacles = [];
var totalobs = 0;

// number of obstacles on an axis
var xobs = 0;
var yobs = 0;

var obsSize= 50;

// setup()
//
// Creates the ball and paddles

function setup() {
  // create canvas:
  canvas = createCanvas(900, 450);
  canvas.parent('sketch-holder');
  player = new Paddle(0,height/2,20,60,4,83,87, 65, 68, 49);

  xobs = floor(width/obsSize);
  yobs = floor(height/obsSize);

  for (var i=0; i<xobs*yobs; i++){
    if(random()<0.5){
      totalobs+=1;
      obstacles.push(new Obstacle(i));
    }
  }

}

// draw()
//
// loops sound and  displays either game or menu screen

function draw() {

  runGame();
}

// rungame()
//
// handles inputs, movement, collisions, game mechanics.

function runGame(){

  background(255);

  player.handleInput();

  player.update();

  player.display();

for(var i=0; i<obstacles.length; i++){
  obstacles[i].display();
}

}

// keypressed()
//
// a place to test functions

function keyPressed(){

}
