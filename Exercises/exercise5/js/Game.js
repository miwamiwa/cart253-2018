/*

Game.js
In this script I placed everything that involves game event triggers.
I suppose it could also be called Event.js.

Most of the functions here involve looking at multiple objects, which was in
fact my initial motivation for placing them in a separate script.

this script handles:
- a variable to toggle gameover on and off
- variables to keep track of time
- checking if the game is over when the ball overlaps the paddle (cat eats ball)
- ball-wall collisions
- ball off-screen event
- ball-paddle collisions
- cat-bullet collision
- cat head appearance (game over)
- reset the ball after a point of scored
- a function to listen for cat arm movement

*/


// Game()
//
// this function is empty. see functions below.

function Game(){
  // a variable to keep track of time
  this.musicInc=0;
  // speed at which to increment time. will change during gameover screen.
  this.musicSpeed=1;
  // a variable to indicate that game is over
  this.gameIsOver=false;
}

// checkgameover()
//
// the game has a chance of ending by feline intervention when the ball goes out of reach.
// this function checks if the ball is behind either paddle,
// sets the x-position and direction of the cat head to be displayed
// then stops the ball.
// the next part of the game over sequence will start once the catHead's timer expires.

Game.prototype.checkGameOver = function(){

  // if ball is out of paddle reach,
  // and if gameOverChanceOn is false.
  // gameOverChanceOn is a trigger used to cause the chance of
  // gameover only once per ball going out of reach.

  if((ball.x<leftPaddle.inset-50||ball.x>width-rightPaddle.inset+50)&&ball.gameOverChanceOn===false){
    // toggle this statement off. it will be reset in ball.reset();
    ball.gameOverChanceOn=true;

    // random chance that game is over
    if(random()<ball.gameOverChance){

      // now make the cat bigHead appear in the right place,
      // and flipped the right way using xs (x-scale)

      // if ball is headed to the left
      if(ball.vx<0){
        // scale the cat head along the x axis
        bigHead.xs=abs(bigHead.xs);
        // allign the cat's mouth with the ball on the y axis
        bigHead.y=ball.y-570*bigHead.ys;
        // set x position to the correct side
        bigHead.x=0;

        // start timer. when it expires the cat head disappears and game is over
        bigHead.dispTimer=millis()+bigHead.timerLength;
        // handleballoffscreen() won't keep track of that last point so update it this way:
        rightPaddle.score+=1;
        // if ball was running right
      } else if (ball.vx>0){
        // scaling is negative
        bigHead.xs=-abs(bigHead.xs);
        bigHead.y=ball.y-570*bigHead.ys;
        bigHead.x=width;
        bigHead.dispTimer=millis()+bigHead.timerLength;
        leftPaddle.score+=1;
      }
      // stop the ball
      ball.vx=0;
      ball.vy=0;
    }
  }
}

// checkwallcollision()
//
// checks for ball colliding with wall
// triggers cat arm
// updates ball velocity accordingly

Game.prototype.checkWallCollision = function(){


  // Calculate edges of ball for clearer if statement below
  var ballTop = ball.y - ball.size/2;
  var ballBottom = ball.y + ball.size/2;
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

  // CAT ARM TRIGGER

  // if ball is close to top
  if(ballTop<5&&ball.vy<0){
    // start appropriate arm movement
    catArm.movetop();
    // chance that cat actually hits the ball
    if(random()<ball.wobbleChance){
      // generate random motion
      ball.isWobbling=true;
    }
  }
  // if ball is close to bottom
  if(ballBottom>height-5&&ball.vy>0){
    // start appropriate arm movement
    catArm.movebottom();
    // check if the ball is hit
    if(random()<ball.wobbleChance){
      ball.isWobbling=true;
    }
  }

  // Check for ball colliding with top and bottom
  if (ballTop < 0 || ballBottom > height) {
    // If it touched the top or bottom, reverse its vy
    ball.vy = -ball.vy;
    // Play our bouncing sound effect by rewinding and then playing
    beepSFX.currentTime = 0;
    beepSFX.play();

    // check for wobble movement (if ball has with either side)
    if(ball.isWobbling){
      // if ball was wobbling, cancel wobble.
      ball.isWobbling=false;
    }
  }
}

// checkoffscreen()
//
// check if ball is off screen
// update appropriate score
// call resetball()

