// --------------------------------------------------------------------------
// -- midi.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//Send Midi Data to music synthesizer:
function sendMidiData (info, player, note){
   // add2Log(note)
    //add2Log('--------------------------------------------------------------------------')
   console.log('note', note, 'velocity: ', info.velocity, 'channel', player.channel - 1, 'session', player.session - 1)
    e.outputs[player.session - 1].send('noteon', {
      note: note,
      velocity: info.velocity,
      channel: player.channel - 1,
    });
    setTimeout(() => {
        e.outputs[player.session - 1].send('noteoff', {
          note: note,
          velocity: info.velocity,
          channel: player.channel - 1,
        });
    }, info.noteDuration * 1000)
}

//Convert velocity values from 0-1 to midi 0-127:
function convertVelocityToMidiValues (inputVelocity){
    if (inputVelocity > 1){
        return inputVelocity
    }
    else {
        return inputVelocity * 127
    }
}

//This function is modified to set action as sequenceSize instead of superDirt
function setupMidiRhythm (env, sequenceName, rhythmPatternName = 'default') {
    env.players[sequenceName] = new Player(sequenceName);
    env.players[sequenceName].maskMap = 'default'
    //env.players[playerName].samplePattern = playerName;
    env.players[sequenceName].action = 'midiSequencedRhythm';
    env.players[sequenceName].rhythmMap = rhythmPatternName
    return sequenceName
}

//Action function:
function musicSynthesizerCaller (p,b) {if ((mask(p, e.maskMaps[e.players[p].maskMap] ,(e.currentBeat()),1)) != true) {callMusicSynthesizerRhythm(e, b, p);}}

function filterMode (note, e, b, player){
    let mode = e.modeFilters[player.modeFilter]
    if (mode === undefined){
        return note
    }
    else if (e.notesInputMode === 'relativeSemitone'){
        console.log('filtering mode map for', player.modeFilter)
        return mode.floorWrapLookup(note)
    }
    else{
        return mode[note]
    }
}

function filterPolyphany (e, b, player, info){
    let playerPolyphany = e.maxPolyphonyMaps[player.polyphonyMap]
    if (playerPolyphany === undefined){
        return info
    }
    let maxNoteSpanLength = playerPolyphany.wrapLookup(b)
    if (info.noteDuration.length > maxNoteSpanLength){
//         for (let i = 0; i < maxNoteSpanLength - info.noteDuration.length; i++) {
        Array.from({length: maxNoteSpanLength - info.noteDuration.length}, () => {
            info.noteDuration = A.safeSplice(info.noteDuration, 1, randomRange(0, info.noteDuration.length - 1))
        })
    }
    return info
}

function convertRomanNumeralsToMidi (info){
    let stringOctaves = info.octaves
    if (typeof info.octaves[0] === 'string'){
        info.octaves = info.octaves.map(x => {
            return Note.midi(x)
        })
    }
    else {
        stringOctaves = info.octaves.map(x => {
            return Note.fromMidi(x)
        })
    }
//     console.log('testing for roman numerals', info.noteValues[0])
    if (typeof info.noteValues[0] === 'string'){
        console.log('Yo octave stuff', info.letters[0] + info.octaves[0])
        info.finalValues = Progression.fromRomanNumerals(info.letters[0] + info.octaves[0], info.noteValues)
        info.finalValues = info.finalValues.map(x => {
            return Midi.toMidi(x)
        })
        console.log('converted', info.finalValues)
        return info
    }
//     info.noteValues = info.noteValues.map((x, i) => {
//         console.log(stringOctaves[i], x)
//         return Progression.fromRomanNumerals(stringOctaves[i], x)
//     })
//     info.noteValues = Progression.fromRomanNumerals(stringOctaves[0], info.noteValues)
    return info
}
//Roman numeral conversions to midi with tonal helped by chatgpt

