// --------------------------------------------------------------------------
// -- example-session-with-melodies.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------
//Export everything with export * from ...
// .load ./arrayTransformations.js
// .load ./dataToArray.js
// .load ./infoFromArray.js
let mergedFunctions = {}
mergedFunctions.R = require('ramda')
let perf= require('perf_hooks');
mergedFunctions.performance = perf.performance
const {TaskTimer} = require('tasktimer')
mergedFunctions.TaskTimer = TaskTimer
// const {TaskTimer} = require('tasktimer')
//const easymidi = require('easymidi');
mergedFunctions.fs = require('fs')
mergedFunctions.path = require('path')
let oscDefault = require("osc");
mergedFunctions.osc = oscDefault.default
mergedFunctions.v8 = require('v8');
mergedFunctions.A = require('array-toolkit')
mergedFunctions.easymidi = require('easymidi')
const {
    Chord,
    Interval,
    Note,
    Scale,
    Key,
    Progression,
    Midi,
    RomanNumeral,
    Mode
} = require("tonal")
mergedFunctions.Chord = Chord
mergedFunctions.Interval = Interval
mergedFunctions.Note = Note
mergedFunctions.Scale = Scale
mergedFunctions.Key = Key
mergedFunctions.Progression = Progression
mergedFunctions.Midi = Midi
mergedFunctions.RomanNumeral = RomanNumeral
mergedFunctions.Mode = Mode
// const A = await import('./github-array-toolkit-package/array-toolkit/array-toolkit.mjs')
let fileToExport  = require('./konduktiva-revised-2.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./testingKonduktiva-revised.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./konduktiva-superdirt-revised.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./defaultSuperDirtPlayers-revised.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./utilities-string.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./utilities-music.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./utilities-general.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./lsystem.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./chords.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./example-chord-progression-scarborough-fair.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./rhythm.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./websocket.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./harmony.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./configure-konduktiva.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./generate-melody.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./midi.js')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  require('./example-websocket-session.js')
Object.assign(mergedFunctions, fileToExport)
// export * from './example-melodies-data.mjs'
function setUpDefaultMusicalEnvironment (){
    let e = new MusicalEnvironment()
    setUpDefaultRhythmMapsToMusicalEnvironment(e)
    setUpDefaultActionToMusicalEnvironment(e)
    setUpDefaultMaskMapsForMusicalEnvironment(e)
    setUpDefaultIOIsForMusicalEnvironment(e)
    setUpDefaultCurrentDensityGraphsForMusicalEnvironment(e)
    setUpDefaultDensityGraphsForMusicalEnvironment(e)
    setUpDefaultPlayersForMusicalEnvironments(e)
    addToMusicalEnvironment(e)
    addMapToMusicalEnvironment(e, 'rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])
    updateMidiOutputList(e)
    setupScheduler(e)
    e.startScheduler()
    e.actions.midiSequencedRlethythm = musicSynthesizerCaller
    e.actions.sendPlaybackMessage = sendPlaybackMessage
    recordConfigurationDataIntoMusicalEnvironment(lsystemData, 'p0', e)
    recordConfigurationDataIntoMusicalEnvironment(circleOfFifthChords, 'p4', e)
    recordConfigurationDataIntoMusicalEnvironment(circleOfFifthMelody, 'p3', e)
    assignPlayerForMusicSynthesizerSession(e, 1, 'p1', {rhythmMapName: 'straight', chordProgressionMapName: 'twelveBars-lsystem-scarbrofair'})
    assignPlayerForMusicSynthesizerSession(e, 3, 'p3', {rhythmMapName: 'straight'})
    assignPlayerForMusicSynthesizerSession(e, 4, 'p4')
    recordConfigurationDataIntoMusicalEnvironment(melodyData, 'p2', e)
    assignPlayerForMusicSynthesizerSession(e, 2, 'p3')
    return e
}

Object.assign(mergedFunctions, setUpDefaultMusicalEnvironment)

// export let wss = createDefaultWebsocketServer()

function setUpKonduktiva (){
    global.udpPort = new osc.UDPPort({
        // This is the port we're listening on.
        localAddress: "127.0.0.1",
        localPort: 57121,
        // This is where sclang is listening for OSC messages.
        remoteAddress: "127.0.0.1",
        remotePort: 57120,
        metadata: true
    });
    // Open the socket.
    udpPort.open();
    global.samples4 = buildSampleArray (superDirtSamplesPath)
}
// 
// export let e = setUpDefaultMusicalEnvironment()
//.load ./22May-backup--steve-midi-music.js

Object.assign(mergedFunctions, setUpKonduktiva)

module.exports = mergedFunctions
//chords.js sort into rhythm.js
//define e in user-music

//chord progression map is the new name for the timeline thing

//konduktiva-revised-2.js testingKonduktiva-revised.js konduktiva-superdirt-revised.js defaultSuperDirtPlayers-revised.js utilities-string.js utilities-music.js utilities-general.js lsystem.js chords.js example-chord-progression-scarborough-fair.js rhythm.js websocket.js harmony.js configure-konduktiva.js generate-melody.js midi.js example-websocket-session.js example-melodies-data.js

/*
 * break into multiple modules

core konduktiva in its own module

chords and other crap in other module



Today make musical environment argument and make e setup functions

*/

