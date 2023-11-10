// --------------------------------------------------------------------------
// -- utilities-music.mjs
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

let loadModules = await import('./loading-konduktiva-dependencies.mjs')
loadModules.loadKonduktivaDependencies()

// let A = require('array-toolkit')
//Next step, play chrods with new system
// export let easymidi = await import('easymidi')

export let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

/**
  * Converts bars(music) to beats(music)
  * @param {numbers} beatsPerBar - Sets the beats per bar which the conversion uses.
  * @param {array} inputBars - Barsr to convert
  * @example console.log(barsToBeats(4, [0, 1, 2, 3])) //[ 0, 4, 8, 12 ]
*/
export function barsToBeats(beatsPerBar, inputBars) {
    return inputBars.map(e => e *= beatsPerBar)
}

// function melodyFromChordProgression (noteValues, iois){
//     let notesToPlay = iois[1] - iois[0]
//     notesToPlay += notesToPlay / 2
//     return {notes: noteValues.map(x => {
//         let chosenNotes = []
//         for (let i = 0; i < x.length; i++) {
//             chosenNotes.push(A.pick(x))
//         }
//         return chosenNotes
//     }).flat(), iois: A.buildArray(iois.length, x => x * notesToPlay)}
// }

export function melodyFromChordProgression (noteValues, iois){
    let notesToPlay = iois[1] - iois[0]
    notesToPlay += notesToPlay / 2
    return {notes: noteValues.map(x => {
        let chosenNotes = x.map(n => {return A.pick(x)})
        return chosenNotes
    }).flat(), iois: A.buildArray(iois.length, x => x * notesToPlay)}
}
