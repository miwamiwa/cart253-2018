/*********************************************************

Exercise 2 - The Artful Dodger
Samuel Paré-Chouinard

Here's my rendering of the artful dodger.
This version features two different visual themes, since I tried and liked both.
- one is based on the two original ellipses
- in the other you are a fully mobile piece of cheese dodging enfuriated mice.
Other features include:
- a stock of 5 lives,
- a "cherry" to eat for an extra life,
- an extra life for every 10 enemies dodged,
- high score,
- chance of facing a bigger and faster enemy.
- game canvas and objects scale to fit the screen.
Control your avatar (cheese) with key controls or click or touch.
Toggle themes with "q" or by quickly dragging 3 fingers.


*********************************************************/
// Position size and speed

// The position and size of our avatar circle
var avatarX;
var avatarY;
var avatarSize = 50;

// The speed and velocity of our avatar circle
var avatarSpeed = 10;
var avatarVX = 0;
var avatarVY = 0;

// Cherry position and size
var cherryX;
var cherrySize=20;
var cherryY;

// Special enemy size and state (true= is the current enemy)
var specialSize=100;
var special=false;

// The position and size of the enemy circle
var enemyX;
var enemyY;
var enemySize = 50;

// The speed and velocity of our enemy
var enemySpeed = 5;
var enemyVX = 5;

// enemySpeed and Size will change over time
// so I will use defaultSpeed and Size to reset it
var defaultSpeed=5;
var defaultSize=20;

// Same idea for special enemy speed.
var defaultSpecialSpeed=6;
var specialSpeed=defaultSpecialSpeed;

// How much bigger the enemy circle gets with each successful dodge
var enemySizeIncrease = 2.5;

// How much faster the enemy circle gets with each successful dodge
var enemySpeedIncrease = 0.3;
var specialSpeedIncrease=0.1;

// Game variables:

// Variables to hold score and high score
var score =0;
var hiScore=0;

// Number of dodges needed for an extra life
var oneup=10;

// Stock of lives to start with
var startingLife=5;

// Variable to save number of lives
var life=startingLife;

// Set number of lives a cherry gives
var cherryBonus=1;

// How many dodges the player has made
var dodges = 0;

// Text to appear upon reaching the end of the game (gets filled later)
var gameOverText="";

// wasDodged is false when there's a collision.
// It will prevent a hit to be counted as a dodge for score keeping purposes.
var wasDodged=true;

// record is true when the final score is a high score.
// It will trigger the high score anouncement at the end of the game.
var record=false;

// When cheeseMode is true the enemy is a mouse and the avatar is cheese.
// When it is false, both are colored circles and color bleeds everywhere.
var cheeseMode=true;

// Number used to scale canvas size and objects' size and speed to fit the screen
var scaleIt=1;

// Color:

// Alpha value of background in and out of cheese mode (themes)
var alphaCheese=200;
var alphaNotCheese=9;

// Alpha value used to display things
var alph =10;

// Declare a background color (will change).
var newcolor= (255, 220, 220, alph);

// Timers:

// Variable used to trigger "game over" text on and off
var timer=0;

// Variable used to trigger the safety timer.
// After a hit the avatar is safe for the duration of the timer.
// I implemented this to prevent one collision from taking multiple lives.
// There are other ways, but this one also allows me to display a
// temporary "animation" (a white circle) upon collision.
var hitTimer=0;

// Duration of "game over" text on in ms
var textTimer=3000;

// Duration of safety timer in ms
var safeTime=500;

// Cherry timer, cherryDownTime and cherry will be used to placed
// the cherry off screen for a moment after it's been captured
var cherryTimer=0;
var cherryDownTime=2000;
var cherry=true;

// Images:

// Avatar image
var cheeseImg;
// Enemy image
var mouseImg;
// Cherry (or blue cheese)
var blueCheese;
// Avatar facing different directions (not sure how to simply rotate my image :D)
var cheeseDown, cheeseUp, cheeseLeft, cheeseRight;



