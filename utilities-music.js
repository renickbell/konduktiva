// --------------------------------------------------------------------------
// -- utilities-music.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//Next step, play chrods with new system
let easymidi = await import('easymidi')

let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const {
    Chord,
    Interval,
    Note,
    Scale,
    Key,
    Progression,
    Midi
} = require("tonal")

/**
  * Converts bars(music) to beats(music)
  * @param {numbers} beatsPerBar - Sets the beats per bar which the conversion uses.
  * @param {array} inputBars - Barsr to convert
  * @example console.log(barsToBeats(4, [0, 1, 2, 3])) //[ 0, 4, 8, 12 ]
*/
function barsToBeats(beatsPerBar, inputBars) {
    return inputBars.map(e => e *= beatsPerBar)
}

function melodyFromChordProgression (noteValues, iois){
    let notesToPlay = iois[1] - iois[0]
    notesToPlay += notesToPlay / 2
    return {notes: noteValues.map(x => {
        let chosenNotes = []
        for (let i = 0; i < notesToPlay; i++) {
            chosenNotes.push(A.pick(x))
        }
        return chosenNotes
    }).flat(), iois: A.buildArray(iois.length, x => x * notesToPlay)}
}
