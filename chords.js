// --------------------------------------------------------------------------
// -- chords.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//Yiler Function:
function setChordsKey(root, octave, template) {
    const notes = ["C", "D", "E", "F", "G", "A", "B"];
    root = notes.indexOf(root.toUpperCase())
    if (template === undefined){
        template = Object.keys(ChordTemplates)[randomRange(0, Object.keys(ChordTemplates).length - 1)]
    }
    let outputChord = [];
    for (let i = 0; i < 12; i++) {
        if (i == 4 || i == 5) {
            outputChord.push(new Chord({
                root: root + 5,
                octave: octave,
                template: ChordTemplates[template]
            }))
        }else if (i == 8 || i == 9){
            outputChord.push(new Chord({
                root: root + 7,
                octave: octave,
                template: ChordTemplates[template]
            }))
        }else {
            outputChord.push(new Chord({
                root: root,
                octave: octave,
                template: ChordTemplates[template]
            }))
        }
    }
    return outputChord
}

//Yiler Function
function generateChords(root, octave, voicing, majorOrMinor) {
    let keyScale = Scale.get(notes[root] + " " + majorOrMinor)
    let letterChords = [];
    for (let i = 0; i < 12; i++) {
        if (i == 4 || i == 5) {
            letterChords.push(Chord.get(keyScale.notes[3] + voicing).notes.map(e => e + "" + octave))
        } else if (i == 8 || i == 9) {
            letterChords.push(Chord.get(keyScale.notes[4] + voicing).notes.map(e => e + "" + octave))
        } else {
            letterChords.push(Chord.get(keyScale.notes[0] + voicing).notes.map(e => e + "" + octave))
        }
    }
    let midiChords = letterChords.map(x => {
        return getMidiKeys(x)
    })
    return midiChords.map(x => {
            return x.map(c => {
                return {note: c % 12, octave: roundTo(c / 12)}
            })
    })
}

//Create noteSpan values for noteValueData
function createNoteSpans (noteValueData, e){
    noteValueData.noteSpan = adjustArrayLength(noteValueData.noteValues.length, noteValueData.noteSpan)
//     noteValueData.bools = adjustArrayLength(noteValueData.noteValues.length, noteValueData.bools)
}

//Creating notespan values from noteValueData:
function createNoteSpanValues (noteValueData, name){
    if (noteValueData.noteSpanValues !== undefined && noteValueData.noteSpanKeyspan !== undefined){
    e.noteSpanMaps[name] = new QuantizedMap(noteValueData.noteSpanKeyspan, noteValueData.noteSpan, noteValueData.noteSpanValues)
    }
    else if (noteValueData.noteSpanValues !== undefined && noteValueData.noteSpanKeyspan === undefined){
        console.log('noteSpanValues defined')
    e.noteSpanMaps[name] = new QuantizedMap(noteValueData.noteSpan.length, noteValueData.noteSpan, noteValueData.noteSpanValues)
    }
    else{
    e.noteSpanMaps[name] = new QuantizedMap(noteValueData.noteSpan.length, buildArray(noteValueData.noteSpan.length, x => {return x}), noteValueData.noteSpan)
    }
}

//Create quantizedMaps that have to do with notes and other things related to note: 
function createNoteRelatedMaps (noteValueData, name, e){
    createNoteSpanValues(noteValueData, name)
    console.log(name, e)
    if (noteValueData.noteValuesKeys === undefined){
        noteValueData.noteValuesKeys = buildArray(noteValueData.noteValues.length, x => {return x})
    }
    e.noteMaps[name] = new QuantizedMap(noteValueData.noteValues.length, noteValueData.noteValuesKeys, noteValueData.noteValues)
}

//Create octave related things:
function createOctaveMaps (noteValueData, name, e){
    if (noteValueData.octaveMapKeys === undefined){
        e.octaveMaps[name] = new QuantizedMap(noteValueData.octave.length, buildArray(noteValueData.octave.length, x => {return x}), noteValueData.octave)
    }
    else {
        e.octaveMaps[name] = new QuantizedMap(noteValueData.octaveMapKeyspan, noteValueData.octaveMapKeys, noteValueData.octave)
    }
}

// function scaleWithNote (noteLetter, octave, keyArray){
//     const notes = ["C", "D", "E", "F", "G", "A", "B"];
//     let note = notes.indexOf(noteLetter)
//     if (note === -1){
//         return 'Invalid note letter'
//     }
//     note += (octave * 12)
//     let vals = []
//     for (let i = 0; i < keyArray.length; i++) {
//         vals.push(note + (12 * i))
//     }
//     return new QuantizedMap(Math.max(...keyArray) + 1, keyArray, vals)
// }

//scaleWithNote('C', randomRange(1, 8), aeolianMode)

// function makeNote (note, octave, add){
//     const notes = ["C", "D", "E", "F", "G", "A", "B"];
//     let modifiedNote = note
//     if (add !== 0 && add !== undefined){
//         modifiedNote = notes[notes.indexOf(note.toUpperCase()) + (add - 1)]
//     }
//     return Note.get(modifiedNote + octave)
// }

