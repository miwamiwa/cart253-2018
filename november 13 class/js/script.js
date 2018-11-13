/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

// preload()
//
// Description of preload
var fft;

function preload() {
mySound = loadSound("assets/sounds/bark.wav");

}


// setup()
//
// Description of setup

function setup() {
  createCanvas(300, 300);
 fft = new p5.FFT();
 mySound.loop();

}


// draw()
//
// Description of draw()

function draw() {
  background(0);
var analysis = fft.analyze();

// energy is constrained between 0 and 255
var hi = fft.getEnergy(5000, 20000);
var mid = fft.getEnergy(250, 5000);
var lo = fft.getEnergy(20, 250);


fill(185, 25, 25);
rect(0, 0, 100, hi);
fill(25, 185, 25);
rect(100, 0, 100, mid);
fill(25, 25, 185);
rect(200, 0, 100, lo);
}
