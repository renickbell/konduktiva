// --------------------------------------------------------------------------
// -- example-session-with-melodies.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------
//Everything else except the ROman numberals is done.
//Semitone is regular midi and scale degree is indicies(index values) in a mode.
//Scale degree is the index of the numbers inside the mode. So, index in the array.
//Add a variable in player to see if in scale degree or semitone mode
//Change rootNoteMap to noteMap
//modeMap will be beats for keys and strings which are names of mode of western msuic as values.
//Remove current noteMap and move current rootNoteMap to noteMap
//There will not be an array of rootNotes.
//Relative mode: Mode.get('ionian').intervals.map(x => Interval.semitones(x))
//RelativeSemitone mode is done and tested
//RealiteveScaleDegree works I think
//Roman numerals work
//modeMap needs to be works I think
// .load ./arrayTransformations.js
// .load ./dataToArray.js
// .load ./infoFromArray.js
.load ./konduktiva-revised-2.js
.load ./testingKonduktiva-revised.js
.load ./konduktiva-superdirt-revised.js
.load ./defaultSuperDirtPlayers-revised.js
// .load ./utilities-array.js
.load ./utilities-string.js
.load ./utilities-music.js
.load ./utilities-general.js
.load ./lsystem.js
.load ./chords.js
// .load ./working-chords.js
.load ./example-chord-progression-scarborough-fair.js
.load ./rhythm.js
// .load ./working-rhythm.js
.load ./websocket.js
.load ./harmony.js
.load ./configure-konduktiva.js
// .load ./working-configure-konduktiva.js
.load ./generate-melody.js
.load ./midi.js
.load ./example-websocket-session.js
.load ./example-melodies-data.js
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
    e.actions.midiSequencedRhythm = musicSynthesizerCaller
    e.actions.sendPlaybackMessage = sendPlaybackMessage
    recordConfigurationDataIntoMusicalEnvironment(lsystemData, 'p1', e)
    recordConfigurationDataIntoMusicalEnvironment(circleOfFifthChords, 'p4', e)
    recordConfigurationDataIntoMusicalEnvironment(circleOfFifthMelody, 'p3', e)
    assignPlayerForMusicSynthesizerSession(e, 1, 'p1', {rhythmMapName: 'straight', chordProgressionMapName: 'twelveBars-lsystem-scarbrofair'})
    assignPlayerForMusicSynthesizerSession(e, 3, 'p3', {rhythmMapName: 'straight'})
    assignPlayerForMusicSynthesizerSession(e, 4, 'p4')
    recordConfigurationDataIntoMusicalEnvironment(melodyData, 'p2', e)
    assignPlayerForMusicSynthesizerSession(e, 2, 'p3')
    return e
}

let e = setUpDefaultMusicalEnvironment()
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