//preload

function preload(){
  // preload images to be used in game
  cheeseDown=loadImage("images/cheesesmall.png");
  cheeseUp=loadImage("images/cheeseup.png");
  cheeseLeft=loadImage("images/cheeseleft.png");
  cheeseRight=loadImage("images/cheeseright.png");
  mouseImg=loadImage("images/mousesmall.png");
  blueCheese=loadImage("images/bluecheese.png");
}

// setup()
//
// Make the canvas, position the avatar, enemy, cherry
// Display either theme: color mode or cheese mode.

function setup() {
 console.log("setup");

 // Create our playing area, adapted to screen size
 // Minus a few pixels because I find things often fit better that way
 createCanvas(window.innerWidth-20,window.innerHeight-20);
 // Determine the scaling factor. A different factor for x and y axis
 // would probably give better results but this average will do I think
 scaleIt=(window.innerWidth/500+window.innerHeight/400)/2;

// Scale size of avatar, enemy, and cherry
defaultSpeed=defaultSpeed*scaleIt;
defaultSize=defaultSize*scaleIt;
enemySpeed=enemySpeed*scaleIt;
enemySize=enemySize*scaleIt;
cherryX=width/2;
cherrySize=cherrySize*scaleIt;
cherryY=height/2;
// Set font
textFont("Courier");
// Give and initial direction for the cheese image
cheeseImg=cheeseDown;
// Set alpha value of background to "cheese mode" to start.
alph=alphaCheese;
// No stroke so it looks cleaner
noStroke();

// Background moved into setup()
// I will use a transparent rect() in draw() instead
background(255,220,220);
// Declare an initial color for these transparent rectangles
newcolor = (255, 220, 220, alph);

// Put the avatar in the centre
avatarX = width/2;
avatarY = height/2;
// Put the enemy to the left at a random y coordinate within the canvas
enemyX = 0;
enemyY = random(0,height);
// Set imageMode and we're ready to go
imageMode(CENTER);
}

// draw()
//
// Handle moving the avatar and enemy and checking for dodges and
// game over situations. Places the cherry on or off screen.
// Listens for key and mouse or touch controls.
//

