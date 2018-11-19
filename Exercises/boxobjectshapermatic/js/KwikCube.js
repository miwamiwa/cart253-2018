function KwikCube(x, y, z, w, h, d, r, g, b, rx, ry, rz){
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  this.h = h;
  this.d = d;
  this.rotX = rx;
  this.rotY = ry;
  this.rotZ = rz;
  this.rFill = r;
  this.gFill = g;
  this.bFill = b;
}

KwikCube.prototype.display = function(){

translate(this.x, this.y, this.z);
/*
rotateX(this.rotX);
rotateY(this.rotY);
rotateZ(this.rotZ);
*/
specularMaterial(this.rFill, this.gFill, this.bFill);
alpha(100);
console.log("size: "+this.w);
console.log("x: "+this.x+"y: "+this.y+"z: "+this.z)
console.log("h: "+this.h+"w: "+this.w+"d: "+this.d)
box(this.w, this.h, this.d);

}
