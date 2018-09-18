// Exercise 1 - Moving pictures
// Samuel Paré-Chouinard
//
// Final code for exercise 1.
// It moves three pictures around on the canvas, as well as 2 ellipses and a square.
// One moves linearly down the screen.
// One (the clown) moves toward the mouse cursor.
// One follows the cursor exactly.
// The two ellipses run from the left side of the screen to the right.
// The higher ellipse moves straight while the lower ellipse oscillates along the Y axis.
// The square moves toward the mouse cursor, at a slower rate than the clown.

// This is the object that goes from left to right
var leftRightObjectX;
var leftRightObjectY;

// This is the object that goes from left to right and oscillates, and the increment it will use
var leftRightSineX;
var leftRightSineY;
var increment;

// The image of a clown face
var clownImage;

// The current position of the clown face
var clownImageX;
var clownImageY;

// This shape behaves similarly to the clown face
var mouseObject;

// This is its position
var mouseObjectX;
var mouseObjectY;

// The transparent image of "felt" that wipes down the canvas
var feltTextureImage;

// This is the image that will follow the mouse. It's nice because it has transparent background
// Source: http://www.iconarchive.com/show/food-icons-by-aha-soft/coffee-icon.html
var mugImage;

// The current position of the transparent image of "felt"
var feltTextureImageX;
var feltTextureImageY;


// preload()
//
// Load the three images we're using before the program starts

function preload() {
  clownImage = loadImage("assets/images/clown.png");
  feltTextureImage = loadImage("assets/images/black-felt-texture.png");
  mugImage = loadImage("assets/images/coffeicon.png");
}


// setup()
//
// Set up the canvas, position the images, set the image mode.

function setup() {
  // Create our canvas
  createCanvas(640,640);
  // Start my mug image somewhere

  // Start the clown image at the centre of the canvas
  clownImageX = width/2;
  clownImageY = height/2;

  // Our mouseObject will start somewhere else on the canvas
  mouseObjectX = width;
  mouseObjectY = height;

  //Start the left-right object on the left side of the canvas somewhere along the y axis
  leftRightObjectX = 0;
  leftRightObjectY = height/2;
  //Start the sine object below the left-right object
  leftRightSineX = 0;
  leftRightSineY = height/2+60;

  // Start the felt image perfectly off screen above the canvas
  feltTextureImageX = width/2;
  feltTextureImageY = 0 - feltTextureImage.height/2;

  // We'll use imageMode CENTER for this script
  imageMode(CENTER);
  // Why not work with rectMode CENTER aswell
  rectMode(CENTER);
}


// draw()
//
// Moves the felt image linearly
// Moves the clown face toward the current mouse location
// Moves a square toward the current mouse location, slower than the square
// Places a coffee mug at mouse location
// Moves leftright objects  horizontally across the screen
// Picks a new random color for the squares and ellipses after 10 frames

function draw() {

  // Move the felt image down by increasing its y position
  feltTextureImageY += 1;

  // Do the same but for our leftright object's x position. it can go faster i say
  leftRightObjectX+=2;

  // The Sine object also moves along the x axis in the same fashion
  leftRightSineX +=2;

  // It also oscillates along the Y axis
  leftRightSineY = leftRightSineY+cos((8*leftRightSineX)/width*TWO_PI);

  // Display the felt image
  image(feltTextureImage,feltTextureImageX,feltTextureImageY);

  // Display coffee mug image at mouse location. It's resized since this "icon" is a bit large
  // The mug appears behind the clown
  image(mugImage, mouseX, mouseY, 60, 60);

  // Move the clown by moving it 1/10th of its current distance from the mouse
  // Calculate the distance in X and in Y
  var xDistance = mouseX - clownImageX;
  var yDistance = mouseY - clownImageY;

  // Do the same for the mouseObject
  var xDistance2 = mouseX - mouseObjectX;
  var yDistance2 = mouseY - mouseObjectY;

  // Add 1/10th of the x and y distance to the clown's current (x,y) location
  clownImageX = clownImageX + xDistance/10;
  clownImageY = clownImageY + yDistance/10;

  // Do the same for mouseObject, but slower. 
  mouseObjectX = mouseObjectX + xDistance2/40;
  mouseObjectY = mouseObjectY + yDistance2/40;

  // Display the clown image.
  image(clownImage,clownImageX,clownImageY);

  // Pick a new color for every 10 frames.
  // I wasn't going to include an if statement since we've yet to cover them in class.
  // But picking a new color every frame is too harsh for my eyes.
  if(leftRightObjectX%10==0){  fill(random(255), random(255), random(255)); }

  // Display the leftright object and sine object as ellipses
  ellipse(leftRightObjectX, leftRightObjectY, 40, 40);
  ellipse(leftRightSineX, leftRightSineY, 40, 40);

  // Display mouseObject
  rect(mouseObjectX, mouseObjectY, 40, 40);
}
