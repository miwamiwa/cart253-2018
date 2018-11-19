// World.js
//
// contains the world constructor.
// displays the world platform (right now in 1 color but could be textured
// or made up of different tiles)
// sets ambient light
// creates a "sun" that wanders around

// World()
//
// creates variables to hold world size, world position, and light motion. 

function World() {

  // world

  // position
  this.x = width/2;
  this.y = height/2;
  this.z = -30;
  // size
  this.w = width*2;
  this.h = height*2;

  // light

  // sun position
  this.lightX=0;
  this.lightY =0;
  this.lightZ =0;
  // increments motion around the world
  this.lightMotion =0;
  // increments sun rotation
  this.sunRotation=0;
}

// display()
//
// trigger light effects and display world platform

World.prototype.display = function(){

  // sets ambient light and sun
  this.setLight();

  // point to the middle of the canvas
  push();
  translate(this.x, this.y, this.z);

  // create "world" as one big box
  ambientMaterial(255);
  box(this.w, this.h, 10);

  pop();
}

// setLight()
//
// activate world-related lights

World.prototype.setLight = function (){

// ambient light
  ambientLight(125, 85, 65);
  // sun light
  this.displaySun();
}

// displaysun()
//
// display the sun's static and spinning parts:
//   a cylinder, two cones and a torus.
// move the sun
// create sunlight

World.prototype.displaySun = function(){

  // increment sun rotation
  this.sunRotation+=0.03;

  // define change in sun parts rotation
  var torusRotation = cos(this.sunRotation)/4;
  var coneRotation = sin(this.sunRotation)*2*PI;

  // display cylinder in the middle
  push();
  translate(this.lightX, this.lightY, this.lightZ);
  fill(200, 200, 25);
  stroke(225, 225, 85);
  cylinder(10, 10);
  push();

  // display spinning torus
  rotateZ(-coneRotation);
  rotateY(torusRotation);
  torus(20, 5);
  pop();

  // display spinning cones
  push();
  // cone 1
  rotateZ(coneRotation);
  rotateX(0.5*PI);
  translate(0, 25, 0);
  cone(10, 30);
  // cone 2
  rotateX(PI);
  translate(0, 50, 0);
  cone(10, 30);

  pop();
  pop();

  // get new sun position using noise()

  // increment noise
  this.lightMotion+=0.001;
  // x-motion
  noiseSeed(0);
  this.lightX = noise(this.lightMotion)*this.w;
  // y-motion
  noiseSeed(1);
  this.lightY = noise(this.lightMotion)*this.h;
  // z-position
  this.lightZ = 200;

  // create light
  pointLight(200, 200, 200, this.lightX, this.lightY, this.lightZ);
}
