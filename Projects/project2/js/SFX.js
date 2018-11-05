/*
SFX.js
this object, as well as Drum and Synth are another edit
of the music objects i've been working on in my exercises and projects.
They all use pretty much the same constructor parameters and setup functions (trimmed to suit the object's needs)
The differences lie mostly in the manner in which sound if triggered in playSFX(), handleDrums() and playMusic()


I copied in my sfx from project 1, edited them a bit and added two new ones.
now sfx can accept either noise or an oscillator as input.

This script handles:
- creating an SFX object.
- setting envelope, filter, delay
- playing one of the sfx (namely up, down, chirp, downchirp, tremolo)
*/

// SFX()
//
// creates a SFX synth.
// accepts synth type and base frequency

function SFX(oscType, frequency){
  // accepted synth types: square, sine, triangle, white noise, pink noise
  this.synthType= oscType;
  // accepted filter types (set with setFilter): LP low pass or BP band pass
  this.filtAtt= "LP";
  // envelope setup
  this.attackLevel= 0;
  this.releaseLevel= 0;
  this.attackTime= 0;
  this.decayTime= 0;
  this.susLevel= 0;
  this.releaseTime= 0;

  // oscillator frequency gets reset to base frequency before every sfx
  this.defaultFreq = frequency;
  // base frequency to be manipulated
  this.baseFreq = this.defaultFreq;


  // next 4 parameters hold p5.sound.js objects (envelope, oscillator, filter, delay)
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

  // parameters used to trigger the different sfx sounds
  this.upFX=false;
  this.downFX= false;
  this.tremFX= false;
  this.chirpFX = false;
  this.downChirpFX = false;

  // length of sfx sounds
  this.FXlength= 45;
  this.upFXlength= 14;
  this.downFXlength= 45;
  this.tremFXlength= 45;
  this.chirpFXlength =10;
  this.downChirpFXlength =10;

  // timer signaling that sfx is over
  this.FXtimer= 0;
  // increment sfx timer
  this.FXinc = 0;


}

//////////////// PLAY SFX ////////////////

// playSFX()
//
// plays either one of the sfx.
// this is a mono synth so only one sfx can be played at one time with one sfx object

