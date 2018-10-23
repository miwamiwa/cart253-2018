var catConstrain=50;
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
  // a variable to create a display timer
  this.dispTimer= 0;
  // length of display timer
  this.timerLength=1500;
}


CatHead.prototype.display = function(){
  // animations were placed in different function since
  // at first i wanted them to run at specific times only.
  // in the end continuous motion looks pretty nice.
// check if jaw gobbling motion is active
  if(this.gobble){
    // if so update gobble motion
    this.moveJaw();
  }
  // check for eye motion
  if(this.eye){
    // grow the eye
    this.growEye();
  }
  // increment ear motion
  this.earInc+=1;
  // reset ear motion
  if(this.earInc===20){
    this.earInc=0;
  }
  // smoothe out the motion using a cos() function
    ear=cos(map(this.earInc, 0, 20, 0, TWO_PI))*3;
  // now draw the cat this
  fill(152);
  strokeWeight(0);
  // this.jaw is added to the y-coordinates of four points of
  // the following three triangles to create the jaw motion
// lower jaw
triangle(this.x+565*this.xs, this.y+(611+this.jaw)*this.ys, this.x+466*this.xs, this.y+563*this.ys, this.x+386*this.xs, this.y+646*this.ys);
triangle(this.x+466*this.xs, this.y+563*this.ys, this.x+588*this.xs, this.y+(572+this.jaw)*this.ys, this.x+565*this.xs, this.y+(611+this.jaw)*this.ys);
//upper jaw
triangle(this.x+466*this.xs, this.y+563*this.ys, this.x+588*this.xs, this.y+(572-this.jaw)*this.ys, this.x+638*this.xs, this.y+464*this.ys);

// this
triangle(this.x+638*this.xs, this.y+464*this.ys, this.x+598*this.xs, this.y+414*this.ys, this.x+466*this.xs, this.y+563*this.ys);
triangle(this.x+466*this.xs, this.y+563*this.ys, this.x+539*this.xs, this.y+318*this.ys, this.x+598*this.xs, this.y+414*this.ys);
triangle(this.x+539*this.xs, this.y+318*this.ys, this.x+370*this.xs, this.y+204*this.ys, this.x+466*this.xs, this.y+563*this.ys);
triangle(this.x+370*this.xs, this.y+204*this.ys, this.x+125*this.xs, this.y+226*this.ys, this.x+466*this.xs, this.y+563*this.ys);
triangle(this.x+386*this.xs, this.y+646*this.ys, this.x+39*this.xs, this.y+591*this.ys, this.x+363*this.xs, this.y+664*this.ys);
triangle(this.x+125*this.xs, this.y+226*this.ys, this.x+4*this.xs, this.y+325*this.ys, this.x+39*this.xs, this.y+591*this.ys);
triangle(this.x+125*this.xs, this.y+226*this.ys, this.x+466*this.xs, this.y+563*this.ys, this.x+39*this.xs, this.y+591*this.ys);
triangle(this.x+386*this.xs, this.y+646*this.ys, this.x+466*this.xs, this.y+563*this.ys, this.x+39*this.xs, this.y+591*this.ys);
// ears. var ear is added to x-coordinate of three points in the following three triangles
fill(50);
triangle(this.x+370*this.xs, this.y+204*this.ys, this.x+421*this.xs-ear, this.y+57*this.ys, this.x+125*this.xs, this.y+226*this.ys);
triangle(this.x+263*this.xs, this.y+322*this.ys, this.x+345*this.xs+ear, this.y+27*this.ys, this.x+125*this.xs, this.y+226*this.ys);
triangle(this.x+345*this.xs+ear, this.y+27*this.ys, this.x+370*this.xs, this.y+204*this.ys, this.x+263*this.xs, this.y+322*this.ys);
// eye socket
fill(80);
triangle(this.x+460*this.xs, this.y+372*this.ys, this.x+512*this.xs, this.y+427*this.ys, this.x+508*this.xs, this.y+341*this.ys);
// eye ellipse. adds this.eye to height of ellipse to grow the eye.
fill(0);
ellipse(this.x+505*this.xs, this.y+380*this.ys, 20*this.ys, (40+this.eye)*this.ys);

}



// movejaw();
//
// cos function to move the jaw
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
// grow pupil size. cats do that..
CatHead.prototype.growEye = function (){
  // increment size
  this.eye+=1;
  // stop motion and reset
  if(this.eye===this.maxMvmt){this.eye=false;}
  if(this.eye===this.maxMvmt+1){this.eye=0;}
}

CatHead.prototype.move = function(){

  //increment noise value
  gameOverCat.rand+=gameOverCat.inc;
  // pick seed for x velocity
  noiseSeed(0);
  // set random velocity
  gameOverCat.vx=map(noise(gameOverCat.rand), 0, 1, -gameOverCat.speed, gameOverCat.speed);
  // pick seed for y velocity
  noiseSeed(1);
  // set random velocity
  gameOverCat.vy=map(noise(gameOverCat.rand), 0, 1, -gameOverCat.speed, gameOverCat.speed);
  // constrain to stay on screen
  // left side
  if(gameOverCat.x<catConstrain){gameOverCat.vx=abs(gameOverCat.vx);}
  // right side
  if(gameOverCat.x>width-catConstrain){gameOverCat.vx=-abs(gameOverCat.vx);}
  // top
  if(gameOverCat.y<catConstrain){gameOverCat.vy=abs(gameOverCat.vy);}
  // bottom
  if(gameOverCat.y>height-catConstrain){gameOverCat.vy=-abs(gameOverCat.vy);}
  // update gameOverCat position
  gameOverCat.x+=gameOverCat.vx;
  gameOverCat.y+=gameOverCat.vy;
  // set this x and y position to match cat x and y position
  this.x=gameOverCat.x-gameOverCat.size/2;
this.y=gameOverCat.y-470*this.xs;

}



CatHead.prototype.reset = function(){
    this.dispTimer=0;
  this.x=width*2;
  this.y=height*2;

  this.xs=0.3;
  this.ys=0.3;
  //position (bottom left corner)


}
