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
var angle2=0;
var angle3=0;
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
angle2+=0.1;
angle3+=5;

var sinmotion = sin(angle);
var sinmotion2 = sin(angle2/2);

camera(200+sinmotion2*100, 0, 200+sinmotion*100, 0, 0, 0, 0, 1, 0);
rotateZ(angle);
fill(225, 225, 0);
box(100);
rotateZ(-angle);

rotateY(angle);
translate(100, 0, 0)
rotateZ(angle2);
fill(0, 0, 200);
box(20);
rotateZ(-angle2);

rotateY(angle+1);
translate(50, 0, 0)
rotateY(angle3);

fill(100);
box(10);

}
