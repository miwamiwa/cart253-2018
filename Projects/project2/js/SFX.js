

// starting key midi value
var rootNote=60;

// SFX(oscType)
//
// creates a synth object.
// everything is set to 0. Parameters are assigned in the functions that follow.
// required argument: oscillator type (square, sine, triangle)

function SFX(oscType, frequency){
  // declare type of synth; and type of filter
  this.synthType= oscType;
  this.filtAtt= "LP";
  // envelope setup
  this.attackLevel= 0;
  this.releaseLevel= 0;
  this.defaultFreq = frequency;
  this.baseFreq = this.defaultFreq;
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
  // phrase and loop
  this.phrase= 0;
  this.loop= 0;
  // loop rate
  this.rate= 0;
  // note values
  this.notes=[0];
  this.oct=0;
  // rhythm array
  this.rhythm= 0;
    this.rType= 0;
  this.nextNote= 0;
    this.playing=true;
    this.playedThru=0;
    this.sections=[0];
    this.thisSection=0;
    // parameters used to trigger the different sfx sounds
    this.upFX=false;
    this.downFX= false;
    this.tremFX= false;
    // length of sfx sounds
    this.FXlength= 45;
    // sfx trigger timer
    this.FXtimer= 0;
    this.FXinc = 0;

}

//////////////// PLAY SFX ////////////////

/*
var this={ //FX synth
  // declare type of synth, and type of filter
  synthType: 'sine',
  filtAtt: "LP",
  attackLevel: 0.4,
  releaseLevel: 0,
  attackTime: 0.001,
  decayTime: 0.6,
  susPercent: 0.4,
  releaseTime: 0.0,
  env:0,
  thisSynth:0,
  // parameters used to trigger the different sfx sounds
  upFX:false,
  downFX: false,
  tremFX: false,
  // length of sfx sounds
  FXlength: 45,
  // sfx trigger timer
  FXtimer: 0,
  // sfx filter
  filter:0,
  fFreq:400,
  // sfx starting frequency
  baseFreq: 650,
  // parameter used to increment the frequency for cool effects
  FXinc:0,
  // state no delay
  delayFX:false
}



*/

SFX.prototype.playSFX = function(){

  // if upFX is triggered

  if(this.upFX){

    // for the duration of the FX timer
    if(musicInc<this.FXtimer){
      console.log("upfx");
      // use FXinc(rement) to keep track of time during the FX
      this.FXinc+=1;
      // increase frequency by increment
      this.thisSynth.freq(this.baseFreq+5*this.FXinc);
      // play this
    this.env.play();
    } else {
      // if timer is over stop this
      this.upFX=false;
    }
  }


  else   if(this.downFX){
       // trigger down effect
       if(musicInc<this.FXtimer){
         this.FXinc+=1;
         // increment frequency downward
         this.thisSynth.freq(this.baseFreq-5*this.FXinc);
         //play this
         this.env.play();
       } else {
         // stop this
         this.downFX=false;
       }
     }

    else if(this.tremFX){
       // trigger tremolo effect
       // FYI "tremolo" means rapidly alternating two separate pitches
       // this is not exactly a tremolo since the pitches change over time but hey
       if(musicInc<this.FXtimer){
         // start incrementing the increment variable
         this.FXinc+=1;
         // alternate between adding and subtracting the increment.
         // change pitch only when the increment is a multiple of 4 (or 8)
         if(this.FXinc%8===0){
           this.thisSynth.freq(this.baseFreq+5*this.FXinc);
         } else if(this.FXinc%4===0) {
           this.thisSynth.freq(this.baseFreq-5*this.FXinc);
         }
         // play this. this will actually get played again every 4 musicIncs in this case.
         // but it sounds nice that way okay
         this.env.play();
       } else {
       //  stop this
         this.tremFX=false;
       }
     }
     else {
       this.FXinc = 0;
       sfx.FXtimer = musicInc+ sfx.FXlength;
       sfx.baseFreq = sfx.defaultFreq;
     }
   }



//////////////// ASSIGN SETTINGS ////////////////

// setenvelope()
//
// creates the amplitude envelope for this synth's notes.
// required arguments: time and gain (level) settings for the different parts of the envelope.

SFX.prototype.setEnvelope = function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel){
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

SFX.prototype.setFilter = function(filterType, frequency){
  // assign parameters with values provided.
  this.fFreq=frequency;
  this.filtAtt= filterType;
}

// setdelay()
//
// switches delay on or off,
// sets the delay effect up

SFX.prototype.setDelay = function(delayIsOn, length, feedback, filterFrequency){
  // toggle delay on or off
  this.delayFX= delayIsOn;
  // assign parameters with values provided
  this.delayLength= length;
  this.delayFB= feedback;
  this.delayFilter= filterFrequency;
}



//////////////// LOAD INSTRUMENT ////////////////

// loadInstrument()
//
// this function sets up our instrument:
// it creates the oscillator, envelope, filter and delay
// it wires their sound outputs correctly
// it starts the sound
// should be called in main script after having called the settings functions

SFX.prototype.loadInstrument = function(){
  // load envelope
  this.env=new p5.Env();
  // setup envelope parameters
  this.env.setADSR(this.attackTime, this.decayTime, this.susLevel, this.releaseTime);
  this.env.setRange(this.attackLevel, this.releaseLevel);
  // check which filter to use
  if(this.filtAtt==="BP"){
    // if the filter attribute says BP the create a band pass filter
    this.filter= new p5.BandPass();
  }
  // if the filter attribute says LP then create a low pass filter
  if(this.filtAtt==="LP"){
    this.filter=new p5.LowPass();
  }
  // set filter frequency
  this.filter.freq(this.fFreq);
  // now load the type of oscillator used.
  // this code was written for Project 1 so it also handles drums (noise)
  // if the synth type is "pink" then we have a noise synth.
  if(this.synthType==='pink'||this.synthType==='white'){
    this.thisSynth=new p5.Noise(this.synthType);
    // if anything else (square or sine) then we have an oscillator
  } else {
    this.thisSynth=new p5.Oscillator(this.synthType);
  }
  // plug-in the amp, which will be monitored using the envelope (env) object
  this.thisSynth.amp(this.env);
  // disconnect this sound from audio output
  this.thisSynth.disconnect();
  // reconnect it with the filter this time
  this.thisSynth.connect(this.filter);
  // start audio
  this.thisSynth.start();
  // set the initial frequency. do not set if this is the noise drum.
  if(this.synthType!='pink'&&this.synthType!='white'){this.thisSynth.freq(1);
  }
  // if delayFX is true, then there is also a delay object to load
  if(this.delayFX){
    // create delay object
    this.delay = new p5.Delay();
    // update settings
    this.delay.process(this.thisSynth, this.delayLength, this.delayFB, this.delayFilter);
  }
}
