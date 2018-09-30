/******************************************************************************
Where's Sausage Dog?
by Pippin Barr

An algorithmic version of a Where's Wally searching game where you
need to click on the sausage dog you're searching for in amongst all
the visual noise of other animals.

Animal images from:
https://creativenerds.co.uk/freebies/80-free-wildlife-icons-the-best-ever-animal-icon-set/
******************************************************************************/

// Position and image of the sausage dog we're searching for
var targetX;
var targetY;
var targetImage;
var targetVX=0;
var targetVY=0;
var targetSizeX;
var targetSizeY;

// random decoy size
var randomSize;

// win animation triggers
var wasHit=false;
var timerDone=0;

// target velocity during animation
var finalVelX=30;

// Position of the help image.
var helpImageX, helpImageY;

// text and help box design parameters
var uiTextSize=14;
var uiTextFill;
var uiFill;
var uiFill2;
var uiStrokeWeight=8;
var questText="$2 reward";
var exclamation="woof!";

// range of possible image sizes
var minSize=36;
var maxSize=128;

// range of decoys to generate
var minDecoys=10;
var maxDecoys=2*minDecoys;

// decoyList holds the full list of images, assigned in preload
var decoyList=[0];
// and finalDecoyList is a copy of decoyList minus the random target image
var finalDecoyList=[0];

// The number of decoys to show on the screen, randomly
// chosen from the decoy images
var numDecoys=0;

// Keep track of whether they've won
var gameOver = false;

// Will be used to save which image is the target image
var tarNum=0;

// State number of images we have
var numImages=11;

// something to count frames
 var frame=0;

// preload()
//
// Loads the target and decoy images before the program starts

function preload() {
  // create array based on number of images we are using (must state this number)
  // this way we could potentially expand the image bank
  // as long as we follow the same name syntax
  // this way in setup() we also avoid the lengthy else/if method of displaying random images

  // For each image, create a link to that image
  for(var i=0; i<numImages; i++){
    // first 9 numbers start with a "0"
    var imageLink= "assets/images/animals-0"+(i+1)+".png";
    // the following ones do not
    if(i>=9){ imageLink="assets/images/animals-"+(i+1)+".png";}
    // here's the exception: our original target image has a different syntax
    // could have renamed it to fit the syntax but exceptions can be interesting too
    if(i===numImages-1){ imageLink="assets/images/animals-target.png";}
    // now that links are created, assign each image to a list element
    decoyList[i]=loadImage(imageLink);
 }
}

// setup()
//
// sets a few initial display parameters then fires the reset function
// which will load everything

function setup() {
  // initialize inc


  // dislay modes
  imageMode(CENTER);
  rectMode(CENTER);
  // set "ui" values (for text and rectangle on screen)
  uiFill=color(255, 25, 25);
  uiFill2=color(255, 85, 85);
  uiTextFill=color(255);
  textFont("Helvetica");
  // avoid doubling setup text by placing the reset function directly here
  resetSetup();
}

function draw() {

  // Update target position based on speed
  targetX=targetX+targetVX;
  targetY=targetY+targetVY;

  if (gameOver) {

    // Prepare our typography
    textSize(128);
    textAlign(CENTER,CENTER);
    noStroke();
    fill(random(255));
    // Tell them they won!
    text("YOU WINNED!",width/2,height/2);
    // A short animation is triggered upon winning
    // First part is the "you winned" text and ellipse
    if(!wasHit){
      // new background
      background(0);
      // stylize
      noFill();
      stroke(random(255));
      strokeWeight(10);
      // draw win ellipse
      ellipse(targetX,targetY,targetSizeX*2,targetSizeY*2);
      image(targetImage, targetX, targetY);
      wasHit=true;

      // Start timer that will trigger the next part of the win animation
      timerDone=millis()+500;
  }
  // Timer end: animation continues
  // in this part I display random target images with a tint applied
   if(millis()>timerDone){
     fill(0, 3);
     rect(width/2, height/2, width, height);
     // starting counting frames after timer
     frame+=1;
     // constrain value below targetSize
     frame=constrain(frame, 0, targetSizeX-25);
     // pick a random color
     tint(random(255), random(255), random(255));
     // display a random target image
     image(targetImage, random(width), random(height), targetSizeX-frame, targetSizeX-frame);
     }
       // display number of decoys, and reset instructions
       // stylize text
         textAlign(LEFT);
         fill(uiFill);
         textSize(25);
         // dislay decoys and instructions twice for shadow effect
      text("Decoys: "+numDecoys, 10, height-50);
      text("to restart press 1 (easier), 2 (same difficulty) or 3 (harder)", 10, height-20);
      fill(uiFill2);
      text("Decoys: "+numDecoys, 10-2, height-50-2);
      text("to restart press 1 (easier), 2 (same difficulty) or 3 (harder)", 10-2, height-20-2);
    }

}

