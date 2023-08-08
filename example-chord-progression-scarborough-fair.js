// --------------------------------------------------------------------------
// -- example-chord-progression-scarborough-fair.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//Generated the values in the scarbrofair QuantizedMap:
function generateScarboroughFairValues (){
    let chordProgressionScarboroughFair = [
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
    return chordProgressionScarboroughFair.map(x => {
        return {data: x.map(n => {
            n.velocity = randomRange(10, 120)
            return n
        }), bool: true}
    })
}

