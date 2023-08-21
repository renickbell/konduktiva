// --------------------------------------------------------------------------
// -- example-melodies-data.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

setupScheduler(e)
e.startScheduler()
addToMusicalEnvironment(e)

chordProgressionScarboroughFair = [
  [{ note: 2, octave: 2 }, { note: 5, octave: 2 }, { note: 9, octave: 2 }],  // Dm
  [{ note: 2, octave: 2 }, { note: 5, octave: 2 }, { note: 9, octave: 2 }],  // Dm
  [{ note: 0, octave: 2 }, { note: 4, octave: 2 }, { note: 7, octave: 2 }],  // C
  [{ note: 0, octave: 2 }, { note: 4, octave: 2 }, { note: 7, octave: 2 }],  // C
  [{ note: 2, octave: 2 }, { note: 5, octave: 2 }, { note: 9, octave: 2 }],  // Dm
  [{ note: 2, octave: 2 }, { note: 5, octave: 2 }, { note: 9, octave: 2 }],  // Dm
  [{ note: 0, octave: 2 }, { note: 4, octave: 2 }, { note: 7, octave: 2 }],  // C
  [{ note: 0, octave: 2 }, { note: 4, octave: 2 }, { note: 7, octave: 2 }],  // C
  [{ note: 2, octave: 2 }, { note: 5, octave: 2 }, { note: 9, octave: 2 }],  // Dm
  [{ note: 2, octave: 2 }, { note: 5, octave: 2 }, { note: 9, octave: 2 }],  // Dm
  [{ note: 10, octave: 2 }, { note: 2, octave: 2 }, { note: 5, octave: 2 }],  // Am
  [{ note: 10, octave: 2 }, { note: 2, octave: 2 }, { note: 5, octave: 2 }],  // Am
  [{ note: 2, octave: 2 }, { note: 5, octave: 2 }, { note: 9, octave: 2 }],  // Dm
  [{ note: 2, octave: 2 }, { note: 5, octave: 2 }, { note: 9, octave: 2 }],  // Dm
  [{ note: 0, octave: 2 }, { note: 4, octave: 2 }, { note: 7, octave: 2 }],  // C
  [{ note: 0, octave: 2 }, { note: 4, octave: 2 }, { note: 7, octave: 2 }]   // C
];

noteData = chordProgressionScarboroughFair

randomMelodyData = {
  velocity: [
    112, 107, 116, 115,
    109, 107,  97, 112,
    116,  91,  96, 113
  ],
  noteSpan: A.buildArray(12, x => {return x}),
  rhythmMap: [0,5, 1, 2.5, 2.75, 4, 5, 6, 8, 8.3, 8.6, 9, 10, 10.5, 10.8],
  bools: [true, true, true, true, true, true, true, true, true, true], 
  noteValues: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return n.note + ((n.octave + 1) * 12)
      })
  }),
  octave: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return n.octave
      })
  }),
  total: 16,
  polyphonyMap: [3 ,2 ,3, 2, 3, 2 ,2 ,3, 2, 3, 2 ,2],
  total: 16,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
   noteSpanKeyspan: 64,
  noteSpanValues: A.buildArray(16, x => {return (x)}),
  noteSpan: A.buildArray(16, x => {return x * 4}),
  rootNote: noteData.map(x => {
      return x.map(n => {
          return n.note
      })
  }),
   total: 64,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  //rhythmMap: A.buildArray(40, x => {return randomRange(0.5, 1.5, 2)}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
//   octave: A.buildArray(5, x => {return A.buildArray(10, b => {return x + 3})}),
//   octaveMapKeys: A.buildArray(12, x => {return x * 4}),
//   octaveMapKeyspan: 20,
    controlChangeMapKeys: [20, 40, 60, 80],
    controlChangeMap: A.buildArray(4, x => {return {
      channel: 0,
      controller: 25,
      value: randomRange(0, 159),
    }
    })
}

//noteData2 = generateRandomMelody('C', 'bluesPentatonicScale', 40, 4, 6)
noteData2 = chordProgressionScarboroughFair
randomMelody1 = {
  velocity: A.buildArray(40, x => {return randomRange(30, 50)}),
   noteSpanKeyspan: 64,
  noteSpanValues: A.buildArray(12, x => {return (x)}),
  noteSpan: A.buildArray(12, x => {return x * 4}),
  bools: A.buildArray(48, x => {return true}), 
  octave: chordProgressionScarboroughFair.map(x => {
      return 0
  }),
  total: 16,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
   noteSpanKeyspan: 64,
  noteSpanValues: A.buildArray(16, x => {return (x)}),
  noteSpan: A.buildArray(16, x => {return x * 4}),
  rootNote: noteData.map(x => {
      return x.note
  }),
   total: 64,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  //rhythmMap: A.buildArray(40, x => {return randomRange(0.5, 1.5, 2)}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
//   octave: A.buildArray(5, x => {return A.buildArray(10, b => {return x + 3})}),
//   octaveMapKeys: A.buildArray(12, x => {return x * 4}),
//   octaveMapKeyspan: 20,
  noteValues: chordProgressionScarboroughFair.map(x => {
      return [x[0].note + (12 * 3)]  }),
}

