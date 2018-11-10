
// newnewKey()
//
// generates a new random newKey
// newKeys are made up of random intervals stacked together until a multiple of 12 (an octave) is reached.
// possible intervals are the ones contained within the max and min boundaries.
// based on that max patch i made for a class a while ago that generated random newKeys..


function Scale(){

  this.minInterval = 1;
  this.maxInterval = 2;

  this.totalInterval = 0;
  this.kNoiseRate = 1;
  this.kNoiseSeed = 100;
  this.kNoiseInc =0;
  this.newKey = [];
  this.stopGenerating = false;
  this.newKeyOctaveSpan = 0;

    console.log("new newKey");
    noiseSeed(this.kNoiseSeed);

  while(!this.stopGenerating){

    this.kNoiseInc += this.kNoiseRate;

    this.thisInterval = 0;
    this.noteChoice =0;
    this.possibleIntervals = this.maxInterval - this.minInterval + 1;

    this.noiseResult = noise(this.kNoiseInc);
    this.noiseSec = 1/this.possibleIntervals;

    console.log("noiseResult: "+this.noiseResult);

    // the following for() loop makes a choice using noiseResult
    for (var i=0; i< this.possibleIntervals; i++){
      if(this.noiseResult > i*this.noiseSec && this.noiseResult < (i+1)*this.noiseSec){
        this.noteChoice = i;
      }
    }
    // interval value for this note
    this.thisInterval = this.minInterval + this.noteChoice;
    // add that to total count
    this.totalInterval += this.thisInterval;
    // add note to array
    this.newKey.push(this.thisInterval);
    // if total count reaches an octave, stop generating.
    if(this.totalInterval%12===0&&this.totalInterval!=0){
      this.stopGenerating = true;
      this.newKeyOctaveSpan = this.totalInterval/12;
    }
  }
  // print results
  console.log("newKeyOctaveSpan :"+this.newKeyOctaveSpan);
  console.log("newKey: ")
  console.log(this.newKey);
}
