/*
Ant.js
When balls collide, an ant appears in their place!
The ants are a total nuisance - they grab balls and damage your paddle.
Generally they just wander around, but sometime they swarm collectively towards a given paddle.

This script handles:
- creating a new ant
- updating ant position based on velocity and target position
- displaying the ant
- giving it a new target
- collision with an object (paddle or ball)
- sabotage: remove a ball from play or eat away from the paddle
- "dropping" the item: picking a new target and triggering a chance for a biscuit
*/

// Ant()
//
// creates the ant object.
// accepts the x, y coordinates of the balls which collided and created the ant

function Ant(x1, y1, x2, y2) {

  // the 6 possible stages in the life of an ant:

  // a short pause as the ant ponders on its next move
  this.waiting = false;
  // the ant is making its way to a random target
  this.searching = true;
  // the ant is carrying an item to its stash
  this.isCarrying = false;
  // the ant obtains an item either via theft or via sabotage
  this.itemPickedUp= false;
  // the ant acts to avenge a recently dead fellow ant by migrating ("swarming")
  // together with all other ants towards either paddle
  this.migrating = false;
  // the ant is.. dead....
  this.antIsDead = false;

  console.log("new ant");

  // x, y position of both rect()'s that make the ant
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  // x, y position of the ant
  this.x = 2*x1-x2;
  this.y = 2*y1-y2;
  // size
  this.size = 10;
  // size difference of inner rect()
  this.dif = random(1, this.size-1);
  // speed
  this.speed = 0;
  this.vx = 0;
  this.vy = 0;
  // ants use a noise() function to move around.
  // noise increment
  this.inc = 0;
  // size of increment
  this.rate = 0.1;
  // target position
  this.tarx = game.width/2;
  this.tary = game.height/2;
  // target size
  this.tars = 10;
  // ants wait a little when they reach their target.
  // time at which ant stops waiting
  this.waitTimer = 0;
  // wait duration
  this.waitLength = 500;
  // the stash is where the ants bring their item before picking a new target
  // stash position:
  this.stashx = game.width/2;
  this.stashy = game.height/2;
  // stash size
  this.stashsize = 10;
  // the damage an ant deals to a paddle's height
  this.damage = 10;
  // start sfx
  music.startSFX(sfx, "down");

}

// update()
//
// update x, y velocity to point the ant towards its target
// update this ant's position


Ant.prototype.update = function(){

  // update speed
  this.inc += this.rate;
  this.speed = 1+noise(this.inc);

  // move ant towards its target along x axis:
  // if target is to the right
  if(this.x<this.tarx){
    // move right
    this.vx = this.speed;
  }
  // if target is to the left
  else if(this.x>this.tarx+this.tars){
    // move left
    this.vx = -this.speed;
  }
  else {
    // else do not move
    this.vx = 0;
    this.migrating=false;
  }
  // move ant towards its target along y axis:
  // if target is below
  if(this.y<this.tary){
    // move down
    this.vy = this.speed;
  }
  // if target is above
  else if(this.y>this.tary+this.tars){
    // move up
    this.vy = -this.speed;
  }
  // else do not move
  else {
    this.vy = 0;
    this.migrating=false;
  }

  // if ant has reached its target, wait a bit
  if (this.vx===0&&this.vy===0&&this.waiting===false){
    // turn searching off and waiting on
    this.searching = false;
    this.waiting = true;
    // start wait timer
    this.waitTimer = millis() + this.waitLength;
  }

  // if ant is done waiting, start "searching"
  // if wait timer is over
  if(this.waitTimer<millis()&&this.waiting){
    // if ant was carrying something, drop it
    if(this.isCarrying){
      this.dropItem();
    }
    // set a new target for the ant to reach
    this.newTarget();
    // turn waiting off and searching on
    this.waiting=false;
    this.searching = true;
  }

  //update position of ant
  this.x += this.vx;
  this.y += this.vy;

  // update position of ant parts
  var ascale = 3;
  this.x1 = this.x + ascale*this.vx;
  this.x2 = this.x - ascale*this.vx;
  this.y1 = this.y + ascale*this.vy;
  this.y2 = this.y - ascale*this.vy;

}

// display()
//
// display ant parts