noteData3 = chordProgressionScarboroughFair

randomMelody2 = {
  //velocity: [...A.buildArray(39, x => {return 0}), ...A.buildArray(8, x => { return 40 + (x * 10)})],
    velocity: [...A.buildArray(39, x => {return 0}), ...A.buildArray(8, x => { return 120})],
  noteSpan: A.buildArray(47, x => {return 1 }),
  rhythmMap: [...A.buildArray(40, x => {return x}), ...[40, 41, 42, 43, 44 ,45, 46, 47, 48, 49]],
  bools: [...A.buildArray(39, x => {return true}), ...A.buildArray(8, x => {return true})], 
  //noteValues: [...A.buildArray(35, x => {return [60]}), ...noteData3.map(x => {
  //    return [x.note + ((x.octave + 1) * 12)]
 // })],
  octave: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return n.octave
      })
  }),
  rootNote: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return n.octave
      })
  }),
  total: 16,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
   noteSpanKeyspan: 64,
  noteSpanValues: A.buildArray(16, x => {return (x)}),
  noteSpan: A.buildArray(16, x => {return x * 4}),
  rootNote: noteData.map(x => {
      return x.map(n => {
          return n.note
      })
  }),
   total: 64,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  //rhythmMap: A.buildArray(40, x => {return randomRange(0.5, 1.5, 2)}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
  noteValues: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return n.note + ((n.octave + 1) * 12)
      })
  }),
}

melodyDataNoteData = generateChords(0, 4, "7", "major")
melodyData = {
  velocity: [
    112, 107, 116, 115,
    109, 107,  97, 112,
    116,  91,  96, 113
  ],
   noteSpanKeyspan: 64,
  noteSpanValues: A.buildArray(12, x => {return (x)}),
  noteSpan: A.buildArray(12, x => {return x * 4}),
  bools: A.buildArray(48, x => {return true}), 
  //noteValuesKeys: A.buildArray(12, x => {return (x * 4)}),
  octave: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return 0
      })
  }),
  rootNote: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return n.octave
      })
  }),
  total: 16,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
   noteSpanKeyspan: 64,
  noteSpanValues: A.buildArray(16, x => {return (x)}),
  noteSpan: A.buildArray(16, x => {return x * 4}),
  rootNote: noteData.map(x => {
      return x.map(n => {
          return n.note
      })
  }),
   total: 64,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  //rhythmMap: A.buildArray(40, x => {return randomRange(0.5, 1.5, 2)}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
  noteValues: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return n.note
      })
  }),
}

velocityData = countLetterChanges(generativeParseString('a', {
    "a": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbb",
    "b": "bbbbbaaaaaaaaaaaaaaaaaaaaaa",
    "ba": "aaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbb"
}, 2))

boolsData = generativeParseString('a', {
    "a": "aaab",
    "aaaaaab": "bbbbb"
}, 5).split('').map(x => {
    if (x === 'a'){
        return true
    }
    else {
        return true
    }
})

generationData = countLetterChanges(generativeParseString('aab', {
    "a": "aabbbbbb",
    "b": "bbbbbaaaaa",
    "ba": "aaaaabb",
    "ab": "baaaaabbb",
    "aaaaab": "ab"
}, 3))

total = 0
lsystemNoteData = generateChords(0, 4, "7", "major")
lsystemData = {
  velocity: velocityData,
   noteSpanKeyspan: 64,
  noteSpanValues: A.buildArray(12, x => {return (x)}),
  noteSpan: A.buildArray(12, x => {return x * 4}),
  bools: boolsData, 
  modeMap: [0, 2],
  modeMapKeyspan: 2,
  //noteValues: generateLsystemMelody('C', 'bluesPentatonicScale', generationData, 16, 8, 10).map(x => {
    /*
  noteValues: generateLsystemMelody('C', 'minorBluesPentatonicScale', generationData, 10, 8, 10).map(x => {
      return [x.note * x.octave]
  }),
  noteValues: lsystemNoteData.map(x => {
      return x.map(c => {
          return c.note
      })
  }),
  */
//   octave: lsystemNoteData.map(x => {
//       return x.map(c => {
//           return c.octave
//       })
//   }),
  octave: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return n.octave
      })
  }),
  rootNote: chordProgressionScarboroughFair.map(x => {
      return x.map(n => {
          return n.octave
      })
  }),
  total: 16,
  polyphonyMap: A.buildArray(12, x => {return 50}),
  //rhythmMap: A.buildArray(40, x => {return randomRange(0.5, 1.5, 2)}),
  rhythmMap: A.buildArray(12, x => {return x * 4}),
