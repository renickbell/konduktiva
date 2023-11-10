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
mergedFunctions.R = await import('ramda')
let perf= await import('perf_hooks');
mergedFunctions.performance = perf.performance
let TaskTimerDefault = await import('tasktimer');
const {TaskTimer} = TaskTimerDefault.default
mergedFunctions.TaskTimer = TaskTimer
// const {TaskTimer} = require('tasktimer')
//const easymidi = require('easymidi');
mergedFunctions.fs = await import('fs')
mergedFunctions.path = await import('path')
let oscDefault = await import("osc");
mergedFunctions.osc = oscDefault.default
mergedFunctions.v8 = await import('v8');
mergedFunctions.A = await import('array-toolkit')
mergedFunctions.easymidi = await import('easymidi')
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
let fileToExport  = await import('./konduktiva-revised-2.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./testingKonduktiva-revised.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./konduktiva-superdirt-revised.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./defaultSuperDirtPlayers-revised.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./utilities-string.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./utilities-music.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./utilities-general.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./lsystem.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./chords.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./example-chord-progression-scarborough-fair.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./rhythm.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./websocket.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./harmony.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./configure-konduktiva.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./generate-melody.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./midi.mjs')
Object.assign(mergedFunctions, fileToExport)
fileToExport =  await import('./example-websocket-session.mjs')
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

export function setUpKonduktiva (){
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
