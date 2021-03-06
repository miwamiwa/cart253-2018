/*
Drum.js
unlike my previous noise drums, this is a drum machine which plays samples.
i built a beat around 96-frame loop using 4 audio samples. i cut the samples
as short as possible and converted them from wav to mp3 to save a bit
of memory.

there's a bit of a polyrhythm going on here. Each voice has a different
offset (firstKick, firstClap, etc) to make this endless loop a bit more
interesting.

*/

// Drum()
//
// creates a new drum object.
// resets playing time
// contains start values for each voice and rhythmic arrays to play.
// sets volume and play mode for each sample.

function Drum(){

  // reset time
  this.isPlaying = false;
  this.nextKick =0;
  this.nextClap =0;
  this.nextBell =0;
  this.nextTick =0;
  this.kickNum =0;
  this.clapNum =0;
  this.bellNum =0;
  this.tickNum =0;

  // timing of first notes to play (frames)
  this.firstKick =0;
  this.firstClap =84;
  this.firstBell =24;
  this.firstTick =12;

  // rhythm (frames until next note)
  // the third kick has a bit of swing
  this.kickList = [24, 5, 19];
  // claps divides measure in 3
  this.clapList = [32];
  // cowbell divides measure in 2
  this.bellList = [48, 48];
  // tick: first a(n approximated) 5/8 rhythm, then straight 8/8
  this.tickList = [24, 5, 5, 4, 10, 24, 6, 6, 12];

  // volume
  this.kickVol = 0.8;
  this.clapVol = 0.2;
  this.tickVol = 0.15;
  this.bellVol = 0.1;

  // setup
  kick.setVolume(this.kickVol)
  clap.setVolume(this.clapVol)
  cowbell.setVolume(this.bellVol)
  tick.setVolume(this.tickVol)
  kick.playMode("restart");
  clap.playMode("restart");
  cowbell.playMode("restart");
  tick.playMode("restart");

}

// handledrums()
//
// triggers drums

Drum.prototype.handleDrums = function(){

  // if drums are playing
  if(this.isPlaying){

    // trigger kick
    if(music.musicInc === this.nextKick){
      kick.play();
      // setup next kick
      this.nextKick += this.kickList[this.kickNum];
      this.kickNum +=1;
      // reset to first kick if end of list is reached
      if(this.kickNum>=this.kickList.length){
        this.kickNum =0;
      }
    }

    // trigger clap
    if(music.musicInc === this.nextClap){
      clap.play();
      // setup next clap
      this.nextClap += this.clapList[this.clapNum];
      this.clapNum +=1;
      // reset to first clap if end of list is reached
      if(this.clapNum>=this.clapList.length){
        this.clapNum =0;
      }
    }

    // trigger cowbell
    if(music.musicInc === this.nextBell){
      cowbell.play();
      // setup next cowbell
      this.nextBell += this.bellList[this.bellNum];
      this.bellNum +=1;
      // reset to first cowbell if end of list is reached
      if(this.bellNum>=this.bellList.length){
        this.bellNum =0;
      }
    }

    // trigger tick
    if(music.musicInc === this.nextTick){
      tick.play();
      // setup next tick
      this.nextTick += this.tickList[this.tickNum];
      this.tickNum +=1;
      // reset to first tick if end of list is reached
      if(this.tickNum>=this.tickList.length){
        this.tickNum =0;
      }
    }
  }
}