//   octave: A.buildArray(5, x => {return A.buildArray(10, b => {return x + 3})}),
//   octaveMapKeys: A.buildArray(12, x => {return x * 4}),
//   octaveMapKeyspan: 20,
  noteValues: chordProgressionScarboroughFair.map((x, i) => {
      total += generationData[i]
      return chordProgressionScarboroughFair[total % (chordProgressionScarboroughFair.length - 1)].map(n => {
          return n.note + ((n.octave + 2) * 12)
      })
  }),
}

function generateChordsv2(root, octave, progression) {
    let letterChords = Progression.fromRomanNumerals(root, progression);
    let noteChords = letterChords.map(chord => Chord.get(chord).notes);
    let midiChords = noteChords.map(c => c.map(n => Note.midi(n + "" + octave)));
    return midiChords
}

// THIS FUNCtion is useful when you want to turn a chord into a bunch of midi key values.
function getMidiKeys(scaleOrChordNotesArray) {
    let outputArray = scaleOrChordNotesArray.map(note => Note.midi(note))
    return outputArray
}

//generated with ChatGPT
function createCircleOfFifths(startingNote) {
    // Define the starting note (C major)
    let currentNote = startingNote;
    const circle = [currentNote];
    // Loop through 11 times to complete the circle of fifths
    for (let i = 0; i < 11; i++) {
        // Get the next note in the circle (up a perfect fifth)
        currentNote = Note.transpose(currentNote, "P5");
        circle.push(currentNote);
    }
    // Print the circle of fifths
    console.log(circle);
    return circle;
}


function generateChordProgression(chordLengths, key, counterClockwiseChance) {
    let progression = [];
    let circleOfFifth = createCircleOfFifths(key);
    let currentNoteIndex = 0;
    //console.log(chordLengths.length)
    for (let i = 0; i < chordLengths.length; i++) {
        if (currentNoteIndex < 0) {
            currentNoteIndex += 11
        } else if (currentNoteIndex >= 12) {
            currentNoteIndex = 0;
        }
        progression.push(circleOfFifth[currentNoteIndex]);
        if (1 - Math.random() < counterClockwiseChance) {
            currentNoteIndex -= 1;
        } else {
            currentNoteIndex += 1;
        }
    }
    let romanNumeralProgression = Progression.toRomanNumerals(key, progression);
    return romanNumeralProgression
}

let progression = generateChordProgression([1,1,1,1], "C", 0.5)

let chords = generateChordsv2("C", 5, progression)

//generated by chatgpt:
function separateOctaveAndRoot(midiNotes) {
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

let newChords2 = chords.map(e => separateOctaveAndRoot(e))

circleOfFifthChords = {
  velocity: A.buildArray(30, x => 90),
   noteSpanKeyspan: 16,
  noteSpanValues: [0, 1, 2, 3],
  noteSpan: [0, 4, 8, 12],
  bools: boolsData,
  modeMap: A.buildArray(12, x=> x),
  modeMapKeyspan: 12,
  octave: newChords2.map(x => {
      return x.octaveNotes
  }),
  rootNote: newChords2.map(x => {
      return x.rootNotes
  }),
  total: 12,
  polyphonyMap: A.buildArray(12, x => {return 50}),
  rhythmMap: [0, 4, 8, 12],
  noteValues: chords, 
}


updateMidiOutputList(e)
//e.changeTempo(250)
recordConfigurationDataIntoMusicalEnvironment(lsystemData, 'p1', e)
//assignPlayerForMusicSynthesizerSession(1, 'p1')
//melodyData.noteSpan = A.buildArray(melodyData.noteValues.length, x => {return x})

//recordConfigurationDataIntoMusicalEnvironment(randomMelodyData, 'p1')
recordConfigurationDataIntoMusicalEnvironment(circleOfFifthChords, 'p4', e)
recordConfigurationDataIntoMusicalEnvironment(randomMelodyData, 'p3', e)

assignPlayerForMusicSynthesizerSession(e, 1, {rhythmMapName: 'straight', chordProgressionMapName: 'twelveBars-lsystem-scarbrofair'}, 'p1')
assignPlayerForMusicSynthesizerSession(e, 3, {rhythmMapName: 'straight'}, 'p3')
assignPlayerForMusicSynthesizerSession(e, 4, {rhythmMapName: 'straight'}, 'p4')
//assignPlayerForMusicSynthesizerSession(2, 'p2')
recordConfigurationDataIntoMusicalEnvironment(melodyData, 'p2', e)
//assignPlayerForMusicSynthesizerSession(2,'p2')
assignPlayerForMusicSynthesizerSession(e, 2, {rhythmMapName: 'straight'}, 'p3')
//console.time('p1')

