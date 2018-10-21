function GOCat() {
  this.x= 0;
  this.y= 0;
  this.vx= 0;
  this.size= 40;
  this.vy= 0;
  this.speed= 5;
  // noise seed
  // noise increment
  this.rand=0;
  this.inc=0.01;
}

GOCat.prototype.load = function(){
  // cat is the object which you have to shoot. it has the characteristics of an ellipse
  this.x=width/2;
  this.y=height/2;
  // the image will be the cat bigHead we used earlier though.
  // since the bigHead is scalable, scale it down
  bigHead.xs=0.1;
  bigHead.ys=0.1;
}
GOCat.prototype.move = function(){
  bigHead.move();
}

  GOCat.prototype.display = function(){
    bigHead.display();
  }
