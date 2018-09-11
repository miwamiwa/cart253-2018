// Exercise 1 - Moving pictures
// Pippin Barr
//
// Starter code for exercise 1.
// It moves two pictures around on the canvas.
// One moves linearly down the screen.
// One moves toward the mouse cursor.

// This is the object that goes from left to right
var objectx;
var objecty;
// The image of a clown face
var clownImage;
// The current position of the clown face
var clownImageX;
var clownImageY;

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
// Load the two images we're using before the program starts

function preload() {
  clownImage = loadImage("assets/images/clown.png");
  feltTextureImage = loadImage("assets/images/black-felt-texture.png");
  mugImage = loadImage("assets/images/coffeicon.png");
  console.log("all good");
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
  //Start the object on the left side of the canvas somewhere along the y axis
  objectx = 0;
  objecty = height/2;



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

function draw() {

  // Move the felt image down by increasing its y position
  feltTextureImageY += 1;
  // Do the same but for our object's x position
  objectx+=1;

  // Display the felt image
  image(feltTextureImage,feltTextureImageX,feltTextureImageY);

  // Display coffee mug image at mouse location. It's resized since this "icon" is a bit large
  // The mug will indeed appear behind the clown.
  // The clown wants coffee. this code tells a story.
  image(mugImage, mouseX, mouseY, 60, 60);

  // Move the clown by moving it 1/10th of its current distance from the mouse

  // Calculate the distance in X and in Y
  var xDistance = mouseX - clownImageX;
  var yDistance = mouseY - clownImageY;
  // Add 1/10th of the x and y distance to the clown's current (x,y) location
  clownImageX = clownImageX + xDistance/10;
  clownImageY = clownImageY + yDistance/10;

  // Display the clown image
  image(clownImage,clownImageX,clownImageY);
  // Display the object
  ellipse(objectx, objecty, 20, 20);
}
