/*
MovingObject.js
So far this is used to handle the player object only, but I originally intended
to have multiple objects with the same behavior (thus the name, which is not
Player.js). I suppose I could have a freakin flock of racoons running around
the player or something.. this script as it is could open up that option.

*/

// movingobject()
//
// modified paddle.js code from project 2.
// Sets the properties with the provided arguments or defaults

function MovingObject(x,y,speed,downKey,upKey,leftKey, rightKey) {
  // position and size
  this.x = x;
  this.y = y;

  this.size = 50;
  this.z =this.size/2;
  // speed
  this.vx = 0;
  this.vy = 0;
  this.speed = speed;
  this.angle =0;

  this.health = initialHealth;

  // key controls
  this.downKey = downKey;
  this.upKey = upKey;
  this.leftKey = leftKey;
  this.rightKey = rightKey;
  this.strafeLeft = 81;
  this.strafeRight = 69;
  this.eatKey = 70;

  // time until the player can eat again
  this.eatingTimer = 0;
  this.eatingTimerLength = 2000;
  //
  this.poopingTimer =0;
  this.poopingTimerLength = 500;

  // fill
  this.red = random(215);
  this.green = random(125);
  this.blu = random(125);

  //game mechanics

  // counts how many food items the player has eaten
  // this is reset upon expelling droppings
  this.foodInBelly = 0;

  // if the player ate anything bad he is sick for the rest of this digestive
  // cycle (meaning he will create sickly droppings)
  this.isSick = false;

  // range within which the player will perceive smells/sounds
  this.smellRange = 200;

  // list of smells the player knows about
  this.knownObjects = [];

  // list of known smells which can be detected within smelling range
  this.knownObjectsInRange = [];

  // count healthy and sickly droppings
  // (to be used to keep score one way or another)
  this.healthydroppings = 0;
  this.sickdroppings = 0;


  // animation variables

  // back leg motion
  this.legAngle = 0;
  // front leg motion
  this.legAngle2 = 0;
  // leg motion speed
  this.legRate =0.5;
  // tail motion along x and y axis
  this.tailXAngle =0;
  this.tailYAngle =0;
  // head bob
  this.headWobble = 0;
  // head bob speed
  this.wobbleRate = 0.2;

  // part sizes

  this.bodSize = this.size;
  this.headSize = this.size*0.6;
  this.tailSize = this.size*0.2;
  this.tailLength = this.size*0.4;
  this.eyeSize= this.size/10;
  this.earSize = this.size/7;
  this.legSize = this.size*0.3;
  this.noseSize = this.size*0.3;

  this.healthyFoodEaten = 0;
  this.sicklyFoodEaten =0;

  this.wasHitTimer =0;
  this.wasHitTimerLength = 400;

  this.ringOsc =0;
  this.ringOscRate =0.08;
  this.roomLeft = 0;
  this.updateRoomLeft();

  this.tailWiggleX = 0;
  this.tailWiggleY = 0;

  this.headBob = 0;

  // calculate change in leg position
  this.legTranslate = 10;
  this.legSin = 0;
  this.legSin2 = 0;
  this.legCos = 0;
  this.legCos2 =0;

}



// handleInput()
//
// Check if the control keys are pressed and update velocity
// accordingly

