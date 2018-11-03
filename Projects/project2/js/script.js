/*
basic ant pong
*/

// Variable to contain the objects
var balls = [];
var leftPaddle;
var rightPaddle;
var totalBalls = 0;
var drawAgain = false;

var ants = [];
var fireBalls=[];
var maxBalls = 10;
var biscuit;
var menuObjects  = [5]
var biscuitChance = 0.15;
var ballIncrease =1;
var music;

var level=1;

var winScore=10;

var canvasIncrease = 25;
var maxCanvasWidth = 0;
var maxCanvasHeight = 0;

var synth1;
var synth2;
var synth3;
var drum;
var sfx;
var sfx2;



var ourcanvas;
var currentScreen = "menu";
var menuFrame=0;
var menuText = [];
var game;
// setup()
//
// Creates the ball and paddles

function setup() {

  music = new Music();
  ourcanvas = createCanvas(900, 450);
  game = new Game();
  ourcanvas.parent('sketch-holder');
  synth1 = new Synth('sine');
  synth2 = new Synth('square');
  synth3 = new Synth('square');
  sfx = new SFX('sine', 400);
  sfx2 = new SFX('white', 400);
  drums = new Drum('white');
  rightPaddle = new Paddle(game.width-10,game.height/2,20,60,10,DOWN_ARROW,UP_ARROW, LEFT_ARROW, RIGHT_ARROW, 48);
  leftPaddle = new Paddle(0,game.height/2,20,60,10,83,87, 65, 68, 49);

  setupMenuScreen();
  music.setupInstruments();
  music.launchPart0();

  // Create paddles



}

// draw()
//
// Handles input, updates all the elements, checks for collisions
// and displays everything.

function draw() {
  playSound();

  if(currentScreen==="menu"){
    runMenuScreen();
  }
  else if(currentScreen==="game"){
    runGame();
  }
  else if(currentScreen==="gameover"){
    runGameOverScreen();
  }



}