SFX.prototype.playSFX = function(){

  // if upFX is triggered

  if(this.upFX){
    // for the duration of the FX timer
    if(music.musicInc<this.FXtimer){
      console.log("upfx");
      // use FXinc(rement) to keep track of time during the FX
      if(this.FXinc%8===0){
        // if input is noise, update filter frequency
        if(this.synthType==="white"){
          this.filter.freq(500+200*this.FXinc)+random(500);}
          else{
            // else increase oscillator frequency by increment
            this.thisSynth.freq(this.baseFreq+30*this.FXinc);
          }
          // update envelope to increase release time as increment gets higher
          this.env.setADSR(0.001, 0.03, 0.5, 0.01+this.FXinc/56);
          this.env.setRange(1, 0);
          // play this
          this.env.play();
        }

        this.FXinc+=1;
      } else {
        // if timer is over stop the sfx
        this.upFX=false;
      }
    }

    // if chirpFX is triggered

    else if(this.chirpFX){
      // set envelope
      this.env.setADSR(0.001, 0.2, 0.5, 0.01);
      this.env.setRange(1, 0);
      // for the duration of the FX timer
      if(music.musicInc<this.FXtimer){
        console.log("chirpfx");
        // use FXinc(rement) to keep track of time during the FX
        if(this.FXinc%4===0){
          // if input is noise update filter frequency
          if(this.synthType==="white"){
            this.filter.freq(500+200*this.FXinc);
          }
          else{
            // else increase oscillator frequency
            this.thisSynth.freq(this.baseFreq+20*this.FXinc);
          }
          // play this
          this.env.play();
        }
        // increment fx frame
        this.FXinc+=1;
      } else {
        // if timer is over stop this
        this.chirpFX=false;
      }
    }

    // if downChirpFX is triggered

    else if(this.downChirpFX){
      // set envelope
      this.env.setADSR(0.001, 0.1, 0.0, 0.01);
      this.env.setRange(1, 0);
      // for the duration of the FX timer
      if(music.musicInc<this.FXtimer){
        console.log("downChirpfx");
        // use FXinc(rement) to keep track of time during the FX
        if(this.FXinc%4===0){
          // if input is noise set filter frequency
          if(this.synthType==="white"){
            this.filter.freq(15000-100*this.FXinc);
            // set noise volume
            this.env.setRange(0.1, 0);
          }
          else{
            // else set oscillator frequency
            this.thisSynth.freq(this.baseFreq*2-20*this.FXinc);
          }
          this.env.play();
        }
    this.FXinc+=1;
      } else {
        // if timer is over stop this
        this.downChirpFX=false;
      }
    }

    // if downFX is triggered

    else   if(this.downFX){
      // set envelope
      this.env.setADSR(0.001, 0.03, 0.5, 0.01);
      this.env.setRange(1, 0);
      // trigger down effect
      if(music.musicInc<this.FXtimer){
        // first part:
        if(this.FXinc<15){
          if(this.FXinc%7===0&&this.FXinc<15){
            // if input is noise set filter freq
            if(this.synthType==="white") {
              this.filter.freq(500+200*this.FXinc);
            }
            // else set oscillator frequency
            else {
              this.thisSynth.freq(this.baseFreq-4*this.FXinc);
            }
            //set envelope
            this.env.setADSR(0.001, 0.05, 0.5, 0.01);
            //play this
            this.env.play();
          }

        }
        // second part:
        if(this.FXinc>=15){
          if(this.FXinc===15){
            //set envelope
            this.env.setADSR(0.001, 0.5, 0.5, 0.01);
            //play this
            this.env.play();
          }
          // increment frequency downward
          // noise input
          if(this.synthType==="white"){
            this.filter.freq(500+200*this.FXinc);
          }
          else{
            // oscillator input
            this.thisSynth.freq(this.baseFreq+1*this.FXinc);
          }

        }
        // increment time
        this.FXinc+=1;
      } else {
        // stop this
        this.downFX=false;
      }
    }

    // if tremFX (tremolo) is triggered

    else if(this.tremFX){

      // "tremolo" means rapidly alternating two separate pitches
      // this is not exactly a tremolo since the pitches change over time but hey
      if(music.musicInc<this.FXtimer){
        // start incrementing the increment variable
        this.FXinc+=1;
        // alternate between adding and subtracting the increment.
        // change pitch only when the increment is a multiple of 4 (or 8)
        // update: added another multiple (12)

        // if current is a multiple of 12
        if(this.FXinc%12===0){
          // if input is noise
          if(this.synthType==="white"){
            this.filter.freq(500+200*this.FXinc);}
            else {
              // if input is oscillator
              this.thisSynth.freq(this.baseFreq+15*this.FXinc);
            }
              this.env.play();
          }
          // if current is a multiple of 8
          else if(this.FXinc%8===0){
            // input is noise
            if(this.synthType==="white"){
              this.filter.freq(500+200*this.FXinc);
            }
            else{
              // input is oscillator
              this.thisSynth.freq(this.baseFreq+5*this.FXinc);
            }
              this.env.play();
          }
          // if current is a multiple of 4
          else if(this.FXinc%4===0) {
            if(this.synthType==="white"){
              // input is noise
              this.filter.freq(500+200*this.FXinc);
            }
            else{
              // input is oscillator
              this.thisSynth.freq(this.baseFreq-5*this.FXinc);
            }
              this.env.play();
          }

        } else {
          //  stop this
          this.tremFX=false;
        }
      }

      // if nothing is playing

      else {
        // if nothing is playing stop the timers, stop FXinc
        this.FXinc = 0;
        this.FXtimer = 0;
        // and reset frequency
        this.baseFreq = this.defaultFreq;
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
