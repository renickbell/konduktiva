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
    e.inputs = updateMidiInputList(e)
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
    e.recordedMessages = {}
     e.messageMaps = {}
}

//e.players.musicSynthesizerSession3.pattern

// let twelveBarsConfiguration = assignChordProgressionToPlayer('p3', 'lsystem') 
// recordConfigurationDataIntoMusicalEnvironment(twelveBarsConfiguration, 'p3')
// assignPlayerForMusicSynthesizerSession(e, 3, {rhythmMapName: 'straight'}, 'p3')
// e.play('musicSynthesizerSession3')
// 
// e.stop('musicSynthesizerSession3')

function checkIfAllMessagesExist (messageList){
    messageList.forEach(x => {
        try{
            if(e.recordedMessages[x] === undefined){
                throw new Error('recordedMessage ' + x + ' does not exist.')
            }
        }
        catch{
            throw new Error('recordedMessage ' + x + ' does not exist.')
        }
    })
}

function scaleQuantizedMapToKeyspan (newKeyspan, map){
    let scaleFactor = newKeyspan / map.keyspan
    map.keys = map.keys.map(x => {
        return x * scaleFactor
    })
    map.keyspan = newKeyspan
    return map
}

function combineQuantizeMaps (messageList, e){
    let returnedMap = new QuantizedMap(0, [], [])
    messageList.forEach(x => {
        e.recordedMessages[x].keys.forEach(b => {
            returnedMap.keys.push(b + returnedMap.keyspan)
        })
        returnedMap.keyspan += e.recordedMessages[x].keyspan
        returnedMap.values.push(e.recordedMessages[x].values)
    })
    returnedMap.values = returnedMap.values.flat()
    return returnedMap
}

function splitOnePlaybackMapIntoMany(e, messageMapName, messageMap){
}
function createPlaybackPlayer (e, messageMapName, playerName = messageMapName, totalKeyspan = combineAllKeySpans(messageMapName)){
    setupPlaybackPlayer(e, playerName, playerName)
    let messageList = e.messageMaps[messageMapName]
    checkIfAllMessagesExist(messageList)
    e.messageMaps[messageMapName] = combineQuantizeMaps(messageList, e)
    let currentMessageMap = e.messageMaps[messageMapName]
    e.rhythmMaps[messageMapName] = new QuantizedMap(1, [1] ,new QuantizedMap(currentMessageMap.keyspan, currentMessageMap.keys, currentMessageMap.keys))
    e.maskMaps[messageMapName] = new QuantizedMap(currentMessageMap.keyspan, currentMessageMap.keys,currentMessageMap.keys.map(x => {return true}))
    e.noteMaps[messageMapName] = new QuantizedMap(0, [], [])
    e.noteMaps[messageMapName] = new QuantizedMap(0, [], [])
    e.noteMaps[messageMapName] = new QuantizedMap(0, [], [])
    splitOnePlaybackMapIntoMany(e.messageMaps[messageMapName])
    e.players[playerName].rhythmMap = messageMapName
    e.players[playerName].maskMap = messageMapName
}

// createPlaybackPlayer(e, 'testios', 'testios', 100)

function checkingAddMapToMusicalEnvironmentArguments (objectName, mapName, keyspan, keys, values){
    if (objectName === undefined || typeof objectName !== 'string'){
        throw new Error('Invalid objectName type. Expected string.')
    }
    else if (e[objectName] === undefined){
        throw new Error('Variable does not exist in MusicalEnvironment. Please fill in one of the variables that exist and uses QuantizedMap(s). To check find all variables, do Object.keys(musicalEnvironment)')
    }
    if (mapName === undefined || typeof mapName !== 'string'){
        throw new Error('Invalid mapName type. Expected string.')
    }
    if (keyspan === undefined){
        console.warn('kepspan is undefined will automatically use last item of the keys array as keyspanb.')
    }
    else if (typeof keyspan !== 'number'){
        throw new Error('Invalid keyspan type. Expected number')
    }
    if (keys instanceof Array === false){
        throw new Error('Invalid keys type. Expected number array')
    }
    else if (keys.every(x => typeof x === 'number') === false){
        throw new Error('Invalid keys type. Expected number array')
    }
    if (values instanceof Array === false){
        throw new Error('Invalid values type. Expected array')
    }
    //differentiating between object and array from: https://stackoverflow.com/a/7803271/19515980
//     console.info('Preliminary checks have passeed.')
}

function createDefaultRhythmMap (e, objectName, mapName, keyspan, keys, values){
    if (checkAllItemsType(values, 'number')) {
        e.rhythmMaps[mapName] = new QuantizedMap(1, [1], new QuantizedMap(keyspan, keys, values))
    }
    return true
}

function createSubarrayMap (e, objectName, mapName, keyspan, keys, values){
    if (checkAllItemsType(values, 'array')){
        e[objectName][mapName] = new QuantizedMap(keyspan, keys, values)
    }
    return true
}

