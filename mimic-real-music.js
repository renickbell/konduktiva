// --------------------------------------------------------------------------
// -- mimic-real-music.js
// --------------------------------------------------------------------------

let easymidi = require('easymidi')

function updateMidiOutputList (outputs){
    let easymidiOutputs = easymidi.getOutputs()
    //The line below is specific To my Device:
    easymidiOutputs.shift()
    if (outputs !== undefined){
        outputs.forEach(x => {
            x.close()
        })
    }
    return easymidiOutputs.map(x => {
        return new easymidi.Output(x)
    })
}

let outputs = []

outputs = updateMidiOutputList(outputs)

function sendMidiData (velocity, noteSpan, output, note){
   // add2Log(note)
    //add2Log('--------------------------------------------------------------------------')
    output.send('noteon', {
      note: note,
      velocity: velocity,
      channel: 0,
    });
    setTimeout(() => {
        output.send('noteoff', {
          note: note,
          velocity: velocity,
          channel: 0,
        });
    }, noteSpan * 1000)
}

chords = [
  [{ note: 2, octave: 3 }, { note: 5, octave: 3 }, { note: 9, octave: 3 }],  // Dm
  [{ note: 2, octave: 3 }, { note: 5, octave: 3 }, { note: 9, octave: 3 }],  // Dm
  [{ note: 0, octave: 3 }, { note: 4, octave: 3 }, { note: 7, octave: 3 }],  // C
  [{ note: 0, octave: 3 }, { note: 4, octave: 3 }, { note: 7, octave: 3 }],  // C
  [{ note: 2, octave: 3 }, { note: 5, octave: 3 }, { note: 9, octave: 3 }],  // Dm
  [{ note: 2, octave: 3 }, { note: 5, octave: 3 }, { note: 9, octave: 3 }],  // Dm
  [{ note: 0, octave: 3 }, { note: 4, octave: 3 }, { note: 7, octave: 3 }],  // C
  [{ note: 0, octave: 3 }, { note: 4, octave: 3 }, { note: 7, octave: 3 }],  // C
  [{ note: 2, octave: 3 }, { note: 5, octave: 3 }, { note: 9, octave: 3 }],  // Dm
  [{ note: 2, octave: 3 }, { note: 5, octave: 3 }, { note: 9, octave: 3 }],  // Dm
  [{ note: 10, octave: 2 }, { note: 2, octave: 3 }, { note: 5, octave: 3 }],  // Am
  [{ note: 10, octave: 2 }, { note: 2, octave: 3 }, { note: 5, octave: 3 }],  // Am
  [{ note: 2, octave: 3 }, { note: 5, octave: 3 }, { note: 9, octave: 3 }],  // Dm
  [{ note: 2, octave: 3 }, { note: 5, octave: 3 }, { note: 9, octave: 3 }],  // Dm
  [{ note: 0, octave: 3 }, { note: 4, octave: 3 }, { note: 7, octave: 3 }],  // C
  [{ note: 0, octave: 3 }, { note: 4, octave: 3 }, { note: 7, octave: 3 }]   // C
]

tempo = 180

b = 0

/*
player = setInterval(() => {
    playChord()
}, 333)

clearInterval(player)
*/

function playChord (){
    chords[(b % (chords.length - 1))].forEach(x => {
        sendMidiData(100, 333, outputs[0],(x.note + (x.octave * 12)))
    })
    b += 1
}
//tempo per minute

var keypress = require('keypress');
 
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
 
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key, ch);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause()
      return false
  }
  else{
     // playChord()
  }
});
 
process.stdin.setRawMode(true);
process.stdin.pause();
