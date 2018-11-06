/*

Game.js
this is another script designed to hide wordy functions away from script.js.
here i packed together UI elements such as the menu screens and
the score displayed below the game screen.

this script handles:
- creating the Game object which contains design variables
for the menu screen and splits the game screen to display score.
- a function to set up the objects and text in the menu screen
- a function to run the menu screen animation
- a function to display score and other info during the game

*/

// Game()
//
// constrains game area to fit score below it
// sets up menu screen animation

function Game(){
  // set width and height of game area
  this.width=width;
  this.height=height-50;
  // a variable to count time during the animation
this.menuFrame=0;
// array of texts to be animated
this.menuText = [];
// rate at which to display text
this.menuTextSpeed = 7;
// game objects to display on menu screen
this.menuObjects  = [5];
// a variable to save the longest string of text in the array
this.longestText=0;
// color
this.menuBGcolor = 255;
this.menuTxtFill = 35;
}

Game.prototype.setupMenuScreen = function(){

  // display background
  fill(this.menuBGcolor); stroke(0); rect(0, 0, this.width-1, this.height-1);
  // count frames from 0
  this.menuFrame = 0;

  // prepare game objects

  // object position:
  // divide width in 5 to space objects evenly
  var objectsX= this.width/5;
  // place on a line at 2/3 height
  var objectsY= (2/3)*this.height;

  // load ball
  this.menuObjects[1] = new Ball();
  // set safe off to display with regular fill
  this.menuObjects[1].isSafe = false;
  // load ant
  this.menuObjects[0] = new Ant(0.5*objectsX, objectsY,0.5*objectsX+this.menuObjects[1].size, objectsY+this.menuObjects[1].size);
  // load fireball
  this.menuObjects[2] = new FireBall();
  // load paddle
  this.menuObjects[3] = new Paddle(3.5*objectsX, objectsY, 20, 100, 0, 0, 0, 0, 0, 0);
  // load biscuit
  this.menuObjects[4] = new Biscuit();
  // toggle biscuit movement off
  this.menuObjects[4].moving = false;

  // set x, y position of each object
  for (var i=0; i<this.menuObjects.length; i++){
    // spaced evenly along the x axis, and centered
    this.menuObjects[i].x = (i+0.5)*objectsX-0.5*this.menuObjects[i].size;
    // also centered on the y-axis
    this.menuObjects[i].y = objectsY-0.5*this.menuObjects[i].size;
  }
  // correct paddle position
    this.menuObjects[3].x = (3.5)*objectsX-0.5*this.menuObjects[3].w;
    this.menuObjects[3].y -=10;

// declare the text to be displayed
  this.menuText[0] = "ant pong! click screen to start.";
  this.menuText[1] = "ant";
  this.menuText[2] = "ball";
  this.menuText[3] = "fireball";
  this.menuText[4] = "paddle";
  this.menuText[5] = "biscuit";
  this.menuText[6] = "two balls colliding\nmake an ant.\nants eat paddles\nand take balls away";
  this.menuText[7] = "more balls appear\nas levels increase.\n+1 for hitting a ball\n-1 for missing a ball";
  this.menuText[8] = "kills ants and damages\n paddles. chance to\nappear upon missing\na ball";
  this.menuText[9] = "P1: WASD to move,\n1 to shoot fireball.\nP2: arrows to move,\n0 to shoot fireball.";
  this.menuText[10] = "gives paddle some\nbonus height.\nchance to appear when\nants sabotage the game";
  this.menuText[11] = "\nround is over when target score is reached. game over if both players have "+gameOverScore+" points";

 // figure out which text string is the longest.
 // this is used to calculate how long runmenuscreen() needs to run
 // to display all the text

 // for every string in the array
  for (var i=0; i<this.menuText.length; i++){
    // if this string is longer than var longestText
    if(this.menuText[i].length>this.longestText){
      // longestText becomes this string's length
      this.longestText=this.menuText[i].length;
    }
  }
}

// runmenuscreen()
//
// displays header text, game objects and information.
// animates text display by making characters appear over time.

