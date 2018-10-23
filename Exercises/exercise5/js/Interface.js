/*

Interface.js
This is the information displayed on screen.

this script handles:
- creating the interface object
- loading a background
- displaying score
- displaying keyboard controls information
- displaying game over text

*/

// Interface()
//
// creates a new interface object.
// loads display settings.

function Interface(){
  // color settings
  this.bgColor=0;
  this.fgColor=255;
  // size of score keeping ball image
  this.scoreSize=10;
  // set text and rect allignment
  textAlign(CENTER);
  rectMode(CENTER);
  noStroke();
}

// loadbg()
//
// loads a background. as of right now there's nothing to see..
// but more could be added here

Interface.prototype.loadBg = function(){
  // display background
  background(ui.bgColor);
}

// displayscore()
//
// displays each paddle's score in the form of rows of squares

Interface.prototype.displayScore = function(){

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
    var leftScoreX = this.scoreSize+1.5*i*this.scoreSize-leftScoreRow*(1.5*row*this.scoreSize);
    // determine y pos depending on score and row size
    var leftScoreY = this.scoreSize+leftScoreRow*1.5*this.scoreSize;
    // display ball
    rect(leftScoreX, leftScoreY,this.scoreSize,this.scoreSize);
  }

  // check right paddle's score,
  // and do the same.
  for(var i=0; i<rightPaddle.score; i++){
    var rightScoreRow = floor(i/row);
    var rightScoreX = width-(this.scoreSize+1.5*i*this.scoreSize-rightScoreRow*(1.5*row*this.scoreSize));
    var rightScoreY = this.scoreSize+rightScoreRow*1.5*this.scoreSize;
    rect(rightScoreX, rightScoreY,this.scoreSize,this.scoreSize);
  }
}

// displaycontrols()
//
// display keyboard controls at the bottom of the screen

Interface.prototype.displayControls = function(){
  // stylize
  noStroke();
  fill(ui.fgColor);
  // display text
  text("left player: WASD. right player: Arrow keys.", width/2, height-15);
}

// displaygameovertext()
//
// choses and displays game over text.
// text will indicate who won, and state the gameover game rules
// (this could be moved to displaycontrols() yo)

Interface.prototype.displayGameOverText = function(){
  //stylize
  fill(ui.fgColor);
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
