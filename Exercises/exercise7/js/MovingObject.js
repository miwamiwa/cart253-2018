// MovingObject
//
// A class that defines how a paddle behaves, including the ability
// to specify the input keys to move it up and down

// EDIT: paddles shoot fireballs.

// MovingObject constructor
//
// Sets the properties with the provided arguments or defaults
function MovingObject(x,y,w,h,speed,downKey,upKey,leftKey, rightKey, shootKey) {
  // position and size
  this.x = x;
  this.y = y;

  this.size = 20;
  // speed
  this.vx = 0;
  this.vy = 0;
  this.speed = speed;

  // key controls
  this.downKey = downKey;
  this.upKey = upKey;
  this.leftKey = leftKey;
  this.rightKey = rightKey;
  this.fireKey = shootKey;

  // reload timer for shooting
  this.reloadTimer = 0;
  this.reloadLength = 2000;

  // fill
  this.red = random(215);
  this.green = random(125);
  this.blu = random(125);

  this.foodInBelly = 0;
  this.isSick = false;
  this.smellRange = 200;
  this.knownObjects = [];
  this.knownObjectsInRange = [];
  this.healthydroppings = 0;
  this.sickdroppings = 0;
}

// handleInput()
//
// Check if the up or down keys are pressed and update velocity
// appropriately
MovingObject.prototype.handleInput = function() {
  if (keyIsDown(this.upKey)) {
    this.vy = -this.speed;
  }
  else if (keyIsDown(this.downKey)) {
    this.vy = this.speed;
  }
  else if (keyIsDown(this.leftKey)) {
    this.vx = -this.speed;
  }
  else if (keyIsDown(this.rightKey)) {
    this.vx = this.speed;
  }
  // NEW : FIRE KEY
  else if (keyIsDown(this.fireKey)) {
    // shoot a bullet
    this.shoot();
    // start reload timer
    this.reloadTimer = millis()+this.reloadLength;
  }
  else {
    this.vy = 0;
    this.vx=0;
  }
}


MovingObject.prototype.update = function() {


  // check all obstacles
  for (var i=0; i<obstacles.length; i++){

if (obstacles[i].size>5){

    //if close to left obstacle wall, can't move right.
    if(
      this.x+this.vx<obstacles[i].x
      && this.x+this.vx+this.size>obstacles[i].x
      && this.y+this.size>obstacles[i].y
      && this.y<obstacles[i].y+obstacles[i].size
      && this.vx>0
    ){
    this.x=obstacles[i].x-this.size;
    this.vx =0;
    console.log("collided with obstacle #"+i+", on its left side");
    this.eatObstacle(i);
  }
  //if close to right obstacle wall, can't move left.
  else if(
    this.x+this.vx+this.size>obstacles[i].x+obstacles[i].size
    && this.x+this.vx<obstacles[i].x+obstacles[i].size
    && this.y+this.size>obstacles[i].y
    && this.y<obstacles[i].y+obstacles[i].size
    && this.vx<0
  ){
  this.x=obstacles[i].x+obstacles[i].size;
  this.vx =0;
  console.log("collided with obstacle #"+i+", on its right side");
    this.eatObstacle(i);
}
  // if close to top wall, can't move down
  if(
    this.y+this.vy<obstacles[i].y
    && this.y+this.vy+this.size>obstacles[i].y
    && this.x+this.size>obstacles[i].x
    && this.x<obstacles[i].x+obstacles[i].size
    && this.vy>0
  ){
  this.y=obstacles[i].y-this.size;
  this.vy =0;
  console.log("collided with obstacle #"+i+", on its upper side");
    this.eatObstacle(i);
}
  //if close to bottom obstacle wall, can't move up
  else if(
    this.y+this.vy+this.size>obstacles[i].y+obstacles[i].size
    && this.y+this.vy<obstacles[i].y+obstacles[i].size
    && this.x+this.size>obstacles[i].x
    && this.x<obstacles[i].x+obstacles[i].size
    && this.vy<0
  ){
  this.y=obstacles[i].y+obstacles[i].size;
  this.vy =0;
  console.log("collided with obstacle #"+i+", on its bottom side");
  this.eatObstacle(i);
}
}
}
  // update and constrain x, y position
  this.y += this.vy;
  this.y = constrain(this.y,0,height-this.size);
  this.x +=this.vx;
  this.x = constrain(this.x,0,width-this.size);
}

// display()
//
// Draw the paddle as a rectangle on the screen
MovingObject.prototype.display = function() {
  noStroke();
  fill(this.red, this.green, this.blu)
  rect(this.x,this.y,this.size,this.size);
  fill(this.red+40, this.green+40, this.blu+40)
  if(this.reloadTimer>millis()){
  rect(this.x,this.y,this.size,this.size-map(this.reloadTimer-millis(), 0, this.reloadLength, 0, this.size));
}
noFill()
stroke(255, 0, 0);
ellipse(this.x+this.size/2, this.y+this.size/2, this.smellRange, this.smellRange);
noStroke()
}




MovingObject.prototype.eatObstacle = function(index) {
  if(obstacles.length>0){
  if(this.reloadTimer<millis() && obstacles[index].edible){
this.foodInBelly +=1;
if(obstacles[index].type === 2){
this.isSick = true;
}
obstacles[index].getEaten();
console.log("ate an object");
this.reloadTimer = millis()+this.reloadLength;

//update knowledge of object
var alreadyKnown = false;
for (var i=0; i<this.knownObjects.length; i++){
  if (this.knownObjects[i] === obstacles[index].type){
    alreadyKnown = true;
  }
}
if(!alreadyKnown){
  this.knownObjects.push(obstacles[index].type);
    console.log("new known objects");
}
if(obstacles[index].size<5){
  removeObstacle(index);
}
}
}

}

MovingObject.prototype.digest = function () {
if(this.foodInBelly === playerIsFullThreshold && this.reloadTimer<millis()){
  this.foodInBelly = 0;

  if(this.isSick){
      droppings.push(new Droppings(this.x, this.y, false, playerIsFullThreshold));
      this.sickdroppings+=1;
  }
  else {
    droppings.push(new Droppings(this.x, this.y, true, playerIsFullThreshold));
    this.healthydroppings+=1;
  }
this.isSick = false;
}
}

MovingObject.prototype.sniffOut = function () {
  // find which objects are in range
  this.knownObjectsInRange = [];
  var nextObject=false;
  //for all obstacles
  for (var i=0; i<obstacles.length; i++){


    var distance = dist(this.x+this.size/2, this.y+this.size/2, obstacles[i].x+obstacles[i].size/2, obstacles[i].y+obstacles[i].size/2);
    nextObject=false;

    // if this obstacle is in range
    if(distance<this.smellRange/2){
var alreadysmelled = false;
      // tag if already smelled
      for (var k=0; k<this.knownObjectsInRange.length; k++){

        if (this.knownObjectsInRange[k]===obstacles[i].type){
          alreadysmelled = true;
          console.log("already smelled")
        }
      }


    for (var j=0; j<this.knownObjects.length; j++){
      // if this is a known object
      if(this.knownObjects[j]===obstacles[i].type &&nextObject === false && !alreadysmelled){
        // and not already smelled

          this.knownObjectsInRange.push(this.knownObjects[j]);
         nextObject = true;
      }
    }
    }
  }

  // express which objects are in range

    console.log("objects in range: "+this.knownObjectsInRange);

}
