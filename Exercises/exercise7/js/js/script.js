var musicInc=0;
var generating=true;
var frame=0;
var scale;
var phrase;

var drums;
var drums2;
var rootNote =50;
// weights

var scaleToneWeight=0;
var passingToneWeight=0;

var moveUpWeight =0;
var moveDownWeight = 0;
var moveNotWeight =0;
var leapWeight =0;
var stepWeight =0;

var musicInc = 0;
var musicSpeed = 1;
var newPhrase = false;


function setup(){
  createCanvas(200, 200);
  console.log("generating");
  phrase = new Phrase();

  drums = new Drum('square');
  drums2 = new Drumz('white');
  setupInstruments();
  launchPart0();
}

function draw(){
playSound();

if(musicInc%60===0&&generating){
console.log("frame = "+frame);
phrase.newNote(frame);
frame+=1;
}
}

function playSound(){
  if(!newPhrase){
    musicInc+=musicSpeed;
  } else {
    newPhrase=false;
  }

  drums.handleDrums();
  drums2.handleDrums();

}
function setupInstruments(){
  // drum setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  drums.setEnvelope(0.01, 0.4, 0.8, 0.5, 0.2, 0.0);
  // function(filterType, frequency)
  drums.setFilter("BP", 800);
  // function(delayIsOn, length, feedback, filterFrequency)
  drums.setDelay(true, 0.1, 0.2, 1000);
  //drums.setDivisions(bar, beat, subdiv, finediv, beatsperbar, divsperbeat, fineperdiv)
  drums.loadInstrument();

  drums2.setEnvelope(0.01, 0.1, 0.4, 0.5, 0.2, 0.0);
  // function(filterType, frequency)
  drums2.setFilter("BP", 400);
  // function(delayIsOn, length, feedback, filterFrequency)
  drums2.setDelay(false, 0.15, 0.6, 2000);
  //drums.setDivisions(bar, beat, subdiv, finediv, beatsperbar, divsperbeat, fineperdiv)
  drums2.loadInstrument();
}
function launchPart0(){
  drums.setDivisions(240, 120, 40, 5, 2, 3, 8);
  drums.setWeights(18, 30, 24, 10, 10, 2, 4);
  drums.isPlaying = true;
  drums2.setDivisions(120, 40, 20, 10, 3, 2, 2);
  drums2.setWeights(30, 28, 20, 5, 15, 10, 2);
  drums2.isPlaying = true;
  newPhrase = true;
  musicInc = 0;
}

function keyPressed(){
  switch(key){
    case " ": if(generating){
      generating=false;
      console.log("not generating");
    }else {
      generating =true;
      console.log("generating");
    }
    break;
    case "z": reset(); break;
  }
}

function reset(){
  frame=0;
  console.log("reset");
}



function removeItem(array, item){
  var length = array.length;

  if(length!=0){

  if(item===length-1){
    array = shorten(array);
  }
  else {
    var partone = array.slice(0, item);
    console.log("partone "+partone);
    var parttwo = array.slice(item+1, length+1);
    array = partone.concat(parttwo);
    console.log("parttwo "+parttwo);
  }
}
console.log("array "+array);
return array;
}


function arraySum(array, end){
  var length = array.length;
  var sum = 0;
  if (end===0){
  for (var i=0; i<length; i++){
    sum+= array[i];
  }
}
else {
  for (var i=0; i<end+1; i++){
    sum+= array[i];
  }
}
  return sum;
}

function checkForEmpties(array){
  for(var i=0; i<array.length; i++){
    if(array[i]===""){
      array = removeItem(this.array, i);
    }
}
}
