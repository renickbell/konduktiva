// --------------------------------------------------------------------------
// -- chords.mjs
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

let loadModules = await import('./loading-konduktiva-dependencies.mjs')
loadModules.loadKonduktivaDependencies()

//Yiler Function:
export function setChordsKey(root, octave, template) {
    const notes = ["C", "D", "E", "F", "G", "A", "B"];
    root = notes.indexOf(root.toUpperCase())
    if (template === undefined){
        template = Object.keys(ChordTemplates)[randomRange(0, Object.keys(ChordTemplates).length - 1)]
    }
    let outputChord = [];
//     for (let i = 0; i < 12; i++) {
    Array.from({length: 12}).forEach((x, i) =>{
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
    })
    return outputChord
}

//Yiler Function
export function generateChords(root, octave, voicing, majorOrMinor) {
    let keyScale = Scale.get(notes[root] + " " + majorOrMinor)
    let letterChords = [];
//     for (let i = 0; i < 12; i++) {
    Array.from({length: 12}).forEach((x, i) =>{
        if (i == 4 || i == 5) {
            letterChords.push(Chord.get(keyScale.notes[3] + voicing).notes.map(e => e + "" + octave))
        } else if (i == 8 || i == 9) {
            letterChords.push(Chord.get(keyScale.notes[4] + voicing).notes.map(e => e + "" + octave))
        } else {
            letterChords.push(Chord.get(keyScale.notes[0] + voicing).notes.map(e => e + "" + octave))
        }
    })
    let midiChords = letterChords.map(x => {
        return getMidiKeys(x)
    })
    return midiChords.map(x => {
            return x.map(c => {
                return {note: c % 12, octave: roundTo(c / 12)}
            })
    })
}

export function generateChordsV2 (root, octave, progression) {
    let letterChords = Progression.fromRomanNumerals(root, progression);
    let noteChords = letterChords.map(chord => Chord.get(chord).notes);
    let midiChords = noteChords.map(c => c.map(n => Note.midi(n + "" + octave)));
    return midiChords
}

//Create noteDuration values for noteValueData
export function createNoteSpans (noteValueData, e){
    noteValueData.noteDurations = A.resizeArray(noteValueData.noteValues.length, noteValueData.noteDurations)
//     noteValueData.bools = A.resizeArray(noteValueData.noteValues.length, noteValueData.bools)
    return noteValueData
}

//Creating notespan values from noteValueData:
export function createNoteSpanValues (noteValueData, name, e){
    if (noteValueData.noteDurationValues !== undefined && noteValueData.noteDurationKeyspan !== undefined){
        console.log('1aaaa')
    e.noteDurationMaps[name] = new QuantizedMap(noteValueData.noteDurationKeyspan, noteValueData.noteDurations, noteValueData.noteDurationValues)
    }
    else if (noteValueData.noteDurationValues !== undefined && noteValueData.noteDurationKeyspan === undefined){
        console.log('2')
        console.log('noteDurationValues defined')
    e.noteDurationMaps[name] = new QuantizedMap(noteValueData.noteDurations.length, noteValueData.noteDurations, noteValueData.noteDurationValues)
    }
    else{
        console.log('3')
    e.noteDurationMaps[name] = new QuantizedMap(noteValueData.noteDurations.length, A.buildArray(noteValueData.noteDurations.length, x => {return x}), noteValueData.noteDurations)
    }
}

//Create quantizedMaps that have to do with notes and other things related to note: 
export function createNoteRelatedMaps (noteValueData, name, e){
    createNoteSpanValues(noteValueData, name, e)
    console.log(name, e)
    if (noteValueData.noteValuesKeys === undefined){
        noteValueData.noteValuesKeys = A.buildArray(noteValueData.noteValues.length, x => {return x})
    }
    e.noteMaps[name] = new QuantizedMap(noteValueData.noteValues.length, noteValueData.noteValuesKeys, noteValueData.noteValues)
}

//Create octave related things:
export function createOctaveMaps (noteValueData, name, e){
    if (noteValueData.octaveMapKeys === undefined){
        e.octaveMaps[name] = new QuantizedMap(noteValueData.octave.length, A.buildArray(noteValueData.octave.length, x => {return x}), noteValueData.octave)
    }
    else {
        e.octaveMaps[name] = new QuantizedMap(noteValueData.octaveMapKeyspan, noteValueData.octaveMapKeys, noteValueData.octave)
    }
}

