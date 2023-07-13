// --------------------------------------------------------------------------
// -- utilities-music.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//Next step, play chrods with new system
let easymidi = require('easymidi');

let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const {
        Chord,
        Interval,
        Note,
        Scale,
        Key,
        Midi
} = require("tonal")

//Converts bars(music) to beats(music)
function barsToBeats(beatsPerBar, inputBars) {
    return inputBars.map(e => e *= beatsPerBar)
}
