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
  this.firstClap =84;
  this.firstBell =24;
  this.firstTick =12;

  this.kickList = [24, 5, 19];
  this.clapList = [32];
  this.bellList = [48, 48];
  this.tickList = [24, 5, 5, 4, 10, 24, 6, 6, 12];

  this.kickNum =0;
  this.clapNum =0;
  this.bellNum =0;
  this.tickNum =0;

  this.kickVol = 0.8;
  this.clapVol = 0.2;
  this.tickVol = 0.15;
  this.bellVol = 0.1;

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


    if(music.musicInc === this.nextKick){


      kick.play();
      this.nextKick += this.kickList[this.kickNum];
      this.kickNum +=1;
      if(this.kickNum>=this.kickList.length){
        this.kickNum =0;
      }
    }

    if(music.musicInc === this.nextClap){


      clap.play();
      this.nextClap += this.clapList[this.clapNum];
      this.clapNum +=1;
      if(this.clapNum>=this.clapList.length){
        this.clapNum =0;
      }
    }

    if(music.musicInc === this.nextBell){


      cowbell.play();
      this.nextBell += this.bellList[this.bellNum];
      this.bellNum +=1;
      if(this.bellNum>=this.bellList.length){
        this.bellNum =0;
      }
    }

    if(music.musicInc === this.nextTick){


      tick.play();
      this.nextTick += this.tickList[this.tickNum];
      this.tickNum +=1;
      if(this.tickNum>=this.tickList.length){
        this.tickNum =0;
      }
    }

  }
}
