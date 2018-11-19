// Droppings.js
//
// this script handles creating and displaying racoon droppings.

// Droppings()
//
// the droppings constructor contains variables for position
// and size. includes a random change for droppings to be healthy
// or sickly, so that I can test out both displays.

function Droppings(x, y){

  // position
  this.x = x;
  this.y = y;
  this.z = 0;

  // size
  this.size = 20;

  // randomly set this dropping to sickly or healthy
  if(random()<0.5){
    this.healthy = true;
  }
  else {
    this.healthy = false;
  }
}

// display()
//
// displays the dropping as a textured box.

Droppings.prototype.display = function(){

// move to droppings position
push();
translate(this.x, this.y, this.z);

// pick appropriate texture
if(this.healthy){
  texture(healthyTexture);
}
else {
  texture(sickTexture);
}

// display box
box(this.size);
pop();
}
