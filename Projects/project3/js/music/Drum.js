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

function Drum(){

  this.isPlaying = false;

  this.nextKick =0;
  this.nextClap =0;
  this.nextBell =0;
  this.nextTick =0;

  this.firstKick =0;
  this.firstClap =24;
  this.firstBell =0;
  this.firstTick =12;

  this.kickList = [12, 12, 6, 6, 12, 12, 12, 24];
  this.clapList = [48, 48];
  this.bellList = [6, 90];
  this.tickList = [6, 18, 24, 6, 6, 12, 24];

  this.kickNum =0;
  this.clapNum =0;
  this.bellNum =0;
  this.tickNum =0;

  this.kickVol =1.5;
  this.clapVol = 0.3;
  this.tickVol =0.8;
  this.bellVol = 0.2;


}

// handledrums()
//
// triggers drums

Drum.prototype.handleDrums = function(){

  // if drums are playing
  if(this.isPlaying){


    if(music.musicInc === this.nextKick){
      console.log("drums are playing")
      kick.setVolume(this.kickVol)
      kick.play();
      this.nextKick += this.kickList[this.kickNum];
      this.kickNum +=1;
      if(this.kickNum>=this.kickList.length){
        this.kickNum =0;
      }
    }

    if(music.musicInc === this.nextClap){
      console.log("drums are playing")
      clap.setVolume(this.clapVol)
      clap.play();
      this.nextClap += this.clapList[this.clapNum];
      this.clapNum +=1;
      if(this.clapNum>=this.clapList.length){
        this.clapNum =0;
      }
    }

    if(music.musicInc === this.nextBell){
      console.log("drums are playing")
      cowbell.setVolume(this.bellVol)
      cowbell.play();
      this.nextBell += this.bellList[this.bellNum];
      this.bellNum +=1;
      if(this.bellNum>=this.bellList.length){
        this.bellNum =0;
      }
    }

    if(music.musicInc === this.nextTick){
      console.log("drums are playing")
      tick.setVolume(this.tickVol)
      tick.play();
      this.nextTick += this.tickList[this.tickNum];
      this.tickNum +=1;
      if(this.tickNum>=this.tickList.length){
        this.tickNum =0;
      }
    }

  }
}
