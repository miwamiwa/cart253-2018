/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

// preload()
//
// Description of preload
var camOffsetX = 0;
var camOffsetY = 0;
var camOffsetZ = 0;

var obs = [];
var player;
var human;
var changeCamView = false;
  var camYAngle = -250;

function preload() {

}


// setup()
//
// Description of setup

function setup() {
createCanvas(500, 500, WEBGL);
obs[0] = new Obs(100, 100);
obs[1] = new Obs(200, 100);
obs[2] = new Obs(300, 100);
obs[3] = new Obs(100, 200);
obs[4] = new Obs(200, 200);
player = new Player(300, 200);
human = new Human(400, 400);


}


// draw()
//
// Description of draw()

function draw() {

background(255);
obs[0].display();
obs[1].display();
obs[2].display();
obs[3].display();
obs[4].display();
human.display();
player.handleInput();
player.display()
if(mouseIsPressed){
updateCam();
}
}

function keyPressed(){
  switch(key){
    case "1": human.vx = 1; human.vy =0; break;
    case "2": human.vx = -1; human.vy =0; break;
    case "3": human.vx = 0; human.vy =1; break;
    case "4": human.vx = 0; human.vy =-1; break;
  }
}

function updateCam(){
  changeCamView = true;
//  camOffsetZ -= (mouseX-width/2)/width*10;
  camOffsetY -= (mouseY-height/2)/height*10;
//  camOffsetZ = constrain(camOffsetZ, -100, 100);
  camOffsetY = constrain(camOffsetY, -300, 350);
}