function calculateFinalNoteValue (info){
    if (info.finalValues === undefined){
//         console.log('finalNote not detected', info.finalNote)
        info.finalValues = info.noteValues.map(x => {
            return Note.midi(info.letters[0] + info.octaves[0]) + x
        })
    }
    return info
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
//Function from: https://stackoverflow.com/a/5778071

function checkIfStringIncluesNumber (inputString){
    let splitArray = inputString.split('')
    return !splitArray.every(x => {
        if (isNumeric(x) === true){
            return false
        }
        else {return true}
    })
}

function convertLettersToMidi (info){
    if (info.finalValues !== undefined){
        console.log('finalNote already defined')
        return info
    }
    if (typeof info.octaves[0] === 'string'){
        info.octaves = info.octaves.map(x => {
             if (checkIfStringIncluesNumber(x) === false){
                return Note.midi(x + '-1')
             }
            else {
                return Note.midi(x)
            }
        })
    }
    if (typeof info.noteValues[0] === 'string'){
        console.log('beforee', info.noteValues)
        info.noteValues = info.noteValues.map(x => {
            if (checkIfStringIncluesNumber(x) === false){
                return Note.midi(x + '-1')
            }
            else {
                console.log('wrong')
                return Note.midi(x)
            }
        })
        console.log('Converting note values NOW', info.noteValues)
    }
    return info
}
//Helped by chatgpt

function convertNoteValuesToMidi (info, e, b, player){
    if (info.finalValues !== undefined){
        console.log('finalNote already detected 2')
        return info
    }
    if (e.notesInputMode === 'relativeScaleDegree'){
        let mode = e.modeFilters[player.modeFilter]
        info.noteValues = info.noteValues.map(x => {
            return mode.nearestWrapLookup(x)
        })
        console.log('mode', mode)
        console.log('this feature works HAHA', info.noteValues)
    }
    else{
        info.noteValues = info.noteValues.map(x => {
            return filterMode(x, e, b, player)
        })
    }
    return info
}

function getRelativeMode (modeName){
    return Mode.get(modeName).intervals.map(x => Interval.semitones(x))
}

function checkIfChangeFilteredMode (e, b, player){
     let currentModeMap = e.modeMaps[player.modeMap] 
    if (currentModeMap === undefined){
        return false
    }
    let currentMode = currentModeMap.wrapLookup(b)
    let correctMode = getRelativeMode(currentMode)
    console.log('testing modeFilter', e.modeFilters[player.modeFilter], correctMode)
    try{
        if (JSON.stringify(e.modeFilters[player.modeFilter].keys) === JSON.stringify(correctMode)){
            return false
        }
        else {
            console.log('changing mode NOW')
            e.modeFilters[player.modeFilter] = new QuantizedMap(correctMode[correctMode.length - 1], correctMode, correctMode)
            return true
        }
    }
    catch{
        console.log('changing mode NOW')
        e.modeFilters[player.modeFilter] = new QuantizedMap(correctMode[correctMode.length - 1], correctMode, correctMode)
        return true
    }
}

//Gather and sort information and prepare to send through midi:
function callMusicSynthesizerRhythm (e, b, session){
    let player = e.players[session]
    let info = getNoteInfoToSend(player, b, session)
    info = filterPolyphany(e, b, player, info)
    let octaveFloor = new QuantizedMap(8, [3, 4, 5, 6, 7], [3, 4, 5, 6, 7])
    /*
    console.log('first step look up', e.noteDurationMaps[player.noteDurationMapName].wrapLookup(b))
    console.log('b', b)
    console.log('noteValues', info.noteValues)
    console.log('music notes', midiToMusicNotes(info.noteValues))
    */
    //info.noteValues = handleDissonance(b, info)
    info = convertRomanNumeralsToMidi(info)
    info = convertLettersToMidi(info)
    visualizeVolume(info)
    checkIfChangeChordProgression(e, b, player)
    checkIfSendMidiControlChange(e, b, player)
    checkIfChangeFilteredMode(e, b, player)
    info = convertNoteValuesToMidi(info, e, b, player)
    info = calculateFinalNoteValue(info)
//     console.log('FINAL playing finaValues', info.finalValues)
    info.finalValues.forEach((x, i) => {
        //console.log('info;', x,octaveFloor.floorLookup(info.octaves[i]))
//             console.log('note', x + (octaveFloor.floorLookup(info.octaves[i]) * 12))
//         console.log(session + ': ' ,x + (octaveFloor.floorLookup(info.octaves[i]) * 12))
//         sendMidiData(info, player, x + (octaveFloor.floorLookup(info.octaves[i]) * 12))
        sendMidiData(info, player, x)
    })
    return true
}

//Collect sound information to play:
function getNoteInfoToSend (player, b, session){
    return {
        noteDuration: e.rhythmMaps[player.rhythmMap].values[0].wrapLookup(b),
        velocity: convertVelocityToMidiValues(e.velocityMaps[player.velocityMap].wrapLookup(b)),
//         noteValues:  e.noteMaps[player.noteMap].wrapLookup(e.noteDurationMaps[player.noteDurationMapName].wrapLookup(b)),
        noteValues:  e.noteMaps[player.noteMap].wrapLookup(e.noteDurationMaps[player.noteDurationMapName].wrapLookup(b)),
//         noteValues: (e.octaveMaps[player.noteMap].wrapLookup(e.noteDurationMaps[player.noteDurationMapName].wrapLookup(b)) * 12) + e.rootNoteMaps[player.noteMap].wrapLookup(e.noteDurationMaps[player.noteDurationMapName].wrapLookup(b)),
        octaves: e.octaveMaps[player.octaveMap].wrapLookup(b),
        letters: e.rootMaps[player.rootMap].wrapLookup(b),
    }
}

//Update Midi outputs:
function updateMidiOutputList (e){
    let easymidiOutputs = easymidi.getOutputs()
    if (process.platform === 'linux'){
        easymidiOutputs.shift()
    }
    if (e.outputs !== undefined){
        e.outputs.forEach(x => {
            x.close()
        })
    }
    e.outputs = easymidiOutputs.map(x => {
        return new easymidi.Output(x)
    })
}

//Yiler function:
function getMidiKeys(scaleOrChordNotesArray) {
    let outputArray = scaleOrChordNotesArray.map(e => Note.midi(e))
    return outputArray
}

//Get the root note of a midi Values:
function getRootMidiValues (note){
    note.forEach((x, i) =>{
        note[i] = x + 0
    })
    let midiValues = note.map ( x =>{
        return Midi.toMidi(x)
    })
    return midiValues.map (x =>{
        return x - 12
    })
}

//Converts midi values to musical notes:
function midiToMusicNotes (array){
    return array.map(x =>{
        return Midi.midiToNoteName(x)
    })
}

function checkIfSendMidiControlChange (e, b, player){
//     console.log(e.controlChangeMaps, player.controlChangeMaps)
    if (e.controlChangeMaps[player.controlChangeMap] === undefined){
        console.log('CC unknown')
        return true
    }
    let correctCC = e.controlChangeMaps[player.controlChangeMap].wrapLookup(b)
    console.log('correctCC', correctCC)
    if (player.currentControlChange !== correctCC){
        player.currentControlChange = correctCC
        e.outputs[player.session - 1].send('cc', correctCC)
        console.log('CC Data sent')
    }
}
