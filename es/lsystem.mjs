// --------------------------------------------------------------------------
// -- lsystem.mjs
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

let loadModules = await import('./loading-konduktiva-dependencies.mjs')
loadModules.loadKonduktivaDependencies()

let {countLetterChanges} = await import('./utilities-string.mjs')
let {parseString} = await import('./konduktiva-revised-2.mjs')
/**
  * Generates an L-system for a number of generations based on a starting inputString and a set of rules.
  * @param {string} inputString - The axiom of the L-system.
  * @param {object} rules - The rules of the L-system.
  * @param {number} generations - The number of generations the L-system has.
  * @example
  * console.log(generativeParseString('a', {'a': 'ba', 'b': 'aaa'}, 5))
*/
export function generativeParseString (inputString,rules,generations) {
    return Array.from({length: generations}, () => {
       inputString=parseString(inputString,rules)
        return inputString
   })[generations - 1]
}
//Chatgpt helped with removing for loop

//Gnerated the QuantizedMap for the lsystem chord progression:
/**
  * Generates a random L-system in form of a QuantizedMap.
  * @example
  * console.log(generateRandomLsystemChordProgression ()) //QuantizedMap {
  keyspan: 6,
  keys: [ 17, 22, 16, 17, 15, 20 ],
  values: [
    { data: [Array], bool: true },
    { data: [Array], bool: false },
    { data: [Array], bool: true },
    { data: [Array], bool: true },
    { data: [Array], bool: false },
    { data: [Array], bool: false }
  ]
}
*/
export function generateRandomLsystemChordProgression (){
    let velocityData = countLetterChanges(generateRandomLsystemString(20))
    let boolsData = generateLsystemBoolsData()
    let octaveData = countLetterChanges(generateRandomLsystemString(20))
    let notesData = generateLsystemNoteData()
    let noteDurationData = generateLsystemNoteData()
    boolsData = A.resizeArray(notesData.length, boolsData)
    noteDurationData = A.resizeArray(notesData.length, noteDurationData)
    octaveData = A.resizeArray(notesData.length, octaveData).map(x => {return x * 2})
    velocityData = A.resizeArray(notesData.length, velocityData).map(x => {return x * (x * 10)})
    return new QuantizedMap(notesData.length, noteDurationData, notesData.map((x, i) => {return {data: [{note: x, octave: octaveData[i], velocity: velocityData[i]}], bool: boolsData[i]}})) 
}

//Generates lsystem in string for for for the lsystem chord progression:
/**
  * Generates an L-system of a specific length based on the pickedAlphabets.
  * @param {number} [length=30] - The minimum length of the L-system.
  * @param {array} pickedAlphabets - An array filled with letters.
  * @example
  * console.log(generateRandomLsystemString()) //'qyppppyqyyqiqyppppyqyyqiqyppppyqyyqijqpiyqyppppyqyyqiqyppppyqyyqiqyppppyqyyqijyqqyppppyqyyqiqyppppyqyyqiqyppppyqyyqijypiip'
  * console.log(generateRandomLsystemString(2)) //'jjuujuujuugjjjgjjjjuugjjjgjjjjuujuugjjjgjjjjuugjjjgujuujuujuugjjjgjjjjuugjjjgjjjjuujuugjjjgjjjjuugjjjg'
  * console.log(generateRandomLsystemString(2, ['a'])) //'aaaaaaaaaaaaaaaa'
  * console.log(generateRandomLsystemString(2, ['a', 'b'])) //'bbbbbbaababbaababbbaababbbbaababbaababbbaababbbbbaababbaababbbaababbbbbbbaababbaababbbaababbbbaababbaababbbaababbbbbaababbaababbbaababb'
*/
export function generateRandomLsystemString (length = 30, pickedAlphabets){
    let configuration = generateRandomLSystemConfiguration(pickedAlphabets)
    console.log('configuration', configuration)
    let finalLsystem = ''
    let failedAttemps = 0
    while (finalLsystem.length < length){
        failedAttemps += 1
        finalLsystem = generativeParseString(configuration.startingLetters, configuration.conditions, 3 ** failedAttemps)
    }
    return finalLsystem
}

