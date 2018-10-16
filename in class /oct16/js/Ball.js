function Ball(x, y, vx, vy) {
  this.x = width/2+x;
  this.y = height/2+y;
  //  this.speed = 10;
  this.vx = vx;
  this.vy = vy;
  this.size = 10;

}

Ball.prototype.update = function () {
  // Move the ball here
  if (this.y<=0 || this.y>=height) {
    this.vy=-this.vy;
  }
  if (this.x<=0 || this.x>=width) {
    this.reset();
  }
  this.x+=this.vx;
  this.y+=this.vy;
}

Ball.prototype.display = function () {
  // Display the ball here
  fill(255);
  noStroke();
  rect(this.x, this.y, this.size, this.size)
}

Ball.prototype.reset = function () {
  // Reset the ball here
  this.vx=-this.vx;
  this.x=width/2;
  this.y=height/2;
}
