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

  // time until the player can eat again
  this.eatingTimer = 0;
  this.eatingTimerLength = 2000;

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
}

// handleInput()
//
// Check if the control keys are pressed and update velocity
// accordingly

MovingObject.prototype.handleInput = function() {
  // up key
  if (keyIsDown(this.upKey)) {
    this.vy = -this.speed;
  }
  // down key
  else if (keyIsDown(this.downKey)) {
    this.vy = this.speed;
  }
  // left key
  else if (keyIsDown(this.leftKey)) {
    this.vx = -this.speed;
  }
  // right key
  else if (keyIsDown(this.rightKey)) {
    this.vx = this.speed;
  }
  // if no keys are pressed stop moving.
  else {
    this.vy = 0;
    this.vx=0;
  }
}

// update()
//
// check for obstacle collisions which prevent movement,
// update position according to velocity

MovingObject.prototype.update = function() {

  // check all obstacles
  for (var i=0; i<obstacles.length; i++){

    // if obstacle is large enough to eat
    if (obstacles[i].size>5){

      if(
        // if player is touching left obstacle wall
        this.x+this.vx<obstacles[i].x
        && this.x+this.vx+this.size>obstacles[i].x
        && this.y+this.size>obstacles[i].y
        && this.y<obstacles[i].y+obstacles[i].size
        // and attempting to move right
        && this.vx>0
      ){

        // overwrite x-pos so we don't accidentally move into the obstacle
        this.x=obstacles[i].x-this.size;
        // overwrite x velocity to stop moving
        this.vx =0;
        // nibble on this obstacle
        this.eatObstacle(i);
      }

      else if(
        // if player is touching right obstacle wall
        this.x+this.vx+this.size>obstacles[i].x+obstacles[i].size
        && this.x+this.vx<obstacles[i].x+obstacles[i].size
        && this.y+this.size>obstacles[i].y
        && this.y<obstacles[i].y+obstacles[i].size
        && this.vx<0
      ){
        // overwrite x-pos so we don't accidentally move into the obstacle
        this.x=obstacles[i].x+obstacles[i].size;
        // overwrite x velocity to stop moving
        this.vx =0;
        // nibble on this obstacle
        this.eatObstacle(i);
      }

      if(
        // if player is touching top obstacle wall
        this.y+this.vy<obstacles[i].y
        && this.y+this.vy+this.size>obstacles[i].y
        && this.x+this.size>obstacles[i].x
        && this.x<obstacles[i].x+obstacles[i].size
        && this.vy>0
      ){
        // overwrite y-pos so we don't accidentally move into the obstacle
        this.y=obstacles[i].y-this.size;
        // overwrite y velocity to stop moving
        this.vy =0;
        // nibble on this obstacle
        this.eatObstacle(i);
      }

      else if(
        // if player is touching bottom obstacle wall
        this.y+this.vy+this.size>obstacles[i].y+obstacles[i].size
        && this.y+this.vy<obstacles[i].y+obstacles[i].size
        && this.x+this.size>obstacles[i].x
        && this.x<obstacles[i].x+obstacles[i].size
        && this.vy<0
      ){
        // overwrite y-pos so we don't accidentally move into the obstacle
        this.y=obstacles[i].y+obstacles[i].size;
        // overwrite y velocity to stop moving
        this.vy =0;
        // nibble on this obstacle
        this.eatObstacle(i);
      }
    }
  }

  // update x, y position according to current velocity and constrain
  this.y += this.vy;
  this.y = constrain(this.y,0,height-this.size);
  this.x +=this.vx;
  this.x = constrain(this.x,0,width-this.size);
}

// display()
//
// Draw the paddle as a rectangle on the screen

MovingObject.prototype.display = function() {
  // stylize
  noStroke();
  fill(this.red, this.green, this.blu)
  // display the object
  rect(this.x,this.y,this.size,this.size);
  // stylize
  fill(this.red+40, this.green+40, this.blu+40);

  // visualize timer as a rect() over the player rect()
  // this tells you if the player is digesting or eating or nah

  var timeSinceStart = map(this.eatingTimer-millis(), 0, this.eatingTimerLength, 0, this.size);
  if(millis()<this.eatingTimer)
  rect(this.x,this.y,this.size,this.size-timeSinceStart);

  // display an ellipse to help visualize smelling range
  noFill()
  stroke(255, 0, 0);
  ellipse(this.x+this.size/2, this.y+this.size/2, this.smellRange, this.smellRange);
  noStroke()
}

// eatobstacle()
//
// check if a given obstacle is edible.
// eat it and suffer the consequences (or benefits)

MovingObject.prototype.eatObstacle = function(index) {

  // if obstacle is large enough to eat
  // and player is done eating
  // and obstacle is edible

  if(obstacles.length>0
    &&this.eatingTimer<millis()
    && obstacles[index].edible){

      // add to total food in belly
      this.foodInBelly +=1;

      // if food item is a bad food
      if(obstacles[index].type === 2){
        // player is now sick
        this.isSick = true;
      }

      // remove a bit of size off this specific obstacle
      obstacles[index].getEaten();

      // start eating timer
      this.eatingTimer = millis()+this.eatingTimerLength;

      // gain knowledge of this food object

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
  }

  // digest()
  //
  // check if player is full and trigger digestion
  // digest any food inside player's belly and output droppings :)
  // resets amount of food inside belly.
  // this is part of the runGame() loop.

  MovingObject.prototype.digest = function () {

    // if player is full and done eating
    if(this.foodInBelly >= playerIsFullThreshold && this.eatingTimer<millis()){

      // reset amount of food inside belly
      this.foodInBelly = 0;

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

      // player is no longer sick.
      // right now this happens whenever the player has digested, but the game
      // could be made more interesting (and challenging) if the player had to
      // pickup an antidote or drink some water or anything like that.

      this.isSick = false;
    }
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
      if(distance<this.smellRange/2){

        // we only want one voice to play per type of object, so this boonlean
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
