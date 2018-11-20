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
  this.isHealthy = goodOrBad;
  this.size = 10+2*size;
}

// display()
//
// displays good and bad droppings with different colours.

Droppings.prototype.display = function (){
  if(this.isHealthy){
    // green for healthy
    fill(45, 185, 35);
  }
  else {
    // red for bad
    fill(185, 35, 35);
  }

  // display dropping
  rect(this.x, this.y, this.size, this.size);
}
