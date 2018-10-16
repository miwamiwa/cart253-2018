/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

// preload()
//
// Description of preload
var balls=100;
var ball;
var ball2;
var ballArray=[balls];
function preload() {

}


// setup()
//
// Description of setup

function setup() {
createCanvas(600, 400);
loadballs();

}
 function loadballs(){
   ball= new Ball(30, -20, 4, 10);
   ball2= new Ball(20, 10, 5, 8);

   for(var i=1; i<balls; i++){
     ballArray[i]=new Ball(i*5, i, i, i);
   }
 }


// draw()
//
// Description of draw()

function draw() {
  background(0);

  for(var i=1; i<balls; i++){
    ballArray[i].update();
    ballArray[i].display();
  }
}
