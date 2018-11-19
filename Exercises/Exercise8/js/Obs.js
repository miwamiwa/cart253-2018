// Obs.js
//
// creates and displays an obstacle object (either food
// or a wall).

// Obs()
//
// the obs() constructor creates variables for this obstacle's
// position, size and colour (if not textured).
// also randomly decides if this obstacle is food or a wall.

function Obs(x, y){

  // position
  this.x = x;
  this.y = y;
  this.z = 0;

  // size
  this.size = 50;

  // colour
  this.r = 185;
  this.g = 0;
  this.b = 185;

  // pick if food (edible) or wall (not edible)
  if(random()<0.5){
    this.edible = true;
  }
  else {
    this.edible = false;
  }
}

// display()
//
// gives the obstacle a texture or fill depending on obstacle type,
// displays the obstacle,
// creates a spotlight over the obstacle.

Obs.prototype.display = function(){

  // move to this obstacle's position
  push();
  translate(this.x, this.y, this.z);

  // pick correct texture or fill
  if(this.edible){
    texture(yumTexture);
  }
  else {
    specularMaterial(this.r, this.g, this.b);
  }

  // display obstacle
  box(this.size);

  // create spotlight over the obstacle
  pointLight(this.r, this.g, this.b, this.x, this.y, this.size);
  pop();
}