// createballs()
//
// creates a number of balls
function runGame(){
  if(leftPaddle.score<-50||rightPaddle.score<-50){
    gameOver();
  }
  background(0);
  displayScore();
  // Create a ball
  if(balls.length<=1){
    createBalls();
  }
  // handle biscuit

  biscuit.update();
  biscuit.display();
  biscuit.handlePaddleCollision(leftPaddle);
  biscuit.handlePaddleCollision(rightPaddle);

  // handle paddle inputs and update position
  leftPaddle.handleInput();
  rightPaddle.handleInput();
  leftPaddle.update();
  rightPaddle.update();

  // check for any fire balls
  // update position and display
  // handle paddle collision
  // handle ant collision
  // remove any fireballs off screen
  if (fireBalls.length>0){
    for(var i=0; i<fireBalls.length; i++){
      fireBalls[i].update();
      fireBalls[i].display();
      fireBalls[i].isOffScreen();
      fireBalls[i].handleCollision();
      fireBalls[i].handlePaddleCollision(leftPaddle);
      fireBalls[i].handlePaddleCollision(rightPaddle);
      if(fireBalls[i].offScreen){
        removeFireBall(i);
      }
    }
  }

  // handle ant collisions:
  // paddle collision,
  // ball collisions,
  // fireball collisions
  // round up dead ants
  if (ants.length>0){
    var deadAnts=[];
    for (var j=0; j<ants.length; j++){
      ants[j].update();
      ants[j].handleCollision(leftPaddle);
      ants[j].handleCollision(rightPaddle);
      for (var k=0; k<balls.length; k++){
        ants[j].handleCollision(balls[k]);
      }
    }
    //  remove dead ants
    if(deadAnts.length!=0){
      console.log("deadants: "+deadAnts);
      removeAnts(deadAnts);
    }
  }

  // display ants
  if (ants.length>0){
    for (var j=0; j<ants.length; j++){
      ants[j].display();
    }
  }

  // balls
  // reset ball array if needed
  for(var i=0; i<balls.length; i++){
    if(drawAgain){
      drawAgain = false;
      return;
    }

    // check if ball is off screen
    balls[i].update();
    if (balls[i].isOffScreen()) {
      balls[i].reset();
    }

    // handle ball collisions
    balls[i].handlePaddleCollision(leftPaddle);
    balls[i].handlePaddleCollision(rightPaddle);
    balls[i].handleBallCollision(i);

    // reset ball array if needed
    if(drawAgain){
      drawAgain = false;
      return;
    }

    //display balls
    balls[i].display();
  }

  // display paddles
  leftPaddle.display();
  rightPaddle.display();
}
function createBalls(){

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

function removeBall(index){
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

function removeFireBall(index){
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

function removeAnt(antIndex){

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
    migrate("left");
  }
  else {
    migrate("right");
  }

  console.log("ants: "+ants.length);
}

// keypressed()
//
// pressing enter creates more balls

function keyPressed(){
  if(keyCode===ENTER){
    createBalls();
  }
  if(keyCode===SHIFT){
    biscuit.appear();
  }
  switch(key){
    case "4": music.startSFX("up");  break;
    case "5": music.startSFX("down");  break;
    case "6": music.startSFX("trem");  break;
    case "9": music.startSFX("chirp");  break;
    case "0": music.startSFX("downchirp");  break;
    case "7": migrate("left");  break;
    case "8": migrate("right");  break;
    case "r": gameReset(); break;
  }
  if(key===" "){
    /*
    ballIncrease+=4;
    canvasWidth+=4*canvasIncrease;
    canvasHeight+=4*canvasIncrease;
    canvasWidth = constrain(canvasWidth, 0, maxCanvasWidth);
    canvasHeight = constrain(canvasHeight, 0, maxCanvasHeight);
    canvas = createCanvas(canvasWidth, canvasHeight);
    */
  }
}




// playsound()
//
// keep time
// play individual instruments

function playSound(){


  drums.handleDrums();
  sfx.playSFX();
  sfx2.playSFX();
  synth1.playMusic();
  synth2.playMusic();
  synth3.playMusic();
  music.musicInc+=music.musicSpeed;
/*
  if(!this.newPhrase){
    music.musicInc+=music.musicSpeed;
  } else {
    music.newPhrase=false;
  }
  */

}

function migrate(direction){

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

function setupMenuScreen(){

  var objectsX= game.width/5;
  var objectsY= 0.666*game.height;

  var menuBGcolor = 0;
  background(menuBGcolor);

  menuFrame = 0;

  menuObjects[1] = new Ball();
  menuObjects[1].isSafe = false;
  menuObjects[1].x = 1.5*objectsX-0.5*menuObjects[1].size;
  menuObjects[1].y = objectsY;
  menuObjects[0] = new Ant(0.5*objectsX, objectsY,0.5*objectsX+menuObjects[1].size, objectsY+menuObjects[1].size);
  console.log("MENU OBJECT[0]"+menuObjects[0])
  menuObjects[0].x -=menuObjects[0].size;
  menuObjects[0].y -=0.5*menuObjects[0].size;
  menuObjects[0].isCarrying = true;
  menuObjects[2] = new FireBall();
  menuObjects[2].x = 2.5*objectsX-0.5*menuObjects[2].size;;
  menuObjects[2].y = objectsY-0.5*menuObjects[2].size;
  menuObjects[3] = new Paddle(3.5*objectsX, objectsY, 20, 100, 0, 0, 0, 0, 0, 0);
  menuObjects[3].y -= 0.5*menuObjects[3].h;
  menuObjects[3].x -=0.5*menuObjects[3].w;
  menuObjects[4] = new Biscuit();
  menuObjects[4].moving = false;
  menuObjects[4].x = 4.5*objectsX-0.5*menuObjects[4].size;;

  menuObjects[4].y = objectsY-0.5*menuObjects[4].size;

  menuText[0] = "ant pong! click screen to start.";
  menuText[1] = "ant";
  menuText[2] = "ball";
  menuText[3] = "fire";
  menuText[4] = "paddle";
  menuText[5] = "biscuit";
}
function runMenuScreen(){
  leftPaddle.isSafe = true;
  rightPaddle.isSafe = true;
  menuObjects[4].moving = false;
  textAlign(CENTER);
  var menuBGcolor = 0;


  var menuTextSpeed =10;
  var textToDisplay = [6];

  var objectsX= game.width/5;
  var objectsY= 0.666*game.height;


  fill(255);

  if(menuFrame<=menuText[0].length*menuTextSpeed){
    menuFrame +=1;
  }
  if(menuFrame%menuTextSpeed===0){
    background(menuBGcolor);
    textToDisplay[0] = subset(menuText[0], 0, menuFrame/menuTextSpeed);

    textSize(50);
    text(textToDisplay[0], game.width/2, game.height*2/7);
    textSize(25);

    var displayNext = 9;

    if(menuFrame/menuTextSpeed>displayNext){
      displayNext +=2;
      for(var i=1; i<6; i++){
        textToDisplay[i] = subset(menuText[i], 0, (menuFrame)/menuTextSpeed-9);
        fill(255);
       menuObjects[i-1].display();
        console.log(textToDisplay[i])
        text(textToDisplay[i], (i-0.5)*objectsX, (0.5)*game.height);
      }
    }
  }


  if(mouseIsPressed===true&&mouseButton===LEFT){
    // PREPARE AND LAUNCH GAME
    currentScreen="game";
    music.launchPart1();
    balls = [];
    fireBalls = [];
    biscuit = new Biscuit();
    leftPaddle.isSafe = false;
    rightPaddle.isSafe = false;
    leftPaddle.score = 0;
    rightPaddle.score =0;
  }
}
function displayScore(){
  var scoretext = "P1 HITS-MISSES= "+leftPaddle.score+", P2 HITS-MISSES= "+rightPaddle.score+ "\n SCORE TO WIN: "+winScore;

  console.log("score:"+leftPaddle.score);
  fill(255);
  strokeWeight(1);
  stroke(255);
  line(0, game.height, game.width, game.height);
  noStroke();
  textSize(15);
  text(scoretext, game.width/2, height-30);
  if(rightPaddle.score>=winScore){
    setupLevel();
    menuText[0] = "Match! Right player wins. \nclick to continue to level "+level+".";
  }
  else if(leftPaddle.score>=winScore){
    setupLevel();
    menuText[0] = "Match! Left player wins. \nclick to continue to level "+level+".";
  }
}

function gameReset(){
  music.launchPart0();
  ants = [];
  setupMenuScreen();
  level=1;
  ballIncrease=1;
  winScore = 10;
  currentScreen= "menu";
  menuText[0] = "ant pong! click screen to start.";
  rightPaddle = new Paddle(game.width-10,game.height/2,20,60,10,DOWN_ARROW,UP_ARROW, LEFT_ARROW, RIGHT_ARROW, 48);
  leftPaddle = new Paddle(0,game.height/2,20,60,10,83,87, 65, 68, 49);

}

function gameOver(){
  var winner;
  if(leftPaddle.score<-50){
    winner = "right";
  } else {
    winner = "left";
  }
gameReset();

menuText[0] = "Game over.. "+winner+" player wins! \n click screen to start again.";
}

function setupLevel(){
  music.launchPart2();
setupMenuScreen();
level+=1;
winScore+=3;
ballIncrease+=1;
currentScreen="menu";
leftPaddle.h +=40;
rightPaddle.h +=40;
for(var i=0; i<ants.length; i++){
  ants[i].damage+=5;
  ants[i].damage = constrain(ants[i].damage, 10, 30);
}
}
