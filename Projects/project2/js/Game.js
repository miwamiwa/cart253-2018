function Game(){
  this.width=width;
  this.height=height-50;
this.menuFrame=0;
this.menuText = [];
this.menuTextSpeed = 7;
this.menuObjects  = [5];
this.longestText=0;
}

Game.prototype.setupMenuScreen = function(){

  var objectsX= this.width/5;
  var objectsY= 0.666*this.height;

  var menuBGcolor = 0;
  background(menuBGcolor);

  this.menuFrame = 0;

  this.menuObjects[1] = new Ball();
  this.menuObjects[1].isSafe = false;
  this.menuObjects[1].x = 1.5*objectsX-0.5*this.menuObjects[1].size;
  this.menuObjects[1].y = objectsY;
  this.menuObjects[0] = new Ant(0.5*objectsX, objectsY,0.5*objectsX+this.menuObjects[1].size, objectsY+this.menuObjects[1].size);
  console.log("MENU OBJECT[0]"+this.menuObjects[0])
  this.menuObjects[0].x -=this.menuObjects[0].size;
  this.menuObjects[0].y -=0.5*this.menuObjects[0].size;
  this.menuObjects[0].isCarrying = true;
  this.menuObjects[2] = new FireBall();
  this.menuObjects[2].x = 2.5*objectsX-0.5*this.menuObjects[2].size;;
  this.menuObjects[2].y = objectsY-0.5*this.menuObjects[2].size;
  this.menuObjects[3] = new Paddle(3.5*objectsX, objectsY, 20, 100, 0, 0, 0, 0, 0, 0);
  this.menuObjects[3].y -= 0.5*this.menuObjects[3].h;
  this.menuObjects[3].x -=0.5*this.menuObjects[3].w;
  this.menuObjects[4] = new Biscuit();
  this.menuObjects[4].moving = false;
  this.menuObjects[4].x = 4.5*objectsX-0.5*this.menuObjects[4].size;;

  this.menuObjects[4].y = objectsY-0.5*this.menuObjects[4].size;

  this.menuText[0] = "ant pong! click screen to start.";
  this.menuText[1] = "ant";
  this.menuText[2] = "ball";
  this.menuText[3] = "fire";
  this.menuText[4] = "paddle";
  this.menuText[5] = "biscuit";
  this.menuText[6] = "two balls colliding\nmake an ant.\nants eat paddles\nand take balls away";
  this.menuText[7] = "more balls appear\nas levels increase.\n+1 for hitting a ball\n-1 for missing a ball";
  this.menuText[8] = "fireballs kill ants and\ndamage paddles.\nchance to appear randomly\nplayers can also shoot them";
  this.menuText[9] = "P1: WASD to move,\n1 to shoot.\nP2: arrows to move,\n0 to shoot.";
  this.menuText[10] = "gives paddle some\nbonus height.\nchance to appear when\nants sabotage the game";
  this.menuText[11] = "score is hits minus misses.\nround is over when objective is reached. game over if both players have "+gameOverScore+" points";
  for (var i=0; i<this.menuText.length; i++){
    if(this.menuText[i].length>this.longestText){
      this.longestText=this.menuText[i].length;
    }
  }
}


Game.prototype.runMenuScreen = function(){
  leftPaddle.isSafe = true;
  rightPaddle.isSafe = true;
  this.menuObjects[4].moving = false;
  textAlign(CENTER);
  var menuBGcolor = 0;


  var menuTextSpeed =10;
  var textToDisplay = [11];

  var objectsX= this.width/5;
  var objectsY= 0.666*this.height;


  fill(255);

  if(this.menuFrame<=(9+this.longestText)*this.menuTextSpeed){
    this.menuFrame +=1;
    console.log("MENUSETUP");
  }
  if(this.menuFrame%this.menuTextSpeed===0){
    background(menuBGcolor);
    textToDisplay[0] = subset(this.menuText[0], 0, this.menuFrame/this.menuTextSpeed);

    textSize(50);
    text(textToDisplay[0], this.width/2, this.height*1/6);


    var displayNext = 9;

    if(this.menuFrame/this.menuTextSpeed>displayNext){
      displayNext +=2;
      textSize(25);
      for(var i=1; i<6; i++){
        textToDisplay[i] = subset(this.menuText[i], 0, (this.menuFrame)/this.menuTextSpeed-9);
        fill(255);
        this.menuObjects[i-1].display();
        console.log(textToDisplay[i])
        text(textToDisplay[i], (i-0.5)*objectsX, (0.5)*this.height);
      }
      if(displayNext>10){
        textSize(15);
        for(var i=6; i<12; i++){
          textToDisplay[i] = subset(this.menuText[i], 0, (this.menuFrame)/this.menuTextSpeed-9);
          fill(255);
          console.log(textToDisplay[i])
          if(i===11){
              text(textToDisplay[i], (0.5)*this.width, (0.93)*height);
          }
          else{
          text(textToDisplay[i], (i-5.5)*objectsX, (0.85)*this.height);
        }
        }
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
Game.prototype.displayScore = function(){

  var lines = [2]
   lines[0] = "////////  P1 HITS - MISSES: "+leftPaddle.score+"  ////////  OBJECTIVE: "+winScore+"  ////////  P2 HITS - MISSES: "+rightPaddle.score+"   ////////";
  lines[1] = "////////   P1 MATCHES WON: "+leftPaddle.matchPoint+"  ////////   LEVEL: "+level+"  ////////   P2 MATCHES WON: "+rightPaddle.matchPoint+"   ////////";
  var scoretext = join(lines,"\n" )

  console.log("score:"+leftPaddle.score);
  fill(255);
  strokeWeight(1);
  stroke(255);
  line(0, this.height, this.width, this.height);
  noStroke();
  textSize(15);
  text(scoretext, this.width/2, height-30);
  if(rightPaddle.score>=winScore){
    setupLevel();
    rightPaddle.matchPoint+=1;
    this.menuText[0] = "Match! Right player wins. \nclick to continue to level "+level+".";
  }
  else if(leftPaddle.score>=winScore){
    setupLevel();
    leftPaddle.matchPoint+=1;
    this.menuText[0] = "Match! Left player wins. \nclick to continue to level "+level+".";
  }
}
