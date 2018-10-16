/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

// preload()
//
// Description of preload
var ball;
function preload() {

}


// setup()
//
// Description of setup

function setup() {
createCanvas(400, 400);

ball= new Ball();



}


// draw()
//
// Description of draw()

function draw() {
  background(100);
  ball.update();
  ball.display();
  if(ball.x>width || ball.y>height){
    ball.reset();
  }
}
