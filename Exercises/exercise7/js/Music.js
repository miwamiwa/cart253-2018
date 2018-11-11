/*
Music.js()

*/

// music()
//
// includes a few things used by most instruments

function Music(){
  // a variable to keep time
  this.musicInc = 0;
  // speed at which to increment time
  this.musicSpeed = 1;
  // a root note for our synths (notes will be seen as intervals above the root)
  // has a midi value.
  this.rootNote=60;
}


// setupinstruments()
//
// here the values which will define the different
// instruments' sound are declared.

Music.prototype.setupInstruments = function(){
for(var i=0; i<synths.length; i++){
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  synths[i].setEnvelope(0.01, 0.4, 0.001, 0.5, 0.32, 0);
  // function(filterType, frequency)
  synths[i].setFilter("LP", 400);
  // function(delayIsOn, length, feedback, filterFrequency)
  synths[i].setDelay(true, 0.5, 0.55, 400)

  this.loadInstrument(synths[i]);

}
/*
  // sfx setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  sfx.setEnvelope(0.001, 0.6, 0.0, 0.4, 0.4, 0);
  // function(filterType, frequency)
  sfx.setFilter("LP", 500);
  // function(delayIsOn, length, feedback, filterFrequency)
  sfx.setDelay(false, 0, 0, 0);
  // function(noteList, octave, loopLength)

  // sfx2 setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  sfx2.setEnvelope(0.001, 0.6, 0.0, 0.2, 0.2, 0);
  // function(filterType, frequency)
  sfx2.setFilter("LP", 500);
  // function(delayIsOn, length, feedback, filterFrequency)
  sfx2.setDelay(false, 0, 0, 0);
  // function(noteList, octave, loopLength)

  // drum setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  drums.setEnvelope(0.005, 0.3, 0.2, 0.9, 0.4, 0.0);
  // function(filterType, frequency)
  drums.setFilter("BP", 400);
  // function(delayIsOn, length, feedback, filterFrequency)
  drums.setDelay(false, 0, 0, 0);
  //drums.setDivisions(bar, beat, subdiv, finediv, beatsperbar, divsperbeat, fineperdiv)



  // load it!
  // these functions create envelope, filter and delay objects
  // and plugs in the audio.


  this.loadInstrument(sfx);
  this.loadInstrument(sfx2);
  */

  this.loadInstrument(drums);

}

// launchpart1()
//
// launch part 1 of the bgm
// this is the game screen music..
// synth2 loops through the lead voice while synth3 plays a 12 bar blues bass.
// synth1 plays some colour tones
// drums play a (random) rhythm that starts bare but gets more full as levels increase
// i will include some explanations on how the launch() functions work here
// startnewphrase() is also explained below. Functionning of the drums is found in Drums.handleDrums()

Music.prototype.launchPart1 = function(){

  // stop any sounds currently playing
  this.stopSound();
  // phrase and rhythm
  // phrase values are (midi) intervals over the root note

  var phrase1=[0, 1];
  var phrase2=[4, 6];

  // while rhythm values are expressed in frames
  // var rhythm1=[60, 40, 20, 40, 20, 40, 20, 40, 120, 80];

  // startnewphrase() requires: synth used, list of notes to play,
  // octave transposition, list of rhythms to play, pulse rate, whether to start from the top.
  // see Synth.js for how this stuff works


    this.startNewPhrase(synths[0], phrase1, 0, 0, 60, true);
    this.startNewPhrase(synths[1], phrase2, 12, 0, 60, true);

  // drums are triggered differently.
  // Beats must be divided up and weighted before we can start.
  // see Drums.js for how this stuff works

  // required arguments: bar length, beat length, subdiv length,
  // finediv length, beats per bar, subdivs per beat, finedivs per subdiv.
  drums.setDivisions(120, 60, 30, 10, 2, 2, 3);
  // required arguments: max weights, stimulus scale, threshold,
  // bar weight, beat weight, subdiv weight, fine div weight.
  drums.setWeights(18, 27, 25, 10, 10, 8, 8);

  // set voices on and off
  for(var i=0; i<synths.length; i++){
  synths[i].isPlaying = true;
}

  drums.isPlaying = true;
  // reset musical time
  this.musicInc = 0;
}


// startSFX()
//
// prepares a given SFX for playing.

