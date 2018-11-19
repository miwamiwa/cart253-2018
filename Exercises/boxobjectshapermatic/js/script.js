/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

var object;
var selected =-1;

function setup() {
createCanvas(400, 400, WEBGL);
object = new KwikObject(width/2, height/2, 0);
}

function draw() {
  background(255);
  camera(width/2-100, height/2-100, 400, width/2, height/2, 0, 0, 1, 0)
  ambientLight(255, 255, 255);
  object.display();


}

function keyPressed(){
  switch(key){
    case "1": newCube(0, 0, 0, 20, 20, 20, 45, 45, 45, 0, 0, 0); break;
    case "2": object.cubes[selected].x -= 10; break;
    case "3": object.cubes[selected].x += 10; break;
    case "4": object.cubes[selected].y -= 10; break;
    case "5": object.cubes[selected].y += 10; break;
    case "6": object.cubes[selected].z -= 10; break;
    case "7": object.cubes[selected].z += 10; break;
    case "8": object.cubes[selected].w += 10;
    object.cubes[selected].h += 10;
    object.cubes[selected].d += 10;
    break;
    case "9": object.cubes[selected].w -= 10;
    object.cubes[selected].h -= 10;
    object.cubes[selected].d -= 10;
     break;
     case "0": object.cubes[selected].rFill += 10;
     object.cubes[selected].gFill += 10;
     object.cubes[selected].bFill += 10;
      break;
  }
}

function newCube(x, y, z, w, h, d, r, g, b, rx, ry, rz){
  object.cubes.push(new KwikCube(x, y, z, w, h, d, r, g, b, rx, ry, rz));
  selected = object.cubes.length-1;
}

function showgrid(){
  strokeWeight(3);
  stroke(255, 0, 0);
  line(width/2, height/2, -500, width/2, height/2, 500);
  stroke(0, 0, 255);
  line(width/2, 0, width/2, height);
  line(0, height/2, width, height/2);
  noStroke();
}
