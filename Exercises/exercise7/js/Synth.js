/*

Synth.js
This is what the three synths in the bgm are made of.
this object, as well as Drum and SFX are another edit
of the music objects i've been working on in my exercises and projects.
They all use pretty much the same constructor parameters and setup functions (trimmed to suit the object's needs)
The differences lie mostly in the manner in which sound if triggered in playSFX(), handleDrums() and playMusic()

this script handles:
- creating a Synth object
- setting the envelope
- setting the filter
- setting the delay effect
- setting the notes and rhythm to be played
- playing this synth's list of notes with a given rhythm

*/

// starting key midi value


// Synth(oscType)
//
// creates a synth object.
// everything is set to 0. Parameters are assigned by functions that follow (called inside music.js)
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
  // transposition factor.
  // doesn't really have to be an octave (12).
  this.oct=0;
  // rhythm array
  this.rhythm= 0;
  this.rType= 0;
  this.nextNote= 0;
  this.isPlaying=true;

  this.sections=[0];
  this.thisSection=0;

}

//////////////// PLAY MUSIC ////////////////

// playmusic()
//
// plays notes from the note list at the rate set with setNotes()

Synth.prototype.playMusic = function(){

  // the following if() checks for the time until the next note is triggered,
  // depending on the type of rhythm (array or pulse):
  // pulse rhythm plays at the rate of this.rate
  // the time until the next note of an array is given by this.nextNote

  if((music.musicInc%this.rate===0&&this.rType==="pulse") || (music.musicInc===this.nextNote&&this.rType==="array")){

    // if voice is playing
    if(this.isPlaying){
      // apply octave transposition to note and convert to a frequency value
      var newNote =midiToFreq(music.rootNote+this.oct+this.notes[this.loop]);
      // set envelope
      this.env.setADSR(this.attackTime, this.decayTime, this.susLevel, this.releaseTime);
      this.env.setRange(this.attackLevel, this.releaseLevel);
      // if rhythm is an array, update decay length to deflect time until next note
      if(this.rType==="array"){
        this.env.setADSR(this.attackTime, this.rhythm[this.loop]/100*this.decayTime, this.susLevel, this.releaseTime);
        this.env.setRange(this.attackLevel, this.releaseLevel);
      }
      // assign frequency
      this.thisSynth.freq(newNote);
      // play note
      this.env.play();

      // continue array rhythm even if synth is not playing
      // this only becomes useful if fromTheTop is set to false.
      // a voice could then enbark into the loop at any point
      if(this.rType==="array"){
        this.nextNote+=this.rhythm[this.loop];
      }
      
    // increment appropriate loop
    this.loop+=1;
    // if loop has reached maximum limit reset loop
    if(this.loop===this.phrase){
      this.loop=0;
    }


  }
}
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
