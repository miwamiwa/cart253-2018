/*

events.js
this script doesn't handle an object in particular, it is a place
to place game event functions that were filling script.js to the rim.
contains:
menuAction()
setupMenu()
setupLevelMenu()
displayLevelInfo()
displayHealth()
displayScore()
checkLevelComplete()
updateCam()
findGoodPosition()
newLevel()
checkGameOver()

*/

// menuAction()
//
// do something when menu action button is pressed
// either start the game or move from gameover screen to menu screen

function menuAction(){

  if(!gameOver){
    gameOn = true;
  }
  else if(gameOver){
    gameOver = false;
    level = 0;  gameOn = true;
    setupMenu();
    newLevel();

  }
}


// setupmenu()
//
// loads menu objects with main menu image files

function setupMenu(){

  menu1 = new MenuObject(400, -30, instructionsimg, false);
  menu2 = new MenuObject(-400, 00, controlsimg, false);
  menu3 = new MenuObject(00, 30, titleimg, true);
}

// setuplevelmenu()
//
// loads menu objects with new level image files

function setupLevelMenu(){

  menu1 = new MenuObject(400, -30, instructionsimg, false);
  menu2 = new MenuObject(-400, 00, controlsimg, false);
  menu3 = new MenuObject(00, 30, nextlvlimg, true);

}


// displaylevelinfo()
//
// display information in the html below the game screen

function displayLevelInfo(){

  // display level
  document.getElementById("1").innerHTML = level;

  // display objective
  document.getElementById("2").innerHTML = levelTarget-player.healthydroppings;

  // display number of healthy foods and number of unhealthy foods
  var healthyfoods =0;
  var unhealthyfoods =0;
  // determine number of healthy and unhealthy foods depending on
  // whether var kindsOfObs is odd or even.
  if(kindsOfObs%2===0){
    healthyfoods = (kindsOfObs-2)/2;
    unhealthyfoods = healthyfoods+1;
    document.getElementById("3").innerHTML = healthyfoods;
    document.getElementById("4").innerHTML = unhealthyfoods;
  }
  else {
    healthyfoods = (kindsOfObs-1)/2;
    unhealthyfoods = healthyfoods;
    document.getElementById("3").innerHTML = healthyfoods;
    document.getElementById("4").innerHTML = unhealthyfoods;
  }

  // display number of enemies
  document.getElementById("5").innerHTML = numEnemies;

  // display health
  displayHealth();

  // display room left
  player.updateRoomLeft();
}

// displayhealth()
//
// update health displayed below game screen

function displayHealth(){
  document.getElementById("6").innerHTML = player.health;
}


// displayscore()
//
// update number of healthy and unhealthy droppings below the game screen

function displayScore(){

  document.getElementById("2").innerHTML = levelTarget-player.healthydroppings;
  player.updateRoomLeft();

}


// checklevelcomplete()
//
// check if level objective is met, then trigger a new level.

function checkLevelComplete(){

  if(player.healthydroppings >= levelTarget){
    levelComplete = true;
    level +=1;
    newLevel();
    setupLevelMenu();
    gameOn = false;
  }
}




// udpateCam()
//
// zoom out function called upon clicking mouse.
// click on top or bottom of screen to update camera Y offset
// click on left or right of screen to update camera Z offset
// camera() function is called inside MovingObject.js

function updateCam(){

  changeCamView = true;
  camOffsetY -= (mouseY-height/2)/height*10;
  camOffsetZ -= (mouseX-width/2)/width*10;
  camOffsetY = constrain(camOffsetY, -300, 350);
  camOffsetZ = constrain(camOffsetZ, -300, 350);
}

// findgoodposition()
//
// finds a random position for a player or enemy that's not inside an obstacle