MovingObject.prototype.handleInput = function() {

  // player left-right rotation speed
  var angleSpeed = 5.0;

  // up key is pressed
  if (keyIsDown(this.upKey)) {

    // update x and y velocity according to current bearing
    this.vy -= cos(this.angle);
    this.vx += sin(this.angle);
    // trigger appropriate parts motion
    this.legAngle += this.legRate;
    this.legAngle2 += this.legRate;
    this.tailXAngle += this.legRate;

  }

  // down key is pressed
  else if (keyIsDown(this.downKey)) {

    // update x and y velocity according to current bearing
    this.vy += cos(this.angle);
    this.vx -= sin(this.angle);
    // trigger appropriate parts motion
    this.legAngle += this.legRate;
    this.legAngle2 += this.legRate;
    this.tailXAngle += this.legRate;
  }  // if no keys are pressed stop moving.
  else {
    this.vx=0;
    this.vy=0;
  }
  // left key is pressed
  if (keyIsDown(this.leftKey)) {

    // rotate left
    this.angle -= radians(angleSpeed);
    // trigger appropriate parts motion
    this.legAngle2 += this.legRate;
    this.tailYAngle += this.legRate;
    this.tailXAngle =0;
  }

  // right key is pressed
  else if (keyIsDown(this.rightKey)) {

    // rotate right
    this.angle += radians(angleSpeed);
    // trigger appropriate parts motion
    this.legAngle2 += this.legRate;
    this.tailYAngle += this.legRate;
    this.tailXAngle =0;
  }


  // strafe left key is pressed
  if (keyIsDown(this.strafeLeft)) {

    // trigger appropriate parts motion
    this.legAngle2 += this.legRate;

    // update x and y velocity according to bearing
    this.vy -= sin(this.angle);
    this.vx -= cos(this.angle);
  }

  // strafe right key is pressed
  else if (keyIsDown(this.strafeRight)) {

    // trigger appropriate parts motion
    this.legAngle2 += this.legRate;

    // update x and y velocity according to bearing
    this.vy += sin(this.angle);
    this.vx += cos(this.angle);

  }

  // trigger footsteps sound
  if((this.vx>0 || this.vy>0) && music.musicInc % (sfx2.downChirpFXlength+10)===0){
    music.startSFX(sfx2, "downchirp");
  }

  // constrain velocity to fit speed
  this.vx = constrain(this.vx, -this.speed, this.speed);
  this.vy = constrain(this.vy, -this.speed, this.speed);
}



// update()
//
// check if player is moving into an obstacle wall:
// this stops motion and enables eating the obstacle.
// update position according to velocity

MovingObject.prototype.update = function() {

  // check for collision with any obstacle

  // check through all obstacles
  for (var i=0; i<obstacles.length; i++){

    // don't bother checking if:
    // obstacle isn't within close range,
    // obstacle's size too small
    if (obstacles[i].size>5 && dist(this.x, this.y, obstacles[i].x, obstacles[i].y)<(foodSize+this.size)*1.1){

      // if is trying to move into either of the obstacle's walls, stop moving
      // also enables eating object.
      if( (
        // if player hits left obstacle wall
        collideLineRect(
          obstacles[i].x,
          obstacles[i].y,
          obstacles[i].x,
          obstacles[i].y+obstacles[i].size,
          this.x+this.vx,
          this.y+this.vy,
          this.size,
          this.size
        )
        // and player is moving to the right
        && this.vx>0
      )
      || (
        // OR if player hits right obstacle wall
        collideLineRect(
          obstacles[i].x+obstacles[i].size,
          obstacles[i].y,
          obstacles[i].x+obstacles[i].size,
          obstacles[i].y+obstacles[i].size,
          this.x+this.vx,
          this.y+this.vy,
          this.size,
          this.size
        )
        // and player is moving to the left
        && this.vx<0
      )
      || (
        // OR if player hits top obstacle wall
        collideLineRect(
          obstacles[i].x,
          obstacles[i].y,
          obstacles[i].x+obstacles[i].size,
          obstacles[i].y,
          this.x+this.vx,
          this.y+this.vy,
          this.size,
          this.size
        )
        // and player is moving down
        && this.vy>0
      )
      || (
        // OR if player hits bottom obstacle wall
        collideLineRect(
          obstacles[i].x,
          obstacles[i].y+obstacles[i].size,
          obstacles[i].x+obstacles[i].size,
          obstacles[i].y+obstacles[i].size,
          this.x+this.vx,
          this.y+this.vy,
          this.size,
          this.size
        )
        // and player is moving up
        && this.vy<0
      )
    ){
      // stop moving
      this.vx =0;
      this.vy =0;
      // check if eating key is pressed and enable eating this obstacle
      if (keyIsDown(this.eatKey)) {
        this.eatObstacle(i);
      }
    }
  }
}

//update position
this.x+=this.vx;
this.y+=this.vy;

// constrain position inside world boundaries
this.x = constrain(this.x, -world.w/2, world.w/2)
this.y = constrain(this.y, -world.h/2, world.h/2)

// set camera to match player position
this.setCam();
}



// setcam()
//
// sets camera's x, y position and x, y direction to match player position

