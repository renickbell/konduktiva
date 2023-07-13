// --------------------------------------------------------------------------
// -- lsystem.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

function generativeParseString (inputString,rules,generations) {
   for (let i = 0; i < generations; i++) {
       inputString=parseString(inputString,rules)
   }
    return inputString
}

//Gnerated the QuantizedMap for the lsystem chord progression:
function generateRandomLsystemChordProgression (){
    let velocityData = countLetterChanges(generateRandomLsystemString(20))
    let boolsData = generateLsystemBoolsData()
    let octaveData = countLetterChanges(generateRandomLsystemString(20))
    let notesData = generateLsystemNoteData()
    let noteSpanData = generateLsystemNoteData()
    boolsData = resizeArray(notesData.length, boolsData)
    noteSpanData = resizeArray(notesData.length, noteSpanData)
    octaveData = resizeArray(notesData.length, octaveData).map(x => {return x * 2})
    velocityData = resizeArray(notesData.length, velocityData).map(x => {return x * (x * 10)})
    return new QuantizedMap(notesData.length, noteSpanData, notesData.map((x, i) => {return {data: [{note: x, octave: octaveData[i], velocity: velocityData[i]}], bool: boolsData[i]}})) 
}

//Generates lsystem in string for for for the lsystem chord progression:
function generateRandomLsystemString (length = 30, pickedAlphabets){
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
function generateLsystemBoolsData (){
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
function generateLsystemNoteData (){
    let noteData = countLetterChanges(generateRandomLsystemString(20))
    let addedNotesData = []
    for (let i = 0; i < noteData.length / 10; i++) {
        let total = 0
        for (let n = 0; n < 10; n++) {
            total += noteData[(i * 10) + n]
        }
        addedNotesData.push(total)
    }
    return addedNotesData
}

//generates alphabets for the lsystem chord progression:
function generateLsystemAlphabets (){
    let alphabetAmount = randomRange(2, 10)
    let alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    let chosenAlphabets = []
    for (let i = 0; i < alphabetAmount; i++) {
        chosenAlphabets.push(alphabets[randomRange(0, alphabets.length - 1)])
    }
    return chosenAlphabets
}

//generates conditions for the lsystem chord progression:
function generateCondition (chosenAlphabets, min, max){
    let condition = ''
    chosenAlphabets.forEach((x, i) =>{
        condition += repeatString(randomRange(min, max), x)
    })
    return shuffleString(condition)
}

//Generate random configurations for the lsystem chord progression:
function generateRandomLSystemConfiguration (pickedAlphabets){
    let amountOfConditions = randomRange(1, 5)
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
    for (let i = 0; i < amountOfConditions - 1; i++) {
        let rule = generateCondition(chosenAlphabets, 1, 3)
        conditions[rule] = generateCondition(chosenAlphabets, 0, 5)
    }
    startingLetters = shuffleString(startingLetters)
    return {conditions, startingLetters}
}

function generateLsystemByAssigningNumberToLetter (mode, octaves,length) {
    let alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    let modeAlphabets = safeSplice(alphabets, alphabets.length, mode.length)
    let modeData = generateRandomLsystemString(length, modeAlphabets)
    let octavesAlphabets = safeSplice(alphabets, alphabets.length, octaves.length)
    let octavesData = generateRandomLsystemString(length, octavesAlphabets)
    return noteData.map((x, i) =>{
        return {note: x, octave: octavesData[i]}
    })
}

// let testios = generateLsystemByAssigningNumberToLetter(mode, [4 ,5, 6], 10)
