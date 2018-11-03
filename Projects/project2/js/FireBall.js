function FireBall(){

  if(random()<0.5){
    this.x=0.2*game.width;
    this.direction = 1;
  } else {
    this.x = game.width-0.2*game.width;
    this.direction = -1;
  }
  this.type = "fireball";
  this.y = game.height/2;
  this.vx = 0;
  this.vy = 0;
  this.inc = 0;
  this.rate = 0.1;
  this.speed = 2;
  this.size = 40;
  this.h = size;
  this.w = size;
  this.offScreen = false;
}

FireBall.prototype.update = function(){

  this.vx = this.speed*this.direction;
  this.inc+=this.rate;
  this.vy = map(noise(this.inc), 0, 1, -this.speed, this.speed)*2;

  this.x+=this.vx;
  this.y+=this.vy;
  this.y = constrain(this.y, 0, game.height);
}

FireBall.prototype.display = function(){
  console.log("fireballs"+fireBalls.length);
  fill(235, 25, 25);
  rect(this.x, this.y, this.size, this.size);
}

FireBall.prototype.isOffScreen = function () {
  // Check for going off screen and reset if so
  if (this.x + this.size < 0 || this.x > game.width) {
    console.log("fireball off");
    this.offScreen = true;
    return true;
  }
  else {
    return false;
  }
}

FireBall.prototype.handleCollision = function(){
  var deadAnts = [];
for (var i=0; i<ants.length; i++){
  var antmidx = ants[i].x+ants[i].size/2;
  var antmidy = ants[i].y+ants[i].size/2;
  if ( antmidx > this.x && antmidx < this.x+this.size && antmidy > this.y && antmidy < this.y+this.size) {
    deadAnts.push(i);
  }
}
  for (var j=0; j<deadAnts.length; j++){
    removeAnt(deadAnts[j]);
    music.startSFX(sfx, "chirp");
  }

}

FireBall.prototype.handlePaddleCollision = function(paddle){

  var padmidx = paddle.x+paddle.w/2;
  var padmidy = paddle.y+paddle.h/2;
  if ( padmidx > this.x && padmidx < this.x+this.size && padmidy > this.y && padmidy < this.y+this.size) {
    paddle.h-=2;
  }
}
