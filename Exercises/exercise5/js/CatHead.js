/*

CatHead.js
This is the scaleable cat head used both in Game.js and GOCat.js.

this script handles:
- creating a new cat head -> CatHead()
- displaying the head -> dislay()
- animating ears, jaw and eyes -> wiggleEars(), moveJaw(), growEye()
- resetting scale upon game reset -> reset()

*/

var catConstrain=50;

// CatHead()
//
// creates a new cat head.

function CatHead() {
  //position (bottom left corner)
  this.x=500;
  this.y=200;
  // scaling= the triangles were mapped in another code with a larger image; so they need scaling
  // y-scaling.
  this.ys=0.3;
  // x-scaling. used to scale but also to flip the image
  this.xs=0.3;
  // enlarging eye animation
  this.eye=false;
  // gobbling jaw animation
  this.gobble=false;
  // length of jaw movement
  this.jaw=20;
  // increment for ear movement
  this.earInc=0;
  // stopper for ear increment
  this.maxMvmt=20;
  // stopper for jaw increment
  this.jawMax=20;
  // growing eye increment
  this.eye=0;
  // wiggling ear increment
  this.ear=0;
  // a variable to create a display timer
  this.dispTimer= 0;
  // length of display timer
  this.timerLength=1500;
}

// display()
//
// displays the cat head.
CatHead.prototype.display = function(){


  // update jaw, eye and ear movement
  this.moveJaw();
  this.growEye();
  this.wiggleEars();


  // now draw the cat head
  fill(152);
  strokeWeight(0);

  // coordinates of the triangles were generated in an another script by me (which i would post but it's on processing..?)
  // here they are scaled (this.xs, this.ys) and translated (this.x, this.y)

  // lower jaw (moving part)
  // this.jaw used to change the y-pos of lips (tip of the mouth)
  triangle(this.x+565*this.xs, this.y+(611+this.jaw)*this.ys, this.x+466*this.xs, this.y+563*this.ys, this.x+386*this.xs, this.y+646*this.ys);
  triangle(this.x+466*this.xs, this.y+563*this.ys, this.x+588*this.xs, this.y+(572+this.jaw)*this.ys, this.x+565*this.xs, this.y+(611+this.jaw)*this.ys);
  //upper jaw (moving part)
  triangle(this.x+466*this.xs, this.y+563*this.ys, this.x+588*this.xs, this.y+(572-this.jaw)*this.ys, this.x+638*this.xs, this.y+464*this.ys);

  // head (static part)
  triangle(this.x+638*this.xs, this.y+464*this.ys, this.x+598*this.xs, this.y+414*this.ys, this.x+466*this.xs, this.y+563*this.ys);
  triangle(this.x+466*this.xs, this.y+563*this.ys, this.x+539*this.xs, this.y+318*this.ys, this.x+598*this.xs, this.y+414*this.ys);
  triangle(this.x+539*this.xs, this.y+318*this.ys, this.x+370*this.xs, this.y+204*this.ys, this.x+466*this.xs, this.y+563*this.ys);
  triangle(this.x+370*this.xs, this.y+204*this.ys, this.x+125*this.xs, this.y+226*this.ys, this.x+466*this.xs, this.y+563*this.ys);
  triangle(this.x+386*this.xs, this.y+646*this.ys, this.x+39*this.xs, this.y+591*this.ys, this.x+363*this.xs, this.y+664*this.ys);
  triangle(this.x+125*this.xs, this.y+226*this.ys, this.x+4*this.xs, this.y+325*this.ys, this.x+39*this.xs, this.y+591*this.ys);
  triangle(this.x+125*this.xs, this.y+226*this.ys, this.x+466*this.xs, this.y+563*this.ys, this.x+39*this.xs, this.y+591*this.ys);
  triangle(this.x+386*this.xs, this.y+646*this.ys, this.x+466*this.xs, this.y+563*this.ys, this.x+39*this.xs, this.y+591*this.ys);

  // ears (moving part)
  // this.ear used to change x-pos of ear tips
  fill(50);
  // "right" ear
  triangle(this.x+370*this.xs, this.y+204*this.ys, this.x+421*this.xs-this.ear, this.y+57*this.ys, this.x+125*this.xs, this.y+226*this.ys);
  // "left" ear
  triangle(this.x+263*this.xs, this.y+322*this.ys, this.x+345*this.xs+this.ear, this.y+27*this.ys, this.x+125*this.xs, this.y+226*this.ys);
  triangle(this.x+345*this.xs+this.ear, this.y+27*this.ys, this.x+370*this.xs, this.y+204*this.ys, this.x+263*this.xs, this.y+322*this.ys);

  // eye socket (static part)
  fill(80);
  triangle(this.x+460*this.xs, this.y+372*this.ys, this.x+512*this.xs, this.y+427*this.ys, this.x+508*this.xs, this.y+341*this.ys);
  // eye ellipse (moving part)
  // this.eye used to change y-size of ellipse.
  fill(0);
  ellipse(this.x+505*this.xs, this.y+380*this.ys, 20*this.ys, (40+this.eye)*this.ys);

}

// wiggleears()
//
// update factor (this.ear) by which ear wiggles left and right.

CatHead.prototype.wiggleEars = function(){
  // smoothe out the motion using a cos() function
  this.ear=cos(map(this.earInc, 0, 20, 0, TWO_PI))*3;
  // increment ear motion
  this.earInc+=1;
  // reset ear motion
  if(this.earInc===20){
    this.earInc=0;
  }
}

// movejaw();
//
// update factor (this.jaw) by which jaw "gobbles" (opens and closes)

CatHead.prototype.moveJaw = function (){
  // start from the top and increment down (jaw starts open)
  this.jawMax-=1;
  // if 0 is reached
  if(this.jawMax===0){
    // stop motion
    this.jawMax=this.maxMvmt;
    this.gobble=false;
  }
  // apply cosine motion
  this.jaw=cos(map(this.jawMax, 0, this.maxMvmt, 0, TWO_PI));
  // map to match correct jaw width
  this.jaw=map(this.jaw, -1, 1, 0, 20);
}

// groweye();
//
// update factor (this.eye) by which eye grows.

CatHead.prototype.growEye = function (){
  // increment size
  this.eye+=1;
  // stop motion and reset
  if(this.eye===this.maxMvmt){this.eye=false;}
  if(this.eye===this.maxMvmt+1){this.eye=0;}
}

// reset()
//
// called upon game reset.
// resets timer, resets scale and hides the head until its next call for action.

CatHead.prototype.reset = function(){
  // reset display timer
  this.dispTimer=0;
  // move cat head off screen
  this.x=width*2;
  this.y=height*2;
  // reset scale
  this.xs=0.3;
  this.ys=0.3;
}
