function Actions() {

}

Actions.prototype.createBalls = function(){

  // constrain random number of balls
  var numBalls = round(random(ballIncrease, ballIncrease+1));
  console.log("numBalls = "+numBalls);
  // create new balls
  if(balls.length<maxBalls){
    for (var i=0; i<numBalls; i++){
      balls.push(new Ball());
    }
    console.log("balls: "+balls.length);
  }
}

// removeball()
//
// removes a given ball without changing array order

Actions.prototype.removeBall = function(index){
  // save length of balls array
  var length = balls.length;
  // unless this ball is the last ball on the list
  if(index!=length){
    // glue together parts of the list that come before and after this ball
    balls = concat(subset(balls, 0, index), subset(balls, index+1, length));
  }
  // if it is the last ball
  else{
    // list becomes everything until the last ball
    balls = subset(balls, 0, index);
  }
  // print new ball array size
  console.log("balls: "+balls.length);
}

// removefireball()
//
// remove fire ball from array without affecting order

Actions.prototype.removeFireBall = function(index){
  // same as removeball()
  var length = fireBalls.length;
  if(index!=length){
    fireBalls = concat(subset(fireBalls, 0, index), subset(fireBalls, index+1, length));
  }
  else{
    fireBalls = subset(fireBalls, 0, index);
  }
  console.log("fireBalls: "+fireBalls.length);
}

// removeants()
//
// removes multiple ants from the array without affecting order

Actions.prototype.removeAnt = function(antIndex){

  var length = ants.length;

  // if this is not the last ant
  if(antIndex!=length-1){
    // glue together ants arrays before and after this ant
    ants = concat(subset(ants, 0, antIndex), subset(ants, antIndex+1, length));
  }
  else {
    ants = subset(ants, 0, antIndex);
  }
  if(random()<0.5){
    this.swarm("left");
  }
  else {
    this.swarm("right");
  }

  console.log("ants: "+ants.length);
}


Actions.prototype.swarm = function(direction){

  for (var i=0; i<ants.length;i++){
    if(ants[i].migrating===false){
      ants[i].migrating = true;
      if(direction==="left"){
        ants[i].tarx = leftPaddle.x;
        ants[i].tary = leftPaddle.y;
      }
      else if(direction==="right"){
        ants[i].tarx = rightPaddle.x;
        ants[i].tary = rightPaddle.y;
      }
    }
  }
}