Music.prototype.startSFX = function(thissfx, sfxType){

  // stop any currently played sfx
  thissfx.upFX = false;
  thissfx.downFX = false;
  thissfx.tremFX = false;
  thissfx.chirpFX = false;
  thissfx.downChirpFX = false;

  // reset time
  thissfx.FXinc = 0;
  // reset frequency
  thissfx.baseFreq = thissfx.defaultFreq;
  // launch the thissfx

  // given the sfx type, assign the correct fx duration and trigger the sfx.
  switch(sfxType){
    case "up": thissfx.upFX = true; thissfx.FXtimer = this.musicInc+thissfx.upFXlength; break;
    case "down": thissfx.downFX = true;   thissfx.FXtimer = this.musicInc+thissfx.downFXlength; break;
    case "trem": thissfx.tremFX = true;   thissfx.FXtimer = this.musicInc+thissfx.tremFXlength; break;
    case "chirp": thissfx.chirpFX = true;   thissfx.FXtimer = this.musicInc+thissfx.chirpFXlength; break;
    case "downchirp": thissfx.downChirpFX = true;   thissfx.FXtimer = this.musicInc+thissfx.downChirpFXlength; break;
  }
}

// startnewphrase()
//
// sets notes and rhythm for a synth to play.
// required arguments: synth to play, array of notes, octave transposition, rhythm array,
// length between notes (if no array is specified), whether or not to play from the top.

Music.prototype.startNewPhrase = function(synx, noteList, octave, rhythm, loop, fromTheTop){

  // enable sound
  synx.playing=true;
  // set synth values given by arguments above
  synx.notes=noteList;
  synx.phrase=noteList.length;
  synx.oct=octave;
  // set rate at which notes are played.
  // synths will play either an array of notes or a steady pulse.
  synx.rate=loop;
  // set rhythm array
  synx.rhythm=rhythm;

  // assign "array" to rType if there is an array in the arguments.
  // if there isn't an array, rType is "pulse"
  if(rhythm===0){
    synx.rType="pulse";

  } else {
    synx.rType="array";
    // set time of first note to be played.
    // subsequent timers are given in the rhythm array
    synx.nextNote=0;
  }

  // start loop from the top. had an idea for this at first
  // but i'm not using it in this code. might delete it or
  // just keep it for future reference.
  if(fromTheTop){
    synx.loop=0;
    music.musicInc =0;
  }
}

// stopsound()
//
// turns all sound objects off

Music.prototype.stopSound= function(){

for (var i=0; i<synths.length; i++){
  synths[i].isPlaying =false;
}
  drums.isPlaying = false;
  /*
  sfx.upFX=false;
  sfx.downFX=false;
  sfx.tremFX=false;
  sfx.chirpFX=false;
  sfx.downChirpFX=false;
  sfx2.upFX=false;
  sfx2.downFX=false;
  sfx2.tremFX=false;
  sfx2.chirpFX=false;
  sfx2.downChirpFX=false;
*/
}

// loadInstrument()
//
// this function sets up our instrument:
// it creates the oscillator, envelope, filter and delay
// it wires their sound outputs correctly
// it starts the sound

Music.prototype.loadInstrument = function(instrument){

  // load envelope
  instrument.env=new p5.Env();
  // setup envelope parameters
  instrument.env.setADSR(instrument.attackTime, instrument.decayTime, instrument.susLevel, instrument.releaseTime);
  instrument.env.setRange(instrument.attackLevel, instrument.releaseLevel);
  // check which filter to use
  if(instrument.filtAtt==="BP"){
    // if the filter attribute says BP the create a band pass filter
    instrument.filter= new p5.BandPass();
  }
  // if the filter attribute says LP then create a low pass filter
  if(instrument.filtAtt==="LP"){
    instrument.filter=new p5.LowPass();
  }
  // set filter frequency
  instrument.filter.freq(instrument.fFreq);
  // now load the type of oscillator used.
  // this code was written for Project 1 so it also handles drums (noise)
  // if the synth type is "pink" then we have a noise synth.
  if(instrument.synthType==='pink'||instrument.synthType==='white'){
    instrument.thisSynth=new p5.Noise(instrument.synthType);
    // if anything else (square or sine) then we have an oscillator
  } else {
    instrument.thisSynth=new p5.Oscillator(instrument.synthType);
  }
  // plug-in the amp, which will be monitored using the envelope (env) object
  instrument.thisSynth.amp(instrument.env);
  // disconnect this sound from audio output
  instrument.thisSynth.disconnect();
  // reconnect it with the filter this time
  instrument.thisSynth.connect(instrument.filter);
  // start audio
  instrument.thisSynth.start();
  // set the initial frequency. do not set if this is the noise drum.
  if(instrument.synthType!='pink'&&instrument.synthType!='white'){instrument.thisSynth.freq(1);
  }
  // if delayFX is true, then there is also a delay object to load
  if(instrument.delayFX){
    // create delay object
    instrument.delay = new p5.Delay();
    // update settings
    instrument.delay.process(instrument.thisSynth, instrument.delayLength, instrument.delayFB, instrument.delayFilter);
  }
}
