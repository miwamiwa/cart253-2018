/*
sound and envelopes example
here I try to explain the basics of creating an instrument,
applying sound effects, playing notes and
applying envelopes to different parts of the code.
*/

var squareSynth;
var env1;
var env2;
var filter;
var counter =0;
var ampConverter;
var delay;

// setup()
//
// sound objects created and explained here.

function setup(){

  createCanvas(500,500);

  ///////////////////////// CREATE AN OSCILLATOR /////////////////////////

  // create a new synthesizor
  squareSynth =  new p5.Oscillator("square");

  // start sound
  squareSynth.start();

  // you can run a sketch with only those two lines but all you get is
  // a tone that never stops or changes.

  ///////////////////////// CREATE AN AMPLITUDE ENVELOPE (optional) /////////////////////////

  // you can use envelopes for many different things, but a most useful
  // application is to control amplitude (loudness). When triggered, this
  // envelope will make the loudness ramp from 0 to a desired level then
  // back to 0 without having to create a bunch of triggers, timers and loops.

  // see what.jpg for an explanation.

  // create an envelope
  env1 = new p5.Env();

  // set the envelope's shape. do see what.jpg for an explanation.

  // arguments: attack time, decay time, sustain level, release time
  env1.setADSR(0.2, 0.2, 0.5, 0.6);
  // arguments: attack level, release level
  env1.setRange(1, 0);

  // this tells our program to use our envelope to control our synth's
  // amplitude. The program will now listen for changes so you don't
  // have to restate this if you change envelope ADSR or Range somewhere else
  // in the script.

  squareSynth.amp(env1);

  ///////////////////////// FILTER (optional) /////////////////////////

  // optional but computer generated sounds can be kind of painful without
  // any filtering.

  filter = new p5.LowPass(); // cuts out all frequencies ABOVE the filter freq
  // filter = new p5.BandPass(); // emphasizes the filter freq
  // filter = new p5.HighPass(); // cuts out frequencies BELOW the filter freq

  // set filter frequency
  filter.freq(2000);
  // OR
  // what if we want to control the filter using an envelope??

  // we can make a new envelope
  env2 = new p5.Env();
  env2.setADSR(0.2, 0.2, 500, 0.6);
  env2.setRange(38000, 0);

  // and apply it to the filter's frequency
  // unlike for oscillator.freq(), this overwrites the previous filter.freq() call
  filter.freq(env2);

  // disconnect&connect method:
  // creating a filter actually creates a second sound output.
  // Unless you disconnect and reconnect the audio output you will hear a
  // combination of two sounds. this could be desirable, but if what you
  // want is only the filtered sound, use the following method:

  // disconnect this sound from its audio output
  squareSynth.disconnect();
  // connect it to the filter instead
  squareSynth.connect(filter);

  ////////////////////////// DELAY (optional) /////////////////////////

  delay = new p5.Delay();

  // connect the delay and give it some characteristics
  // arguments: delay time, feedback, filter

  delay.process(squareSynth, 0.1, 0.4, 800)

  ///////////////////////// SET FREQUENCY (optional) /////////////////////////

  // writing this in setup() is optional.
  // You can update the frequency
  // value at any point in the script with this one line.

  // ALSO freq() accepts only Hz (hertz) values. Use midiToFreq() to convert
  // notes to frequency values.

  // give the oscillator an initial frequency:
  squareSynth.freq(200);

  // How about using an envelope to control oscillator frequency!
  // We could make a new envelope, or just re-use the one we created for
  // filter frequency.
  // Note that the frequency envelope below is ADDED to the initial frequency
  // declared above, it doesn't totally replace it.

  squareSynth.freq(env2);

  ///////////////////////// MORE optional ENVELOPEY STUFF /////////////////////////

  // Envelopes can be applied directly to just about any p5.sound or web audio
  // object, though there are limitations.
  // Attempting to control something that's not sound, like rectangle y-pos for
  // example, would result in an error because y-pos is not a sound object.
  // Moreover, some sound object parameters can't be controlled via an envelope
  // because technically they don't accept numbers that change over time.

  // HOWEVER!
  // you CAN work around this, and it's pretty easy:
  // instead of applying the envelope directly to the non-sound-related thing
  // you want to control, apply it to an Amplitude() object, then extract its
  // output value when you need it! p5.Amplitude() doesn't make any sound.

  env3 = new p5.Env();
  env3.setADSR(0.1, 0.3, height-height/4, 0.8);
  env3.setRange(height/2, height-50);

  // first create the amplitude object and assign env3 to its input.

  ampConverter = new p5.Amplitude();
  ampConverter.setInput(env3);

  // then use its output value to control anything you can think of.
  // find this part in function coolObjects().

}

// draw()
//
// keeps track of time and triggers envelopes

function draw(){

  background(185);

  // note triggers:
  // using envelopes you can easily trigger notes when events happen,
  // or around some kind of rhythmic system.

  // here's an ez example where the sound is triggered every 100 frames:

  if(counter%100===0){
    // you could configure the next note to be played right here,
    // by setting its frequency for example, or modifying envelope times.

    // you could also set the time until the next note to be played
    // (and just use a different kind of if() statement to trigger this part)

    env1.play();
    env2.play();
    env3.play();
  }
  // use a variable to keep track of time
  counter++

  // trigger other things using envelopes:
  coolObjects();
}

// coolobjects()
//
// here we get the output from out amplitude() object, which is controlled
// by what we inputed into env3 using the setADSR() and setRange() functions.

function coolObjects(){

  // get ampConverter's current level (controlled by env3)
  var envValue = ampConverter.getLevel();

  // use it to affect rectangle y-pos which otherwise could not be affected,
  // as it is not a sound object.

  fill(0);
  rect(width/2, envValue, 50, 50);

  // use it to affect delayTime(), which is a function that won't accept
  // an envelope for input.

  delay.delayTime((height-envValue)/(height));
}

// note how the envelope used to move the rect starts out by ramping from 0
// to its actual starting value (height-50) on load. Not sure why. Perhaps
// the envelope object always assumes to start at 0, or maybe it has to do
// with the way i'm using amplitude() or somethin'