export function createRootMap (noteValueData, name, e){
    if (noteValueData.rootMapKeys === undefined){
        e.rootMaps[name] = new QuantizedMap(noteValueData.rootMap.length, A.buildArray(noteValueData.rootMap.length, x => {return x}), noteValueData.rootMap)
    }
    else {
        e.rootMaps[name] = new QuantizedMap(noteValueData.rootMapKeyspan, noteValueData.rootMapKeys, noteValueData.root)
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
export function generateChordProgressions (){
    let twelveBarsProgression = generateRandomMelody('C', 'bluesScale', 18, 6, 10)
    return {
        twelveBars: new QuantizedMap(18, A.buildArray(12, x => {return 4}), twelveBarsProgression.map(x => {x.velocity = 100; return {data: [x], bool: true}})),
        lsystem: generateRandomLsystemChordProgression(),
        scarboroughFair: new QuantizedMap(48, A.buildArray(12, x => {return 4}), generateScarboroughFairValues())
    }
}

//Generate the note related part of the configuration object to change chord progressions:
export function noteRelatedNecessaryConfigurations (chosenProgression, configurationObj){
    configurationObj.rootNote = retreiveDataFromChosenProgressionValuesData('note', chosenProgression)
    configurationObj.noteValues = chosenProgression.values.map(x => {
        return x.data.map(b => {
            return b.note 
        })
    })
    return configurationObj
}
//Generate the necessary configurations of the configuration object to change chord progressions:
export function necessaryConfigurations (chosenProgression){
    let configurationObj = {bools: chosenProgression.values.map(x => {return x.bool})}
    configurationObj = noteRelatedNecessaryConfigurations(chosenProgression, configurationObj)
    configurationObj.total = chosenProgression.values.length
    configurationObj.octave = retreiveDataFromChosenProgressionValuesData('octave', chosenProgression)
    configurationObj.noteDurationKeyspan = chosenProgression.keyspan
    let beatCounter = 0
    configurationObj.rhythmMapKeys = chosenProgression.keys
    return configurationObj
}

//Retreive data from chord progression variable in musical environment:
export function retreiveDataFromChosenProgressionValuesData (dataToRetreive, chosenProgression){
    return chosenProgression.values.map(x => {
        return x.data.map(n => {
            return n[dataToRetreive]
        })
    })
}

//Generate the conditional configurations of the configuration object to change chord progressions:
export function conditionalNoteConfigurations (chosenProgression, configurationObj){
    if (chosenProgression.values[0].data[0].noteDuration === undefined){
        let beatCounter = 0
        configurationObj.noteDurations = []
        chosenProgression.keys.forEach(x => {
            configurationObj.noteDurations.push(beatCounter)
            beatCounter += x
        })
    }
    else {
        configurationObj.noteDurations = retreiveDataFromChosenProgressionValuesData('noteDuration', chosenProgression)
    }
    if (chosenProgression.values[0].data[0].noteDurationValues === undefined){
        configurationObj.noteDurationValues = chosenProgression.keys
    }
    else {
        configurationObj.noteDurationValues = retreiveDataFromChosenProgressionValuesData('noteDurationValues', chosenProgression)
    }
    if (chosenProgression.values[0].data[0].keySpan === undefined){
        configurationObj.rhythmMapValues = A.buildArray(chosenProgression.keys.length, x => {
            return 1})
    }
    else {
        configurationObj.rhythmMapValues = retreiveDataFromChosenProgressionValuesData('keySpan', chosenProgression)
    }
    return configurationObj
}

// //Generate configuration obj from chord progression:
// function assignChordProgressionToPlayer (playerName, chosenChordProgression){
//     let chosenProgression = e.chordProgressions[chosenChordProgression]
//     let configurationObj = necessaryConfigurations(chosenProgression)
//     configurationObj = conditionalNoteConfigurations (chosenProgression, configurationObj)
//     if (chosenProgression.values[0].data[0].velocity === undefined){
//         configurationObj.velocity = [100, 100]
//     }
//     else {
//         configurationObj.velocity = chosenProgression.values.map(x => {
//             if (x.data[0].velocity <= 127){
//                 return x.data[0].velocity
//             }
//             else {
//                 return 127
//             }
//         })
//     }
//     if (chosenProgression.values[0].data[0].polyphony === undefined){
//         configurationObj.polyphonyMap = [10000000000000000000000, 10000000000000000000000]
//     }
//     else {
//         configurationObj.polyphonyMap = retreiveDataFromChosenProgressionValuesData('polyphony', chosenProgression)
//     }
//     return configurationObj
// }

export function assignChordProgressionToPlayer (chosenChordProgression, e){
    let chosenProgression = e.chordProgressions[chosenChordProgression]
    let configurationObj = sortIntoConfigurationObj(chosenProgression)
    configurationObj = inputOtherNecessaryConfigurationVariables(configurationObj)
    return configurationObj
}

export function sortIntoConfigurationObj (chosenProgression){
    let configurationObj = {}
    configurationObj.octaves = chosenProgression.values.map(x => {return x.octaves})
    configurationObj.rootNote = chosenProgression.values.map(x => {return x.note})
    configurationObj.rhythmMap = chosenProgression.keys
    configurationObj.total = chosenProgression.keyspan
    configurationObj.notespan = chosenProgression.keys
    return configurationObj
}

export function inputOtherNecessaryConfigurationVariables (chosenProgression){
    configurationObj.velocity = [100]
    configurationObj.bools = [true, true]
    configurationObj.polyphanyMap = [50, 50]
    configurationObj.modeMap = [0, 1, 2, 3, 4 ,5 , 6, 7, 8, 9, 10, 11, 12]
}

//Check current if it is time to change chord progressions
export function checkIfChangeChordProgression (e, b, player){
//     console.log('song', player.song)
    if (player.song === undefined){
        return true
    }
    let correctCurrentChordProgression = e.songs[player.song].wrapLookup(b)
    console.log('correct', correctCurrentChordProgression)
    if (player.currentChordProgression === correctCurrentChordProgression){
        return true
    }
    else {
        let defaultName = A.findMostFrequentItem(Object.values(player))
        console.log('step1')
    recordConfigurationDataIntoMusicalEnvironment(assignChordProgressionToPlayer(correctCurrentChordProgression, e), defaultName, e)
        console.log('step2')
        assignPlayerForMusicSynthesizerSession(e, 3, {rhythmMapName: 'straight'}, defaultName)
        console.log('step3')
        player.currentChordProgression = correctCurrentChordProgression
        console.log('step4')
    }
}

//Yiler function or Yiler may be able to explain this better:
export function scaleWithNote (noteLetter, octave, mode){
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

//generated by chatgpt:
export function separateOctaveAndRoot(midiNotes) {
  let octaveNotes = [];
  let rootNotes = [];
  midiNotes.forEach(x => {
    let octave = Math.floor(x / 12); // Divide by 12 to get the octave
    let rootNote = x % 12; // The remainder gives the root note within the octave
    octaveNotes.push(octave);
    rootNotes.push(rootNote);
  })
  return {
    octaveNotes,
    rootNotes
  };
}

export function reformatIoisToRelative (iois){
    if (A.isArrayAscending(iois) === false){
        return iois
    }
    return iois.map((x, i) =>{
        if (iois[i + 1] !== undefined){
            return iois[i + 1] - x
        }
    }).slice(0, iois.length - 1)
}

export function convertMusicalLettersToMidi (letterArray){
    if (typeof letterArray[0] !== 'string'){
        return letterArray
    }
    return letterArray.map(x => {
        return Note.midi(x)
    })
}
//Helped by chatgpt

export function makeChordProgression (name, total, iois, notes, octaves, e){
    if (iois === undefined){
        let splitNotes = separateOctaveAndRoot(iois.map(x => {
            return x[1]
        }))
        notes = splitNotes.rootNotes
        octaves = splitNotes.octaveNotes
        iois = iois.map(x => {
            return x[0]
        })
    }
    if (iois.length > notes.length){
        notes = A.resizeArray(iois.length, notes)
    }
    else if (iois.length < notes.length){
        iois = A.resizeArray(notes.length, iois)
    }
    if (octaves.length !== notes.length){
        octaves = A.resizeArray(notes.length, octaves)
    }
    if (typeof notes[0] === 'object'){
    e.chordProgressions[name] = new QuantizedMap(total, reformatIoisToRelative(iois), notes.map((x, i) => { return x.map((d, n) => {return {note: d, octave: octaves[i][n]}})}))
    }
    else {
    e.chordProgressions[name] = new QuantizedMap(total, reformatIoisToRelative(iois), notes.map((x, i) => { return {note: x, octave: octaves[i]}}))
    }
}

// makeChordProgression('yo', 10, [4, 8, 12, 16, 20], [10, 10, 10, 10, 20], [5, 5, 5])
