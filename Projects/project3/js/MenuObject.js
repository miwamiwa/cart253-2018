function MenuObject(x, y, img, isActionObject) {

this.x = x;
this.y = y;
this.hasImage = false;
this.isActionObject = isActionObject;
if(img!=0){
  this.hasImage = true;
  this.textureimage = img;
}

this.largeSize = 180;
this.smallSize = 50;
this.size =this.smallSize;
this.angle =0;
this.isLarge = false;
if(this.isActionObject){
  this.size =this.largeSize;
  this.isLarge = true;
}
this.shrinking = false;
this.growing = false;
this.growSpeed = 3;
this.shrinkSpeed = 2;


}

MenuObject.prototype.display = function(){

  this.angle +=0.03;
  push();
  var z = cos(this.angle)*5;
  var x = sin(this.angle)*8;
  translate(this.x, this.y, 0);
  rotateZ(radians(z));
  rotateX(radians(x));
  stroke(0);
  if (this.hasImage){
    texture(this.textureimage);
  }
  else{
    fill(125);
  }
  box(this.size);
  pop();

}

MenuObject.prototype.check = function(){
  if(collidePointRect(mouseX, mouseY, width/2+this.x-this.size/2, height/2+this.y-this.size/2, this.size, this.size)){
if(this.isLarge){
  if(this.isActionObject){
    menuAction();
  }
  this.shrinking = true;
  this.growing = false;
}
else {
  this.growing = true;
  this.shrinking = false;
  if(this===menu1){
    menu2.shrinking = true;
    menu2.growing = false;
    menu3.shrinking = true;
    menu3.growing = false;
  }
  else if(this===menu2){
    menu1.shrinking = true;
    menu1.growing = false;
    menu3.shrinking = true;
    menu3.growing = false;
  }
  else if(this===menu3){
    menu1.shrinking = true;
    menu1.growing = false;
    menu2.shrinking = true;
    menu2.growing = false;
  }
}
  }
}

MenuObject.prototype.shrink = function(){
  if(this.size <= this.smallSize){
    this.shrinking = false;
    this.isLarge = false;
  }
  if(this.shrinking){
    this.size -= this.shrinkSpeed;
  }
}

MenuObject.prototype.grow = function(){
  if(this.size >= this.largeSize){
    this.growing = false;
    this.isLarge = true;
  }
  if(this.growing){
    this.size += this.growSpeed;
  }
}

MenuObject.prototype.update = function(){
  this.shrink();
  this.grow();
  this.display();
}
