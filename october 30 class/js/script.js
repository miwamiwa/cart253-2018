/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

// preload()
//
// Description of preload
var angle=0;
function preload() {

}


// setup()
//
// Description of setup

function setup() {
createCanvas(500, 500, WEBGL);

}


// draw()
//
// Description of draw()

function draw() {
background(255);

angle+=0.03;
rotateY(angle);
fill(225, 225, 0);
box(100);
translate(100, 0, 0)
rotateY(angle);
fill(0, 0, 200);
box(20);
translate(50, 0, 0)
rotateY(angle);

fill(100);
box(10);

}