MovingObject.prototype.setCam = function(){

  camera(this.x+camOffsetX, this.y-camYAngle+camOffsetY,  (height/2.0) / tan(PI*30.0 / 180.0)+camOffsetZ, this.x, this.y,0, 0 , 1, 0);

}



// display()
//
// draws the racoon, its hoop and its spotlight.

MovingObject.prototype.display = function() {

  // move to racoon position
  translate(this.x, this.y, this.z);

  // create spotlight over racoon
  this.createSpotLight();

  // display a hoop representing smell range and game events such as:
  // player/human collision, eating, chewing, pooping.
  this.displaySmellRange();

  // rotate racoon according to key controls
  rotateZ(this.angle);

  // update tail, legs and head position
  this.updateParts();
  // display racoon
  this.displayRacoon();
}



// createspotlight()
//
// creates a light that follows the player

MovingObject.prototype.createSpotLight = function(){
  push();
  translate(0, 0, this.size*3)
  directionalLight(0, 0, 215,0, 0);
  pop();
}



// updateparts()
//
// update position of racoon parts using oscillators

MovingObject.prototype.updateParts = function(){

  // calculate change in tail position
  this.tailWiggleX = sin(this.tailXAngle)*5;
  this.tailWiggleY = sin(this.tailYAngle)*5;

  // increment head bob
  this.headWobble += this.wobbleRate;
  // calculate change in head position
  this.headBob = sin(this.headWobble)*3;

  // calculate change in leg position
  this.legTranslate = 10;
  this.legSin = sin(this.legAngle2)*this.legTranslate;
  this.legSin2 = sin(this.legAngle2+PI)*this.legTranslate;
  this.legCos = cos(this.legAngle)*this.legTranslate;
  this.legCos2 = cos(this.legAngle+PI)*this.legTranslate;
}



// displayracoon();
//
// display the boxes that make up the racoon

MovingObject.prototype.displayRacoon = function(){

  // draw racoon

  // body
  push();
  texture(racTexture);
  box(this.bodSize);
  pop();

  // tail
  push();
  texture(racTexture2);
  // inmost tail part
  translate(0, this.bodSize/2+this.tailLength/2, 0);
  box(this.tailSize, this.tailLength, this.tailSize);
  // outmost tail part
  translate(this.tailWiggleX, this.tailLength, this.tailWiggleY);
  box(this.tailSize+5, this.tailLength, this.tailSize+5);
  pop();

  // head
  push();
  translate(0, -this.bodSize/2-this.headSize/2, this.headBob);
  texture(racTexture);
  box(this.headSize);

  // nose
  push();
  specularMaterial(125);
  translate(0, -this.headSize/2-this.noseSize/2, 0);
  box(this.noseSize);
  // nose tip
  specularMaterial(25);
  translate(0, -5*this.noseSize/8, 0);
  box(this.noseSize/4);
  pop();

  // ears
  push();
  specularMaterial(125);
  // ear 1
  translate(this.earSize, -this.headSize/6, this.headSize/2+this.earSize/2);
  box(this.earSize);
  // ear 2
  translate(-2*this.earSize, 0, 0);
  box(this.earSize);
  pop();

  //head stripes
  // white stripe
  specularMaterial(255);
  translate(0, -this.headSize/3, this.headSize/4);
  box(this.headSize+2, this.headSize/3+2, this.headSize/3);
  // black stripe
  specularMaterial(0);
  translate(0, 0, -this.headSize/2);
  box(this.headSize+2, this.headSize/3+2, this.headSize/3);

  //eyes
  // eye 1
  translate(this.eyeSize*2, -(this.headSize/2-this.headSize/3)-this.eyeSize/2, this.headSize/2);
  box(this.eyeSize);
  // eye 2
  translate(-this.eyeSize*4, 0, 0);
  box(this.eyeSize);
  pop();

  //frontright leg
  push();
  specularMaterial(85);
  translate(this.bodSize/2+this.legSize/2, -this.bodSize/4-this.legSize/2, this.legSin-10);
  box(this.legSize);
  pop();
  stroke(125);
  //frontleft leg
  push();
  specularMaterial(85);
  translate(-this.bodSize/2-this.legSize/2, -this.bodSize/4-this.legSize/2, this.legSin2-10);
  box(this.legSize);
  pop();

  //backright leg
  push();
  specularMaterial(85);
  translate(this.bodSize/2+this.legSize/2, +this.bodSize/4+this.legSize/2, this.legCos-10);
  box(this.legSize);
  pop();

  //backleft leg
  push();
  specularMaterial(85);
  translate(-this.bodSize/2-this.legSize/2, +this.bodSize/4+this.legSize/2, this.legCos2-10);
  box(this.legSize);
  pop();
}



