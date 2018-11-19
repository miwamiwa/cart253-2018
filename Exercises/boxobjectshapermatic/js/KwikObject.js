function KwikObject(x, y, z){
  this.cubes = [];
  this.rotX = 0;
  this.rotY = 0;
  this.rotZ = 0;
  this.x = x;
  this.y = y;
  this.z = z;
}


KwikObject.prototype.display = function (){
showgrid();
  if (this.cubes.length!=0){
    translate(this.x, this.y, this.z);
    console.log("objectxyz: "+this.x+" "+this.y+" "+this.z+" ")
    console.log("object rotation: "+this.rotX+" "+this.rotY+" "+this.rotZ+" ")
    /*
    rotateX(this.rotX);
    rotateY(this.rotY);
    rotateZ(this.rotZ);
    */
    for(var i=0; i<this.cubes.length; i++){
      push();
      if(i===selected){
        stroke(0);
        strokeWeight(5);
      } else {
        noStroke();
      }
      this.cubes[i].display();
      pop();
    }


  }


}

KwikObject.prototype.setAngle = function (x, y, z){
  this.rotX = x;
  this.rotY = y;
  this.rotZ = z;
}
