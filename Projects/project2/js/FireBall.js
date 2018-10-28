function FireBall(){

  if(random()<0.5){
    this.x=0.2*width;
    this.direction = 1;
  } else {
    this.x = width-0.2*width;
    this.direction = -1;
  }
  this.type = "fireball";
 this.y = height/2;
 this.vx = 0;
 this.vy = 0;
 this.inc = 0;
 this.rate = 0.001;
 this.speed = 2;
 this.size = 40;
 this.h = size;
 this.w = size;
 this.offScreen = false;
}

FireBall.prototype.update = function(){

  this.vx = this.speed*this.direction;

  if(this.direction===1){
  this.vy = (rightPaddle.y-this.y)*0.1;
} else if (this.direction===-1){
  this.vy = (leftPaddle.y-this.y)*0.1;
}

this.x+=this.vx;
this.y+=this.vy;
}

FireBall.prototype.display = function(){
  console.log("fireballs"+fireBalls.length);
  fill(235, 25, 25);
  rect(this.x, this.y, this.size, this.size);
}

FireBall.prototype.isOffScreen = function () {
  // Check for going off screen and reset if so
  if (this.x + this.size < 0 || this.x > width) {
    console.log("fireball off");
    this.offScreen = true;
    return true;
  }
  else {
    return false;
  }
}