// displaysmellrange()
//
// draw a hoop around the player that indicates smell range,
// with a colour that reflects certain game events

MovingObject.prototype.displaySmellRange = function(){

  push()
  ambientMaterial(45, 45, 185, 85);
  stroke(95, 95, 185);

  // change the hoop's fill depending on player status
  // if player is chewing
  if(this.eatingTimer>millis()){
    ambientMaterial(45, 185, 45, 205);
    stroke(45, 185, 45);
  }
  // if player is pooping
  if (this.poopingTimer>millis()){
    ambientMaterial(185, 85, 65, 205);
    stroke(185, 85, 65);
  }
  // if player's just been hit
  if (this.wasHitTimer>millis()){
    ambientMaterial(185, 185, 25, 205);
    stroke(185, 185, 25);
  }
  // if eating key is pressed
  if(keyIsDown(this.eatKey)){
    ambientMaterial(185, 185, 225, 205);
    stroke(185, 185, 225);
  }

  // display a cylinder of this colour below the player,
  translate(0, 0, -this.size/2+5)
  rotateX(PI/2)
  cylinder(this.size*1.1, 2);
  rotateX(-PI/2)
  // and display the hoop
  translate(0, 0, this.size*0.6)
  this.ringOsc+=this.ringOscRate;
  rotateY(cos(this.ringOsc)/50)
  torus(this.smellRange-15, 8);
  translate(0, 0, 10);
  rotateY(-cos(this.ringOsc)/50)
  rotateY(cos(this.ringOsc/2)/50)
  torus(this.smellRange, 4);
  pop()
}



// eatobstacle()
//
// check if a given obstacle is edible.
// reduce its size,
// count objects eaten,
// update info text below the screen
// check if this is a known object,
// if not add it to list of known objects,
// trigger digestion (when belly is full, empty belly)


MovingObject.prototype.eatObstacle = function(index) {

  // if obstacle is large enough to eat
  // and player is done chewing
  // and obstacle is edible
  if(
    obstacles.length>0
    &&this.eatingTimer<millis()
    && obstacles[index].edible
  ){
    // add to total food in belly
    this.foodInBelly +=1;
    this.updateRoomLeft();

    // remove a bit of size off this specific obstacle
    obstacles[index].getEaten();

    // trigger actions depending on if food was good or bad
    switch(obstacles[index].healthy){
      case true: this.healthyObsEaten(index); break;
      case false: this.unhealthyObsEaten(index); break;
    }

    // start chewing timer
    this.eatingTimer = millis()+this.eatingTimerLength;

    // gain knowledge of this food object
    this.checkKnownObjects(index);


  }
}



// checkknownobjects()
//
// when food is eaten,
// check through known objects
// if this isn't a known object, add if to known objects.

MovingObject.prototype.checkKnownObjects = function(index){
  var alreadyKnown = false;
  // look through all known objects to check if you already know about this one
  for (var i=0; i<this.knownObjects.length; i++){
    // if you already know about it,
    if (this.knownObjects[i] === obstacles[index].type){
      // this boolean will turn the next if() statement off.
      alreadyKnown = true;
    }
  }

  // if this isn't a known object
  if(!alreadyKnown){
    // learn about it by adding its type to the knownObjects array.
    this.knownObjects.push(obstacles[index].type);
  }
}



// healthyobseaten()
//
// fired upon eating healthy foods
// counts healthy foods eaten and healthy foods left on screen
// updates health accordingly

MovingObject.prototype.healthyObsEaten = function(index){
  this.healthyFoodEaten ++;
  this.health+=healthyPoopBonus;
  if (obstacles[index].size<=0){
    healthyobs -=1
  }
}



// unhealthyobseaten()
//
// fired upon eating unhealthy foods
// counts unhealthy foods eaten and unhealthy foods left on screen
// updates health accordingly

