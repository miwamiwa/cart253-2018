function Player(x, y){
  this.x = x;
  this.y = y;
  this.z=0;
  this.size = 50;
  this.vx =0;
  this.vy =0;
  this.speed =10;
  this.angle =0;

  // key controls
  this.downKey = 83;
  this.upKey = 87;
  this.leftKey = 65;
  this.rightKey = 68;
  this.strafeLeft = 81;
  this.strafeRight = 69;

  // avatar animation variables
  this.legAngle = 0;
  this.legRate =0.5;
  this.tailXAngle =0;
  this.tailYAngle =0;
  this.headWobble = 0;
  this.wobbleRate = 0.2;

}

Player.prototype.display = function(){

  this.headWobble += this.wobbleRate;

  var bodsize = this.size;
  var headsize = this.size-20;
  var tailsize = this.size-40;
  var taillength = this.size-30;
  var eyesize= this.size/10;
  var earsize = this.size/7;
  var legsize = this.size-35;

  var tailWiggleX = sin(this.tailXAngle)*5;
  var tailWiggleY = sin(this.tailYAngle)*5;
  var headBob = sin(this.headWobble)*3;

  var legTrans = 10;
  var legSin = sin(this.legAngle)*legTrans;
  var legSin2 = sin(this.legAngle+PI)*legTrans;
  var legCos = cos(this.legAngle)*legTrans;
  var legCos2 = cos(this.legAngle+PI)*legTrans;

  // body
  fill(125);
  translate(this.x, this.y, this.z);
  rotateZ(this.angle);
  push();
  box(bodsize);
  pop();

  // tail
  push();
  fill(185);
  translate(0, bodsize/2+taillength/2, 0);
  box(tailsize, taillength, tailsize);
  translate(tailWiggleX, taillength, tailWiggleY);
  box(tailsize+5, taillength, tailsize+5);
  pop();

  // head
  push();
  translate(0, -bodsize/2-headsize/2, headBob);
  box(headsize);

  // ears
  push();
  fill(125);
  translate(earsize, -headsize/6, headsize/2+earsize/2);
  box(earsize);
  translate(-2*earsize, 0, 0);
  box(earsize);
  pop();

  //head stripes
  fill(255);
  translate(0, -headsize/3, headsize/4);
  box(headsize+2, headsize/3+2, headsize/3);
  fill(0);
  translate(0, 0, -headsize/2);
  box(headsize+2, headsize/3+2, headsize/3);

  //eyes
  translate(eyesize*2, -(headsize/2-headsize/3)-eyesize/2, headsize/2);
  box(eyesize);
  translate(-eyesize*4, 0, 0);
  box(eyesize);
  pop();

  //frontright leg
  push();
  translate(bodsize/2+legsize/2, -bodsize/4-legsize/2, legSin-10);
  box(legsize);
  pop();

  //frontleft leg
  push();
  translate(-bodsize/2-legsize/2, -bodsize/4-legsize/2, legSin2-10);
  box(legsize);
  pop();

  //backright leg
  push();
  translate(bodsize/2+legsize/2, +bodsize/4+legsize/2, legCos-10);
  box(legsize);
  pop();

  //backleft leg
  push();
  translate(-bodsize/2-legsize/2, +bodsize/4+legsize/2, legCos2-10);
  box(legsize);
  pop();


}

Player.prototype.handleInput = function() {
var angleSpeed = 1.0;

  // up key
  if (keyIsDown(this.upKey)) {

    this.vy -= cos(this.angle);
    this.vx += sin(this.angle);
    this.legAngle += this.legRate;
    this.tailXAngle += this.legRate;

  }
  // down key
  else if (keyIsDown(this.downKey)) {
    this.vy += cos(this.angle);
    this.vx -= sin(this.angle);
    this.legAngle += this.legRate;
    this.tailXAngle += this.legRate;
  }
  // left key
  else if (keyIsDown(this.leftKey)) {
  this.tailYAngle += this.legRate;
  this.tailXAngle =0;
  this.angle -= radians(angleSpeed*PI);
  this.vx =0;
  this.vy =0;
  }
  // right key
  else if (keyIsDown(this.rightKey)) {
this.tailYAngle += this.legRate;
this.tailXAngle =0;
    this.angle += radians(angleSpeed*PI);
    this.vx =0;
    this.vy =0;

  }
  else if (keyIsDown(this.strafeLeft)) {

      this.vy -= sin(this.angle);
      this.vx -= cos(this.angle);


  }
  else if (keyIsDown(this.strafeRight)) {

      this.vy+= sin(this.angle);
      this.vx += cos(this.angle);

  }
  // if no keys are pressed stop moving.
  else {
    this.vy = 0;
    this.vx=0;
  }

  // constrain to fit speed
  this.vx = constrain(this.vx, -this.speed, this.speed);
  this.vy = constrain(this.vy, -this.speed, this.speed);

  //update position
  this.x+=this.vx;
  this.y+=this.vy;

  var playerFollowFactor = 1;

if(this.vx!=0||this.vy!=0){
  camOffsetX = this.vx*playerFollowFactor;
  camOffsetY = this.vy*playerFollowFactor;
  camOffsetZ = 0;
}

    this.setCam();


}

Player.prototype.setCam = function(){

  camera(this.x+camOffsetX, this.y-camYAngle+camOffsetY,  (height/2.0) / tan(PI*30.0 / 180.0), this.x, this.y,0, 0 , 1, 0);

}
