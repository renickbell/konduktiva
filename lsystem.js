// --------------------------------------------------------------------------
// -- lsystem.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

function generativeParseString (inputString,rules,generations) {
    return Array.from({length: generations}, () => {
       inputString=parseString(inputString,rules)
        return inputString
   })[generations - 1]
}
//Chatgpt helped with removing for loop

//Gnerated the QuantizedMap for the lsystem chord progression:
function generateRandomLsystemChordProgression (){
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
function generateLsystemAlphabets (){
    let alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    return Array.from({length: randomRange(2, 10)}, () => {
        return A.pick(alphabets)
    })
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

function convertLsystemStringToNumbersViaAssignedLetters (chosenAlphabets, lsystem, availableNumbers){
    return lsystem.split('').map((x, i) =>{
        return availableNumbers[chosenAlphabets.indexOf(x)]
    })
}

function generateLsystemByAssigningNumberToLetter (mode, octaves,length) {
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