Ant.prototype.display = function(){

  noStroke();

  var red, gre, blu;

  if(this.searching||this.isCarrying){
    // display the item ant is carrying
    if(this.isCarrying){
      // if it's carrying something, display it.
      stroke(85);
      fill(255);
      rect(this.x+this.size/2, this.y+this.size/2, 10, 10);
    }
      // set fill according to ant's current action or level

    // set color while searching and carrying (actions the ant is carrying out most of the time)
    // to reflect the ant's level or damage it deals.


    // level 5: light grey
     if(this.damage>=30){
      red = 125;
      gre = 125;
      blu = 135;

    }
    // level 4: red
    else if(this.damage>=25){
      red = 125;
      gre = 75;
      blu = 75;
    }
    else if(this.damage>=20){
     // level 3: blue
     red = 75;
     gre = 75;
     blu = 125;
   }
   // level 2: green
    else if(this.damage>=15){
     red = 75;
     gre = 125
     blu = 75;
   }
    // level1: grey
    else if(this.damage>=10){
      red = 75;
      gre = 75;
      blu = 75;
    }
  }

  if(this.waiting){
    // blue if waiting
    red = 45;
    gre = 45;
    blu = 185;
  }

  if(this.itemPickedUp){
    // red if picking something up
    red = 185;
    gre = 45;
    blu = 45;
  }

  // display ant parts
  fill(red, gre, blu);
  rect(this.x1, this.y1, this.size, this.size);
  rect(this.x2, this.y2, this.size, this.size);

  // give the ant body a smaller, lighter rect() within those last rect()s
  fill(red+40, gre+40, blu+40);
  rect(this.x1+this.dif/2, this.y1+this.dif/2, this.size-this.dif, this.size-this.dif);
  rect(this.x2+this.dif/2, this.y2+this.dif/2, this.size-this.dif, this.size-this.dif);
}

// newtarget()
//
// pick a new target point from a list of places to go.

Ant.prototype.newTarget = function(){

  // set list:
  // possible targets are the four corners, the two paddles, and the middle of the screen.
  var targetxlist = [0, game.width-2*this.size, leftPaddle.x, rightPaddle.x, game.width/2, 0, game.width-2*this.size];
  var targetylist = [0, 0, leftPaddle.y, rightPaddle.y, game.height/2, game.height-2*this.size, game.height-2*this.size];

  // pick a random number
  var choice = floor(random(targetxlist.length));
  // set new target x, y position
  this.tarx = targetxlist[choice];
  this.tary = targetylist[choice];

  // if ant picked something up, the new target is the stash
  if(this.itemPickedUp){
    // set target x, y position to stash x, y position
    this.tarx = this.stashx;
    this.tary = this.stashy;
    this.tars = this.stashsize;
    console.log("item picked up");
    // set carrying to true and picking up to false.
    this.itemPickedUp=false;
    this.isCarrying=true;
  }
}

// handlecollision()
//
// handles collision with paddle and ball.
// accepts either a paddle or a ball.

Ant.prototype.handleCollision = function(thing) {

  if(!thing.isSafe&&!this.isCarrying&&!this.itemPickedUp){
    // Check if the ant overlaps the thing on x axis
    if (this.x + this.size > thing.x && this.x < thing.x + thing.w) {
      // Check if the ant overlaps the thing on y axis
      if (this.y + this.size > thing.y && this.y < thing.y + thing.h) {
        // set target to the item the and just collided with.
        // this will cause the ant to wait for a sec as it has reached its target.
        // then it will move towards the stash.
        // target position
        this.tarx = thing.x;
        this.tary = thing.y;
        // target size
        this.tars = thing.size;
        // ant has picked something up
        this.itemPickedUp = true;
        // sabotage the thing we have collided with
        this.sabotage(thing);
      }
    }
  }
}

// sabotage()
//
// remove a ball from play,
// or remove some height off the targeted paddle

Ant.prototype.sabotage = function(thing){

  // if target is a ball
  if(thing.type==="ball"){
    for(var i=0; i<balls.length; i++){
      // find the ball in the array of balls by looking up its x, y coordinates
      if(thing.x===balls[i].x&&thing.y===balls[i].y){
        // remove that ball.
        actions.removeBall(i);
        // trigger sabotage sfx
        music.startSFX(sfx, "downchirp");
      }
    }
  }
  // if target is a paddle
  if(thing.type==="paddle"){
    // remove some height
    thing.h -= this.damage;
    // signify that paddle was sabotaged (supposed to trigger a safe timer. think i removed it though)
    thing.wasSabotaged=true;
    // trigger sabotage sfx
    music.startSFX(sfx, "downchirp");
  }
}

//dropitem()
//
// ant drops the item it is carrying.
// causes a chance for the biscuit to appear
// ant gets slightly stronger

Ant.prototype.dropItem = function(){

  // ant is no longer carrying anything
  this.isCarrying = false;
  // it is now searching
  this.searching=true;
  // pick a new target
  this.newTarget();
  // increase ant damage
  this.damage+=antEatingBonus;
  console.log("dropped");
  console.log("chance that biscuit appears");

  // trigger random chance that a health biscuit appears
  if(random()<biscuitChance){
    console.log("biscuit appeared!");
    // trigger biscuit
    biscuit.appear();
  }
}
