// --------------------------------------------------------------------------
// -- harmony.mjs
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

let loadModules = await import('./loading-konduktiva-dependencies.mjs')
loadModules.loadKonduktivaDependencies()

//Array to record notes played on current beat, beat before and beat after:
export let dissonanceRecorder = []

//function that checks for dissonance and changes them to 0:
export function handleDissonance (beat, info){
    add2Log('flagged dissonanceRecorder')
    if (dissonanceRecorder.length > 5){
        dissonanceRecorder.shift()
    }
    let indexOfBeat = dissonanceRecorder.indexOf(dissonanceRecorder.find(x => x.beat === beat))
    if (indexOfBeat === -1){
        dissonanceRecorder.push({beat: beat, notesPlayed: []})
        indexOfBeat = dissonanceRecorder.length - 1
    }
    return info.noteValues.map(x => {
       // if (dissonanceRecorder[indexOfBeat].notesPlayed.indexOf(x - 1) ===  - 1 && dissonanceRecorder[indexOfBeat].notesPlayed.indexOf(x + 1) ===  - 1 && checkBeatBeforeForDissonance(indexOfBeat, x) === false && checkBeatAfterForDissonance(indexOfBeat, x) === false){
            if (dissonanceRecorder[indexOfBeat].notesPlayed.indexOf(x - 1) ===  - 1 && dissonanceRecorder[indexOfBeat].notesPlayed.indexOf(x + 1) ===  - 1){
            checkIfAddToDissonanceRecorder(beat, x, indexOfBeat)
            return x
        }
        else{
            console.log('flagged disonacne', x - 1, dissonanceRecorder[indexOfBeat].notesPlayed.indexOf(x - 1) ===  - 1, 'next',  x + 1,  dissonanceRecorder[indexOfBeat].notesPlayed.indexOf(x + 1) ===  - 1)
            checkIfAddToDissonanceRecorder(beat, x, indexOfBeat)
            return 0
        }
    })
}

//Check beat before current beat for disonacne
export function checkBeatBeforeForDissonance (indexOfBeat, x){
    if (indexOfBeat === 0){
        return false
    }
    else if (dissonanceRecorder[indexOfBeat - 1].notesPlayed.indexOf(x - 1) !== -1) {
        return true
    }
    else if (dissonanceRecorder[indexOfBeat - 1].notesPlayed.indexOf(x + 1) !== -1) {
        return true
    }
    return false
}

//Check beat after current beat for disonacne
export function checkBeatAfterForDissonance (indexOfBeat, x){
    if (indexOfBeat === dissonanceRecorder.length - 1){
        return false
    }
    else if (dissonanceRecorder[indexOfBeat + 1].notesPlayed.indexOf(x - 1) !== -1) {
        return true
    }
    else if (dissonanceRecorder[indexOfBeat + 1].notesPlayed.indexOf(x + 1) !== -1) {
        return true
    }
    return false
}

//Checks if this not has been played in the current beat. If no, record it in dissonanceRecorder:
export function checkIfAddToDissonanceRecorder (beat, note, indexOfBeat){
    if (dissonanceRecorder[indexOfBeat].notesPlayed.indexOf(note) === -1){
        dissonanceRecorder[indexOfBeat].notesPlayed.push(note)
    }
}

