// starting key midi value
var rootNote=60;
function Synth(oscType){
  // declare type of synth; and type of filter
  this.synthType= oscType;
  this.filtAtt= "LP";
  // envelope setup
  this.attackLevel= 0;
  this.releaseLevel= 0;
  this.attackTime= 0;
  this.decayTime= 0;
  this.susPercent= 0;
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
}
Synth.prototype.setEnvelope = function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel){
  this.attackLevel= attackLevel;
  this.releaseLevel= releaseLevel;
  this.attackTime= attackTime;
  this.decayTime= decayTime;
  this.susPercent= susLevel;
  this.releaseTime= releaseLevel;
}
Synth.prototype.setFilter = function(filterType, frequency){
  this.fFreq=frequency;
  this.filtAtt= filterType;
}
Synth.prototype.setDelay = function(delayIsOn, length, feedback, filterFrequency){
  this.delayFX= delayIsOn;
  this.delayLength= length;
  this.delayFB= feedback;
  this.delayFilter= filterFrequency;
}
Synth.prototype.setNotes = function(noteList, octave, loopLength){
  this.notes=noteList;
  this.oct=octave;
  this.rate=loopLength;
}


Synth.prototype.playMusic = function(){

// musicInc is incremented by musicSpeed in draw()
// if musicInc reaches the synth's pulse rate
if(musicInc%this.rate===0){
      // convert midi to frequency
      var newNote =midiToFreq(rootNote+this.oct+this.notes[this.loop]);
      // set frequency
      this.thisSynth.freq(newNote);
      // play synth
       this.env.play();
       // increment appropriate loop
       this.loop+=1;
       // if loop has reached maximum limit reset loop
       if(this.loop===this.phrase){
         this.loop=0;
          }
  }
}

// this is a straight copy-paste from my project1, except for the first line.
// loadAnInstrument();
//
// sets up a given instrument with appropriate oscillator, envelope, filter and delay.
// starts audio (but not envelope)
Synth.prototype.loadInstrument = function(){
  // set phrase length
  this.phrase=this.notes.length;
  // for any instrument namedm this (syn1, syn2, syn3 or syn4)
  // load envelope
  this.env=new p5.Env();
  // setup envelope parameters
  this.env.setADSR(this.attackTime, this.decayTime, this.susPercent, this.releaseTime);
  this.env.setRange(this.attackLevel, this.releaseLevel);
  // check which filter to use
  if(this.filtAtt==="BP"){
    // if the filter attribute says BP load a band pass filter
    this.filter= new p5.BandPass();
  }
   // if the filter attribute says LP load a low pass filter
  if(this.filtAtt==="LP"){
    this.filter=new p5.LowPass();
  }
  // set initial filter frequency
  this.filter.freq(this.fFreq);
 // now load the type of oscillator used. syn3 is the only one which uses
 // something else than the standard oscillator, so this exception is dealt with first:
 // if the synth type is "pink" then we have a noise synth.
  if(this.synthType==='pink'){
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
  if(this.synthType!='pink'){this.thisSynth.freq(1);
  }
  // if delayFX is true, then there is also a delay object to load
  if(this.delayFX){
    this.delay = new p5.Delay();
    this.delay.process(this.thisSynth, this.delayLength, this.delayFB, this.delayFilter);
  }
}