function draw() {
  // constrain enemy speed to something reasonable if needed.
  enemySpeed=constrain(enemySpeed,0, width/20);
  console.log("speed"+enemySpeed);

  // Fill screen with a transparent rectangle
  fill(newcolor);
  rect(0, 0, width, height);

  // Default the avatar's velocity to 0 in case no key is pressed this frame
  avatarVX = 0;
  avatarVY = 0;
  // Check if cherry timer is over.
  // If it is, load cherry at a random location on screen
  if(millis()>cherryTimer&&cherry===false){
    cherryX=random(width);
    cherryY=random(height);
    cherry=true;
  }
  // Check if mouse is pressed and move avatar accordingly
  if(mouseIsPressed){
    // If mouse on right side of avatar, move right
    if(mouseX-avatarX>avatarSpeed){
      avatarVX = avatarSpeed;
      // Cheese image will point right
      cheeseImg=cheeseRight;
      }  else if(mouseX-avatarX<-avatarSpeed){
    // If mouse is on left side move left
      avatarVX = -avatarSpeed;
      // Cheese image will point left
      cheeseImg=cheeseLeft;
      }
    // If mousePress was over avatar move up
    if(mouseY-avatarY>avatarSpeed){
      avatarVY = avatarSpeed;
      // If mouse isn't moving very far horizontally, display it moving Down instead
      if(mouseX-avatarX<2*avatarSpeed&&mouseX-avatarX>-2*avatarSpeed){
        cheeseImg=cheeseDown;
      }
    } else if(mouseY-avatarY<-avatarSpeed) {
    // If mousePress was under avatar move down
      avatarVY = -avatarSpeed;
      // If mouse isn't moving very far horizontally, display it moving Up instead
      if(mouseX-avatarX<2*avatarSpeed&&mouseX-avatarX>-2*avatarSpeed){
        cheeseImg=cheeseUp;
      }
    }
  }


  // Check which keys are down and set the avatar's velocity based on its
  // speed appropriately. Also set cheese image to set the right direction.
  // Left and right
  if (keyIsDown(LEFT_ARROW)) {
    avatarVX = -avatarSpeed;
    // Use leftward image
    cheeseImg=cheeseLeft;
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    avatarVX = avatarSpeed;
    // Use right image
    cheeseImg=cheeseRight;
  }
  // Up and down (separate if-statements so you can move vertically and
  // horizontally at the same time)
  if (keyIsDown(UP_ARROW)) {
    avatarVY = -avatarSpeed;
    // Use Up image
    cheeseImg=cheeseUp;
  }
  else if (keyIsDown(DOWN_ARROW)) {
    avatarVY = avatarSpeed;
    // Use down image
    cheeseImg=cheeseDown;
  }

  // Move the avatar according to its calculated velocity
  // Constrain value to remain on screen
  avatarX = constrain(avatarX + avatarVX, -5, width+5);
  avatarY = constrain(avatarY + avatarVY, -5, height+5);
  // The enemy always moves at enemySpeed (which increases)
  enemyVX = enemySpeed;
  // Update the enemy's position based on its velocity
  enemyX = enemyX + enemyVX;

  // Check if avatar is reached the cherry
  if (dist(cherryX,cherryY,avatarX,avatarY) < cherrySize/2 + avatarSize/2 ) {
    // If so, move the cherry off screen
    cherryX=-100;
    cherryY=-100;
    cherry=false;
    // Set the timer to bring the cherry back on
    cherryTimer=millis()+cherryDownTime;
    // And give the player some bonus life
   life+=cherryBonus;
  }

  // Check if the enemy and avatar overlap - if they do the player loses
  // We do this by checking if the distance between the centre of the enemy
  // and the centre of the avatar is less that their combined radii.
  // I added a timer here that prevents the player from losing
  // multiple lives in one collision: once the timer is set no hits
  // are recorded for the duration of hitTimer (0.5 sec in this version).
  if (dist(enemyX,enemyY,avatarX,avatarY) < enemySize/2 + avatarSize/2 && millis()>hitTimer) {
    console.log("hit!");
    // If that was the last life
    if(life===0){
    // Tell the player they lost
    console.log("YOU LOSE!");
    // Reset life
    life=startingLife;
    // Trigger "game over" timer
    timer=millis()+textTimer;
    // Reset the enemy's position
    enemyX = 0;
    enemyY = random(0,height);
    // Reset and scale the enemy's size and speed
    enemySize = 20*scaleIt;
    enemySpeed = 5*scaleIt;
    // Reset the avatar's position
    avatarX = width/2;
    avatarY = height/2;
    // Check if score is better than high score
    if(dodges>hiScore){
      // If the highscore was beat,
      // Update new high score and switch "record"
      // to trigger an announcement in game over text.
      hiScore=dodges;
      record=true;
    }
    // Reset the dodge counter
    dodges = 0;
    // Reset default speed and size, and special speed too. Scale them.
    defaultSpeed=5*scaleIt;
    defaultSize=20*scaleIt;
    specialSpeed=defaultSpecialSpeed*scaleIt;
  } else {
    // If that wasn't the last life, player gets minus one life
    life-=1;
    // This boolean prevents dodge from being counted
    wasDodged=false;
    // Trigger safety timer. Player is safe for a brief moment.
    hitTimer=millis()+safeTime;}
}

  // Check if the avatar has gone off the screen (cheating!)
  if ((avatarX < 0 || avatarX > width || avatarY < 0 || avatarY > height)&& millis()>hitTimer) {
    // If they went off the screen they lose in the same way as above,
    // With the exception of wasDodged which is not triggered.
    // function gameover(){}
    if(life===0){
    console.log("YOU LOSE!");
    life=startingLife;
    timer=millis()+textTimer;
    enemyX = 0;
    enemyY = random(0,height);
    defaultSize = 20*scaleIt;
    defaultSpeed = 5*scaleIt;
    specialSpeed=defaultSpecialSpeed*scaleIt;
    avatarX = width/2;
    avatarY = height/2;
    if(dodges>hiScore){
      hiScore=dodges;
      record=true;}
    dodges = 0;
  } else {
    life-=1;
    // wasDodged is not triggered here, because the enemy was dodged after all.
    hitTimer=millis()+safeTime;  }
}

  // Check if the enemy has moved all the way across the screen
  if (enemyX > width) {
    // This means the player dodged so update its dodge statistic
    // Though first we should check if we really did dodge something
    if(wasDodged){
      dodges = dodges + 1;
    }
    // Generate and scale new avatar size and speed
    avatarSize=random(10, 75)*scaleIt;
    avatarSpeed=random(5, 20)*scaleIt;
    // If the normal enemy speed is reaching special enemy speed
    // ..speed up the special enemy
    if(defaultSpeed>=specialSpeed-2){
      specialSpeed+=2*scaleIt;
    }
    // If a new multiple of 10 dodges is reached, get a bonus life
    if(dodges%oneup===0&&dodges!=0){
      life+=1;
    }
    // Tell them how many dodges they have made
    console.log(dodges + " DODGES!");
    // Reset the enemy's position to the left at a random height
    enemyX = 0;
    enemyY = random(0,height);
    // Reset wasDodged trigger
    wasDodged=true;
    // Increase the enemy's speed and size to make the game harder
    // Add a random chance for a much larger but slower enemy.
    if(random()>0.5){
      // Here the normal sized enemy is triggered
      // This boolean will be explained below.
      // For now normal enemy means not special.
    special=false;
    // Default speed (normal enemy speed) is increased
    defaultSpeed = defaultSpeed + enemySpeedIncrease*scaleIt;
    defaultSize = defaultSize + enemySizeIncrease*scaleIt;
    // Default speed assigned to (current) enemy speed
    enemySpeed=defaultSpeed;
    enemySize=defaultSize;
  } else {
    // Here the special enemy is triggered
    // This boolean will trigger an alternative enemy appearance
    special=true;
    // Assign special parameters to current enemy speed and size
    enemySpeed = specialSpeed*scaleIt;
    enemySize = specialSize*scaleIt;
    // The increase to special speed is not scaled, that would be cruel I feel.
    specialSpeed+=specialSpeedIncrease;
  }
console.log("defaultspeed:"+defaultSpeed+" specialSpeed: "+specialSpeed);

    // Pick new background color
    newcolor = color(random(255), random(255), random(255), alph);
  }

  // Display the current number of successful in the console
  console.log(dodges);
  // ----------------- Display section ------------------//
  // One section for "cheese mode"
  // And one for the other, which we can call "color mode"

  // Start with cheese mode:
  if(cheeseMode===true){
    // Variables used while desiging to scale images
    var scaleCheese=1.2;
    var scaleMouse=1.5;
    // If player was hit, display a circle around him
    // For the duration of the hitTimer which was trigged earlier.
      if(millis()<hitTimer){
        fill(255, 25, 25);
        ellipse(avatarX,avatarY,avatarSize*scaleMouse,avatarSize*scaleMouse);
      }
    // Here we display the cheese and mouse images
    // If we have a special enemy, apply a red tint
        if(special){
         tint(255, 0, 0);
        }
    // Display enemy image
    image(mouseImg, enemyX-0.4*enemySize, enemyY, 1.2*enemySize*2, 1.5*enemySize);
    // Make sure tint is off and display avatar image
    noTint();
    image(cheeseImg, avatarX, avatarY, scaleCheese*avatarSize,scaleCheese*avatarSize);
    // Display cherry (blue cheese in this case)
    image(blueCheese, cherryX, cherryY, cherrySize, cherrySize);
  } else {

  // Now we reach "color mode"
  // The player is black by default
  fill(0);
  // If we was just hit, switch fill to white for duration of the hitTimer.
  if(millis()<hitTimer){
    fill(255, 150);
  }
  // Draw the player as a circle
  ellipse(avatarX,avatarY,avatarSize,avatarSize);
  // The enemy is red
  fill(255,0,0);
  // If we have a special enemy, he will be blue.
  if(special){
    fill(0, 0, 255);
  }
  // Draw the enemy as a circle
  ellipse(enemyX,enemyY,enemySize,enemySize);
  // Draw the cherry
  fill(225, 85, 85);
  ellipse(cherryX, cherryY, cherrySize, cherrySize);
}

  // Now we display text. All text gets scaled.
  // Determine which game over text to display.
  // If a new record was reached, mention it.
  // If not, just say "game over"
  if(record){
    gameOverText="game over. New record: "+hiScore;
  } else {
    gameOverText="game over."
  }
   // Display game over text. Text will disappear once the timer limit is reached.
 if(millis()<timer){
   // Scale size
   textSize(25*scaleIt);
   fill(0);
   text(gameOverText, width/2-textWidth(gameOverText)/2, height/2);
   // Display text twice for shadow effect
   fill(255);
   text(gameOverText, width/2-textWidth(gameOverText)/2, height/2-2);
 } else {
   // This boolean needs to be reset only after the text disappears,
   // If we want the hiscore to appear at all.
   // Thus its presence inside this "else" statement.
   record=false;
 }
  // Display dodges in top left corner of the screen
  // Display text description of dodges
  fill(0);
  textSize(15*scaleIt);
  text("successful dodges :", 20*scaleIt, 20*scaleIt);
  fill(255);
  // Display again for shadow effect.
  text("successful dodges :", 20*scaleIt-1, 20*scaleIt-1);
  // Display dodges larger and red
  fill(255, 10, 25);
  textSize(35*scaleIt);
  text(dodges, 20*scaleIt, 50*scaleIt);
  // Shadow effect
  fill(255);
  text(dodges, 20*scaleIt+1, 50*scaleIt+1);
  // Display text description of health
  fill(0);
  textSize(15*scaleIt);
  text("hp: ", width-40*scaleIt, 20*scaleIt);
  // Shadow effect
  fill(255);
  text("hp: ", width-40*scaleIt-1, 20*scaleIt-1);
  // Display health in red
  fill(255, 10, 25);
  textSize(35*scaleIt);
  text(life, width-40*scaleIt, 50*scaleIt);
  // Shadow effect
  fill(255);
  text(life, width-40*scaleIt+1, 50*scaleIt+1);
  // Display some instructions at the bottom of the screen
  textSize(17*scaleIt);
  fill(0);
  text("q or drag three fingers to toggle cheese mode.", 10*scaleIt, height-20*scaleIt);
  fill(255);
  text("q or drag three fingers to toggle cheese mode.", 10*scaleIt-1, height-20*scaleIt-1);
  // Display highscore text.
  fill(0);
  textSize(15*scaleIt);
  text("hiscore: "+hiScore, width/2, 20*scaleIt);
  fill(255);
  text("hiscore: "+hiScore, width/2, 20*scaleIt-1);
}
// keyPressed()
// allows toggling between color mode and cheese mode
function keyPressed(){
  // Press q to toggle between cheese mode and color mode
  if(key==="q"){
    // record the toggle
    cheeseMode=!cheeseMode;
    // switch to appropriate alpha values for the background rectangle
    if(cheeseMode){
    alph=alphaCheese;
    } else {
    alph=alphaNotCheese;
    }
  }
}

// touchMoved
// Allows for same functionnality as keyPressed but on a touch screen.
function touchMoved(){
  // If three fingers are placed and dragged, toggle same as above.
if(touches.length>=3){
  cheeseMode=!cheeseMode;
  if(cheeseMode){
  alph=alphaCheese;
  } else {
  alph=alphaNotCheese;
  }
}
}
