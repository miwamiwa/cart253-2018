/*

droppings.js
this script creates new racoon poop and display it.

*/

// droppings constructor
//
// accepts coordinates, healthiness and size of dropping.

function Droppings(x, y, goodOrBad, size){
  this.x = x;
  this.y = y;
  this.isHealthy = goodOrBad;
  this.size = 20+2*size;
  this.z = this.size/2  ;
}

// display()
//
// displays good and bad droppings with different colours.

Droppings.prototype.display = function (){
  // move to droppings position
  push();
  translate(this.x, this.y, this.z);

  // pick appropriate texture
  if(this.isHealthy){
    texture(healthyTexture);
  }
  else {
    texture(sickTexture);
  }

  // display box
  box(this.size);
  pop();
}
