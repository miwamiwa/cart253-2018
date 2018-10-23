function Game(){

}

Game.prototype.checkGameOver = function(){
  // if ball is out of paddle reach,
  // and if gameOverChanceOn is false.
  // gameOverChanceOn is reset when ball goes out. ball way the chance that the cat comes in
  // is calculated only once per ball that makes it behind the paddle.
if((ball.x<leftPaddle.inset-50||ball.x>width-rightPaddle.inset+50)&&ball.gameOverChanceOn===false){
  // toggle ball statement off. it will be reset in handleballoffscreen()
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
  // start timer. when it expires the cat head disappears and game is over (see cathead.js)
  bigHead.dispTimer=millis()+bigHead.timerLength;
  // so handleballoffscreen() won't keep track of ball point.
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
Game.prototype.checkWallCollision = function(){


    // Calculate edges of ball for clearer if statement below
    var ballTop = ball.y - ball.size/2;
    var ballBottom = ball.y + ball.size/2;
    var ballLeft = ball.x - ball.size/2;
    var ballRight = ball.x + ball.size/2;

  ///////////// NEW /////////////
    // check chance of something silly happening
    // (cat interferes with the game by swatting the ball)
    // ball function is looped, so every frame the cat has a new chance of
    // swiping at the ball.. meaning that the 0.5 chance we have right now
    // causes the leg to fire almost every time the ball is near a side.

    // if ball is close to top
    if(ballTop<5&&ball.vy<0){
      // start appropriate leg movement
      catArm.movetop();
      // chance that cat actually hits the ball
      if(random()<ball.wobbleChance){
        // generate random motion
        ball.isWobbling=true;
      }
    }
    // if ball is close to bottom
    if(ballBottom>height-5&&ball.vy>0){
      // start appropriate leg movement
      catArm.movebottom();
      // check if the ball is hit
      if(random()<ball.wobbleChance){
        ball.isWobbling=true;
      }
    }

  ///////////// END NEW /////////////

    // Check for ball colliding with top and bottom
    if (ballTop < 0 || ballBottom > height) {
      // If it touched the top or bottom, reverse its vy
      ball.vy = -ball.vy;
      // Play our bouncing sound effect by rewinding and then playing
      beepSFX.currentTime = 0;
      beepSFX.play();

        ///////////// NEW /////////////

        // cancel any random ball movement (if ball has with either side)
        if(ball.isWobbling){
          ball.isWobbling=false;
        }

        ///////////// END NEW /////////////
    }
}

Game.prototype.checkOffScreen = function(){

  // Calculate edges of ball for clearer if statement below
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

 ///////////// NEW /////////////
  // Check for ball going off one side or the other.
  // Reset it to middle
  // Update its direction
  // Update the score
  if (ballRight < 0 ) {
    // reset the ball and fire to the right side
    ball.reset("right");
    // Update right paddle score
    rightPaddle.score+=1;
  } else if (ballLeft > width) {
    // reset the ball and fire to the left side
    ball.reset("left");
    // update left paddle score
    leftPaddle.score+=1;
  }
}
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

        ///////////// NEW /////////////

        // cancel any random ball movement if ball collides with paddle
        if(ball.isWobbling){
          ball.isWobbling=false;
        }
        ///////////// END NEW /////////////

        ball.vx = -ball.vx;

        ///////////// NEW /////////////
        // update angle at which ball is sent back
        ball.vy = map(paddle.y-ball.y, -paddle.h/2, paddle.h/2, ball.speed, -ball.speed);
        ///////////// END NEW /////////////

        // Play our bouncing sound effect by rewinding and then playing
        beepSFX.currentTime = 0;
        beepSFX.play();

      }
    }
}

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

Game.prototype.catHeadAppears = function(){
  if (millis()<bigHead.dispTimer){
  bigHead.display();
  bigHead.gobble=true;
  bigHead.eye=true;
  }

  if(millis()>bigHead.dispTimer&&bigHead.dispTimer!=0&&gameIsOver===false){


// bigHead is the load game over function

    gameOverCat.load();
    ui.bgColor=255;
    // place ball in the middle so that it doesn't interact
    ball.x=width/2;
    ball.y=height/2;

    // speed up the music!
    musicSpeed=2;
    // if musicInc is not a multiple of 2 it will mess up my note triggers,
    // so make it an even number if it isn't already
    if(musicInc%2!=0){
      musicInc+=1;
    }

    // indicate that game is over. bigHead will fire the game over screen in draw.
    gameIsOver=true;
}
}
