function Music(){
  this.musicInc = 0;
  this.musicSpeed = 1;
  this.rootNote=60;
  this.newPhrase=false;
  this.sectionSwitched=false;
}


// setupinstruments()
//
// here the values which will define the different
// instruments' sound are declared.

Music.prototype.setupInstruments = function(){

  // synth1 setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  synth1.setEnvelope(0.01, 0.4, 0.001, 0.5, 0.32, 0);
  // function(filterType, frequency)
  synth1.setFilter("LP", 400);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth1.setDelay(true, 0.5, 0.55, 400)
  // function(noteList, octave, loopLength)

  // load it



  // synth2 setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  synth2.setEnvelope(0.001, 0.5, 0.2, 0.8, 0.4, 0);
  // function(filterType, frequency)
  synth2.setFilter("LP", 1500);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth2.setDelay(true, 0.33, 0.4, 2000)
  // function(noteList, octave, loopLength)


  // synth3 setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  synth3.setEnvelope(0.01, 0.7, 0.8, 0.3, 0.1, 0);
  // function(filterType, frequency)
  synth3.setFilter("LP", 800);
  // function(delayIsOn, length, feedback, filterFrequency)
  synth3.setDelay(true, 0.165, 0.3, 1500);
  // function(noteList, octave, loopLength)

  // sfx setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  sfx.setEnvelope(0.001, 0.6, 0.0, 0.4, 0.4, 0);
  // function(filterType, frequency)
  sfx.setFilter("LP", 500);
  // function(delayIsOn, length, feedback, filterFrequency)
  sfx.setDelay(false, 0, 0, 0);
  // function(noteList, octave, loopLength)
  // sfx setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  sfx2.setEnvelope(0.001, 0.6, 0.0, 0.4, 0.4, 0);
  // function(filterType, frequency)
  sfx2.setFilter("LP", 500);
  // function(delayIsOn, length, feedback, filterFrequency)
  sfx2.setDelay(false, 0, 0, 0);
  // function(noteList, octave, loopLength)

  // drum setup
  // envelope: function(attackTime, decayTime, releaseTime, attackLevel, susLevel, releaseLevel)
  drums.setEnvelope(0.005, 0.2, 0.2, 0.5, 0.2, 0.0);
  // function(filterType, frequency)
  drums.setFilter("BP", 400);
  // function(delayIsOn, length, feedback, filterFrequency)
  drums.setDelay(false, 0, 0, 0);
  //drums.setDivisions(bar, beat, subdiv, finediv, beatsperbar, divsperbeat, fineperdiv)



  // load it
    synth1.loadInstrument();
  synth2.loadInstrument();
  synth3.loadInstrument();
  sfx.loadInstrument();
  sfx2.loadInstrument();
  drums.loadInstrument();

}

Music.prototype.launchPart1 = function(){
    this.stopSound();

  var phrase1=[-5, 5, 6, 7, 6, 5, 6, 7, 6, -7];
  var rhythm1=[60, 40, 20, 40, 20, 40, 20, 40, 120, 80];
  var phrase2=[3, 2, 3, 7, 3, 9, 3, 7, 3, 5, 7, 3, 3, 2, 3, 9, 3, 10, 3, 9, 3, 5, 7, 3];
  var phrase3=[0, 5, 0, 0, 5, 5, 0, 0, 8, 7, 0, 7];
  this.startNewPhrase(synth2, phrase1, 0, rhythm1, 30, true);
  this.startNewPhrase(synth1, phrase2, 12, 0, 60, true);
  this.startNewPhrase(synth3, phrase3, -24, 0, 120, true);
  drums.setDivisions(120, 60, 30, 10, 2, 2, 3);
  drums.setWeights(18, 27, 25, 10, 10, 8, 8);
  synth1.isPlaying = true;
  synth2.isPlaying = true;
  synth3.isPlaying = true;
  drums.isPlaying = true;
  this.newPhrase = true;
  this.musicInc = 0;
}
Music.prototype.launchPart0 = function(){
    this.stopSound();

  var phrase1=[-5, -7, 3, 5];
  var rhythm1=[20, 40, 30, 30];
  var phrase2=[3, 2, 3, 7, 3, 9, 3, 7, 3, 5, 7, 3, 3, 2, 3, 9, 3, 10, 3, 9, 3, 5, 7, 3];
  var phrase3=[0, 0, 0, -7];
  var rhythm2=[40, 10, 60, 10]
  this.startNewPhrase(synth2, phrase1, 0, rhythm1, 0, true);
  this.startNewPhrase(synth1, phrase2, 12, 0, 20, true);
  this.startNewPhrase(synth3, phrase3, -24, rhythm2, 30, true);
  drums.setDivisions(60, 20, 10, 5, 3, 2, 2);
  drums.setWeights(18, 27, 24, 10, 10, 2, 8);
  synth1.isPlaying = true;
  synth2.isPlaying = true;
  synth3.isPlaying = true;
  drums.isPlaying = true;
  this.newPhrase = true;
  this.musicInc = 0;
}

Music.prototype.launchPart2 = function(){

  this.stopSound();


  var phrase2=[3, 2, 3, 7, 3, 9, 3, 7, 3, 5, 7, 3, 3, 2, 3, 9, 3, 10, 3, 9, 3, 5, 7, 3];

  this.startNewPhrase(synth1, phrase2, 12, 0, 20, true);

  this.newPhrase = true;
  this.musicInc = 0;
  synth1.isPlaying = true;
  synth2.isPlaying = false;
  synth3.isPlaying = false;
  drums.isPlaying = false;
}
Music.prototype.startSFX = function(thissfx, sfxType){
  // prepare all SFX to allow new one to start

  thissfx.upFX = false;
  thissfx.downFX = false;
  thissfx.tremFX = false;
  thissfx.chirpFX = false;
  thissfx.downChirpFX = false;
  thissfx.FXinc = 0;

  thissfx.baseFreq = thissfx.defaultFreq;
  // launch the thissfx

  switch(sfxType){
    case "up": thissfx.upFX = true; thissfx.FXtimer = this.musicInc+thissfx.upFXlength; break;
    case "down": thissfx.downFX = true;   thissfx.FXtimer = this.musicInc+thissfx.downFXlength; break;
    case "trem": thissfx.tremFX = true;   thissfx.FXtimer = this.musicInc+thissfx.tremFXlength; break;
    case "chirp": thissfx.chirpFX = true;   thissfx.FXtimer = this.musicInc+thissfx.chirpFXlength; break;
    case "downchirp": thissfx.downChirpFX = true;   thissfx.FXtimer = this.musicInc+thissfx.downChirpFXlength; break;
  }

}

Music.prototype.startNewPhrase = function(synx, noteList, octave, rhythm, loop, fromTheTop){
  synx.playing=true;
  this.newPhrase=true;
  synx.notes=noteList;
  synx.phrase=noteList.length;
  synx.playedThru=0;
  synx.oct=octave;
  // set rate at which notes are played
  synx.rate=loop;
synx.rhythm=rhythm;

  if(rhythm===0){
    synx.rType="pulse";

  } else {
    synx.rType="array";

    synx.nextNote=0;
  }
  if(fromTheTop){
    synx.loop=0;
  }

}

Music.prototype.stopSound= function(){
  synth1.isPlaying =false;
  synth2.isPlaying =false;
  synth3.isPlaying = false;
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
