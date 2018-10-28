function Biscuit(){

this.x = random(width);
  this.type = "Biscuit";
  this.y = random(height);
  this.vx = 0;
  this.vy = 0;
  this.inc = 0;
  this.rate = 0.1;
  this.speed = 2;
  this.size = 40;
  this.h = size;
  this.w = size;
  this.offScreen = false;
  this.moving = true;
  this.appearLength = 3000;
  this.appearTimer = this.appearLength+millis();
  this.awayTimer = 0;
  this.awayLength = 10000;
  this.appeared = false;
}

Biscuit.prototype.update = function(){


  this.inc+=this.rate;
  this.vx = map(noise(this.inc), 0, 1, -this.speed, this.speed);
  this.vy = map(noise(this.inc), 0, 1, -this.speed, this.speed);
if(this.moving){
  this.x+=this.vx;
  this.y+=this.vy;
}
}

Biscuit.prototype.display = function(){
if(millis()>this.appearTimer){
  this.moving=false;
  this.x = width*2;
  this.y = width*2;
} else {
  this.moving = true;
  fill(25, 25, 185);
  rect(this.x, this.y, this.size, this.size);
}
}
/*
Biscuit.prototype.isOffScreen = function () {
  // Check for going off screen and reset if so
  if (this.x + this.size < 0 || this.x > width) {
    console.log("Biscuit off");
    this.offScreen = true;
    this.x = width*2;
    this.y = height*2;
    return true;
  }
  else {
    return false;
  }
}
*/
/*
Biscuit.prototype.handleCollision = function(){
// optional ant collision stuff
for (var i=0; i<ants.length; i++){
  var antmidx = ants[i].x+ants[i].size/2;
  var antmidy = ants[i].y+ants[i].size/2;
  if ( antmidx > this.x && antmidx < this.x+this.size && antmidy > this.y && antmidy < this.y+this.size) {

  }
}
}
*/
Biscuit.prototype.handlePaddleCollision = function(paddle){
  var padmidx = paddle.x+paddle.w/2;
  var padmidy = paddle.y+paddle.h/2;
  if ( padmidx > this.x && padmidx < this.x+this.size && padmidy > this.y && padmidy < this.y+this.size) {
    paddle.h+=100;
    this.x = width*2;
    this.y = height*2;
    this.moving = false;
  }
}

Biscuit.prototype.appear = function(){
  this.appearTimer = millis() + this.appearLength;
  this.x = random(100, width-100);
  this.y = random(100, height-100);
}
