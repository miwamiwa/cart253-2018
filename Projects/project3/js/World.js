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
  this.x = 0;
  this.y = 0;
  this.z = -25;
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

  push();
  translate(0, 0, -200);

  texture(lowergroundImage);
  plane(width*10, height*8);

  pop();
  push();
  rotateX(3*PI/2);
  translate(0,0 , - height*4);
  texture(backgroundImage);
  plane(width*10, height*3.5);
  pop();
  push();
  // sets ambient light and sun
  this.setLight();

  // point to the middle of the canvas

  translate(this.x, this.y, this.z);
  // create "world" as one big box
  texture(groundTexture);
  box(this.w, this.h, -50);

  pop();
}

// setLight()
//
// activate world-related lights

World.prototype.setLight = function (){

// ambient light
  ambientLight(190, 210, 185);
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
  // create light
  pointLight(200, 200, 200, this.lightX, this.lightY, 50);
  pop();
  pop();

  // get new sun position using noise()

  // increment noise
  this.lightMotion+=0.001;
  // x-motion
  noiseSeed(0);
  this.lightX = map(noise(this.lightMotion), 0, 1, -this.w/2, this.w/2);
  // y-motion
  noiseSeed(1);
  this.lightY = map(noise(this.lightMotion), 0, 1, -this.w/2, this.w/2);
  // z-position
  this.lightZ = 300;


}
