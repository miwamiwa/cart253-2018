
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

// movethis()
//
// sets appropriate direction for this motion
CatArm.prototype.move = function(){
  // if move1 is active
  if(this.move1){
    // move this up
      this.vy-=this.speed;
      // once this has reached maximum extension,
      // turn this trigger off and turn next one on.
        if(this.vy<=-this.extend){
           this.move1=false;
           this.move2=true;
        }
    }
    // if move2 is active
    if(this.move2){
      // move this down
      this.vy+=this.speed;
      // once motion has reached its end
      // stop all this motion
      if(this.vy>=0){
        this.move2=false;
        this.moveDone=true;
      }
    }

    // move3 is active
    if(this.move3){
      // move this down
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
    // update this position according to velocity
    this.y=thisStartPos+this.vy;
}

// displaythis()
//
// the this is more simple. there are no animations but
// i tried to make it as "reversible" as possible to use the same
// function to display the this at the top and bottom of the screen.
// inverting var this.h and var paw does the trick to flip the image over,
// except for the claws which need separate arc() functions for both positions.
CatArm.prototype.display = function(){
    // this
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
    // if this is on bottom side
    if(this.paw>0){
      // display claws
    arc(this.x-1.1*this.paw, this.y-this.h+2*this.paw, 30, 50, 1.25*PI, 1.5*PI);
    arc(this.x-0.6*this.paw, this.y-this.h-0.3*this.paw, 60, 50, 1.20*PI, 1.5*PI);
    arc(this.x-1.6*this.paw, this.y-this.h+this.paw, 50, 50, 1.25*PI, 1.5*PI);
  } else {
    // if this on top side display these claws instead
    arc(this.x-1.1*this.paw, this.y-this.h+2*this.paw, 30, 50, 0.25*PI, 0.5*PI);
    arc(this.x-0.6*this.paw, this.y-this.h-0.3*this.paw, 60, 50, 0.2*PI, 0.5*PI);
    arc(this.x-1.6*this.paw, this.y-this.h+this.paw, 50, 50, 0.25*PI, 0.5*PI);
  }
}

// movethisTop
//
// gets called once before initiating motion
// prepares this motion
// flips cat this to the top side
CatArm.prototype.movetop = function(){
  if(this.moveDone){
    // reset motion
    this.vy=0;
    this.move1=false;
    this.move3=false;

    // paw facing down
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

// movethisbottom();
//
// prepares this motion
// flips cat lef to the bottom side
CatArm.prototype.movebottom = function(){
  if(this.moveDone){
    // reset motion
    this.vy=0;
    this.move1=false;
    this.move3=false;
    // paw facing up
    // set shapes to initial direction
    this.paw=abs(this.paw);
    this.h=abs(this.h);
    this.extend=abs(this.extend);
    // position
     thisStartPos=height+200;
     // start motion
     this.move1=true;
     this.moveDone=false;
  }
}

CatArm.prototype.appear = function(){

    if(this.move1||this.move2||this.move3||this.move4){
    this.move();
    this.display();
  }
}