MovingObject.prototype.unhealthyObsEaten = function(index){
  this.sicklyFoodEaten ++;
  this.health-=unhealthyPoopPenalty;
  this.isSick = true;
  console.log("blabla "+obstacles[index].size)
  if (obstacles[index].size<=0){
    sicklyobs -=1;
  }
}



// digest()
//
// fired when food is eaten
// check if player is full and trigger digestion
// digest any food inside player's belly and create poop :)
// resets amount of food inside belly.
// checks if level is complete

MovingObject.prototype.digest = function () {

  // if player is full and done eating
  if(this.foodInBelly >= playerIsFullThreshold && this.eatingTimer<millis()){

    // reset amount of food inside belly
    this.foodInBelly = 0;
    this.updateRoomLeft();
    displayHealth();
    // update score text
    displayScore();
    displayObstaclesLeft();

    // shoot the pooping timer
    this.poopingTimer = millis() + this.poopingTimerLength;

    // if player is sick because of what he ate
    if(this.isSick){
      // create a new sickly dropping and add to total count.
      droppings.push(new Droppings(this.x, this.y, false, playerIsFullThreshold));
      this.sickdroppings+=1;
    }
    else {
      // if the player is health, create and count a healthy dropping.
      droppings.push(new Droppings(this.x, this.y, true, playerIsFullThreshold));
      this.healthydroppings+=1;
    }

    // check if this level is complete
    checkLevelComplete();

    // player is no longer sick once he's digested (realistic i know)
    this.isSick = false;
  }
}


// updateroomleft()
//
// count how many more foods until digestion
// update info below the game screen

MovingObject.prototype.updateRoomLeft = function(){
  this.roomLeft = playerIsFullThreshold-this.foodInBelly;
  // update text at the bottom of the screen
  document.getElementById("7").innerHTML = this.roomLeft;
}



// sniffout()
//
// identify things in range that you can recognize using your racoonlike
// smelling ability.
// this is part of the runGame() loop.
// this function checks through a bunch of data everytime draw() is called,
// so i tried to shorten it by inserting booleans that interrupt the search
// once appropriate matches are found.

MovingObject.prototype.sniffOut = function () {

  // reset array containing objects in range
  this.knownObjectsInRange = [];

  // nextObject is used to stop searching through known objects
  // when a match is found, allowing the code to skip right to the next object.
  var nextObject=false;

  //for all obstacles
  for (var i=0; i<obstacles.length; i++){

    // reset nextObject trigger
    nextObject=false;

    // calculate distance to player
    var distance = dist(this.x+this.size/2, this.y+this.size/2, obstacles[i].x+obstacles[i].size/2, obstacles[i].y+obstacles[i].size/2);

    // if this obstacle is in range
    if(distance<this.smellRange && obstacles[i].size>0){

      // we only want one voice to play per type of object, so this boolean
      // will prevent multiple objects of the same type to be added to the
      // knownObjectsInRange array.

      var alreadysmelled = false;

      // for any object already recognized
      for (var k=0; k<this.knownObjectsInRange.length; k++){
        // if an object matches the object which is currently being examined,
        // indicate that we already know this object is within range.
        if (this.knownObjectsInRange[k]===obstacles[i].type){
          alreadysmelled = true;
        }
      }

      for (var j=0; j<this.knownObjects.length; j++){
        // if this is a known object
        if(this.knownObjects[j]===obstacles[i].type
          // and we haven't added this object to the array yet
          &&nextObject === false
          // and we haven't smelled an object of the same type
          && !alreadysmelled){
            // then add this object to knownObjectsInRange array, and move on to
            // next object
            this.knownObjectsInRange.push(this.knownObjects[j]);
            nextObject = true;
          }
        }
      }
    }
  }



// increasesize()
//
// fired upon eating
// increase player size and player parts size

  MovingObject.prototype.increaseSize = function(){

    this.size += playerSizeIncrease;
    this.bodSize = this.size;
    this.headSize = this.size*0.6;
    this.tailSize = this.size*0.2;
    this.tailLength = this.size*0.4;
    this.eyeSize= this.size/10;
    this.earSize = this.size/7;
    this.legSize = this.size*0.3;
    this.noseSize = this.size*0.3;
  }
