/*
Drum.js...
copied from project 2. no change so far.
this is only to make the music sound more interesting.

*/

// Synth(oscType)
//
// creates a synth object.
// everything is set to 0. Parameters are assigned in the functions that follow.
// required argument: oscillator type (square, sine, triangle)
//
// since this is Drum.js the constuctor also contains variables for divions and weights.

function Drum(oscType){
  // declare type of synth; and type of filter
  this.synthType= oscType;
  this.filtAtt= "LP";
  this.isPlaying = false;
  // envelope setup
  this.attackLevel= 0;
  this.releaseLevel= 0;
  this.attackTime= 0;
  this.decayTime= 0;
  this.susLevel= 0;
  this.releaseTime= 0;
  // next 4 parameters hold p5.sound.js objects
  this.env=0;
  this.thisSynth=0;
  this.filter=0;
  this.delay=0;
  // filter frequency
  this.fFreq=0;
  // delay parameters
  this.delayFX= false;
  this.delayLength=0;
  this.delayFB= 0;
  this.delayFilter= 0;
  // divisions length
  this.beat=40;
  this.bar=80;
  this.subdiv=20;
  this.finediv=4;

  // strong beat
  // i DID implement beat hierarchy here
  // but it's not very sophisticated
  this.strongbeatdivision=2;
  this.strongsubdivision=2;

  // divisions in a bar, beat and subdivision
  this.divperbar=2;
  this.divperbeat=2;
  this.divpersub=5;

  // weights
  this.barweight=0;
  this.beatweight=0;
  this.subweight=0;
  this.fineweight=0;
  this.strongbeatweight=0;
  this.strongsubweight=0;

  // section/division count
  this.phrase=0;
  this.section=0;
  this.currentbeat=0;
  this.currentsub=0;

  // maxWeights and stimulusScale are used to
  // map noise() result to fit the scale of the total weights.
  this.maxWeight= 0;
  this.stimulusScale= 0;
  // threshold above which notes are played
  this.thresh= 0;

  // rate at which to increment noise
  this.noiseInc = 0.11;
  // value for noiseSeed();
  this.noiseseed=random(100);
}

// setDivisions
//
// sets the length of divisions
// and the number of divisions in a higher division

Drum.prototype.setDivisions = function(bar, beat, subdiv, finediv, beatsperbar, divsperbeat, fineperdiv){
  this.bar = bar;
  this.beat = beat;
  this.subdiv = subdiv;
  this.finediv = finediv;
  this.divperbar = beatsperbar;
  this.divperbeat = divsperbeat;
  this.divpersub = fineperdiv;
}

// setweights()
//
// sets weights for bar, beat, subdiv and finediv.
// sets scaling and threshold values for note generating.
// picks a new noise seed every time weights() are changed.

Drum.prototype.setWeights = function(maxWeight, stimScale, threshold, barweight, beatweight, subweight, fineweight){
  this.maxWeight = maxWeight;
  this.stimulusScale = stimScale;
  this.thresh = threshold;
  this.barweight = barweight;
  this.beatweight = beatweight;
  this.subweight = subweight;
  this.fineweight = fineweight;
  // pick a random noise seed.
  this.noiseseed=random(1000);
}

// handledrums()
//
// triggers drums

Drum.prototype.handleDrums = function(){

  // if drums are playing
  if(this.isPlaying){

    noiseSeed(this.noiseseed);
    // obtain weights from salience() function
    var weight =  drums.salience(music.musicInc);
    // generate noise value
    var thisnoise = noise(music.musicInc*this.noiseInc);
    // scale noise
    var stimulus = thisnoise*this.stimulusScale;

    // if noise + weight excedes threshold, and weight is not 0
    // then play note
    if(stimulus+weight>this.thresh&&weight!=0){

      // map decay time to beat salience
      var decayTime = map(stimulus+weight, 0, this.stimulusScale+this.maxWeight, 0, 1);
      decayTime = constrain(decayTime, 0, 1);

      // map filter frequency to beat salience too
      this.filter.freq( 18150-decayTime*18000 );
      // set envelope
      this.env.setADSR(this.attackTime, this.decayTime, this.susPercent, this.releaseTime);
      this.env.setRange(this.attackLevel, this.releaseLevel);
      // play sound
      this.env.play();
    }
  }
}

// salience()
//
// returns weight for a given frame
// required argument: t for time (or frame)

Drum.prototype.salience = function(t){

  // first count beats and subdivisions.
  // this is necessary to introduce beat hierarchy
  // if time corresponds to a beat
  if(t%this.beat===0){
    // count beats
    this.currentbeat+=1;
    // reset beat count when we reach end of the bar
    if(this.currentbeat>this.divperbar){
      this.currentbeat=0;
    }
  }
  // if time corresponds to a subdivison
  if(t%this.subdiv===0){
    // count subdivisions
    this.currentsub+=1;
    // reset count
    if(this.currentbeat>this.divperbeat){
      this.currentsub=0;
    }
  }

  // var factor will be used to total up the weights
  var factor=0;
  // if time corresponds to a bar
  if(t%this.bar===0){
    // add weight
    factor+=this.barweight;
  }
  // if time corresponds to a beat
  if(t%this.beat===0){
    var addweight=0;
    // if time corresponds to a strong beat
    if(this.currentbeat%this.strongbeatdivision!=0){
      // add strong beat weight
      addweight=this.strongbeatweight;
    }
    // in any case add beat weight
    factor+=this.beatweight+addweight;
  }
  // if time corresponds to a sub division
  if(t%this.subdiv===0){
    var addmoreweight=0;
    // if time corresponds to a strong subdivision
    if(this.currentsub%this.strongsubdivision!=0){
      // add strong subdivision weight
      addmoreweight=this.strongsubweight;
    }
    // in any case add subdivision weight
    factor+=this.subweight;
  }
  // if time corresponds to a fine divison
  if(t%this.finediv===0){
    // add weight
    factor+=this.fineweight;
  }
  // return total weight
  return factor;
}

//////////////// ASSIGN SETTINGS ////////////////

// setenvelope()
//
// creates the amplitude envelope for this synth's notes.
// required arguments: time and gain (level) settings for the different parts of the envelope.

Drum.prototype.setEnvelope = function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel){
  // assign parameters with values provided.
  this.attackLevel= attackLevel;
  this.releaseLevel= releaseLevel;
  this.attackTime= attackTime;
  this.decayTime= decayTime;
  this.susLevel= susLevel;
  this.releaseTime= releaseLevel;
}

// setfilter()
//
// sets the filter type and frequency

Drum.prototype.setFilter = function(filterType, frequency){
  // assign parameters with values provided.
  this.fFreq=frequency;
  this.filtAtt= filterType;
}

// setdelay()
//
// switches delay on or off,
// sets the delay effect up

Drum.prototype.setDelay = function(delayIsOn, length, feedback, filterFrequency){
  // toggle delay on or off
  this.delayFX= delayIsOn;
  // assign parameters with values provided
  this.delayLength= length;
  this.delayFB= feedback;
  this.delayFilter= filterFrequency;
}