// Key pressed ()
// this function manages the key controls used to reset the game
function keyPressed(){
  // factor by which the game is made easier or harder
  // var variation will be used to increase or decrease the maximum
  // and minimum boundaries of the random number of decoys displayed
  var variation;
  // if key press is 1, 2, or 3
  if(key>0&&key<4){
  switch(key){
    // pressing 1 makes the game easier
    case '1':
    console.log("50% easier");
    variation=0.5;
    break;
    // pressing 2 keeps the same difficulty
    case '2':
    console.log("same difficulty");
    variation=1;
    break;
    // pressing 3 makes the game harder
    case '3':
    console.log("50% harder");
    variation=1.5;
    break;
}
// Calculate new range for random decoys based on difficulty setting
minDecoys = constrain(variation*minDecoys, 1, 1000);
maxDecoys = 2*minDecoys;
// Calculate new range for random size
// using 1-variation as a factor we can increase size range for added difficulty,
// and normalise the sizes to make it easier
minSize += (1-variation)*8;
minSize = constrain(minSize, 10, 40);
maxSize -= (1-variation)*16;
maxSize = constrain(maxSize, 100, 200);
// Reset game variables
wasHit=false;
gameOver=false;
numImages=11;
frame=0;
noTint();
//fire the reset function
resetSetup();
}
}

// mousePressed()
//
// Checks if the player clicked on the target and if so tells them they won
function mousePressed() {
  // Check if the mouse is in the x range of the target
  if (mouseX > targetX - targetSizeX/2 && mouseX < targetX + targetSizeX/2) {
    // Check if the mouse is also in the y range of the target
    if (mouseY > targetY - targetSizeY/2 && mouseY < targetY + targetSizeY/2) {
      gameOver = true;
    }
  }
}


 function resetSetup(){
   // This part replaces most of setup() and is used to reset the gameOver
   // to its initial settings as well.
   // create playing area
   createCanvas(windowWidth-1,windowHeight-5);
   background("#ffff00");
   // choose a number from 0 to 10
   tarNum = floor(random(0, 11));
   // use that to pick the target image from the array created in preload()
   targetImage=decoyList[tarNum];
   // update the final decoy list to exlude the target
   finalDecoyList=concat(subset(decoyList, 0, tarNum), subset(decoyList, tarNum+1, decoyList.length));
   // generate a random number of decoys
   numDecoys=round(random(minDecoys, maxDecoys));
   // reset target size, velocity, position
   targetSizeX=128;
   targetSizeY=128;
   targetVX=0;
   targetVY=0;
   targetX=0;
   targetY=0;
   // Use a for loop to draw as many decoys as we need
   for (var i = 0; i < numDecoys; i++) {
     // Choose a random location for this decoy
     var x = random(0,width);
     var y = random(0,height);
     // Generate a random number we can use for probability
     var r = random();
     // check through the list of decoys
     for(var j=0; j<finalDecoyList.length; j++){
     // now check range of the random number
     if(r<0.1*j&&r>0.1*(j-1)){
     // use that to display a random image with random size
         randomSize=random(minSize, maxSize);
         image(finalDecoyList[j],x,y, randomSize, randomSize);

     }
   }
   }

   // Once we've displayed all decoys, we choose a location for the target
   targetX = random(0,width);
   targetY = random(0,height);
   // Make sure target image is not hidden behind the ui by generating coordinates again if needed
   while(targetX>width-1.5*128&&targetY<1.5*128+uiTextSize){
     targetX = random(0,width);
     targetY = random(0,height);
   }
   // generate a random size
   targetSizeX=random(minSize, maxSize);
   targetSizeY=targetSizeX;
  // And draw target (this means it will always be on top)
  image(targetImage,targetX,targetY, targetSizeX, targetSizeY);

   // Display a help box that tells the user what he's looking for
   // First determine position
   helpImageX=width-128/2-uiStrokeWeight/2;
   helpImageY=128/2+uiStrokeWeight/2;
   // stylize rectangle
   strokeWeight(uiStrokeWeight);
   stroke(uiFill2);
   fill(uiFill);
   // display rectangle which is the background of help box
   rect(helpImageX, helpImageY, 128, 128+uiTextSize+5);
   // stylize text
   fill(uiTextFill);
   noStroke();
   textSize(uiTextSize);
   // display help box text
   text(questText, helpImageX-textWidth(questText)/2, helpImageY+64);
   // display help box image
   image(targetImage, helpImageX, helpImageY);

  // display text at the bottom of the screen
  // stylize text and display twice for shadow effect.
  fill(uiFill);
  textSize(25);
  text("Decoys: "+numDecoys+". Current difficulty: "+floor(minDecoys)+" to "+floor(maxDecoys)+" decoys.", 10, height-50);
  text("to restart press 1 (easier), 2 (same difficulty) or 3 (harder)", 10, height-20);
  fill(uiFill2);
  text("Decoys: "+numDecoys+". Current difficulty: "+floor(minDecoys)+" to "+floor(maxDecoys)+" decoys.", 10-2, height-50-2);
  text("to restart press 1 (easier), 2 (same difficulty) or 3 (harder)", 10-2, height-20-2);


}
