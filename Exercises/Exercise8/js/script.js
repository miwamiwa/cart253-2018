/*****************
Samuel Paré-Chouinard
Exercise 8:
3D environment prototype for Project 3.

While in exercise 7 I created game mechanics with no graphics, here I have
graphics with no mechanics.

- Game elements from ex7 such as the player, humans, obstacles, foods and
droppings are fleshed out using boxes.

- I've added a World object which is the platform above which the
game takes place. The camera will follow the player, so the world can be
made larger than the canvas width.

- As I mentionned aboved, I added a camera that follows the player. I also
have an attempt at implementing camera control (hold click on top half
of screen to zoom out, hold click on bottom half of screen to zoom in).

- I've include some light effects (spotlights over most objects and a sun)

- Some objects have textures (placeholder paint masterpieces) while others
have different colours.

- This script includes testing racoon motion and human object rotation

- One foreseable issue in combining this with ex7 is that objects here are drawn
from their center, while in ex7 everything is calculated from the top left
corner. I wasn't planning to make this game using WEBGL at the time, so I'll
have to revisit ex7 using rectMode(CENTER) before merging these two parts.


******************/

// variables declared here

// game objects
var obs = [];
var droppings = [];
var player;
var human;
var world;

// camera settings
var camOffsetX = 0;
var camOffsetY = 0;
var camOffsetZ = 0;
var changeCamView = false;
var camYAngle = -250;

// textures
var yumTexture;
var racTexture;
var healthyTexture;
var sickTexture;

// preload()
//
// loads images to be used for textures

function preload() {

  // load images
  yumTexture = loadImage("images/yum.jpg");
  racTexture = loadImage("images/racoon.jpg");
  healthyTexture = loadImage("images/healthy.jpg");
  sickTexture = loadImage("images/sickly.jpg");
}


// setup()
//
// creates canvas and game objects.

function setup() {

  // create canvas
  createCanvas(500, 500, WEBGL);

  // create game objects
  obs[0] = new Obs(100, 100);
  obs[1] = new Obs(200, 100);
  obs[2] = new Obs(300, 100);
  obs[3] = new Obs(100, 200);
  obs[4] = new Obs(200, 200);
  droppings[0] = new Droppings(300, 300);
  droppings[1] = new Droppings(300, 350);
  droppings[2] = new Droppings(350, 300);
  droppings[3] = new Droppings(350, 350);
  droppings[4] = new Droppings(350, 400);
  player = new Player(300, 200);
  human = new Human(400, 400);
  world = new World();

  // no stroke by default
  noStroke();
}


// draw()
//
// Draws world and game objects.
// Handles player key controls
// Handles click to zoom out

function draw() {

  // draw background
  background(255);

  // display the world
  world.display();

  // display some obstacles and droppings
  for(var i=0; i<5; i++){
    obs[i].display();
    droppings[i].display();
  }

  // allow player key controls (to test out leg motion)


  // display a human
  human.display();

  // handle racoon input and display
  player.handleInput();
  player.display()

  // listen for mouse pressed
  if(mouseIsPressed){
    // trigger zoom out
    updateCam();
  }
}

// keypressed()
//
// used to test out rotating the human.

function keyPressed(){

  switch(key){
    // press one to face right
    case "1": human.vx = 1; human.vy =0; break;
    // press two to face left
    case "2": human.vx = -1; human.vy =0; break;
    // press three to face down
    case "3": human.vx = 0; human.vy =1; break;
    // press four to face up
    case "4": human.vx = 0; human.vy =-1; break;
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
