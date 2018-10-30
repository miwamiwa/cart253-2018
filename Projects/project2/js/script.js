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
var ballIncrease =3;

var loseScore=10;

var canvasIncrease = 25;
var maxCanvasWidth = 0;
var maxCanvasHeight = 0;

var synth1;
var synth2;
var synth3;
var drum;
var sfx;

var musicInc = 0;
var musicSpeed = 1;

var rootNote=60;

var newPhrase=false;
var sectionSwitched=false;

var ourcanvas;
var currentScreen = "menu";
var menuFrame=0;
var menuText = [];
// setup()
//
// Creates the ball and paddles

function setup() {
  ourcanvas = createCanvas(900, 450);
  ourcanvas.parent('sketch-holder');
  synth1 = new Synth('sine');
  synth2 = new Synth('square');
  synth3 = new Synth('square');
  sfx = new SFX('sine', 400);
  drums = new Drum('white');
  setupMenuScreen();
  setupInstruments();
  launchPart0();

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
    case "4": startSFX("up");  break;
    case "5": startSFX("down");  break;
    case "6": startSFX("trem");  break;
    case "7": migrate("left");  break;
    case "8": migrate("right");  break;
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


function startSFX(sfxType){
  // prepare all SFX to allow new one to start
  sfx.upFX = false;
  sfx.downFX = false;
  sfx.tremFX = false;
  sfx.FXinc = 0;
  sfx.FXtimer = musicInc+ sfx.FXlength;
  sfx.baseFreq = sfx.defaultFreq;
  // launch the SFX
  switch(sfxType){
    case "up": sfx.upFX = true;  break;
    case "down": sfx.downFX = true; break;
    case "trem": sfx.tremFX = true; break;
  }
}

function startNewPhrase(synx, noteList, octave, rhythm, loop, fromTheTop){
  synx.playing=true;
  synx.notes=noteList;
  synx.phrase=noteList.length;
  synx.playedThru=0;
  synx.oct=octave;
  // set rate at which notes are played
  synx.rate=loop;


  if(rhythm===0){
    synx.rType="pulse";
    synx.rhythm=0;
  } else {
    synx.rType="array";
    synx.rhythm=rhythm;
    synx.nextNote=0;
  }
  if(fromTheTop){
    synx.loop=0;
  }
  newPhrase=true;
}

// playsound()
//
// keep time
// play individual instruments

function playSound(){
  if(!newPhrase){
    musicInc+=musicSpeed;
  } else {
    newPhrase=false;
  }

  drums.handleDrums();
  synth1.playMusic();
  synth2.playMusic();
  synth3.playMusic();
  sfx.playSFX();


}

// setupinstruments()
//
// here the values which will define the different
// instruments' sound are declared.

function setupInstruments(){

  // synth1 setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  synth1.setEnvelope(0.01, 0.4, 0.001, 0.5, 0.32, 0);
  // function(filterType, frequency)
  synth1.setFilter("LP", 400);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth1.setDelay(true, 0.5, 0.55, 400)
  // function(noteList, octave, loopLength)

  // load it
  synth1.loadInstrument();


  // synth2 setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  synth2.setEnvelope(0.001, 0.5, 0.2, 0.8, 0.4, 0);
  // function(filterType, frequency)
  synth2.setFilter("LP", 1500);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth2.setDelay(true, 0.33, 0.4, 2000)
  // function(noteList, octave, loopLength)


  // synth3 setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  synth3.setEnvelope(0.01, 0.7, 0.8, 0.3, 0.1, 0);
  // function(filterType, frequency)
  synth3.setFilter("LP", 800);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth3.setDelay(true, 0.165, 0.3, 1500);
  // function(noteList, octave, loopLength)

  // sfx setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  sfx.setEnvelope(0.001, 0.6, 0.0, 0.4, 0.4, 0);
  // function(filterType, frequency)
  sfx.setFilter("LP", 500);
  // function(delayIsOn, length, feedback, filterFrequency)
  sfx.setDelay(false, 0, 0, 0);
  // function(noteList, octave, loopLength)

  // drum setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  drums.setEnvelope(0.005, 0.2, 0.2, 0.5, 0.2, 0.0);
  // function(filterType, frequency)
  drums.setFilter("BP", 400);
  // function(delayIsOn, length, feedback, filterFrequency)
  drums.setDelay(false, 0, 0, 0);
  //drums.setDivisions(bar, beat, subdiv, finediv, beatsperbar, divsperbeat, fineperdiv)



  // load it
  synth2.loadInstrument();
  synth3.loadInstrument();
  sfx.loadInstrument();
  drums.loadInstrument();

}

function launchPart1(){

  var phrase1=[-5, 5, 6, 7, 6, 5, 6, 7, 6, -7];
  var rhythm1=[60, 40, 20, 40, 20, 40, 20, 40, 120, 80];
  var phrase2=[3, 2, 3, 7, 3, 9, 3, 7, 3, 5, 7, 3, 3, 2, 3, 9, 3, 10, 3, 9, 3, 5, 7, 3];
  var phrase3=[0, 5, 0, 0, 5, 5, 0, 0, 8, 7, 0, 7];
  startNewPhrase(synth2, phrase1, 0, rhythm1, 30, true);
  startNewPhrase(synth1, phrase2, 12, 0, 60, true);
  startNewPhrase(synth3, phrase3, -24, 0, 120, true);
  drums.setDivisions(120, 60, 30, 10, 2, 2, 3);
  drums.setWeights(18, 27, 25, 10, 10, 8, 8);
  synth1.isPlaying = true;
  synth2.isPlaying = true;
  synth3.isPlaying = true;
  drums.isPlaying = true;
  newPhrase = true;
  musicInc = 0;
}
function launchPart0(){

  var phrase1=[-5, -7, 3, 5];
  var rhythm1=[20, 40, 30, 30];
  var phrase2=[3, 2, 3, 7, 3, 9, 3, 7, 3, 5, 7, 3, 3, 2, 3, 9, 3, 10, 3, 9, 3, 5, 7, 3];
  var phrase3=[0, 0, 0, -7];
  var rhythm2=[40, 10, 60, 10]
  startNewPhrase(synth2, phrase1, 0, rhythm1, 30, true);
  startNewPhrase(synth1, phrase2, 12, 0, 20, true);
  startNewPhrase(synth3, phrase3, -24, rhythm2, 30, true);
  drums.setDivisions(60, 20, 10, 5, 3, 2, 2);
  drums.setWeights(18, 27, 24, 10, 10, 2, 8);
  synth1.isPlaying = true;
  synth2.isPlaying = true;
  synth3.isPlaying = true;
  drums.isPlaying = true;
  newPhrase = true;
  musicInc = 0;
}
function launchPart2(){

  var phrase2=[3, 2, 3, 7, 3, 9, 3, 7, 3, 5, 7, 3, 3, 2, 3, 9, 3, 10, 3, 9, 3, 5, 7, 3];

  startNewPhrase(synth1, phrase2, 12, 0, 20, true);

  newPhrase = true;
  musicInc = 0;
  synth1.isPlaying = true;
  synth2.isPlaying = false;
  synth3.isPlaying = false;
  drums.isPlaying = false;
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

  var objectsX= width/5;
  var objectsY= 0.666*height;
  var menuBGcolor = 0;
  background(menuBGcolor);

  menuFrame = 0;

  menuObjects[1] = new Ball();
  menuObjects[1].isSafe = false;
  menuObjects[1].x = 1.5*objectsX-0.5*menuObjects[1].size;
  menuObjects[1].y = objectsY;
  menuObjects[0] = new Ant(0.5*objectsX, objectsY,0.5*objectsX+menuObjects[1].size, objectsY+menuObjects[1].size);
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
  menuObjects[4].moving = false;
  textAlign(CENTER);
  var menuBGcolor = 0;


  var menuTextSpeed =10;
  var textToDisplay = [6];

  var objectsX= width/5;
  var objectsY= 0.666*height;


  fill(255);

  if(menuFrame<=menuText[0].length*menuTextSpeed){
    menuFrame +=1;
  }
  if(menuFrame%menuTextSpeed===0){
    background(menuBGcolor);
    textToDisplay[0] = subset(menuText[0], 0, menuFrame/menuTextSpeed);

    textSize(50);
    text(textToDisplay[0], width/2, height/3);
    textSize(25);

    var displayNext = 9;

    if(menuFrame/menuTextSpeed>displayNext){

      displayNext +=2;
      for(var i=1; i<6; i++){



        textToDisplay[i] = subset(menuText[i], 0, (menuFrame)/menuTextSpeed-9);
        fill(255);
        menuObjects[i-1].display();
        console.log(textToDisplay[i])
        text(textToDisplay[i], (i-0.5)*objectsX, (0.5)*height);


      }
    }
  }


  if(mouseIsPressed===true&&mouseButton===LEFT){
    // PREPARE AND LAUNCH GAME
    currentScreen="game";
    launchPart1();
    rightPaddle =0;
    leftPaddle=0;
    balls = [];
    ants=[];
    fireBalls = [];
    rightPaddle = new Paddle(width-10,height/2,20,60,10,DOWN_ARROW,UP_ARROW, LEFT_ARROW, RIGHT_ARROW, 48);
    leftPaddle = new Paddle(0,height/2,20,60,10,83,87, 65, 68, 49);
    biscuit = new Biscuit();
  }
}
function displayScore(){
  console.log("score:"+leftPaddle.score);
  fill(255);
  text("P1 HITS-MISSES= "+leftPaddle.score+", P2 HITS-MISSES= "+rightPaddle.score, width/2, 50);
  if(leftPaddle.score>loseScore){
    launchPart2();
    setupMenuScreen();
    currentScreen="menu";
    menuText[0] = "Game! Right player wins. click to start.";
  }
  else if(leftPaddle.score>loseScore){
      launchPart2();
    setupMenuScreen();
    currentScreen="menu";
    menuText[0] = "Game! Left player wins. click to start.";
  }
}
