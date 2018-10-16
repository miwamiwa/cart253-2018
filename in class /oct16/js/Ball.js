function Ball() {
  this.x = width/2;
  this.y = height/2;
    this.speed = 10;
  this.vx = this.speed;
  this.vy = this.speed;
  this.size = 10;

}
Ball.prototype.update = function () {
  // Move the ball here
  this.x+=this.speed;
  this.y+=this.speed;
}
Ball.prototype.display = function () {
  // Display the ball here
  fill(255);
  noStroke();
  rect(this.x, this.y, this.size, this.size)
}
Ball.prototype.reset = function () {
  // Reset the ball here
  this.x=width/2;
  this.y=height/2;
}