Game.prototype.checkOffScreen = function(){

  // Calculate edges of ball for clearer if statement below
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

  // Check for ball going off one side or the other.
  // Reset it to middle
  // Update its direction
  // Update the score
  if (ballRight < 0 ) {
    // reset the ball and fire to the right side
    game.resetBall("right");
    // Update right paddle score
    rightPaddle.score+=1;
  } else if (ballLeft > width) {
    // reset the ball and fire to the left side
    game.resetBall("left");
    // update left paddle score
    leftPaddle.score+=1;
  }
}

// checkballpaddlecollision()
//
// checks for collision between ball and paddle and
// updates ball velocity accordingly.
// cancels wobble motion if any.

Game.prototype.checkBallPaddleCollision = function(paddle){

  // Calculate edges of ball for clearer if statements below
  var ballTop = ball.y - ball.size/2;
  var ballBottom = ball.y + ball.size/2;
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

  // Calculate edges of paddle for clearer if statements below
  var paddleTop = paddle.y - paddle.h/2;
  var paddleBottom = paddle.y + paddle.h/2;
  var paddleLeft = paddle.x - paddle.w/2;
  var paddleRight = paddle.x + paddle.w/2;

  // First check it is in the vertical range of the paddle
  if (ballBottom > paddleTop && ballTop < paddleBottom) {
    // Then check if it is touching the paddle horizontally
    if (ballLeft < paddleRight && ballRight > paddleLeft) {
      // Then the ball is touching the paddle so reverse its vx

      // cancel any random ball movement if ball collides with paddle
      if(ball.isWobbling){
        ball.isWobbling=false;
      }
      // send ball in opposite direction
      ball.vx = -ball.vx;

      // update angle at which ball is sent back
      ball.vy = map(paddle.y-ball.y, -paddle.h/2, paddle.h/2, ball.speed, -ball.speed);

      // Play our bouncing sound effect by rewinding and then playing
      beepSFX.currentTime = 0;
      beepSFX.play();
    }
  }
}


// checkcatcollision()
//
// check for collision between bullet and cat
// reset game upon collision

Game.prototype.checkCatCollision = function(paddle){

  // simplify the upcoming if statement by calculating variables prior
  var catTop = gameOverCat.y - gameOverCat.size/2;
  var catBottom = gameOverCat.y + gameOverCat.size/2;
  var catLeft = gameOverCat.x - gameOverCat.size/2;
  var catRight = gameOverCat.x + gameOverCat.size/2;

  // check for bullet proximity to cat
  if(paddle.bulletx>catLeft&&paddle.bulletx<catRight&&paddle.bullety>catTop&&paddle.bullety<catBottom&&paddle.bulletOn) {
    // reset game
    playAgain();
    // make sure bullets are turned off when game is reset
    paddle.bulletOn=false;
  }

}

// catheadappears()
//
// when the cat head appears, the game is soon to be over.
// display the cat head during the timer started in checkgameover()
// once the timer has expired, load and trigger the game over screen.


Game.prototype.catHeadAppears = function(){

  // if the cat head timer is running, display cat head
  if (millis()<bigHead.dispTimer){
    bigHead.display();
  }

  // if the cat head timer is over, load gameover screen then start it.
  if(millis()>bigHead.dispTimer&&bigHead.dispTimer!=0&&game.gameIsOver===false){

    // load game over:
    // load the GOcat which will be the target in the gameover game
    gameOverCat.load();
    // place ball in the middle so that it doesn't interact
    ball.x=width/2;
    ball.y=height/2;
    // speed up the music!
    this.musicSpeed=2;
    // if musicInc is not a multiple of 2 it will mess up my note triggers,
    // so make it an even number if it isn't already
    if(this.musicInc%2!=0){
      this.musicInc+=1;
    }

    // indicate that game is over. this will toggle the game over screen in the main script.
    this.gameIsOver=true;
  }
}

// resetball()
//
// places the ball back in the middle after a point was scored.
// picks a velocity and direction,
// resets position, gameoverchance and ball wobble.

Game.prototype.resetBall = function(direction){
  // turn silly ball off
  ball.isWobbling=false;
  // get a new random speed based on initial ball speed parameter
  ball.vy=random(1, 2*ball.speed);
  // set new direction for ball
  // to the left
  if(direction==="left"){
    ball.vx=-abs(ball.vx);
    // to the right
  } else if(direction==="right"){
    ball.vx=abs(ball.vx);
  }
  // place ball at the center of the screen
  ball.x = width/2;
  ball.y = height/2;
  // reset gameover chance
  ball.gameOverChanceOn=false;
}


// moveCatArm()
//
// listens for catArm motion triggers
// triggers motion

Game.prototype.moveCatArm = function(){

  if(catArm.move1||catArm.move2||catArm.move3||catArm.move4){
    catArm.move();
    catArm.display();
  }
}
