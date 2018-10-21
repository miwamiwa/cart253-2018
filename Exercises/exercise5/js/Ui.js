var scoreSize=10;
function Ui(){
  this.bgColor=0;
  this.fgColor=255;
  textAlign(CENTER);
    rectMode(CENTER);
    noStroke();
}
Ui.prototype.loadBg = function(){
  background(bgColor);
}

Ui.prototype.displayScore = function(){

  // set fill for this entire function
  fill(this.fgColor-100);
  // divide score into rows (set row length)
  var row=4;
  // check left paddle's score
  for(var i=0; i<leftPaddle.score; i++){
    // for each point, display a ball.
    // determine which row this ball falls into
    var leftScoreRow = floor(i/row);
    // determine x pos depending on score and row size
    var leftScoreX = scoreSize+1.5*i*scoreSize-leftScoreRow*(1.5*row*scoreSize);
    // determine y pos depending on score and row size
    var leftScoreY = scoreSize+leftScoreRow*1.5*scoreSize;
    // display ball
    rect(leftScoreX, leftScoreY,scoreSize,scoreSize);
  }

  // check right paddle's score,
  // and do the same.
  for(var i=0; i<rightPaddle.score; i++){
    var rightScoreRow = floor(i/row);
    var rightScoreX = width-(scoreSize+1.5*i*scoreSize-rightScoreRow*(1.5*row*scoreSize));
    var rightScoreY = scoreSize+rightScoreRow*1.5*scoreSize;
    rect(rightScoreX, rightScoreY,scoreSize,scoreSize);
}
}

Ui.prototype.displayControls = function(){
  noStroke();
  fill(fgColor);
  text("left player: WASD. right player: Arrow keys.", width/2, height-15);
}
Ui.prototype.displayGameOverText = function(){
  fill(fgColor);
  //check who won
  if(leftPaddle.score>rightPaddle.score) {
    // left player won
  text("game over. left player wins. spray cat to reclaim the ball and field. \nleft player: press 1 to shoot. right player: press 0 to shoot.", width/2, height/2);
} else if (leftPaddle.score<rightPaddle.score) {
  // right player won
  text("game over. right player wins. spray cat to reclaim the ball and field. \nleft player: press 1 to shoot. right player: press 0 to shoot.", width/2, height/2);
}else {
  // tie
  text("game over. it's a tie. spray cat to reclaim the ball and field. \nleft player: press 1 to shoot. right player: press 0 to shoot.", width/2, height/2);
}
}
