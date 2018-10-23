/*

CatArm.js
This is the cat arm/leg/limb that swipes at the ball when it reaches the sides.

this scrips handles:
- creating the CatArm object
- moving the arm towards the center of the screen and back
- displaying the arm
- preparing the arm for motion by flipping it along the y-axis
and resetting its motion triggers


*/


// this is the cat this that swipes at the ball when it reaches the side walls
function CatArm(){
  //position
  this.x=200;
  this.y=height+200;
  // height and width (used to scale the image)
  this.h=100;
  this.w=80;
  // paw width
  this.paw=22;
  // this thickness
  this.thick=42;
  // finger radius
  this.rad=40;
  // finger inner radius
  this.rad2=15;
  // movement triggers
  // move from bottom of screen upward
  this.move1=false;
  //and back again
  this.move2=false;
  // move from top of the screen downward
  this.move3= false;
  // and back again
  this.move4= false;
  // finished moving trigger
  this.moveDone=true;
  // velocity
  this.vy=0;
  this.speed=7;
  // how long to extend the this
  this.extend=180;
}

// move()
//
// moves the arm to the center of the screen then back.
// sets appropriate direction for the arm's motion depending
// on whether it's on the top or bottom side of the screen.

CatArm.prototype.move = function(){

  // MOVE 1 AND 2: ARM IS SWIPING AT THE BOTTOM OF THE SCREEN

  // if move1 is active
  if(this.move1){
    // move arm up
    this.vy-=this.speed;
    // once arm has reached maximum extension,
    // turn arm trigger off and turn next one on.
    if(this.vy<=-this.extend){
      this.move1=false;
      this.move2=true;
    }
  }
  // if move2 is active
  if(this.move2){
    // move arm down
    this.vy+=this.speed;
    // once motion has reached its end
    // stop all arm motion
    if(this.vy>=0){
      this.move2=false;
      this.moveDone=true;
    }
  }

  // MOVE 3 AND 4: ARM IS SWIPING ON TOP OF THE SCREEN

  // move3 is active
  if(this.move3){
    // move arm down
    this.vy+=this.speed;
    // motion finished:
    // stop move3 and start move4
    if(this.vy>=-this.extend){
      this.move3=false;
      this.move4=true;
    }
  }
  // move4 is active
  if(this.move4){
    // move this up
    this.vy-=this.speed;
    // motion finished:
    // stop all motion.
    if(this.vy<=0){
      this.move4=false;
      this.moveDone=true;
    }
  }
  // set this.x to match where the ball is
  this.x=ball.x;
  // update arm's y-position according to velocity
  this.y=thisStartPos+this.vy;
}

// display()
//
// displays the cat arm.
// uses this.h and this.paw to flip the image to correct position

CatArm.prototype.display = function(){

  // arm

  noFill()
  stroke(165);
  strokeWeight(this.thick);
  arc(this.x, this.y, this.w, 2*this.h, 1.5*PI, 0.25*PI);

  // paw

  // outer circle
  fill(185);
  noStroke();
  ellipse(this.x-this.paw/2, this.y-this.h+this.paw, 1.6*this.paw, 1.6*this.paw);
  ellipse(this.x, this.y-this.h-this.paw, 1.6*this.paw, 1.6*this.paw);
  ellipse(this.x-this.paw, this.y-this.h, 1.6*this.paw, 1.6*this.paw);
  // inner circle
  fill(145);
  noStroke();
  ellipse(this.x-this.paw/2, this.y-this.h+this.paw, 1*this.paw, 1*this.paw);
  ellipse(this.x, this.y-this.h-this.paw, 1*this.paw, 1*this.paw);
  ellipse(this.x-this.paw, this.y-this.h, 1*this.paw, 1*this.paw);

  // claws

  noFill();
  stroke(215);
  strokeWeight(5);
  // if arm is on bottom side
  if(this.paw>0){
    // display claws accordingly
    arc(this.x-1.1*this.paw, this.y-this.h+2*this.paw, 30, 50, 1.25*PI, 1.5*PI);
    arc(this.x-0.6*this.paw, this.y-this.h-0.3*this.paw, 60, 50, 1.20*PI, 1.5*PI);
    arc(this.x-1.6*this.paw, this.y-this.h+this.paw, 50, 50, 1.25*PI, 1.5*PI);
  } else {
    // if arm is on top display these claws instead
    arc(this.x-1.1*this.paw, this.y-this.h+2*this.paw, 30, 50, 0.25*PI, 0.5*PI);
    arc(this.x-0.6*this.paw, this.y-this.h-0.3*this.paw, 60, 50, 0.2*PI, 0.5*PI);
    arc(this.x-1.6*this.paw, this.y-this.h+this.paw, 50, 50, 0.25*PI, 0.5*PI);
  }
}

// movetop()
//
// gets called called upon initiating motion on top of the screen
// resets motion triggers
// flips arm to correct side of the screen
// starts motion

CatArm.prototype.movetop = function(){
  // if arm is currently not moving
  if(this.moveDone){
    // reset velocity and motion triggers
    this.vy=0;
    this.move1=false;
    this.move3=false;
    // set paw to face down
    // invert shapes
    this.paw=-abs(this.paw);
    this.h=-abs(this.h);
    this.extend=-abs(this.extend);
    // set position
    thisStartPos=-200;
    // start motion
    this.move3=true;
    this.moveDone=false;

  }
}

// movebottom();
//
// gets called called upon initiating motion at the bottom of the screen
// resets motion triggers
// flips arm to correct side of the screen
// starts motion

CatArm.prototype.movebottom = function(){
  // if arm is currently not moving
  if(this.moveDone){
    // reset velocity and motion triggers
    this.vy=0;
    this.move1=false;
    this.move3=false;
    // set paw to face up
    // invert shapes
    this.paw=abs(this.paw);
    this.h=abs(this.h);
    this.extend=abs(this.extend);
    // set position
    thisStartPos=height+200;
    // start motion
    this.move1=true;
    this.moveDone=false;
  }
}
