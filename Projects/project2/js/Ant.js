// Ant

function Ant(x1, y1, x2, y2) {
  console.log("new ant");
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.size = 10;
  this.speed = random(3, 5);
  this.vx = 0;
  this.vy = 0;
}

Ant.prototype.display = function(){
  fill(255);
  rect(this.x1, this.y1, this.size, this.size);
  rect(this.x2, this.y2, this.size, this.size);
}
