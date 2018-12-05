/*
MenuObject.js
This script creates a box with a texture image that holds information.
The box can be resized on click. if the box is an action button,
it will trigger an action if it is clicked while its size is largest.
Clicking one box will resize the others.

my cat LOVED seeing these big cubes on the screen. this script is cat-approved.
*/

function MenuObject(x, y, img, isActionObject) {

  this.x = x;
  this.y = y;
  // object has a trigger associated with it or not
  this.isActionObject = isActionObject;
  // max and min size
  this.largeSize = width/6;
  this.smallSize = 50;
  this.size =this.smallSize;
  // oscillation angle
  this.angle =0;
  this.isLarge = false;
  // set initial size
  if(this.isActionObject){
    this.size =this.largeSize;
    this.isLarge = true;
  }
  // state
  this.shrinking = false;
  this.growing = false;

  // speed of change in size
  this.growSpeed = 3;
  this.shrinkSpeed = 5;
  this.textureimage = img;

}



// display()
//
// rotate and display menu object

MenuObject.prototype.display = function(){

  // increment angle
  this.angle +=0.01;
  push();
  // ambient light
    ambientLight(190, 210, 185);
  // translate and rotate
  var z = cos(this.angle)*5;
  var x = sin(this.angle)*8;
  translate(this.x, this.y, 0);
  rotateZ(radians(z));
  rotateX(radians(x));
  // display
  stroke(0);
  texture(this.textureimage);
  box(this.size);
  pop();

}


// check()
//
// fired on mousepress. checks if a menu object is hovered.
// make it shrink or grow depending on current state.
// trigger menu action depending on if this object has a trigger and its state.

MenuObject.prototype.check = function(){

  // check for mouse hover
  if(collidePointRect(mouseX, mouseY, width/2+this.x-this.size/2, height/2+this.y-this.size/2, this.size, this.size)){
    // if object is in large state
    if(this.isLarge){
      // trigger action
      if(this.isActionObject){
        menuAction();
        return;
      }
      // change state
      this.shrinking = true;
      this.growing = false;
    }
    // if not large state
    else {
      // change state
      this.growing = true;
      this.shrinking = false;

      // change state of other menu objects
      if(this===menu1){
        menu2.shrinking = true;
        menu2.growing = false;
        menu3.shrinking = true;
        menu3.growing = false;
      }
      else if(this===menu2){
        menu1.shrinking = true;
        menu1.growing = false;
        menu3.shrinking = true;
        menu3.growing = false;
      }
      else if(this===menu3){
        menu1.shrinking = true;
        menu1.growing = false;
        menu2.shrinking = true;
        menu2.growing = false;
      }
    }
  }
}



// shrink()
//
// shrink this menu object to the minimum size

MenuObject.prototype.shrink = function(){
  if(this.size <= this.smallSize){
    this.shrinking = false;
    this.isLarge = false;
  }
  if(this.shrinking){
    this.size -= this.shrinkSpeed;
  }
}



// grow()
//
// grow this menu object to the maximum size

MenuObject.prototype.grow = function(){
  if(this.size >= this.largeSize){
    this.growing = false;
    this.isLarge = true;
  }
  if(this.growing){
    this.size += this.growSpeed;
  }
}



// update()
//
// display, grow or shrink menu object.
// called within script.js

MenuObject.prototype.update = function(){
  this.shrink();
  this.grow();
  this.display();
}