function createRhythmPatternMap (e, objectName, mapName, keyspan, keys, values){
    if (checkAllItemsType(values, 'boolean')){
        e.rhythmPatterns[mapName] = new QuantizedMap(keyspan, keys, values)
    }
    return true
}

function createDeafaultMaskMap (e, objectName, mapName, keyspan, keys, values){
    if (checkAllItemsType(values, 'boolean')){
        e.maskMaps[mapName] = new QuantizedMap(keyspan, keys, A.flipBooleans(values))
    }
    return true
}

function checkChordProgressionDataType (values){
    if (findItemType(values) !== 'Array'){
        throw new Error('invalid values type. expected array. check values')
    }
    return values.every((x, i) => {
        console.log(findItemType(x.data))
        if (findItemType(x.data) !== 'Array'){
            throw new error('invalid data type. expected number. check values[' + i + '].data.')
        }
        else if (findItemType(x.bool) !== 'boolean'){
            throw new Error('Invalid boolean type. Expected number. Check values[' + i + '].data.boolean')
        }
        return x.data.every(d => {
            if (findItemType(d.note) !== 'number'){
                throw new Error('Invalid data note type. Expected number. Check values[' + i + '].data.note')
            }
            else if (findItemType(d.octave) !== 'number'){
                throw new Error('Invalid octave type. Expected number. Check values[' + i + '].data.octave')
            }
            else if (findItemType(d.rootNote) !== 'string'){
                throw new Error('Invalid rootNote type. Expected number. Check values[' + i + '].data.rootNote')
            }
            else if (findItemType(d.velocity) !== 'number'){
                throw new Error('Invalid velocity type. Expected number. Check values[' + i + '].data.velocity')
            }
            return true
        })
    })
}

function createChordProgressionMap (e, objectName, mapName, keyspan, keys, values){
    if (checkAllItemsType(values, 'object') && checkChordProgressionDataType(values)){
        e.chordProgressions[mapName] = new QuantizedMap(keyspan, keys, values)
    }
}

function createDefaultMap (e, objectName, mapName, keyspan, keys, values){
    if (checkAllItemsType(values, 'number')){
        e[objectName][mapName] = new QuantizedMap(keyspan, keys, values)
    }
}

function createSongMap (e, objectName, mapName, keyspan, keys, values){
    if (checkAllItemsType(values, 'string') === false){
        throw new Error ('Invalid items in values array. Expected an array filled with strings.')
    }
    else if (values.every((x, i) => {if (e.chordProgressions[x] === undefined){
        throw new Error (x + ' is not a property name of musicalEnvironment.chordProgressions. Fix index ' + i)
        return false
        }
        return true
    }) === false){
        throw new Error ('Invalid items in values array. Expected name of a property in musicalEnvironment.chordProgressions')
            }
    else {
        e.song[mapName] = new QuantizedMap(keyspan, keys, values)
    }
    return true
}

// createSongMap(e, 'song', 'yo', 100, [0, 1, 2, 3], ['lsystem', 'twelveBars', 'lsystem', 'scarboroughFair' ])
function addMapToMusicalEnvironment (e, objectName, mapName, keyspan, keys, values){
    checkingAddMapToMusicalEnvironmentArguments(objectName, mapName, keyspan, keys, values)
    switch (objectName){
        case'rhythmMaps':
            createDefaultRhythmMap(e, objectName, mapName, keyspan, keys, values)
            break;
        case 'noteMaps':
        case 'octaveMap':
            createSubarrayMap(e, objectName, mapName, keyspan, keys, values)
            break;
        case 'rhythmPatterns':
            createRhythmPatternMap(e, objectName, mapName, keyspan, keys, values)
        case 'maskMaps':
            createDeafaultMaskMap(e, objectName, mapName, keyspan, keys, values)
            break;
        case 'chordProgressions':
            createChordProgressionMap(e, objectName, mapName, keyspan, keys, values)
            break;
        case 'song':
            createSongMap(e, objectName, mapName, keyspan, keys, values)
            break;
        default: 
            createDefaultMap(e, objectName, mapName, keyspan, keys, values);
    }
    console.log('Successfully created ', objectName, ' named ', mapName)
    return true
}

addMapToMusicalEnvironment(e, 'rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])

function findItemType (item){
    if (typeof item === 'object' && item instanceof Array){
        //differentiating between object and array from: https://stackoverflow.com/a/7803271/19515980
        return 'Array'
    }
    return typeof item
}

function typesOfItemsInArray (inputArray){
    let types = {}
    inputArray.forEach((x, i) => {
        let finalType = findItemType(x)
        if (types[finalType] === undefined){
            types[finalType] = [i]
        }
        else {
            types[finalType].push(i)
        }
    })
    return types
}

function checkAllItemsType (inputArray, type){
    let arrayInfo = typesOfItemsInArray(inputArray)
    if (Object.keys(arrayInfo).length !== 1){
        return false
    }
    else if (Object.keys(arrayInfo)[0].toLowerCase() === type.toLowerCase()){
        return true
    }
    else {
        return false
    }
}
