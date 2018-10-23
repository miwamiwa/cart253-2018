/*

GOCat.js
This is the small cat head players shoot at during the game-over game.

This script handles:
- creating the gameover cat object
- initializing its position and scaling down the cat head
- updating position of cat head
- displaying cat head

*/

// GOCat()
//
// creates a new Game Over Cat.
// the game over cat uses the display image of CatHead.js.
// it is also the invisible ellipse that you are shooting at during the
// game over game (over which the small cat head is drawn).

function GOCat() {
  // position
  this.x= 0;
  this.y= 0;
  // side
  this.size= 40;
  // speed
  this.vx= 0;
  this.vy= 0;
  this.speed= 5;
  // variables to manipulate noise() (mapped to speed)
  this.noiseIncrement=0;
  this.inc=0.01;
}

// load()
//
// readies the cat by placing it in the middle of the screen,
// and by scaling down the bigHead image.

GOCat.prototype.load = function(){
  this.x=width/2;
  this.y=height/2;
  // Scale down the bigHead image.
  bigHead.xs=0.1;
  bigHead.ys=0.1;
}

// move()
//
// updates GOcat's speed using mapped noise().
// constrains motion within the screen.

GOCat.prototype.move = function(){

  ///// update velocity
  // increment noise value
  gameOverCat.noiseIncrement+=gameOverCat.inc;
  // pick seed for x velocity
  noiseSeed(0);
  // map noiseIncrement to x velocity
  gameOverCat.vx=map(noise(gameOverCat.noiseIncrement), 0, 1, -gameOverCat.speed, gameOverCat.speed);
  // pick seed for y velocity
  noiseSeed(1);
  // map noiseIncrement to y velocity
  gameOverCat.vy=map(noise(gameOverCat.noiseIncrement), 0, 1, -gameOverCat.speed, gameOverCat.speed);

  ///// constrain to stay on screen
  // left side
  if(gameOverCat.x<catConstrain){gameOverCat.vx=abs(gameOverCat.vx);
  }
  // right side
  if(gameOverCat.x>width-catConstrain){gameOverCat.vx=-abs(gameOverCat.vx);
  }
  // top
  if(gameOverCat.y<catConstrain){gameOverCat.vy=abs(gameOverCat.vy);
  }
  // bottom
  if(gameOverCat.y>height-catConstrain){gameOverCat.vy=-abs(gameOverCat.vy);
  }

  ///// update gameOverCat position
  gameOverCat.x+=gameOverCat.vx;
  gameOverCat.y+=gameOverCat.vy;
  // set this x and y position to match cat x and y position
  bigHead.x=gameOverCat.x-gameOverCat.size/2;
  bigHead.y=gameOverCat.y-470*bigHead.xs;
}

// display()
//
// used for understanding's sake in the main script.
// displays CatHead (scaled down).

GOCat.prototype.display = function(){
  bigHead.display();
}
