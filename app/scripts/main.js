var context;

var init = function() {
  bind_event.init();

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  // window.AudioContext = window.webkitAudioContext;
  context = new AudioContext();

  // context.samplingRate = 48000;

}

var audio = function() {
  var buffer = context.createBuffer(1, 45000, 48000);
  var channel = buffer.getChannelData(0);

  for( var i=0; i < channel.length; i++ ) {
    channel[i] = Math.sin( i / 100 * Math.PI);
  }

  var src = context.createBufferSource();
  src.buffer = buffer;
  src.connect(context.destination);

  src.start(context.currentTime);
}

var oscillator = {
  init: function() {
    var self = this;
    osc = context.createOscillator();
    osc.frequency.value = 450;
    osc.type = (typeof osc.type === 'string') ? self.type.sawtooth[0] : self.type.sawtooth[1];
    osc.connect(context.destination);

    console.log(osc.type);

    osc.start = osc.start || osc.noteOn;
    osc.start(0);
  },
  type: {
    sine: ['sine', 0],
    square: ['square', 1],
    sawtooth: ['sawtooth', 2],
    triangle: ['triangle', 3]
  }
}

var bind_event = {
  init: function() {
    $('body').on('click', '#play', function(e) {
      e.preventDefault();
      audio();
    });

    $('body').on('click', '#play_oscillator', function(e) {
      e.preventDefault();
      oscillator.init();
    });
  }
}


init();
