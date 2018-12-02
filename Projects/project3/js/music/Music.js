/*
Music.js()
this script sets up musical structure and objects.

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

  // SYNTAX
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  // filter:  function(filterType, frequency)
  // delay: function(delayIsOn, length, feedback, filterFrequency)

  // LOAD FOOD SOUNDS
  for(var i=0; i<synths.length; i++){
    synths[i].setEnvelope(0.01, 0.4, 0.001, 0.7, 0.52, 0);
    synths[i].setFilter("BP", i*500);
    synths[i].setDelay(true, i*0.1, 0.55, 400)
    this.loadInstrument(synths[i]);
  }

  // LOAD SFX
  sfx.setEnvelope(0.001, 0.6, 0.0, 0.4, 0.4, 0);
  sfx.setFilter("LP", 500);
  sfx.setDelay(false, 0, 0, 0);
  this.loadInstrument(sfx);

  sfx2.setEnvelope(0.001, 0.6, 0.5, 0.4, 0.8, 0);
  sfx2.setFilter("LP", 500);
  sfx2.setDelay(false, 0, 0, 0);
  this.loadInstrument(sfx2);

  // LOAD BASS
  bass.setEnvelope(0.01, 0.8, 0.2, 0.31, 0.23, 0);
  bass.setFilter("LP", 500);
  bass.setDelay(true, 0.12, 0.7, 500)
  this.loadInstrument(bass);

}


// startSFX()
//
// prepares a given SFX for playing.
// copied straight outa project 2.

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

// launchMusic()
//
// launches the bgm
// stops any previously playing voices.
// sets rhythm and notes for each voice.
// assigns random phrase to each food sound.

Music.prototype.launchMusic = function(){

  // stop any sounds currently playing
  this.stopSound();

  // phrase and rhythm
  // phrase values are (midi) intervals over the root note
  var phrase1=[0, 13, 8];
  var phrase2=[4, 6];
  var phrase3 =[3, 7]
  var phrase4 = [2, 8, 5]
  var phrase5 = [1, 2, 3]
  var phrase6 = [7, 2, 4]

  // shuffle phrases
  var phrases = [phrase1, phrase2, phrase3, phrase4, phrase5, phrase6];
  phrases = shuffle(phrases);

  var bassPhrase = [0, 0, 0, 1];
  var bassRhythm = [282, 12, 12, 78];

  // assign a phrase and rhythm to each food synth voice.

  for (var i=0; i<level+2; i++){
    // give a random rhythm
    var rhythm = 6*floor(random(4, 9));
    // transpose randomly too
    var transpose = floor(random(-7, 7));
    this.startNewPhrase(synths[i], phrases[i], transpose, 0, rhythm, true);
  }

  // load bass
  this.startNewPhrase(bass, bassPhrase, -24, bassRhythm, 0, true);

  // set voices on and off
  for(var i=0; i<synths.length; i++){
    synths[i].isPlaying = true;
  }
  bass.isPlaying = true;
  drums.isPlaying = true;

  // reset musical time
  this.musicInc = 0;

  // reset drum timing
  drums.nextKick = drums.firstKick;
  drums.nextClap = drums.firstClap;
  drums.nextBell = drums.firstBell;
  drums.nextTick = drums.firstTick;
  drums.kickNum =0;
  drums.clapNum =0;
  drums.bellNum =0;
  drums.tickNum =0;
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

// killsynths()
//
// deletes all food related synth objects

Music.prototype.killSynths = function(){
  for (var i=0; i<synths.length; i++){
    synths[i].thisSynth.stop();
  }
  synths = [];
}

// stopsound()
//
// turns all sound objects off

Music.prototype.stopSound= function(){

  for (var i=0; i<synths.length; i++){
    synths[i].isPlaying =false;
  }
  drums.isPlaying = false;

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
  if(instrument.filtAtt==="HP"){
    instrument.filter=new p5.HighPass();
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
