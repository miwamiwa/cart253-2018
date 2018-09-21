/*********************************************************

Exercise 2 - The Artful Dodger
Pippin Barr

Starter code for exercise 2.

*********************************************************/

// The position and size of our avatar circle
var avatarX;
var avatarY;
var avatarSize = 50;
var score =0;
var gameOverText="";
var x1, x2, y1, y2;
var startingLife=5;
var life=startingLife;
var oneup=10;
var alphaCheese=200;
var alphaNotCheese=9;
var wasDodged=true;
// The speed and velocity of our avatar circle
var avatarSpeed = 10;
var avatarVX = 0;
var avatarVY = 0;
var initSpecialSpeed=10;
var specialSpeed=initSpecialSpeed;
var specialSize=120;

// The position and size of the enemy circle
var enemyX;
var enemyY;
var enemySize = 50;
// How much bigger the enemy circle gets with each successful dodge
var enemySizeIncrease = 5;

// The speed and velocity of our enemy circle
var enemySpeed = 5;
var enemyVX = 5;
// How much bigger the enemy circle gets with each successful dodge
var enemySpeedIncrease = 0.25;
var specialSpeedIncrease=0.1;
// How many dodges the player has made
var dodges = 0;

// Set default alpha value
var alph =10;

// Declare background color.
var newcolor= (255, 220, 220, alph);

var lastSpeed, lastSize;
var defaultSpeed=5;
var defaultSize=20;
var special=false;
var timer=0;
var textTimer=1500;
var safeTime=500;
var hitTimer=0;
var cheeseImg;
var mouseImg;
var hiScore=0;
var record=false;
var cheeseMode=true;
var cheeseDown, cheeseUp, cheeseLeft, cheeseRight;
//preload

function preload(){
  cheeseDown=loadImage("images/cheesesmall.png");
  cheeseUp=loadImage("images/cheeseup.png");
  cheeseLeft=loadImage("images/cheeseleft.png");
  cheeseRight=loadImage("images/cheeseright.png");
  mouseImg=loadImage("images/mousesmall.png");
}
// setup()
//
// Make the canvas, position the avatar and anemy
function setup() {
  textFont("Courier");
  cheeseImg=cheeseDown;
      if(cheeseMode){alph=alphaCheese;}else{alph=alphaNotCheese;}
  console.log("setup");
  // Create our playing area
  createCanvas(window.innerWidth,window.innerHeight);

  // Put the avatar in the centre
  avatarX = width/2;
  avatarY = height/2;

  // Put the enemy to the left at a random y coordinate within the canvas
  enemyX = 0;
  enemyY = random(0,height);

  // No stroke so it looks cleaner
  noStroke();
// A pink background.
// Background moved into setup; I will use transparent rectangles in draw instead
    background(255,220,220);
    newcolor = (255, 220, 220, alph);
    imageMode(CENTER);
}

