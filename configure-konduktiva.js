// --------------------------------------------------------------------------
// -- configure-konduktiva.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//Fill in the variables inside the player:
function assignPlayerForMusicSynthesizerSession (e, session, defaultName, playerData){
    if (playerData === undefined){
        playerData = {velocityMapName: defaultName}
    }
    else if (defaultName !== undefined && playerData.velocityMapName === undefined){
        playerData.velocityMapName = defaultName
    }
    if (checkIfSessionPlayerExist(session) === undefined){
    createSessionPlayer(e, session, playerData.velocityMapName, playerData.noteMapName, playerData.octaveMapName, playerData.rhythmMapName, playerData.polyphonyMapName, playerData.noteDurationMapName, playerData.maskMapName, playerData.rhythmPatternName, playerData.chordProgressionMapName, playerData.controlChangeMapName, playerData.modeFilterName, playerData.rootMapName, playerData.modeMapName, playerData.channel)
    }
    else{
        editSessionPlayer(e, session, playerData.velocityMapName, playerData.noteMapName, playerData.octaveMapName, playerData.rhythmMapName, playerData.polyphonyMapName, playerData.noteDurationMapName, playerData.maskMapName, playerData.rhythmPatternName, playerData.chordProgressionMapName, playerData.controlChangeMapName, playerData.modeFilterName, playerData.rootMapName, playerData.modeMapName, playerData.channel)
    }
}

//Check if this player name has been used:
function checkIfSessionPlayerExist (session){
    return Object.keys(e.players).find(x => x === 'musicSynthesizerSession' + session)
}

function checkIfAddChordProgressionMapToPlayer (chordProgressionMapName, e){
    try{
        if (e.song[chordProgressionMapName] === undefined){
            return;
        }
        else {
            return chordProgressionMapName
        }
    }
    catch(e){
        console.log(e)
    }
}

//Create Player:
function createSessionPlayer (e, session, velocityMapName, noteMapName = velocityMapName, octaveMapName = velocityMapName, rhythmMapName = velocityMapName, polyphonyMapName = velocityMapName, noteDurationMapName = velocityMapName, maskMapName = velocityMapName, rhythmPatternName = velocityMapName, chordProgressionMapName = velocityMapName, controlChangeMapName = velocityMapName, modeFilterName = velocityMapName, rootMapName = velocityMapName, modeMapName = velocityMapName, channel = 1){
    let name = 'musicSynthesizerSession' + JSON.stringify(session)
    setupMidiRhythm(e, name, rhythmMapName) 
    let sessionPlayer = e.players['musicSynthesizerSession' + session]
    sessionPlayer.velocityMap = velocityMapName
    sessionPlayer.noteMap = noteMapName
    sessionPlayer.octaveMap = octaveMapName
    sessionPlayer.maskMap = maskMapName
    sessionPlayer.rhythmMap = rhythmMapName
    //e.rhythmMaps[rhythmMapName].add(e)
    sessionPlayer.session = session
    sessionPlayer.channel = channel
    sessionPlayer.polyphonyMap = polyphonyMapName
    sessionPlayer.noteDurationMapName = noteDurationMapName
    sessionPlayer.controlChangeMap = controlChangeMapName
    sessionPlayer.modeFilter = modeFilterName
    sessionPlayer.modeMap = modeMapName
    sessionPlayer.rootMap = rootMapName
    let playerName = 'musicSynthesizerSession' + session
    e.rhythmPatterns[rhythmPatternName].add(e, playerName)
    e.outputs.push(new easymidi.Output(easymidi.getOutputs()[session]))
    try{
    sessionPlayer.chordProgressionMap = checkIfAddChordProgressionMapToPlayer(chordProgressionMapName, e)
    }catch{}
}

//https://stackoverflow.com/a/43363105/19515980

//Edit Player:
function editSessionPlayer (e, session, velocityMapName, noteMapName = velocityMapName, octaveMapName = velocityMapName, rhythmMapName = velocityMapName, polyphonyMapName = velocityMapName, noteDurationMapName = velocityMapName, maskMapName = velocityMapName, rhythmPatternName = velocityMapName, chordProgressionMapName = velocityMapName, controlChangeMapName = velocityMapName, modeFilterName = velocityMapName, rootMapName = velocityMapName, modeMapName = velocityMapName, channel = 1){
    console.log('chose to edit')
    let sessionPlayer = e.players['musicSynthesizerSession' + session]
    sessionPlayer.velocityMap = velocityMapName
    sessionPlayer.noteMap = noteMapName
    sessionPlayer.octaveMap = octaveMapName
    sessionPlayer.maskMap = maskMapName
    sessionPlayer.rhythmMap = rhythmMapName
    //e.rhythmMap[rhythmMapName].add(e)
    sessionPlayer.session = session
    sessionPlayer.channel = channel
    sessionPlayer.noteDurationMapName = noteDurationMapName
    sessionPlayer.controlChangeMap = controlChangeMapName
    sessionPlayer.modeFilter = modeFilterName
    sessionPlayer.modeMap = modeMapName
    sessionPlayer.rootMap = rootMapName
    sessionPlayer.polyphonyMap = polyphonyMapName
    let playerName = 'musicSynthesizerSession' + session
    e.rhythmPatterns[rhythmPatternName].add(e, playerName)
    e.outputs[session - 1] = (new easymidi.Output(easymidi.getOutputs()[session]))
    try{
    sessionPlayer.chordProgressionMap = checkIfAddChordProgressionMapToPlayer(chordProgressionMapName, e)
    }catch{}
}

