// --------------------------------------------------------------------------
// -- generate-melody.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//Generated a random melody and outputs an array with objects that contains notes and octaves:
function generateRandomMelody (rootNote, mode, melodyLength, octaveMin = 1, octaveMax = 12, melodyMin = 1, melodyMax = 12, chords){
    const modes = {
      ionian: [0, 2, 4, 5, 7, 9, 11],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      phrygian: [0, 1, 3, 5, 7, 8, 10],
      lydian: [0, 2, 4, 6, 7, 9, 11],
      mixolydian: [0, 2, 4, 5, 7, 9, 10],
      aeolian: [0, 2, 3, 5, 7, 8, 10],
      locrian: [0, 1, 3, 5, 6, 8, 10],
      bluesScale: [0, 3, 5, 6, 7, 10],
      bluesPentatonicScale: [0, 3, 5, 6, 7, 10],
      minorBluesPentatonicScale: [0, 3, 5, 7, 10],
    };
    let modeMap = new QuantizedMap(12, modes[mode], modes[mode])
    let randomMelody;
    let randomOctaves;
        randomMelody  = buildArray (melodyLength, x => randomRangeInt (melodyMin, melodyMax))
        randomOctaves  = buildArray (melodyLength, x => randomRangeInt (octaveMin, octaveMax))
    return randomMelody.map((x, i) => {
        return {note: modeMap.nearestLookup(x % 12), octave: randomOctaves[i], rootNote: rootNote}
    })
}

