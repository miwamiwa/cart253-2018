function Human(x, y){
  this.x = x;
  this.y = y;
  this.z = 0;
  this.size = 50;
  this.legRate = 0.2;
  this.legMotion = 0;
  this.vx =0;
  this.vy =0;
  this.eyecolor = color(45, 185, 45);
  this.haircolor = color(185, 45, 45);
  this.skincolor = color(255, 213, 147);
  this.pantscolor = color(45);
  this.shirtcolor = color(85, 65, 135);
}

Human.prototype.display = function(){
var legw= this.size/2-5;
var legh = this.size;
var bodsize = this.size;
var headsize= this.size-10;
var armsize = this.size-25;
var eyesize = this.size/10;
this.legMotion += this.legRate;
var legTranslate = 5;
var leg1 = cos(this.legMotion)*legTranslate;




translate(this.x, this.y, 0);

if(this.vx<0){
  rotateZ(3*PI/2)
}
else if(this.vx>0){
  rotateZ(PI/2)
}
else if(this.vy<0){
  rotateZ(PI)
}
else if(this.vy>0){
  rotateZ( 0)
}
else if(this.vx===0&&this.vy===0){
  rotateZ(0);
}


push();
// legs
// leg1
  specularMaterial(this.pantscolor);
translate(legw, leg1, legh/2);
box(legw, legw, legh);
// leg2
translate(-2*legw, -2*leg1, 0);
box(legw, legw, legh);
pop();

//bod
  specularMaterial(this.shirtcolor);
translate(0, 0, legh+bodsize/2);
push();
box(bodsize);

// arm1
push()
translate(bodsize/2, -leg1, 0);
box(armsize);
pop();

// arm2
push();
translate(-bodsize/2, leg1, 0);
box(armsize);
pop();

// head
push();
  specularMaterial(this.skincolor);
translate(0, 0, this.size);
box(headsize);
push();
//facialfeatures
// nose
translate(0, headsize/2+eyesize/2, 0)
box(eyesize);
pop();

// eye1
push();
  specularMaterial(this.eyecolor);
translate(eyesize*2, headsize/2+eyesize/2, headsize/4);
box(eyesize);
pop();

// eye1
push()
  specularMaterial(this.eyecolor);
translate(-eyesize*2, headsize/2+eyesize/2, headsize/4);
box(eyesize);
pop();

// hair
push()
  specularMaterial(this.haircolor);
translate(0, 0, 3*headsize/8);
box(headsize+2, headsize+2, 2*headsize/8+2);
pop();
}
