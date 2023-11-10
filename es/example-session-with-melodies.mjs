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
export const R = await import('ramda')
let perf= await import('perf_hooks');
export default performance = perf.performance
let TaskTimerDefault = await import('tasktimer');
export const {TaskTimer} = TaskTimerDefault.default
// const {TaskTimer} = require('tasktimer')
//const easymidi = require('easymidi');
export const fs = await import('fs')
export const path = await import('path')
let oscDefault = await import("osc");
export const osc = oscDefault.default
export const v8 = await import('v8');
export const A = await import('array-toolkit')
export let easymidi = await import('easymidi')
export const {
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
// const A = await import('./github-array-toolkit-package/array-toolkit/array-toolkit.mjs')
export * from './konduktiva-revised-2.mjs'
export * from './testingKonduktiva-revised.mjs'
export * from './konduktiva-superdirt-revised.mjs'
export * from './defaultSuperDirtPlayers-revised.mjs'
export * from './utilities-string.mjs'
export * from './utilities-music.mjs'
export * from './utilities-general.mjs'
export * from './lsystem.mjs'
export * from './chords.mjs'
export * from './example-chord-progression-scarborough-fair.mjs'
export * from './rhythm.mjs'
export * from './websocket.mjs'
export * from './harmony.mjs'
export * from './configure-konduktiva.mjs'
export * from './generate-melody.mjs'
export * from './midi.mjs'
export * from './example-websocket-session.mjs'
// export * from './example-melodies-data.mjs'
export function setUpDefaultMusicalEnvironment (){
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

export function testingA (){
    return B()
}

export function B (){
    return 'hi'
}
// 
// export let e = setUpDefaultMusicalEnvironment()
//.load ./22May-backup--steve-midi-music.js

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