Game.prototype.runMenuScreen = function(){

  // prevent paddle from interacting with ant
  leftPaddle.isSafe = true;
  rightPaddle.isSafe = true;
  // prevent biscuit from moving
  this.menuObjects[4].moving = false;

  textAlign(CENTER);
  // arrays to contain menu text
  var textToDisplay = [11];
  // game objects x, y pos
  // also used to align text
  var objectsX= this.width/5;
  var objectsY= 0.666*this.height;

  fill(this.menuTxtFill);
  // the animation is in three parts: the header text is first to appear,
  // then the game objects and descriptions,  then the info.

  // first part:
  if(this.menuFrame<=(9+this.longestText)*this.menuTextSpeed){
    // increment animation frame
    this.menuFrame +=1;
  }
  // everytime menu text speed is reached
  if(this.menuFrame%this.menuTextSpeed===0){

    // draw bg
    background(this.menuBGcolor);

    // pick a new subset of the header text to display
    textToDisplay[0] = subset(this.menuText[0], 0, this.menuFrame/this.menuTextSpeed);
    // display text
    fill(this.menuTxtFill);
    textSize(50);
    text(textToDisplay[0], this.width/2, this.height*1/6);

    // second part:
    // prepare next timer
    var displayNext = 9;
    if(this.menuFrame/this.menuTextSpeed>displayNext){
      // increment timer
      displayNext +=2;
      textSize(25);
      // for each object to display
      for(var i=1; i<6; i++){
        // pick subset of text description to display
        textToDisplay[i] = subset(this.menuText[i], 0, (this.menuFrame)/this.menuTextSpeed-9);
        stroke(45);
        strokeWeight(2);
        fill(this.menuTxtFill);
        // display object
        this.menuObjects[i-1].display();
        // display text description
        text(textToDisplay[i], (i-0.5)*objectsX, (0.5)*this.height);
      }
      // third part:
      if(displayNext>10){
        textSize(15);
        // for every info text to display
        for(var i=6; i<12; i++){
          // pick subset of info text to display
          textToDisplay[i] = subset(this.menuText[i], 0, (this.menuFrame)/this.menuTextSpeed-9);
          noStroke();
          fill(this.menuTxtFill);
          // if it's the last info text display it at the bottom of the page
          if(i===11){
              text(textToDisplay[i], (0.5)*this.width, (0.93)*height);
          }
          else{
            // else display text below each object
          text(textToDisplay[i], (i-5.5)*objectsX, (0.85)*this.height);
        }
        }
      }
    }
  }

// if mouse is pressed during menu screen, start game.

  if(mouseIsPressed===true&&mouseButton===LEFT){
    // PREPARE AND LAUNCH GAME
    currentScreen="game";
    // set correct music
    music.launchPart1();
    // reset objects (ants are reset somewhere else as they don't reset
    // everytime this function is called)
    balls = [];
    fireBalls = [];
    biscuit = new Biscuit();
    leftPaddle.isSafe = false;
    rightPaddle.isSafe = false;
    leftPaddle.score = 0;
    rightPaddle.score =0;
  }
}

// displayscore()
//
// display score and info beneath the game area

Game.prototype.displayScore = function(){

  // prepare text to be displayed
  var lines = [2]
  lines[0] = "////////  P1 HITS - MISSES: "+leftPaddle.score+"  ////////  TARGET: "+winScore+"  ////////  P2 HITS - MISSES: "+rightPaddle.score+"   ////////";
  lines[1] = "////////   P1 MATCHES WON: "+leftPaddle.matchPoint+"  ////////   LEVEL: "+level+"  ////////   P2 MATCHES WON: "+rightPaddle.matchPoint+"   ////////";
  var scoretext = join(lines,"\n" )

  // stylize
  noStroke();
  fill(this.menuBGcolor);
  // display rect over which text is written
  rect(0, this.height, this.width, height-this.height);
  fill(this.menuTxtFill);
  stroke(0);
  textSize(15);
  // display score text
  text(scoretext, this.width/2, height-30);

}