//Generates that chord progression that are placed in the chordProgressions variable in the musical environment:
function generateChordProgressions (){
    let twelveBarsProgression = generateRandomMelody('C', 'bluesScale', 18, 6, 10)
    return {
        twelveBars: new QuantizedMap(18, buildArray(12, x => {return 4}), twelveBarsProgression.map(x => {x.velocity = 100; return {data: [x], bool: true}})),
        lsystem: generateRandomLsystemChordProgression(),
        scarboroughFair: new QuantizedMap(48, buildArray(12, x => {return 4}), generateScarboroughFairValues())
    }
}

//Generate the note related part of the configuration object to change chord progressions:
function noteRelatedNecessaryConfigurations (chosenProgression, configurationObj){
    configurationObj.rootNote = retreiveDataFromChosenProgressionValuesData('note', chosenProgression)
    configurationObj.noteValues = chosenProgression.values.map(x => {
        return x.data.map(b => {
            return b.note 
        })
    })
    return configurationObj
}
//Generate the necessary configurations of the configuration object to change chord progressions:
function necessaryConfigurations (chosenProgression){
    let configurationObj = {bools: chosenProgression.values.map(x => {return x.bool})}
    configurationObj = noteRelatedNecessaryConfigurations(chosenProgression, configurationObj)
    configurationObj.total = chosenProgression.values.length
    configurationObj.octave = retreiveDataFromChosenProgressionValuesData('octave', chosenProgression)
    configurationObj.noteSpanKeyspan = chosenProgression.keyspan
    let beatCounter = 0
    configurationObj.rhythmMapKeys = chosenProgression.keys
    return configurationObj
}

//Retreive data from chord progression variable in musical environment:
function retreiveDataFromChosenProgressionValuesData (dataToRetreive, chosenProgression){
    return chosenProgression.values.map(x => {
        return x.data.map(n => {
            return n[dataToRetreive]
        })
    })
}

//Generate the conditional configurations of the configuration object to change chord progressions:
function conditionalNoteConfigurations (chosenProgression, configurationObj){
    if (chosenProgression.values[0].data[0].noteSpan === undefined){
        let beatCounter = 0
        configurationObj.noteSpan = []
        chosenProgression.keys.forEach(x => {
            configurationObj.noteSpan.push(beatCounter)
            beatCounter += x
        })
    }
    else {
        configurationObj.noteSpan = retreiveDataFromChosenProgressionValuesData('noteSpan', chosenProgression)
    }
    if (chosenProgression.values[0].data[0].noteSpanValues === undefined){
        configurationObj.noteSpanValues = chosenProgression.keys
    }
    else {
        configurationObj.noteSpanValues = retreiveDataFromChosenProgressionValuesData('noteSpanValues', chosenProgression)
    }
    if (chosenProgression.values[0].data[0].keySpan === undefined){
        configurationObj.rhythmMapValues = buildArray(chosenProgression.keys.length, x => {
            return 1})
    }
    else {
        onfigurationObj.rhythmMapValues = retreiveDataFromChosenProgressionValuesData('keySpan', chosenProgression)
    }
    return configurationObj
}

//Generate configuration obj from chord progression:
function assignChordProgressionToPlayer (playerName, chosenChordProgression){
    let chosenProgression = e.chordProgressions[chosenChordProgression]
    let configurationObj = necessaryConfigurations(chosenProgression)
    configurationObj = conditionalNoteConfigurations (chosenProgression, configurationObj)
    if (chosenProgression.values[0].data[0].velocity === undefined){
        configurationObj.velocity = [100, 100]
    }
    else {
        configurationObj.velocity = chosenProgression.values.map(x => {
            if (x.data[0].velocity <= 127){
                return x.data[0].velocity
            }
            else {
                return 127
            }
        })
    }
    if (chosenProgression.values[0].data[0].polyphony === undefined){
        configurationObj.polyphonyMap = [10000000000000000000000, 10000000000000000000000]
    }
    else {
        configurationObj.polyphonyMap = retreiveDataFromChosenProgressionValuesData('polyphony', chosenProgression)
    }
    return configurationObj
}

//Check current if it is time to change chord progressions
function checkIfChangeChordProgression (e, b, player){
    console.log('chordProgressionMap', player.chordProgressionMap)
    if (player.chordProgressionMap === undefined){
        return true
    }
    let correctCurrentChordProgression = e.chordProgressionMaps[player.chordProgressionMap].wrapLookup(b)
    console.log('correct', correctCurrentChordProgression)
    if (player.currentChordProgression === correctCurrentChordProgression){
        return true
    }
    else {
        let defaultName = findMostFrequentItem(Object.values(player))
        console.log('step1')
    recordConfigurationDataIntoMusicalEnvironment(assignChordProgressionToPlayer(defaultName, correctCurrentChordProgression), defaultName, e)
        console.log('step2')
        assignPlayerForMusicSynthesizerSession(e, 3, {rhythmMapName: 'straight'}, defaultName)
        console.log('step3')
        player.currentChordProgression = correctCurrentChordProgression
        console.log('step4')
    }
}

//Yiler function or Yiler may be able to explain this better:
function scaleWithNote (noteLetter, octave, mode){
    let note = Mode.notes(mode, noteLetter)
    note.forEach((x, i) =>{
        note[i] = x + octave
    })
    let midiValues = note.map ( x =>{
        return Midi.toMidi(x)
    })
    let rootNoteValues = getRootMidiValues(Mode.notes(mode, noteLetter))
    return new QuantizedMap(Math.max(...rootNoteValues) + 1, rootNoteValues, midiValues)
}