// draw()
//
// Handle moving the avatar and enemy and checking for dodges and
// game over situations.
function draw() {

// Add a rectangle over background
fill(newcolor);
rect(0, 0, width, height);




  // Default the avatar's velocity to 0 in case no key is pressed this frame
  avatarVX = 0;
  avatarVY = 0;

  // Check which keys are down and set the avatar's velocity based on its
  // speed appropriately
  if(mouseIsPressed){
    if(mouseX-avatarX>0){
      avatarVX = avatarSpeed;
      cheeseImg=cheeseLeft;
    }  else{
      avatarVX = -avatarSpeed;
    cheeseImg=cheeseRight;}
    if(mouseY-avatarY>0){avatarVY = avatarSpeed;}
    else{avatarVY = -avatarSpeed;}


  }
  // Left and right
  if (keyIsDown(LEFT_ARROW)) {
    avatarVX = -avatarSpeed;
    cheeseImg=cheeseLeft;
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    avatarVX = avatarSpeed;
    cheeseImg=cheeseRight;
  }

  // Up and down (separate if-statements so you can move vertically and
  // horizontally at the same time)
  if (keyIsDown(UP_ARROW)) {
    avatarVY = -avatarSpeed;
    cheeseImg=cheeseUp;
  }
  else if (keyIsDown(DOWN_ARROW)) {
    avatarVY = avatarSpeed;
    cheeseImg=cheeseDown;
  }

  // Move the avatar according to its calculated velocity
  avatarX = avatarX + avatarVX;
  avatarY = avatarY + avatarVY;

  // The enemy always moves at enemySpeed (which increases)
  enemyVX = enemySpeed;
  // Update the enemy's position based on its velocity
  enemyX = enemyX + enemyVX;

  // Check if the enemy and avatar overlap - if they do the player loses
  // We do this by checking if the distance between the centre of the enemy
  // and the centre of the avatar is less that their combined radii
  if (dist(enemyX,enemyY,avatarX,avatarY) < enemySize/2 + avatarSize/2 && millis()>hitTimer) {
    console.log("hit!");
    if(life===0){
    // Tell the player they lost
    console.log("YOU LOSE!");
    life=startingLife;
    timer=millis()+textTimer;
    // Reset the enemy's position
    enemyX = 0;
    enemyY = random(0,height);
    // Reset the enemy's size and speed
    enemySize = 20;
    enemySpeed = 5;
    // Reset the avatar's position
    avatarX = width/2;
    avatarY = height/2;
    //check for hiScore
    if(dodges>hiScore){hiScore=dodges;record=true;}
    // Reset the dodge counter
    dodges = 0;
    defaultSpeed=5;
    defaultSize=20;
    specialSpeed=initSpecialSpeed;
  } else {life-=1;

    wasDodged=false;
    hitTimer=millis()+safeTime;}
}

  // Check if the avatar has gone off the screen (cheating!)
  if ((avatarX < 0 || avatarX > width || avatarY < 0 || avatarY > height)&& millis()>hitTimer) {
    // If they went off the screen they lose in the same way as above.
    if(life===0){
    console.log("YOU LOSE!");
    life=startingLife;
    timer=millis()+textTimer;
    enemyX = 0;
    enemyY = random(0,height);
    defaultSize = 20;
    defaultSpeed = 5;
    specialSpeed=initSpecialSpeed;
    avatarX = width/2;
    avatarY = height/2;
    if(dodges>hiScore){
      hiScore=dodges;
      record=true;}
    dodges = 0;
  } else{life-=1;

    hitTimer=millis()+safeTime;  }
}

  // Check if the enemy has moved all the way across the screen
  if (enemyX > width) {
    // This means the player dodged so update its dodge statistic
    if(wasDodged){dodges = dodges + 1;}
    avatarSize=random(10, 100);
    avatarSpeed=random(5, 20);
    if(defaultSpeed>=specialSpeed+2){
      specialSpeed+=2;
    }
    if(dodges%oneup===0&&dodges!=0){life+=1;}
    // Tell them how many dodges they have made
    console.log(dodges + " DODGES!");
    // Reset the enemy's position to the left at a random height
    enemyX = 0;
    enemyY = random(0,height);
    wasDodged=true;
    // Increase the enemy's speed and size to make the game harder
    // Add a random chance for a much larger but slower enemy.
    if(random()>0.5){
    special=false;
    defaultSpeed = defaultSpeed + enemySpeedIncrease;
    defaultSize = defaultSize + enemySizeIncrease;
    enemySpeed=defaultSpeed;
    enemySize=defaultSize;
  } else {
    special=true;
    enemySpeed = specialSpeed;
    enemySize = specialSize;
    specialSpeed+=specialSpeedIncrease;
  }
console.log("defaultspeed:"+defaultSpeed+" specialSpeed: "+specialSpeed);

    // Pick new background color
    newcolor = color(random(255), random(255), random(255), alph);
  }

  // Display the current number of successful in the console
  console.log(dodges);
  // if cheese mode draw cheese
  if(cheeseMode===true){
    var scaleCheese=1.2;
    var scaleMouse=1.5;
      if(millis()<hitTimer){
        fill(255, 150);
        ellipse(avatarX,avatarY,avatarSize*scaleMouse,avatarSize*scaleMouse);}
        if(special){  tint(255, 0, 0);}
        image(mouseImg, enemyX-0.4*enemySize, enemyY, 1.2*enemySize*2, 1.5*enemySize);
    noTint();
        image(cheeseImg, avatarX, avatarY, scaleCheese*avatarSize,scaleCheese*avatarSize);

  } else {

  // The player is black, or white if he just lost a life
  fill(0);
  if(millis()<hitTimer){fill(255, 150);}
  // Draw the player as a circle
  ellipse(avatarX,avatarY,avatarSize,avatarSize);
  // The enemy is red
  fill(255,0,0);
  if(special){fill(0, 0, 255);}
    // Draw the enemy as a circle
    ellipse(enemyX,enemyY,enemySize,enemySize);
}
if(record){gameOverText="game over. New record: "+hiScore;}
else{gameOverText="game over."}

 if(millis()<timer){
   textSize(25);
   fill(0);
   text(gameOverText, width/2-textWidth(gameOverText)/2, height/2);
   fill(255);
   text(gameOverText, width/2-textWidth(gameOverText)/2, height/2-2);
 }else {record=false;}
  // Display dodges in top left corner of the screen
  fill(0);
  textSize(15);
  text("successful dodges :", 20, 20);
  fill(255);
  text("successful dodges :", 19, 19);
  fill(255, 10, 25);
  textSize(35);
  text(dodges, 20, 50);
  fill(255);
  text(dodges, 21, 51);
  fill(0);
  textSize(15);
  text("hp : ", width-40, 20);
  fill(255);
  text("hp : ", width-41, 19);
  fill(255, 10, 25);
  textSize(35);
  text(life, width-40, 50);
  fill(255);
  text(life, width-39, 51);
  textSize(17);
  fill(0);
  text("1up for every 10 dodges. \npress q to toggle cheese mode.", 10, height-30);
  fill(255);
  text("1up for every 10 dodges. \npress q to toggle cheese mode.", 9, height-31);
}

function keyPressed(){
  if(key==="q"){
    console.log("backspace pressed")
    cheeseMode=!cheeseMode;
    if(cheeseMode){alph=alphaCheese;}else{alph=alphaNotCheese;}
  }
}

function mouseDragged(){
if(mouseX<0.3*width){//go left
  avatarVX = -avatarSpeed;
}
if(mouseX>0.3*width){//go right
  avatarVX = avatarSpeed;
}
if(mouseY<0.3*height){//go up
  avatarVY = -avatarSpeed;
}
if(mouseY>0.3*height){//go down
  avatarVY = avatarSpeed;
}
}
function touchMoved(){
  if(mouseX<0.3*width){//go left
  }
  if(mouseX>0.3*width){//go right
  }
  if(mouseY<0.3*height){//go up
  }
  if(mouseY>0.3*height){//go down
  }
}