function findGoodPosition(target) {

  var positionGood = false;
  // repeat until a good position is found
  while (!positionGood){
    // pick a new position
    target.x = random(-world.w/2, world.w/2);
    target.y = random(-world.h/2, world.h/2);
    var positionNoGood = false;
    // check if target would overlap with any obstacles
    for(var i=0; i < obstacles.length; i++){
      if(
        target.x>=obstacles[i].x-obstacles[i].size/2-foodSize/2
        && target.x<=obstacles[i].x+obstacles[i].size/2+foodSize/2
        && target.y>=obstacles[i].y-obstacles[i].size/2-foodSize/2
        && target.y<=obstacles[i].y+obstacles[i].size/2+foodSize/2
      ){
        positionNoGood=true;
      }
    }
    // if the position answers the criteria above, stop looping
    if(!positionNoGood){
      positionGood = true;
    }
  }
}


// newlevel()
//
// start a new level: load player, enemies, obstacles.
// groups obstacles by rows and columns to speed up detection code during game.
// set this level's target, based on number of obstacles in play
// load an oscillator for each type of obstacle in the level
// place the player and enemies away from obstacles
// update info below the screen

function newLevel(){

  levelComplete = false;
  gameOver = false

  // load PLAYER
  initialHealth +=1;
  player = new MovingObject(0,height/2,3,83,87, 65, 68);

  // load ENEMIES
  // add a new enemy
  numEnemies = 1+level;
  enemies = [];
  for (var i=0; i<numEnemies; i++){
    enemies[i] = new EnemyObject(50, 50);
  }

  // new OBSTACLES

  // new number of obstacle types
  kindsOfObs = level+3;
  // create a grid based on size of food objects
  xobs = (world.w)/foodSize;
  yobs = (world.h)/foodSize;

  // new columns and rows
  obsRow = [];
  obsCol = [];
  // create columns to group obstacles
  for(var i=0; i<(xobs+1)*4; i++){
    obsCol.push(new ObsGroup(0));
  }
  // create rows to group obstacles
  for(var i=0; i<(yobs+1)*4; i++){
    obsRow.push(new ObsGroup(1));
  }

  // reset obstacles array, number of healthy obstacles
  healthyobs =0;
  obstacles = [];
  // a variable to index obstacle position on the grid
  var obstacleindex =0;
  obstacleDensity += 0.03;

  // for each point on the grid
  for (var i=0; i<xobs*yobs; i++){
    // random chance of generating an obstacle object
    if(random()<obstacleDensity){
      // push a new obstacle. can be either food or a wall.
      obstacles.push(new Obstacle(i, obstacleindex));
      // add to appropriate row and column.
      var row = obstacles[obstacleindex].row;
      var col = obstacles[obstacleindex].column;
      obsRow[row].addNew(obstacles[obstacleindex]);
      obsCol[col].addNew(obstacles[obstacleindex]);
      // increment index
      obstacleindex +=1;
    }
  }

  minHealthyFood += 3;
  // make sure our random obstacles meet the level's minimum requirement
  while(healthyobs < minHealthyFood){
    var pick = floor(random(obstacles.length));
    var numHealthyObs = floor((kindsOfObs-1)/2);
    // transform a random obstacle into a healthy food obstacle if needed.
    obstacles[pick].type = 2+floor(random(numHealthyObs-1))*2;
    obstacles[pick].size = foodSize;
    obstacles[pick].loadHealthyObs();
  }
  // get this level's target (objective) based on number of
  // healthy obstacles in play
  levelTarget = floor(minHealthyFood/3);

  // player and enemy POSITION

  // position player and enemies around obstacles.
  findGoodPosition(player);
  for (var i=0; i<numEnemies; i++){
    findGoodPosition(enemies[i]);
  }

  if(soundStarted) startLevelSound();

  // update info below screen
  displayLevelInfo()
}


// checkgameover()
//
// check if player's health has reached 0.
// resetgame variables
// prepare and launch game over screen

function checkGameOver(){

  if(player.health<0){
    // reset
    initialHealth =7;
    minHealthyFood = 7;
    obstacleDensity =0.08;
    displayHealth();
    gameOver = true;
    gameOn = false;
    menu1 = new MenuObject(400, -30, gameoverimg, true);
    menu2 = new MenuObject(-400, 00,gameoverimg, true);
    menu3 = new MenuObject(00, 30, gameoverimg, true);
  }
}
