/*

droppings.js
this script displays racoon poop.

*/

// droppings constructor
//
// accepts coordinates, healthiness and size of dropping.

function Droppings(x, y, goodOrBad, size){
  this.x = x;
  this.y = y;
    this.z = 0;
  this.isHealthy = goodOrBad;
  this.size = 10+2*size;
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