//Generates bools data for the lsystem chord progression:
/**
  * Generatest L-system bools data. Returns an array filled with true or false booleans.
  * @example console.log(generateLsystemBoolsData()) //[
  false, true,  false, true,  false,
  true,  false, true,  false, true,
  false, true,  false, true,  false,
  true,  true,  false, true,  false,
  true,  false, true,  false, true,
  false, true,  false, true,  false,
  true
]
*/
export function generateLsystemBoolsData (){
    return generateRandomLsystemString(30, ['a', 'b']).split('').map(x => {
            if (x === 'a'){
                return true
            }
            else {
                return false
            }
        })
}

//generates note data for the lsystem chord progression:
export function generateLsystemNoteData (){
    let noteData = countLetterChanges(generateRandomLsystemString(20))
    let addedNotesData = []
    let tenLengthArray = Array.from({length: 10})
    Array.from({length: Math.floor(noteData.length / 10)}).forEach((x, i) =>{
        let total = 0
        tenLengthArray.forEach((x, n) =>{
            total += noteData[(i * 10) + n]
        })
        addedNotesData.push(total)
    })
    return addedNotesData
}

//generates alphabets for the lsystem chord progression:
export function generateLsystemAlphabets (){
    let alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    return Array.from({length: randomRange(2, 10)}, () => {
        return A.pick(alphabets)
    })
}

//generates conditions for the lsystem chord progression:
export function generateCondition (chosenAlphabets, min, max){
    let condition = ''
    chosenAlphabets.forEach((x, i) =>{
        condition += repeatString(randomRange(min, max), x)
    })
    return shuffleString(condition)
}

//Generate random configurations for the lsystem chord progression:
export function generateRandomLSystemConfiguration (pickedAlphabets){
    let chosenAlphabets;
    if (pickedAlphabets === undefined){
        chosenAlphabets = generateLsystemAlphabets()
    }
    else{
        chosenAlphabets = pickedAlphabets
    }
    let startingLetters = chosenAlphabets.map(x => {
        return repeatString(randomRange(1, 3), x)
    }).join('')
    let conditions = {}
    conditions[chosenAlphabets[0]] = generateCondition(chosenAlphabets, 0, 5) + chosenAlphabets[0]
    Array.from({length: randomRange(1, 5)}, () => {
        let rule = generateCondition(chosenAlphabets, 1, 3)
        conditions[rule] = generateCondition(chosenAlphabets, 0, 5)
    })
    startingLetters = shuffleString(startingLetters)
    return {conditions, startingLetters}
}

export function convertLsystemStringToNumbersViaAssignedLetters (chosenAlphabets, lsystem, availableNumbers){
    return lsystem.split('').map((x, i) =>{
        return availableNumbers[chosenAlphabets.indexOf(x)]
    })
}

export function generateLsystemByAssigningNumberToLetter (mode, octaves,length) {
    let alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    let modeAlphabets = A.safeSplice(alphabets, alphabets.length, mode.length)
    let modeData = convertLsystemStringToNumbersViaAssignedLetters(modeAlphabets, generateRandomLsystemString(length, modeAlphabets), mode)
    let octavesAlphabets = A.safeSplice(alphabets, alphabets.length, octaves.length)
    let octavesData = convertLsystemStringToNumbersViaAssignedLetters(octavesAlphabets,  generateRandomLsystemString(length, octavesAlphabets), octaves)
    return modeData.map((x, i) =>{
        return {note: x, octave: octavesData[i]}
    })
}

// hi = generateLsystemByAssigningNumberToLetter([0,2,4,7,9,11], [4 ,5, 6], 10)
