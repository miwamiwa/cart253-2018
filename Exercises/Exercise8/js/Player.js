// Player.js
//
// This script handles the Player constructor;
// Displaying the player's static and moving parts;
// Key controls and movement: there's front-back motion, left-right
//  rotation, and left-right strafing. same function updates position;
// Setting camera to follow player.

// Player()
//
// the player constructor creates variables for player position,
// size, speed, rotation angle, key controls and animations.

function Player(x, y){

  // position
  this.x = x;
  this.y = y;
  this.z=0;

  // size
  this.size = 50;

  // motion, direction
  this.vx =0;
  this.vy =0;
  this.speed =6;
  this.angle =0;

  // key controls
  this.downKey = 83;
  this.upKey = 87;
  this.leftKey = 65;
  this.rightKey = 68;
  this.strafeLeft = 81;
  this.strafeRight = 69;

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
  this.headSize = this.size-20;
  this.tailSize = this.size-40;
  this.tailLength = this.size-30;
  this.eyeSize= this.size/10;
  this.earSize = this.size/7;
  this.legSize = this.size-35;
  this.noseSize = this.size-35;

}

// display()
//
// calculate change in animated parts' position
// display a spotlight over the racoon
// display racoon parts with correct positions and fills or textures.

Player.prototype.display = function(){

  // calculate change in animated parts' position

  // increment head bob
  this.headWobble += this.wobbleRate;

  // calculate change in tail position
  var tailWiggleX = sin(this.tailXAngle)*5;
  var tailWiggleY = sin(this.tailYAngle)*5;

  // calculate change in head position
  var headBob = sin(this.headWobble)*3;

  // calculate change in leg position
  var legTrans = 10;
  var legSin = sin(this.legAngle2)*legTrans;
  var legSin2 = sin(this.legAngle2+PI)*legTrans;
  var legCos = cos(this.legAngle)*legTrans;
  var legCos2 = cos(this.legAngle+PI)*legTrans;

  // move to racoon position
  translate(this.x, this.y, this.z);

  // create spotlight over racoon
  pointLight(145, 145, 215, this.x, this.y, this.size*1.5);

  // rotate racoon according to key controls
  rotateZ(this.angle);
  push();

  // draw racoon

  // body
  texture(racTexture);
  box(this.bodSize);
  pop();

  // tail
  push();
  specularMaterial(185);
  // inmost tail part
  translate(0, this.bodSize/2+this.tailLength/2, 0);
  box(this.tailSize, this.tailLength, this.tailSize);
  // outmost tail part
  translate(tailWiggleX, this.tailLength, tailWiggleY);
  box(this.tailSize+5, this.tailLength, this.tailSize+5);
  pop();

  // head
  push();
  translate(0, -this.bodSize/2-this.headSize/2, headBob);
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
  translate(this.bodSize/2+this.legSize/2, -this.bodSize/4-this.legSize/2, legSin-10);
  box(this.legSize);
  pop();

  //frontleft leg
  push();
  specularMaterial(85);
  translate(-this.bodSize/2-this.legSize/2, -this.bodSize/4-this.legSize/2, legSin2-10);
  box(this.legSize);
  pop();

  //backright leg
  push();
  specularMaterial(85);
  translate(this.bodSize/2+this.legSize/2, +this.bodSize/4+this.legSize/2, legCos-10);
  box(this.legSize);
  pop();

  //backleft leg
  push();
  specularMaterial(85);
  translate(-this.bodSize/2-this.legSize/2, +this.bodSize/4+this.legSize/2, legCos2-10);
  box(this.legSize);
  pop();

}

// handleinput()
//
// listens for key controls and triggers right, left, up, down, strafe
// left and strafe right.
//
// also updates player position and tells camera to follow player.

Player.prototype.handleInput = function() {

  // player left-right rotation speed
  var angleSpeed = 1.0;

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
  }

  // left key is pressed
  else if (keyIsDown(this.leftKey)) {

    // rotate left
    this.angle -= radians(angleSpeed*PI);

    // stop moving
    this.vx =0;
    this.vy =0;

    // trigger appropriate parts motion
    this.legAngle2 += this.legRate;
    this.tailYAngle += this.legRate;
    this.tailXAngle =0;
  }

  // right key is pressed
  else if (keyIsDown(this.rightKey)) {

    // rotate right
    this.angle += radians(angleSpeed*PI);

    // stop moving
    this.vx =0;
    this.vy =0;

    // trigger appropriate parts motion
    this.legAngle2 += this.legRate;
    this.tailYAngle += this.legRate;
    this.tailXAngle =0;
  }

   // strafe left key is pressed
  else if (keyIsDown(this.strafeLeft)) {

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

  // if no keys are pressed stop moving.
  else {
    this.vy = 0;
    this.vx=0;
  }

  // constrain velocity to fit speed
  this.vx = constrain(this.vx, -this.speed, this.speed);
  this.vy = constrain(this.vy, -this.speed, this.speed);

  //update position
  this.x+=this.vx;
  this.y+=this.vy;

  // set camera to match player position
  this.setCam();
}

// setcam()
//
// sets camera's x, y position and x, y direction to match player position 

Player.prototype.setCam = function(){

  camera(this.x+camOffsetX, this.y-camYAngle+camOffsetY,  (height/2.0) / tan(PI*30.0 / 180.0), this.x, this.y,0, 0 , 1, 0);

}
