// Human.js
//
// contains Human object constructor and function to display the Human object.
// legs and arms are animated inside display().

// Human()
//
// accepts initial x, y coordinates as argument.
// sets position, size, velocity
// sets colours and variables used in the animation.

function Human(x, y){

  // position
  this.x = x;
  this.y = y;
  this.z = 0;

  // size
  this.size = 50;

  // velocity : used to test the human facing in different directions.
  // the human remains stationary in this prototype.
  this.vx =0;
  this.vy =0;

  // colours
  // some are random, some are set.
  this.eyeColor = color(45, 185, 45);
  this.hairColor = color(random(125), random(185), random(255));
  this.skinColor = color(255, 213, 147);
  this.pantsColor = color(45);
  this.shirtColor = color(random(125), random(185), random(255));

  // motion
  this.legRate = 0.2;
  this.legMotion = 0;

  // part sizes
  this.legW= this.size/2-5;
  this.legH = this.size;
  this.bodSize = this.size;
  this.headSize= this.size-10;
  this.armSize = this.size-25;
  this.eyeSize = this.size/10;
}

// display()
//
// increments animation variables,
// places a spotlight over human
// rotates human according to velocity
// displays the boxes that make a human.

Human.prototype.display = function(){

  // set up motion
  // increment motion (arm motion is just reversed leg motion)
  this.legMotion += this.legRate;
  // maximum leg motion
  var legTranslate = 5;
  // calculate change in leg position
  var leg1 = cos(this.legMotion)*legTranslate;

  // draw human

  // move to player position
  translate(this.x, this.y, 0);

  // place a red spotlight over the human
  pointLight(255, 0, 0, this.x, this.y, this.size*4);

  // rotate according to velocity
  if(this.vx<0){
    rotateZ(3*PI/2)
  }
  else if(this.vx>0){
    rotateZ(PI/2)
  }
  else if(this.vy<0){
    rotateZ(PI)
  }
  else if(this.vy>0){
    rotateZ( 0)
  }
  else if(this.vx===0&&this.vy===0){
    rotateZ(0);
  }

  push();

  // display legs

  // leg1
  specularMaterial(this.pantsColor);
  translate(this.legW, leg1, this.legH/2);
  box(this.legW, this.legW, this.legH);
  // leg2
  translate(-2*this.legW, -2*leg1, 0);
  box(this.legW, this.legW, this.legH);
  pop();

  // display body

  specularMaterial(this.shirtColor);
  translate(0, 0, this.legH+this.bodSize/2);
  push();
  box(this.bodSize);

  // display arms

  // arm1
  push()
  translate(this.bodSize/2, -leg1, 0);
  box(this.armSize);
  pop();

  // arm2
  push();
  translate(-this.bodSize/2, leg1, 0);
  box(this.armSize);
  pop();

  // display head

  // head
  push();
  specularMaterial(this.skinColor);
  translate(0, 0, this.size);
  box(this.headSize);
  push();

  // display facial features
  
  // nose
  translate(0, this.headSize/2+this.eyeSize/2, 0)
  box(this.eyeSize);
  pop();

  // eye1
  push();
  specularMaterial(this.eyeColor);
  translate(this.eyeSize*2, this.headSize/2+this.eyeSize/2, this.headSize/4);
  box(this.eyeSize);
  pop();

  // eye1
  push()
  specularMaterial(this.eyeColor);
  translate(-this.eyeSize*2, this.headSize/2+this.eyeSize/2, this.headSize/4);
  box(this.eyeSize);
  pop();

  // hair
  push()
  specularMaterial(this.hairColor);
  translate(0, 0, 3*this.headSize/8);
  box(this.headSize+2, this.headSize+2, 2*this.headSize/8+2);
  pop();
}