function createControlChangeMaps (noteValueData, name, e){
    if (noteValueData.controlChangeMap !== undefined && noteValueData.controlChangeMapKeys !== undefined){
        e.controlChangeMaps[name] = new QuantizedMap(noteValueData.controlChangeMapKeys[noteValueData.controlChangeMapKeys.length - 1] + 1, noteValueData.controlChangeMapKeys, noteValueData.controlChangeMap)
    }
}

function createModeFilters (noteValueData, name, e){
    console.log('trying to createModeMap')
    let modeArray = noteValueData.modeFilter
    if (modeArray === undefined){
        return false
    }
    let keySpan = noteValueData.modeFilterKeyspan
    console.log('keySpan', keySpan)
    if (keySpan === undefined){
        keySpan = modeArray[modeArray.length - 1] + 2
    }
    if (typeof modeArray === 'object'){
        e.modeFilters[name] = new QuantizedMap(keySpan, modeArray, modeArray)
    }
}

function createModeMaps (noteValueData, name, e){
    if (noteValueData.modeMap === undefined || noteValueData.modeMapKeys === undefined){
        return false
    }
    else if (noteValueData.modeMapKeyspan !== undefined){
        e.modeMaps[name] = new QuantizedMap(noteValueData.modeMapKeyspan, noteValueData.modeMapKeys, noteValueData.modeMap)
    }
    else {
        e.modeMaps[name] = new QuantizedMap(noteValueData.modeMapKeys[noteValueData.modeMapKeys.length - 1], noteValueData.modeMapKeys, noteValueData.modeMap)
    }
}

//Create maps and other things from noteValue Data and save these new things in the musical environment:
function recordConfigurationDataIntoMusicalEnvironment (noteValueData, name, e){
    createNoteSpans(noteValueData, e)
    createNoteRelatedMaps(noteValueData, name, e)
    createOctaveMaps(noteValueData, name, e)
//     e.rootNoteMaps[name] = new QuantizedMap(noteValueData.rootNote.length, A.buildArray(noteValueData.rootNote.length, x => {return x}), noteValueData.rootNote)
    e.velocityMaps[name] = new QuantizedMap(noteValueData.velocity.length, A.buildArray(noteValueData.velocity.length, x => {return x}), noteValueData.velocity)
    if (noteValueData.polyphonyMap !== undefined){
        e.maxPolyphonyMaps[name] = new QuantizedMap(noteValueData.polyphonyMap.length, A.buildArray(noteValueData.polyphonyMap.length, x => {return x}), noteValueData.polyphonyMap, e)
    }
    createControlChangeMaps(noteValueData, name, e)
    createModeFilters(noteValueData, name, e)
    createModeMaps(noteValueData, name, e)
    createRootMap(noteValueData, name, e)
//     createRhythmMap(noteValueData, name)
//     createMaskMap(noteValueData, name)
    //The problem with your RhythmPattern function is, it starts assigning things to the player it does not write it to the musical environmet
    e.rhythmPatterns[name] = new RhythmPattern (name, noteValueData.total, noteValueData.noteDurations, noteValueData.bools)
    return name
}

function addToMusicalEnvironment (e){
    e.outputs = []
//     e.midiDataSets = {}
    e.velocityMaps = {}
    e.noteMaps = {}
    e.octaveMaps = {}
//     e.rootNoteMaps = {}
    e.maxPolyphonyMaps = {}
//     e.noteDurationMaps = {}
    e.rhythmPatterns = {}
    e.noteDurationMaps = {}
//     e.pattern = undefined
    e.controlChangeMaps = {}
    e.chordProgressions = generateChordProgressions()
    e.song = {
        'twelveBars-lsystem-scarbrofair': new QuantizedMap(15000, [1000, 5000, 10000], ['twelveBars', 'lsystem', 'scarbrofair'])
    }
    e.modeFilters = {}
    e.modeMaps = {}
    e.rootMaps = {} //English alphabets for music
     e.notesInputMode = 'relativeSemitone' //OR 'relativeScaleDegree'
//     e.notesInputMode = 'relativeScaleDegree' 
}

//e.players.musicSynthesizerSession3.pattern

// let twelveBarsConfiguration = assignChordProgressionToPlayer('p3', 'lsystem') 
// recordConfigurationDataIntoMusicalEnvironment(twelveBarsConfiguration, 'p3')
// assignPlayerForMusicSynthesizerSession(e, 3, {rhythmMapName: 'straight'}, 'p3')
// e.play('musicSynthesizerSession3')
// 
// e.stop('musicSynthesizerSession3')
