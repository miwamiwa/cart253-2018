/*

Synth.js
This is what the three synths in the bgm are made of.

this script handles:
- creating a Synth object
- setting the envelope
- setting the filter
- setting the delay effect
- setting the notes to be played
- putting the oscillator, envelope, filter and delay together and starting the sound
- isisPlaying this synth's list of notes

Envelope, filter, delay settings and note lists are declared in the main script.

*/

// starting key midi value
var rootNote=60;

// Synth(oscType)
//
// creates a synth object.
// everything is set to 0. Parameters are assigned in the functions that follow.
// required argument: oscillator type (square, sine, triangle)

function Synth(oscType){
  // declare type of synth; and type of filter
  this.synthType= oscType;
  this.filtAtt= "LP";
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
    this.isisPlaying=true;
    this.playedThru=0;
    this.sections=[0];
    this.thisSection=0;

}

//////////////// PLAY MUSIC ////////////////

// playmusic()
//
// plays notes from the note list at the rate set with setNotes()

Synth.prototype.playMusic = function(){
  if((musicInc%this.rate===0&&this.rType==="pulse") || (musicInc===this.nextNote&&this.rType==="array")){
    if(this.loop===0){sectionSwitched=false;}
    if(this.isPlaying){
        var newNote =midiToFreq(rootNote+this.oct+this.notes[this.loop]);
        this.env.setADSR(this.attackTime, this.decayTime, this.susLevel, this.releaseTime);
        this.env.setRange(this.attackLevel, this.releaseLevel);
        if(this.rType==="array"){
        this.env.setADSR(this.attackTime, this.decayTime*this.rhythm[this.loop]/100, 0.8*this.susLevel, this.releaseTime*this.rhythm[this.loop]/100);
       this.env.setRange(this.attackLevel, this.releaseLevel);
   }
        this.thisSynth.freq(newNote);
         this.env.play();
       }
       //continue rhythm even if synth is not isisPlaying
         if(this.rType==="array"){
           this.nextNote+=this.rhythm[this.loop];
           }
         // increment appropriate loop
         this.loop+=1;
         // if loop has reached maximum limit reset loop
         if(this.loop===this.phrase){
           this.loop=0;
           this.playedThru+=1;
           this.sectionSwitched = false;
        }
   }

/*
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
  */
}


//////////////// ASSIGN SETTINGS ////////////////

// setenvelope()
//
// creates the amplitude envelope for this synth's notes.
// required arguments: time and gain (level) settings for the different parts of the envelope.

Synth.prototype.setEnvelope = function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel){
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

Synth.prototype.setFilter = function(filterType, frequency){
  // assign parameters with values provided.
  this.fFreq=frequency;
  this.filtAtt= filterType;
}

// setdelay()
//
// switches delay on or off,
// sets the delay effect up

Synth.prototype.setDelay = function(delayIsOn, length, feedback, filterFrequency){
  // toggle delay on or off
  this.delayFX= delayIsOn;
  // assign parameters with values provided
  this.delayLength= length;
  this.delayFB= feedback;
  this.delayFilter= filterFrequency;
}

// setnotes()
//
// sets up notes to be played, octave transposition
// and length between notes played.

Synth.prototype.setNotes = function(noteList, octave, loopLength){
  // set notes to be played
  this.notes=noteList;
  // set transposition
  this.oct=octave;
  // set rate at which notes are played
  this.rate=loopLength;
  // set phrase length
  this.phrase=this.notes.length;
}


//////////////// LOAD INSTRUMENT ////////////////

// loadInstrument()
//
// this function sets up our instrument:
// it creates the oscillator, envelope, filter and delay
// it wires their sound outputs correctly
// it starts the sound
// should be called in main script after having called the settings functions

Synth.prototype.loadInstrument = function(){
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
