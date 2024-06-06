// --------------------------------------------------------------------------
// -- combined.js
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
//exporting assist:
function addToModuleExports (items){
    module.exports = Object.assign({}, module.exports, items)
}

// --------------------------------------------------------------------------
//Loading dependencies:
let performance = require('perf_hooks');
performance = performance.performance
let {TaskTimer} = require('tasktimer');
// const {TaskTimer} = require('tasktimer')
const easymidi = require('easymidi');
const fs = require('fs')
const path = require('path')
const osc = require("osc");
const v8 = require('v8');
const A = require('array-toolkit')
const R = require('ramda')
const midiFileIO = require('midi-file-io');
const { Worker, isMainThread, parentPort } = require('worker_threads');
const os = require('os')
const lodash = require('lodash');

// --------------------------------------------------------------------------
//Exporting dependencies:

let mergedFunctions = {}
mergedFunctions.R = require('ramda')
let perf= require('perf_hooks');
mergedFunctions.performance = perf.performance
mergedFunctions.TaskTimer = TaskTimer
mergedFunctions.fs = require('fs')
mergedFunctions.path = require('path')
mergedFunctions.osc = osc
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
     Mode,
     Pcset
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
mergedFunctions.Pcset = Pcset
mergedFunctions.midiFileIO = require('midi-file-io');
mergedFunctions.Worker = Worker
mergedFunctions.isMainThread = isMainThread
mergedFunctions.parentPort = parentPort
mergedFunctions.os = os
mergedFunctions.lodash = lodash

module.exports = mergedFunctions

// --------------------------------------------------------------------------
//Konduktiva-revised-2.js

let tempFiles = {}

function updateTempFilesVariable (KonduktivaPackage){
    KonduktivaPackage.tempFiles = tempFiles
}

process.on('exit', () => {
    let keys = Object.keys(tempFiles)
    if (keys.length > 0){
        keys.forEach(x => {
            fs.unlinkSync(x)
        })
    }
})


/**
  * Returns the current year, month, and day (yyMMdd)
  * @example console.log(ymd()) //'230821'
*/
function ymd () {
    let dateObj = new Date();
    let y = (""+dateObj.getFullYear()).slice(2);
    let m = "" + (dateObj.getMonth() + 1);
    if (m.length < 2) {m = "0"+m} else {m = "" + m}
    let d = dateObj.getDate();
    if (d.length < 2) {d = "0"+d} else {d = "" + d}
    return y+m+d
}

const structuredClone = obj => {
      return v8.deserialize(v8.serialize(obj));
};


//--------------------------------------------------------------------------
// utility

function checkKonduktivaVersionNumber () {
    let konduktivaPath = require.resolve('konduktiva')
    if (os.type() === 'Windows_NT'){
        konduktivaPath = konduktivaPath.slice(0, konduktivaPath.lastIndexOf('\\'))
        konduktivaPath = konduktivaPath.slice(0, konduktivaPath.lastIndexOf('\\'))
        konduktivaPath += '\\package.json'
    }
    else {
        konduktivaPath = konduktivaPath.slice(0, konduktivaPath.lastIndexOf('/'))
        konduktivaPath = konduktivaPath.slice(0, konduktivaPath.lastIndexOf('/'))
        konduktivaPath += '/package.json'
    }
    let packageFileContents = JSON.parse(fs.readFileSync(konduktivaPath, 'utf8'))
    return packageFileContents.version
}

const version = checkKonduktivaVersionNumber()

// let all = x => Object.keys(x)
function all (x){
    return Object.keys(x)
}

/**
  * Adds the input of the function to a file called test.log
  * @param {*} x - The item to add to test.log file.
  * @example
  * console.log(addLog([0, 1, 2, 3])) //will add: 0,1,2,3
  * console.log(addLog('hi')) //will add: hi
*/
function addLog (x) {
    let d = new Date ();
    fs.appendFile('test.log',
//"--------------------------------------------------------------------------"
//       + "\nbegin: "+d+"\n\n"+x+"\n" +
         "\n"+x+"\n" +
//       + "\n-- end. " + d + "\n" +
"--------------------------------------------------------------------------"
       + "\n"
        , function (err) { if (err) throw err; /*console.log('Saved!');*/ })
}

/**
 * Adds the item and the item type to the file test.log
 * @param {*} x - Item to add.
 * @example
 * console.log(addLog2([0, 1, 2, 3])) //will add: [ 0, 1, 2, 3 ]
 * console.log(addLog2('hi')) //will add: 'hi'
*/
function addLog2 (x) {addLog(util.inspect(x, {maxArrayLength: null, depth: null}))}

/**
  * Outputs how long since the nodejs midiOutput has started in seconds.
  * @requires perf_hooks
  * @see {@link https://nodejs.org/api/perf_hooks.html#performancenow} to see how performance.now() works.
  * @example now() //23.817596345998346
*/
function now () {
    return 0.001 * performance.now()
}

/**
  * Returns a whole number between the min and max values.
  * @param {number} min - Minimum amount the random number can be.
  * @param {number} max - Maximum amount the random number can be.
  * @example console.log(randomRangeInt(0, 10)) //9
*/
function randomRangeInt (min, max) {
    return Math.floor(randomRange(min, max))
}

/**
  * A lerp/linear interpolation function finding a value that is between two other values by a certain fraction, which is represented by the s parameter in your function 
  * @see {@link https://en.wikipedia.org/wiki/Linear_interpolation}
  * @param {number} y1
  * @param {number} y2
  * @param {number} s
  * @example console.log(lerpValues(10, 20, 30)) //310
*/
function lerpValues (y1, y2, s) {return y1 + s * (y2 - y1)}

/**
  * Returns an array of numbers of a specific length that are always equally different in amount. This function calculates a specific number of intervals to get from start number to stop number.
  * @param {number} start - Number to start from.
  * @param {number} stop - Number to stop at.
  * @param {number} steps - The number of intervals/steps to take to get from start to stop
  * @example
  * console.log(lerpedRange(0, 10, 4)) //[ 0, 5, 10 ]
  * console.log(lerpedRange(0, 10, 7)) //[ 0, 2, 4, 6.000000000000001, 8, 10 ]
*/
function lerpedRange (start, stop, steps) {
    let stepArray = A.integerArray(0,steps-1);
    let stepSize = 1/(stepArray.length-1);
    let scalars = stepArray.map(x => x * stepSize);
    return scalars.map(x => lerpValues (start, stop, x))
}

/** Class for representing a point. */
class Point {
  /**
    * Creates the point.
    * @param {*} x - X value.
    * @param {*} y - Y value.
  */
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  /**
    * Moves the point.
    * @param {*} xDistance - Item that gets added to the x value.
    * @param {*} yDistance - Item that gets added to the y value.
  */
  move(xDistance, yDistance) {
    return new Point(this.x + xDistance, this.y + yDistance)
  }
  /**
    * Moves the point by angle and distance.
    * @param {number} angle - Angle point should rotated by.
    * @param {number} distance - The amoun the point should be moved along the angle.
  */
  moveByAngle (angle, distance) {
            let r = angle * Math.PI / 180;
            return new Point(this.x + distance*Math.sin(r), this.y + distance*Math.cos(r))
            }
}

/**
  * Function that calculates slope intercept. It returns the an object with the equation stored as a function and as a string.
  * @param {Point} p1 - First Point.
  * @param {Point} p2 - Second Point.
*/
function linearFunctionFromPoints(p1,p2) {
    let rise = p2.y - p1.y;
    let run = p2.x - p1.x;
    let slope = rise/run;
    // y = mx + b
    let b = p1.y - (slope * p1.x);
    //console.log('the linear function is: y = ' + slope + 'x + ' + b);
    return {func: (x => (x * slope) + b), note: 'y = ' + slope + 'x + ' + b}
}

/**
  * Calculates all the slope intercepts in an array of points.
  * @param {array} pointArray - The array of Points to sort through.
  * @example console.log(linearFunctionArrayFromPoints([new Point(0, 10), new Point(5, 20), new Point(10, 30)])) //[ { func: [Function: func], note: 'y = 2x + 10' }, { func: [Function: func], note: 'y = 2x + 10' } ]
*/
function linearFunctionArrayFromPoints (pointArray) {
    return A.safeSplice(pointArray, 1, 0).map((x, i) =>{
        return linearFunctionFromPoints(pointArray[i],pointArray[i+1])
    })
}

/**
  * Calculates all the slope intercepts in an array of points and returns them in form of a QuantizedMap. The keyspan will be the final X value. The keys will will be all the X values in the array.
  * @param {array} pointArray - The array of Points to sort through.
  * @example
  * linearFunctionQuantizedMap([new Point(0, 10), new Point(5, 20), new Point(10, 30)]) //QuantizedMap { keyspan: 10, keys: [ 0, 5, 10 ], values: [ { func: [Function: func], note: 'y = 2x + 10' }, { func: [Function: func], note: 'y = 2x + 10' } ] }
*/
function linearFunctionQuantizedMap (pointArray) {
    let times = pointArray.map(t => t.x);
    return new QuantizedMap(times[times.length-1], times, linearFunctionArrayFromPoints(pointArray))
}

//------------------------------------------------------------------------------
// lsystem functions

function parseItem (input, rules) {
    if (Object.keys(rules).includes(input)) {
        return rules[input]}
    else {
        return input
    }
}
// let parseItem = (input,rules) => { if (Object.keys(rules).includes(input)) {return rules[input]} else {return input}}

// let parseString = (inputString,rules) => inputString.split("").map(x => parseItem(x,rules)).join().replace(/,/g,"")
function parseString (inputString, rules) {
    return inputString.split("").map(x => parseItem(x,rules)).join().replace(/,/g,"")
}

function lsystem (inputString,rules,generations) {
        if (generations > 0) {return lsystem (parseString(inputString,rules),rules,generations-1)}
        else {return inputString}
}

function rewriteString (inputString, stringMap) {
    let splitString = inputString.split('');
    return splitString.map(c => stringMap[c])
}

// uses code from Javier Conde https://stackoverflow.com/questions/34929094/how-can-i-get-all-possible-characters-in-javascript

/**
  * Returns an array of all the English alphabets.
*/
function getAllAlphabets() {
  return Array.from({ length: 26 * 2 }, (_, index) => {
    let charCode = index < 26 ? 97 + index : 65 + index - 26;
    return String.fromCharCode(charCode);
  });
}

/**
  * Assigns each item of an array a letter of the English alphabet.
  * @param {array} inputArray - Array of things to assign letter to.
  * @example console.log(randomCharacterMapFromArray([0, 1, 2, 10])) //{ a: 1, b: 0, c: 2, d: 10 }
*/
function randomCharacterMapFromArray (inputArray) {
    let allChars = getAllAlphabets();
    if (allChars.length < inputArray.length) {return "error: inputArray is longer than array of alphabetic characters"};
    let outputMap = {};
    charactersToUse = A.takeN(allChars,inputArray.length);
    let shuffled = A.shuffle(inputArray);
    charactersToUse.forEach((x,i) => {outputMap[x] = shuffled[i]})
    return outputMap
}

/**
  * Assigns an item of one array to one item of the other array.
  * @param {array} keyArray - Array of keys.
  * @param {array} valueArray - Array of values.
  * @example console.log(randomMap(['a', 'b', 'c', 'd'], [0, 1, 2, 3])) //{ a: 1, b: 3, c: 2, d: 0 }
*/
function randomMap (keyArray, valueArray) {
    if (keyArray.length < valueArray.length) {return "error: key array is longer than value array"};
    let outputMap = {};
    charactersToUse = A.takeN(keyArray,valueArray.length);
    let shuffled = A.shuffle(valueArray);
    charactersToUse.forEach((x,i) => {outputMap[x] = shuffled[i]})
    return outputMap
}

function rulesGenerator (inputPool, maxRuleLength) {
    let ruleLengths = A.pickN (inputPool.length, A.linearArray(1,1,maxRuleLength));
    return (ruleLengths.map(x => A.pickN(x, inputPool) ) )
}

function OvariousLsystems(baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets()) {
    let replacements = A.buildArray(n, x => randomMap(allChars, A.resizeArray(allChars.length, replacementValues)));
    let thisL = lsystem (inputString, rules, generations);
    let lsystems = replacements.map(x => A.loopTo(patternLength,rewriteString(thisL,x)))
    console.log('er', lsystems)
    let names = A.buildArray(n, i => baseName+i);
    let outputMap = {};
    names.forEach((x,i) => outputMap[x] = lsystems[i]);
    return outputMap
}

function workerLsystem (inputString, rules, generations) {
    let workerCode = parseItem.toString() + ';' + parseString.toString() + ';' + lsystem.toString() + ';returnToParent(lsystem(' + JSON.stringify(inputString) + ', ' + JSON.stringify(rules) + ', JSON.parse(' +  generations + ')))'
    return giveWorkerWork(workerCode)
}

function variousLsystems(baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets()) {
    return new Promise((resolve, reject) => {
        let thisL = workerLsystem(inputString, rules, generations)
        let replacements = A.buildArray(n, x => randomMap(allChars, A.resizeArray(allChars.length, replacementValues)));
        let names = A.buildArray(n, i => baseName+i);
        let outputMap = {};
        thisL.then((lsystemRes) => {
            workerCode = 'const A = require(`array-toolkit`);' + rewriteString.toString() + ';let replacements = ' + JSON.stringify(replacements) + ';let res  = ' + JSON.stringify(lsystemRes) + '; let patternLength = ' + JSON.parse(patternLength) + '; returnToParent(replacements.map(x => A.loopTo(patternLength,rewriteString(res,x))))'
//             let lsystems = replacements.map(x => A.loopTo(patternLength,rewriteString(res,x)))
            let sortedLsystem = giveWorkerWork(workerCode)
            sortedLsystem.then((sortedRes) => {
//                 console.log('sortedRes', typeof sortedRes[0], sortedRes)
                names.forEach((x,i) => outputMap[x] = sortedRes[i]);
                resolve(outputMap)
            })
        })
    })
}

function sortRhythmMapIntoKeysAndKeyspan (rhythmMap, e){
    if (typeof rhythmMap === 'string' && e === undefined){
        throw new Error ('Location of rhythmMap provided but MusicalEnvironment not provided. Please provide the MusicalEnvironment in the second argument.')
    }
    else if (typeof rhythmMap === 'string'){
        return e.rhythmMaps[rhythmMap].values[0]
    }
    else if (findItemType(rhythmMap) !== 'QuantizedMap'){
        throw new Error('Unexpected argument. Provide the location of a rhythmMap or a QuantizedMap representing a rhythmMap as first argument. If location of rhythmMap provided pass a MusicalEnvironment as the second argument')
    }
    else if (K.checkAllItemsType(rhythmMap.values, 'number')){
        return rhythmMap
    }
    else {
        return rhythmMap.values[0]
    }
}

function convertVariousLsystemObjectToArray (obj){
    return Object.values(obj).map(x => {return x}).flat()
}

function lsystemDefaultMapTemplate (rhythmMap,e, value){
    let correctRhythmMap = sortRhythmMapIntoKeysAndKeyspan(rhythmMap, e)
    return new QuantizedMap(correctRhythmMap.keyspan, correctRhythmMap.keys, value)
}

function lsystemNoteMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e){
    return new Promise((resolve, reject) => {
        let lsystemResult = variousLsystems.apply(null, arguments)
        lsystemResult.then((res) => {
            resolve(lsystemDefaultMapTemplate(rhythmMap, e, convertVariousLsystemObjectToArray(res).map(x => {return [x]})))
        })
    })
}

function lsystemRhythmMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets()){
    return new Promise((resolve, reject) => {
        let lsystemResult = variousLsystems.apply(null, arguments)
        lsystemResult.then((res) => {
            resolve(new QuantizedMap(1, [1], Object.values(res).map(x => {
                let absolutes = deltaToAbsolute(x)
                return new QuantizedMap(absolutes[0], absolutes[1], x)
            })))
        })
    })
}

function lsystemRootMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e){
    return new Promise((resolve, reject) => {
        let lsystemResult = variousLsystems.apply(null, arguments)
        lsystemResult.then((res) => {
            resolve(lsystemDefaultMapTemplate(rhythmMap, e, Object.keys(res).map(x => {
                return res[x].map(n => {
                    let note = Note.fromMidi(n)
                    return note.slice(0, note.indexOf('-'))
                })}).flat()
            ))
        })
    })
}

function lsystemChordMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e){
    return new Promise((resolve, reject) => {
        let lsystemResult = variousLsystems.apply(null, arguments)
        lsystemResult.then((res) => {
            let diatonicChords = ['maj7',' m7',' m7',' maj7',' 7',' m7',' m7b5']
            resolve(lsystemDefaultMapTemplate(rhythmMap, e, Object.values(res).map(x => {
                return x.map(n => {
                    return diatonicChords[n % diatonicChords.length]
                })
            }).flat()))
        })
    })
}

function lsystemGeneralMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e){
    return new Promise((resolve, reject) => {
        let lsystemResult = variousLsystems.apply(null, arguments)
        lsystemResult.then((res) => {
            resolve(lsystemDefaultMapTemplate(rhythmMap, e,Object.keys(res).map(x => { return res[x] }).flat()))
        })
    })
}

function lsystemLegatoMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e) {
    return lsystemGeneralMap.apply(null, arguments)
}

function lsystemNoteDurationMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e) {
    return lsystemGeneralMap.apply(null, arguments)
}

function lsystemOctaveMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e) {
    return lsystemGeneralMap.apply(null, arguments)
}

function lsystemVelocityMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e) {
    return lsystemGeneralMap.apply(null, arguments)
}

function lsystemPolyphonyMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e) {
    return lsystemGeneralMap.apply(null, arguments)
}

function lsystemMaskMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e){
    return new Promise((resolve, reject) => {
        let lsystemResult = variousLsystems.apply(null, arguments)
        lsystemResult.then((res) => {
            resolve(lsystemDefaultMapTemplate(rhythmMap, e, Object.keys(res).map(x => {return res[x] }).flat().map(x => { return x % 2 === 0})))
        })
    })
}

function lsystemModeMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e){
    return new Promise((resolve, reject) => {
        let lsystemResult = variousLsystems.apply(null, arguments)
        lsystemResult.then((res) => {
            let modeMapKeys = Object.keys(e.modeMaps)
            resolve(lsystemDefaultMapTemplate(rhythmMap, e, Object.keys(res).map(x => {return res[x] }).flat().map(x => { return modeMapKeys[x % modeMapKeys.length]})))
        })
    })
}

// function lsystemModeMap (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), keys){
//     return new Promise((resolve, reject) => {
//         let lsystemResult = variousLsystems.apply(null, arguments)
//         lsystemResult.then((res) => {
//             let modeMapKeys = Object.keys(e.modeMaps)
//             resolve(new QuantizedMap(patternLength, keys, Object.keys(res).map(x => {return x }).flat().map(x => { return modeMapKeys[x % modeMapKeys.length]})))
//         })
//     })
// }

function lsystemModeFilter (baseName,n,patternLength,rules,generations,replacementValues,inputString, allChars = getAllAlphabets(), rhythmMap, e){
    return new Promise((resolve, reject) => {
        let lsystemResult = variousLsystems.apply(null, arguments)
        lsystemResult.then((res) => {
            resolve(lsystemDefaultMapTemplate(rhythmMap, e, Object.keys(res).map(x =>{ return res[x]}).flat()))
        })
    })
}

async function lsystemWrapperTests (K, e, allChars = ['a', 'b', 'c'], rules = {'a': 'ab', 'b': 'cc', 'c': 'abc'}, startingLetter = 'a', rhythmMap){
    let complexLsystem = await variousLsystems('comp',1 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars)
    let yo = await lsystemNoteMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemRhythmMap('comp',1 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, [0, 1, 2, 3])
    yo = await lsystemRootMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemChordMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemGeneralMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemLegatoMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemNoteDurationMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemOctaveMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemVelocityMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemPolyphonyMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemMaskMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    yo = await lsystemModeMap('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap, e)
    yo = await lsystemModeFilter('comp',2 , 30, rules, 10, e.modeFilters.aeolian.values, startingLetter,allChars, rhythmMap)
    console.log('test ran successfully')
}

addToModuleExports({
    lsystemNoteMap,
    lsystemRhythmMap,
    lsystemChordMap,
    lsystemGeneralMap,
    lsystemLegatoMap,
    lsystemNoteDurationMap,
    lsystemOctaveMap,
    lsystemVelocityMap,
    lsystemPolyphonyMap,
    lsystemMaskMap,
    lsystemModeMap,
    lsystemModeFilter,
    lsystemRootMap,
    lsystemWrapperTests,
})

//--------------------------------------------------------------------------
//midi actions

/**
  * Turns off all notes on a specific channel for the output.
  * @param e - MusicalEnvironment
*/
function allNotesOff(e) {
    e.midiOutputs.forEach(x => {
      Array.from({ length: 16 }, (_, i) => {
        x.send('cc', {
            controller: 123,
            value: 0,
            channel: i,
        });
      });
    })
}

//--------------------------------------------------------------------------
// the easiest way to make a rhythm

/**
  * Helps create a simpel rhythm in Konduktiva.
  * @param env - Musical Environment
  * @param {string} rhythmName - The name of the new rhythm.
  * @param {array}
*/
function simpleRhythm (env, rhythmName, deltas) {
    env.rhythmMaps[rhythmName] = new QuantizedMap(1,[1],[new QuantizedMap(A.sum(deltas),[0].concat(A.runningSum(0,deltas).slice(0, deltas.length - 1)),deltas)])
    return rhythmName
}

//--------------------------------------------------------------------------
// rhythm pattern with density

// increase density

// revise these so that the algorithm is swappable

/**
  * Finds the highest value number and multiplies it by the ratio. The same number is also subtracted by itself after it is multiplied by the ratio. Both of those numbers are added to the array behind that highest value number.
  * @param {number} minVal - The highest value number in the inputArray has to be greater than this number.
  * @param {number} ratio - The number the highest value number will be multipled by.
  * @param {array} inputArray - The array to modify.
  * @example
  * console.log(increaseDensity(0, 10, [0, 1, 2, 3, 5])) //[ 0, 1, 2, 3, 50, -45 ]
  * console.log(increaseDensity(0, 10, [0, 1, 2, 8, 3, 5])) //[ 0, 1, 2, 80, -72, 3, 5 ]
*/
function increaseDensity (minVal,ratio,inputArray) {
    let max = A.getMaxIndex(inputArray);
    if (max[0][1] <= minVal) {console.log("max is already at minVal");return inputArray}
    else {
        let toIncrease = A.pick(max);
        console.log("this is the max: " + toIncrease);
        let outputA = inputArray.slice(0,toIncrease[0]);
        console.log("this is outputA: " + outputA);
        let outputB = inputArray.slice(toIncrease[0]+1);
        let newVals = [toIncrease[1]*ratio,toIncrease[1] - (toIncrease[1]*ratio)];
        return outputA.concat(newVals.concat(outputB))
    }
}

/**
  * Returns an array that has the same total value and the same length but the numbers in the array will be different.
  * @param {array} inputArray - Number array.
  * @example
  * console.log(decreaseDensity([0, 1, 2, 3, 10])) //[ 0, 1, 5, 10 ] //[ 0, 3, 3, 10 ] //[ 1, 2, 3, 10 ]
*/
function decreaseDensity (inputArray) {
    if (inputArray.length == 1) {return inputArray}
    else if (inputArray.length ==2) {
        return [inputArray[0] + inputArray[1]]
    }
    else {
        let target = (randomRangeInt(0,inputArray.length - 2));
        let outputA = inputArray.slice(0,target);
        let outputB = [inputArray[target] + inputArray[target+1]].concat(inputArray.slice(target+2))
        return outputA.concat(outputB)
    }
}

function recursiveDecreaseDensity (stack) {
   let targetArray = stack[(stack.length -1)];
   if (targetArray.length > 1) {
       return recursiveDecreaseDensity(stack.concat([decreaseDensity(stack[stack.length -1])]))
   }
    return stack
}


/**
  * Uses the increaseDensity function on multiple arrays and picking randomly from an array of ratios.
  * @param {number} minVal - The minimum value the the highest value number in the first item of the stack array can be.
  * @param {array} ratio -
*/
function recursiveIncreaseDensity (minVal, ratios, stack) {
    console.log(minVal, stack)
    if (A.getMaxIndex(stack[0])[0][1] > minVal) {
        let r = A.pick(ratios);
        let addToStack = increaseDensity(minVal,r,stack[0]);
        return recursiveIncreaseDensity(minVal, ratios, [addToStack].concat(stack))
        return [addToStack].concat(stack)
    }
    return stack
}

// function recursiveDecreaseDensity (stack) {
//    console.log(stack);
//    let targetArray = stack[(stack.length -1)];
//    if (targetArray.length > 1) {
//        console.log("this is the target array");
//        return recursiveDecreaseDensity(stack.concat([decreaseDensity(stack[stack.length -1])]))
//    }
//     return stack
// }

function densityStack (minVal, ratios, inputArray) {
    return recursiveDecreaseDensity(recursiveIncreaseDensity(minVal, ratios, [inputArray]))
}

// musical time

function deltaToAbsolute (inputArray) {
    let output = [0];
    inputArray.forEach((e,i) => output.push(output[i]+e));
    return [R.last(output),R.init(output)]
}

function absoluteToDelta (inputArray) {
    let output = [];
    let [head, ...tail] = inputArray;
    tail.forEach((e,i) => output.push(e - inputArray[i]))
    return output
}

function densityFromDeltas (inputDeltas) {
    return inputDeltas.length/A.sum(inputDeltas)
}

//  keyspan is max value, keys is an array of absolutes (increasing values), values is an array of anything of the same length as keys

/** A QuantizedMap is a discreet function.
 * @see {@link https://www.sparknotes.com/math/algebra2/discretefunctions/summary/}
*/
class QuantizedMap {
    /**
      * Creates the QuantizedMap. The methods provide different ways to look for things in the quantized map.
      * @param {number} limitValue - The keyspan/total of the QuantizedMap.
      * @param {array} keys - The keys of the QuantizedMap which will be a number array in ascending order.
      * @param {array} vals - The values of the QuantizedMap which will be an array.
      * @example
      * let qMap = new QuantizedMap(10, [0, 2, 4, 6, 8], ['A', 'B', 'C', 'D']) //QuantizedMap { keyspan: 10, keys: [ 0, 2, 4, 6, 8 ], values: [ 'A', 'B', 'C', 'D' ] }
    */
    constructor(limitValue,keys,vals) {
        this.keyspan = limitValue;
        this.keys = keys;
        this.values = vals;
    }
    /**
      * The wrapLookup method is also similar to the nearestLookup method but when the number provided is greater than the keyspan, it does not return the last item in the values array instead it loops back around.
      * @param {number} time - The beat number.
      * @example
      * qMap.wrapLookup(4) //'C'
      * qMap.wrapLookup(5) //'C'
      * qMap.wrapLookup(6) //'D'
      * qMap.wrapLookup(10) //'A'
      * qMap.wrapLookup(11) //'A'
      * qMap.wrapLookup(12) //'B'
    */
    wrapLookup(time) {
        let lookupTime = time%this.keyspan;
        let filteredTime = this.keys.filter(x => x <= lookupTime);
        if (filteredTime[0] == undefined) {filteredTime = [0]};
        return this.values[(filteredTime.length - 1)]
    }
    /**
      * The floorLookup method does something similar to nearestLookup but when it looks for the closest it always looks for a number smaller than it.
      * @param {number} time - The beat number.
      * @example
      * qMap.floorLookup(4) //'C'
      * qMap.floorLookup(5) //'C'
      * qMap.floorLookup(6) //'D'
      * qMap.floorLookup(10) //'D'
      * qMap.floorLookup(11) //'D'
    */
    floorLookup(time) {
        let lookupTime = time;
        let output = undefined;
        if (lookupTime >= this.keyspan)
            {output = this.values[this.values.length - 1]}
        else if (lookupTime < this.keys[0])
            {output = this.values[0]}
        else {
            let filteredTime = this.keys.filter(x => x <= lookupTime);
            if (filteredTime[0] == undefined) {filteredTime = [0]};
            output = this.values[(filteredTime.length - 1)]
            }
        return output
    }
    /**
      * Takes a number as an input and will look for a number in the keys array that is closest to it compared to the others. It will then take the index of that number and return the value array using that index.
      * @param {number} time - The beat number.
      * @example
      * qMap.nearestLookup(4) //'C'
      * qMap.nearestLookup(5) //'D'
      * qMap.nearestLookup(6) //'D'
      * qMap.nearestLookup(10) //'D'
      * qMap.nearestLookup(11) //'D'
    */
    nearestLookup (time) {
        let lookupTime = time;
        let output = undefined;
        if (lookupTime >= this.keys[this.keys.length - 1])
            {output = this.values[this.values.length - 1]}
        else if (lookupTime < this.keys[0])
            {output = this.values[0]}
        else {
            let filteredTime = this.keys.filter(x => x <= lookupTime);
            if (filteredTime[0] == undefined) {filteredTime = [0]};
            let lower = filteredTime[filteredTime.length - 1];
            let higher = this.keys[filteredTime.length]
            if ((lookupTime - lower) < (higher - lookupTime))
                {output = this.values[(filteredTime.length - 1)]}
            else {output = this.values[(filteredTime.length)]}
            }
        return output
    }
    /**
      * nearestLookup but the numbers are wrapped.
      * @param {number} time - Number to lookup
    */
    nearestWrapLookup (time){
        return this.nearestLookup(time % this.keyspan)
    }
    /**
      * floorLookup but the numbers are wrapped.
      * @param {number} time - Number to lookup
    */
    floorWrapLookup (time){
        return this.floorLookup(time % this.keyspan)
    }
    isEqualTo (otherMap){
        if (otherMap instanceof QuantizedMap === false){
            return false
        }
        else if (otherMap.keyspan === this.keyspan && R.equals(otherMap.keys, this.keys) === true && R.equals(otherMap.values, this.values) === true){
            return true
        }
        else {
            return false
        }
    }
}

/**
   * A helper function for navigating QuantizedMap. It will tell you which key will be used at a specific time when using the wrapLookup method.
   * @param {QuantizedMap} qm - QuantizedMap to filter through.
   * @param {number} time - The argument for the wrapLookup.
   * @example
   * console.log(whichWrapKey(new QuantizedMap(10, [0, 2, 4, 6, 8], ['A', 'B', 'C', 'D']), 2)) //2
   * console.log(whichWrapKey(new QuantizedMap(10, [0, 2, 4, 6, 8], ['A', 'B', 'C', 'D']), 3)) //2
   * console.log(whichWrapKey(new QuantizedMap(10, [0, 2, 4, 6, 8], ['A', 'B', 'C', 'D']), 10)) //0
   * console.log(whichWrapKey(new QuantizedMap(10, [0, 2, 4, 6, 8], ['A', 'B', 'C', 'D']), 12) //2
*/
function whichWrapKey(qm, time) {
    let lookupTime = time%qm.keyspan;
    let filteredTime = qm.keys.filter(x => x <= lookupTime);
    if (filteredTime[0] == undefined) {filteredTime = [0]};
    return filteredTime[filteredTime.length - 1]
    }

// time needs to be remaindered by the keyspan!
function calculateDensity (env, playerName, time) {
    let dGraphs = env.currentDensityGraphs.map(x => env.densityGraphs[x]);
    //console.log(dGraphs);
    let densityFuncMaps = dGraphs.map((x) => {
        if (Object.keys(x).includes(playerName)) {return x[playerName]}
        else if (Object.keys(x).includes('default')) {return x.default}
        // this has to be a QuantizedMap
        // else {return x => 1}
        else {return linearFunctionQuantizedMap([new Point(0,1), new Point (1,1)]) }
    });
    let densityFuncs = densityFuncMaps.map(x => [(x.floorLookup(time%x.keyspan)).func,x.keyspan])
    let densities = densityFuncs.map(x => x[0](time%x[1]))
    return A.mean(densities)
}

/**
  * Helps to make a rhythmMap in QuantizedMap form.
  * @param {number} minIOI - The minimum value of the IOI
*/
function makeRhythmMap (minIOI, ratios, deltas) {
    let stack = densityStack(minIOI,ratios,deltas);
    let absolutes = stack.map(deltaToAbsolute);
    let densities = stack.map(densityFromDeltas)
    let rows = stack.map((x, i) => {
        return new QuantizedMap(absolutes[i][0],absolutes[i][1],stack[i])
    })
    return new QuantizedMap(densities[0],R.reverse(densities),R.reverse(rows))
}
//Might be wrong don't know how to test.

//------------------------------------------------------------------------------
// stochastic rhythmMap functions

function generateSeed (onsetValues, seedLengths) {
    let seedLength = A.pick(seedLengths);
    return A.pickN(seedLength, onsetValues)
}

function generatePhrase (onsetValues, seedLengths, noOfSeeds, phraseLength) {
    let seeds = A.buildArray(noOfSeeds, x => generateSeed(onsetValues, seedLengths));
    return A.takeTo(phraseLength,R.flatten(seeds))
}

function generateAndAddRhythms(env, n, baseName, onsetValues, minIOI, ratios, seedLengths, noOfSeeds, phraseLength) {
    let names = A.buildArray(n, x => baseName + x);
    let rhythms = A.buildArray(n, x => generatePhrase(onsetValues,seedLengths,noOfSeeds,phraseLength));
    let rhythmMaps = rhythms.map(r => makeRhythmMap(minIOI, ratios, r));
    names.forEach((name,i) => {return env.rhythmMaps[name] = rhythmMaps[i]})
}


//------------------------------------------------------------------------------
// getting IOIs

function getRemainingDelta (densityMap, density, beat) {
    let wrappedBeat = beat % densityMap.floorLookup(density).keyspan;
    let currentDelta = densityMap.floorLookup(density).floorLookup(wrappedBeat);
    let currentKey = whichWrapKey(densityMap.floorLookup(density),beat);
    let remainingDelta = currentDelta - (wrappedBeat - currentKey);
    return remainingDelta
}

function getNextOnset (densityMap, density, beat) {
    return beat + getRemainingDelta(densityMap, density, beat)
    }

function getDelta (densityMap, density, beat) {
    return densityMap.floorLookup(density).wrapLookup(beat)
}

function getNextOnsetFromRhythmMap (densityMap, density, beat) {
    return beat + getRemainingDelta(densityMap, density, beat)
    }

function getIOI (env, player, beat) {
    let density = calculateDensity (env, player, beat);
    let rhythmMap = env.rhythmMaps[env.players[player].rhythmMap]
    let onset = getNextOnsetFromRhythmMap(rhythmMap,density,beat)
    return onset
}

function getNextOnsets (ioiFunc, player, beat, limitBeat, output, e) {
    if (beat > limitBeat) {
        return output
    }
    else {
        // replace getNextOnset with generalized IOIFunc here?
        let nextOnset = ioiFunc(player, beat, e);
        output = output.concat(nextOnset)
        return getNextOnsets (ioiFunc, player, beat+nextOnset, limitBeat, output, e)
    }
}

// probability of masking
function mask (player, maskMap, beat, probability) {
    let maskVal = maskMap.wrapLookup(beat);
    if (maskVal == true && (Math.random() < probability)) {maskVal = true} else {maskVal = false};
    //if (maskVal == true) {addLog(''+player+' function was masked at beat '+beat+'.')}
    return maskVal
}

function logRedError (){
    console.log("\x1b[31m", Object.values(arguments).join(), "\x1b[0m")
    return true
}
//color logging: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color/41407246#41407246

function checkIfObjectCompatibleWithQuantizedMap (item){
    if (item instanceof Object === false || item instanceof QuantizedMap){
        return false
    }
    let itemKeys = Object.keys(item)
    if (itemKeys.length !== 3) {
        return false
    }
    if (itemKeys.includes('keyspan') && itemKeys.includes('keys') && itemKeys.includes('values')){
        return (typeof itemKeys.keyspan === 'number' && itemKeys.keys instanceof Array && itemKeys.values instanceof Array)
    }
    return false
}


function checkIfObjectCompatibleWithPlayer (item){
    if (item instanceof Object === false || item instanceof Player){
        return false
    }
    let itemKeys = Object.keys(item)
    if (itemKeys.length <= 12) {
        return false
    }
    let necessaryPlayerVariables = [  'name',   'status',   'verbose',   'IOIFunc',   'rhythmMap',   'maskMap',   'action',   'cut',   'counter',   'interrupt',   'lastScheduledTime']
    return necessaryPlayerVariables.every(x => {
        return itemKeys.includes(x)
    })
}

function checkArrayForQuantizedMapAndConvert (arr){
    return arr.map(x => {
        if (checkIfObjectCompatibleWithQuantizedMap(x) === true){
            return convertObjectToQuantizedMap(x)
        }
        return x
    })
}

function convertObjectToQuantizedMap (obj){
    if (typesOfItemsInArray(obj.values).object !== undefined){
        obj.values = checkArrayForQuantizedMapAndConvert(obj.values)
    }
    return new QuantizedMap(obj.keyspan, obj.keys, obj.values)
}

function countCharacterBeforeIndex(str, index, char) {
    let countBefore = 0;
    // Count occurrences before the index
    for (let i = 0; i < index; i++) {
        if (str[i] === char) {
            countBefore++;
        }
    }
    return countBefore;
}

function countCharacterAfterIndex(str, index, char) {
    let countAfter = 0;
    // Count occurrences after the index
    for (let i = index + 1; i < str.length; i++) {
        if (str[i] === char) {
            countAfter++;
        }
    }
    return countAfter;
}

function checkIfVariableIsInString (string, varToCheckFor){
    let varIndex = string.indexOf(varToCheckFor)
    if (countCharacterBeforeIndex(string, varIndex, "'") % 2 != 0 || countCharacterBeforeIndex(string, varIndex, `"`) % 2 !== 0 || countCharacterBeforeIndex(string, varIndex, "`") % 2 !== 0){
        return true
    }
    else if (countCharacterAfterIndex(string, varIndex, "'") % 2 != 0 || countCharacterAfterIndex(string, varIndex, `"`) % 2 !== 0 || countCharacterAfterIndex(string, varIndex, "`") % 2 !== 0){
        return true
    }
    return false
}

function checkIfStringIsArrowFunction (string){
    if (string.includes('=>') === false){
        return false
    }
    return !checkIfVariableIsInString(string, '=>')
}

function checkForAnonymousFunctionInString (string){
    let splitString = string.trim().split(' ').filter(str => str !== "");
    if (splitString[0] === 'function' && splitString[1][0] === '(' && splitString[splitString.length - 1].includes('}')){
        return true
    }
    else if (splitString[0] === 'async' && splitString[1] === 'function' && splitString[2][0] === '(' && splitString[splitString.length - 1].includes('}')){
        return true
    }
    else if (splitString[0] === 'function*' && splitString[1][0] === '(' && splitString[splitString.length - 1].includes('}')){
        return true
    }
    else if (splitString[0] === 'async' && splitString[1] === 'function*' && splitString[2][0] === '(' && splitString[splitString.length - 1].includes('}')){
        return true
    }
}

function checkForNormalFunctionInString (string){
    let splitString = string.trim().split(' ').filter(str => str !== "");
    if (splitString[0] === 'function' && splitString[2][0] === '(' && splitString[splitString.length - 1].includes('}')){
        return true
    }
    else if (splitString[0] === 'async' && splitString[1] === 'function' && splitString[3][0] === '(' && splitString[splitString.length - 1].includes('}')){
        return true
    }
    else if (splitString[0] === 'function*' && splitString[2][0] === '(' && splitString[splitString.length - 1].includes('}')){
        return true
    }
    else if (splitString[0] === 'async' && splitString[1] === 'function*' && splitString[3][0] === '(' && splitString[splitString.length - 1].includes('}')){
        return true
    }
}

function checkIfStringIsAFunction (string){
    let splitString = string.trim().split(' ').filter(str => str !== "");
    if (splitString.length === 0){
        return false
    }
    if (splitString[splitString.length - 1].includes('}') === false){
        return false
    }
    else if (checkForAnonymousFunctionInString(string) === true){
        return true
    }
    else if (checkForNormalFunctionInString(string) === true){
        return true
    }
    else if (checkIfStringIsArrowFunction(string) === true){
        return true
    }
    else {
        return false
    }
}

function convertStringToFunction (string){
//     let functionResult; 
//         try{
//             functionResult = new Function(string)
//         }
//         catch (err){
//             if (err.toString().includes('Function statements require a function name')){
//                 functionResult = new Function(addAAfterFunction(string))
//             }
//         }
     return new Function('return (' + string + ')')()
//     return new Function('return (' + string + ')').bind(module.exports)()
//         return (1, eval)('return (' + string + ')')()
}

function checkDefaultRhythmMap(keyspan, keys, values){
    if (checkAllItemsType(values, 'number')){
        return true
    }
    else {
        throw new Error('Expected values to be an array of numbers')
        return false
    }
}

function checkNoteMap (keyspan, keys, values){
    if (checkAllItemsType(values, 'array') === false){
        throw new Error('Expected values array to be filled with arrays which contain numbers')
        return false
    }
    else if (values.map((x, i) => {return checkAllItemsType(x, 'number')}).includes(false)){
        throw new Error('Expected items in arrays in values to be filled with numbers. ex. [[number], [number]]')
        return false
    }
    else {
        return true
    }
}

function checkRhythmPatternMap (keyspan, keys, values){
    if (checkAllItemsType(values, 'boolean')){
        return true
    }
    else {
        throw new Error('Expected an values array to be filled with booleans true or false')
        return false
    }
}

function checkMaskMap (keyspan, keys, values){
    if (checkAllItemsType(values, 'boolean')){
        return true
    }
    else {
        throw new Error('Expected an values array to be filled with booleans true or false')
        return false
    }
}

function checkSongMap (keyspan, keys, values, e){
    if (checkAllItemsType(values, 'string') === false){
        throw new Error ('Invalid items in values array. Expected an array filled with strings.')
        return false
    }
    else if (values.every((x, i) => {if (e.chordMaps[x] === undefined){
        throw new Error (x + ' is not a property name of musicalEnvironment.chordProgressions. Fix index ' + i)
        return false
        }
        return true
    }) === false){
        throw new Error ('Invalid items in values array. Expected name of a property in musicalEnvironment.chordProgressions')
        return false
    }
    else {
        return true
    }
}

function checkChordMap (keyspan, keys, values){
    if (checkAllItemsType(values, 'string') === false){
        throw new Error ('Invalid items in values array. Expected an array filled with chords in form of strings.')
    }
    else if (values.map((x, i) => {
        if (Chord.getChord(x).empty === true){
            console.log('Item ' + i + ' of the value array is not a chord')
            return false
        }
        return true
    }).includes(false)){
        throw new Error('Items in the value array include variables which are not chords.')
        return false
    }
}

function checkControlChangeMap (keyspan, keys, values){
        if (checkAllItemsType(values, 'Array') === false){
            throw new Error ('Invalid items in values array. Expected an array filled with arrays which are filled with objects. The objects should be filled with two variables controller and value. Both should be numbers.')
            return false
        }
        else if (values.map((x, i) => {
            return x.map((o, c) => {
            let incorrectTypes = false
            if (typeof o.controller !== 'number' || o.controller < 0 || o.controller > 127){
                console.log('The controller value of ' + c + ' should a a number 0-127.')
                incorrectTypes = true
            }
            if (typeof o.value !== 'number' || o.value < 0 || o.value > 127){
                console.log('The value of the variable value ' + c + 'should a a number 0-127.')
                incorrectTypes = true
            }
            if (incorrectTypes === true){
                return true
            }
        })}).flat().includes(true)){
            throw new Error ('Invalid items in values array. Expected objects with two variables controller and value. Both numbers 0-127.')
            return false
        }
    else {
        return true
    }
}

function checkMidiProgramMap (keyspan, keys, values){
    if (checkAllItemsType(values, 'Array') === false){
        throw new Error('Expected value array to contain arrays with numbers in it. [[Number], [Number]]')
        return false
    }
    else if (values.map((x, i) => { return x.map((n, c) => {
        if (findItemType(n) !== 'number'){
            console.log('Values[' + i + '][' + c + '] is not a number')
            return false
        }
        return true
    })}).flat().includes(false)){
        throw new Error('Expected value array to contain arrays with numbers in it. [[Number], [Number]]')
        return false
}
    else {
        return true
    }
}

function checkModeMap (keyspan, keys, values, e){
    if (checkAllItemsType(values, 'string') === false){
        throw new Error ('Invalid items in values array. Expected an array filled with names of modeFilters in form of strings.')
        return false
    }
    else if (values.map((x, i) => {
        if (e.modeFilters[x] === undefined){
            console.log('Item ' + i + ' of the value array is not a variable name in modeFilters.')
            return false
        }
        return true
    }).includes(false)){
        throw new Error ('Items in the value array include names that are not in modeFilters.')
        return false
    }
    else {
        return true
    }
}

function checkRootMap (keyspan, keys, values){
    if (checkAllItemsType(values, 'string') === false){
        throw new Error ('Invalid items in values array. Expected an array filled with english letters that represent musical letter notation in form of strings.')
        return false
    }
    else if (values.map((x, i) => {
        let foundNote = Note.get(x)
        if (foundNote.empty === true){
            console.log('Item ' + i + ' of the value array is not an english letter that represents musical letter notation')
            return false
        }
        return true
    }).includes(false)){
        throw new Error('There are items in the value array that are not english letters that represent the musical letter notation.')
        return false
    }
    else{
        return true
    }
}

function checkModeFilter (keyspan, keys, values){
    if (checkAllItemsType(values, 'number') === false){
        throw new Error ('All items in values in values array should be numbers between and including 0-11')
        return false
    }
    else if (values.map((x, i) => {
        if (x > 11 || x < 0){
            console.log('Item', i , 'in value array not between and including 0-11')
            return false
        }
    }).includes(false)){
        throw new Error ('All items in values in values array should be numbers between and including 0-11')
        return false
    }
    else {
        return true
    }
}

/** Class representing MusicalEnvironments */
class MusicalEnvironment {
    /**
      * Creates MusicalEnvironments. Remember to call setupScheduler(e)
      * @example let e = new MusicalEnvironment()
    */
    constructor (){
        this.players = {};
        this.actions = {"default": function (midiOutput, b, e){
                console.log('Hi this is the default action function being triggered')
                console.log('This is the midiOutput: ', midiOutput)
                console.log('This is the beat: ', e.currentBeat())
            }
        };
        this.IOIs = {};
        this.densityGraphs = {};
        this.rhythmMaps = {};
        this.maskMaps = {};
//         this.superDirtPath = this.findSuperDirtSamples();
        this.samples = undefined;
        this.sampleKits = {};
        this.samplePatterns = {'default': new QuantizedMap(4, [0], [{ name: '808bd', index: 4}])},
        this.samplePatternCount = 0;
        this.samplePatternStore = {};
        this.currentDensityGraphs = [];
        this.timeSignature = 4;
        this.currentTempo = 120;
        this.beatOfChangeToCurrentTempo = undefined;
        this.timeOfChangeToCurrentTempo = undefined;
        this.scheduler = new TaskTimer(20);
        this.lookahead = 0.1;
        this.scheduledPlayers = [];
        this.root = "A";
        this.mapConnectionsToPlayerVariables = {
            name: 'players',
            IOIFunc: 'IOIs',
            densityGraph: 'densityGraphs',
            action: 'actions',
            velocityMap: 'velocityMaps',
            samplePattern: 'samplePatterns',
            noteMap: 'noteMaps', 
            octaveMap: 'octaveMaps',
            channelMap: 'channelMaps',
            polyphony: 'maxPolyphonyMaps',
            noteDurationMap: 'noteDurationMaps',
            modeMap: 'modeMaps',
            rootMap: 'rootMaps',
            chordMap: 'chordMaps',
            legatoMap: 'legatoMaps',
            midiOutput: 'midiOutputs',
        }
//         this.environmentVariableTypes = {
//             'players': Player,
//             'actions': 'function',
//             'IOIs': 'function',
//             'densityGraphs': QuantizedMap,
//             'rhythmMaps': QuantizedMap,
//             'maskMaps': QuantizedMap,
//             'superDirtPath': 'string',
//             'samples': undefined,
//             'sampleKits': Object,
//             'samplePatterns': QuantizedMap,
//             'samplePatternCount': 'number',
//             'samplePatternStore': Object,
//             'currentDensityGraphs': Array,
//             'timeSignature': 'number',
//             'currentTempo': 'number',
//             'beatOfChangeToCurrentTempo': 'number',
//             'timeOfChangeToCurrentTempo': 'number',
//             'scheduler': TaskTimer,
//             'lookahead': 'number',
//             'scheduledPlayers': Array,
//             'root': 'string',
//             'mapConnectionsToPlayerVariables': Object,
//             'tasksQueue': QuantizedMap,
//             'websocketTaskPlayer': 'string',
//             'channelMaps': QuantizedMap,
//             'midiOutputs': Array,
//             'midiInputs': Array,
//             'velocityMaps': QuantizedMap,
//             'noteMaps': QuantizedMap,
//             'octaveMaps': QuantizedMap,
//             'maxPolyphonyMaps': QuantizedMap,
//             'rhythmPatterns': QuantizedMap,
//             'noteDurationMaps': QuantizedMap,
//             'controlChangeMaps': QuantizedMap,
//             'chordMaps': QuantizedMap,
//             'songMaps': QuantizedMap,
//         }
        this.tasksQueue = {}
        this.websocketTaskPlayer = undefined
    }
    /**
      * Returns the current beat of the MusicalEnvironment.
    */
    currentBeat () {
        let elapsed = now() - this.timeOfChangeToCurrentTempo;
        return timeToBeats(this.currentTempo, elapsed) + this.beatOfChangeToCurrentTempo
    }
    /**
      * Changes the tempo of the MusicalEnvironment.
      * @param {number} tempo - New tempo of the current MusicalEnvironment
    */
    changeTempo(tempo) {
        this.beatOfChangeToCurrentTempo = this.currentBeat ();
        this.timeOfChangeToCurrentTempo = now();
        // this.beatOfChangeToCurrentTempo = beatOfChangeToCurrentTempo + timeToBeats(timeSinceTempoChange())
        console.log("TEMPO CHANGE! time: " + this.timeOfChangeToCurrentTempo + "; beat: " + this.beatOfChangeToCurrentTempo);
        this.currentTempo = tempo;
    }
    /**
      * Returns the action function of a specific player in this MusicalEnvironment
      * @param {string} player - Player name.
    */
    getAction (player) {
        // console.log("running action for player " + player + " at beat " + this.currentBeat())
        return this.actions[(this.players[player].action)];
    }
    /**
      * Returns the IOI function of a specific player in this MusicalEnvironment.
      * @param {string} player - Player name.
    */
    getIOIFunc (player) {
        return this.IOIs[(this.players[player].IOIFunc)];
    }
    /**
      * Schedules events for the a specific player in this MusicalEnvironment.
      * @param {string} player - Player name.
    */
    scheduleEvents (player) {
        let e = this
//         console.log("scheduling " + player);
        let ioiFunc = this.getIOIFunc (player);
        let onsets = getNextOnsets(ioiFunc,player, this.currentBeat(), this.currentBeat() + timeToBeats(this.currentTempo,this.lookahead),[], e);
        let onsetsAfterLastScheduled = onsets.filter(x => x > this.players[player].lastScheduledTime);
//         console.log('onsetsAfterLastScheduled', onsetsAfterLastScheduled)
        if (player.verbose == true) {
        console.log(" -------------------------------------------------------------------------- " );
        console.log("current beat: " + this.currentBeat());
        console.log("onsets after last scheduled: " + onsetsAfterLastScheduled)
        };
        if (onsetsAfterLastScheduled[0] !== undefined) {
            this.players[player].lastScheduledTime = R.last(onsetsAfterLastScheduled);
            // run the masking here
            //let currentMaskMap = this.maskMaps[this.players[player].maskMap];
            //let unmaskedOnsets = onsetsAfterLastScheduled.filter(t => (mask(player,currentMaskMap,(t),1)) != true);
            let unmaskedOnsets = onsetsAfterLastScheduled;
            let times = unmaskedOnsets.map(x => beatsToTime(e.currentTempo, x - (e.currentBeat())));
            if (player.verbose == true) { console.log("these are the times for events of player " + player + ": " + times)};
            //if (player == 'kick') {console.log(unmaskedOnsets)}
//             console.log('times', times)
            times.forEach(
                (t,i) => {
//                     console.log('hi here', player)
                    setTimeout(x => (this.getAction(player))(player,unmaskedOnsets[i], this),
                    Math.max(1000 * (t - now()),0))
                }
            );
        };
        if (player.verbose == true) { console.log("last scheduled time: " + this.lastScheduledTime)}
    }
    /**
      * Starts the scheduler for the MusicalEnvironment.
    */
    startScheduler () {
        this.timeOfChangeToCurrentTempo = now();
        this.beatOfChangeToCurrentTempo = 0;
        this.scheduler.start()
    }
    /**
      * Stops the scheduler for the MusicalEnvironment.
    */
    stopScheduler () {
        this.timeOfChangeToCurrentTempo = undefined;
        this.beatOfChangeToCurrentTempo = undefined;
        //this.lastScheduledTime = 0;
        this.scheduler.stop()
    }
    /**
      * MusicalEnvironment starts playing a specific player.
      * @param {string} player - Player name.
    */
    play (player) {
        if (this.players[player].status == "playing")
            {console.log("Player " + this.players[player].name + " is already playing!")}
        else {
            this.scheduledPlayers = this.scheduledPlayers.concat(player);
            this.players[player].status = "playing";
            this.players[player].startTime = now();
        }
    }
    /**
      * MusicalEnvironment stops a a specific player from playing.
      * @param {string} player - Player name.
    */
    stop (player) {
        if (this.players[player].status == "stopped")
            {    console.log("Player " + this.players[player].name + " is not playing!")}
        else {
//             this.scheduledPlayers = A.removeItem(this.scheduledPlayers,player)
            this.scheduledPlayers = A.removeAllInstance(this.scheduledPlayers,player)
            this.players[player].status = "stopped";
            this.players[player].startTime = undefined;
            this.players[player].lastScheduledTime = 0;
        }
    }
    /**
      * Returns an array of all the player names.
    */
    allPlayers () {
        return Object.keys(this.players)
    }
    /** Returns an array full of arrays. Each sub array contains the player name and their status. All the player names and their status also gets logged into the console.
    */
    allPlayerStatus () {
        Object.keys(this.players).forEach(x => console.log(x,this.players[x].status))
        return Object.keys(this.players).map(x => [x,this.players[x].status])
    }
    /**
      * Returns an array of all the names of players that are currently playing.
    */
    playingPlayers () {
       let ps = this.allPlayerStatus ();
       let withStatus = ps.filter(p => p[1] == 'playing')
       return withStatus.map(p => p[0])
    }
    /**
      * Starts playing all the player names in the array.
      * @param {array} ps - An array of player names.
    */
    playN (ps) {
        ps.forEach(p => this.play(p))
    }
    /**
      * Stops playing all the player names in the array.
      * @param {array} ps - An array of player names.
    */
    stopN (ps) {
        ps.forEach(p => this.stop(p))
    }
    /**
      * All players start playing.
    */
    playAll () {
        this.allPlayers().forEach(p => this.play(p))
    }
    /**
      * All players stop playing.
    */
    stopAll () {
        this.allPlayers().forEach(p => this.stop(p))
    }
    /**
      * Stops playing all the player names in the array after checking if the players exist inside the MusicalEnvironment.
      * @param {array} ps - An array of player names.
    */
    solo (ps) {
        this.stopN(this.allPlayers().filter(p => !A.matchesOneOf(ps,p)))
    }
    /**
      * Toggles the state of a specific player. If that player is playing it will be stopped. If that player is stopped, it will start playing.
      * @param {string} p - Player name.
    */
    togglePlayer (p) {
       if (this.players[p].status == 'playing') {this.stop(p)} else {this.play(p)}
    }
    findSuperDirtSamples (){
        let foundPath = this.getSuperDirtSamplesPath()
        if (fs.existsSync(foundPath) === false){
            throw new Error('Superdirt samples directory not found. Please install the superdirt samples and manually set superdirt directory path by: e.superDirtPath = "filePath"')
            return undefined
        }
        else if (fs.readdirSync(foundPath).length === 0){
            throw new Error('Superdirt samples directory empty. Please manually set superdirt directory path by: e.superDirtPath = "filePath"')
            return undefined
        }
        else {
            return foundPath
        }
    }
    getSuperDirtSamplesPath () {
        let type = os.type()
        if (type === 'Darwin'){
            return path.join(os.homedir(), 'Library', 'Application Support', 'SuperCollider', 'downloaded-quarks', 'Dirt-Samples');
        }
        else if (type === 'Windows_NT'){
            return path.join(os.homedir(), 'AppData', 'Local', 'SuperCollider', 'downloaded-quarks', 'Dirt-Samples');
        }
        else if (type === 'Linux'){
            return path.join(os.homedir(), '.local', 'share', 'SuperCollider', 'downloaded-quarks', 'Dirt-Samples');
        }
        return undefined
    }
    checkingAddMapToMusicalEnvironmentArguments (objectName, mapName, keyspan, keys, values){
        if (objectName === undefined || typeof objectName !== 'string'){
            throw new Error('Invalid objectName type. Expected string.')
        }
        else if (this[objectName] === undefined){
            throw new Error('Variable does not exist in MusicalEnvironment. Please fill in one of the variables that exist and uses QuantizedMap(s). To check find all variables, do Object.keys(musicalEnvironment)')
        }
        if (mapName === undefined || typeof mapName !== 'string'){
            throw new Error('Invalid mapName type. Expected string.')
        }
        if (keyspan === undefined){
            console.warn('kepspan is undefined will automatically use last item of the keys array as keyspanb.')
        }
        else if (typeof keyspan !== 'number'){
            throw new Error('Invalid keyspan type. Expected number')
        }
        if (keys instanceof Array === false){
            throw new Error('Invalid keys type. Expected number array')
        }
        else if (keys.every(x => typeof x === 'number') === false){
            throw new Error('Invalid keys type. Expected number array')
        }
        if (values instanceof Array === false){
            throw new Error('Invalid values type. Expected array')
        }
        //differentiating between object and array from: https://stackoverflow.com/a/7803271/19515980
    //     console.info('Preliminary checks have passeed.')
    }
    createDefaultRhythmMap (objectName, mapName, keyspan, keys, values){
        if (checkDefaultRhythmMap(keyspan, keys, values)){
            this.rhythmMaps[mapName] = new QuantizedMap(1, [1], [new QuantizedMap(keyspan, keys, values)])
            return true
        }
        else {
            return false
        }
    }
    createSubarrayMap (objectName, mapName, keyspan, keys, values){
        if (checkAllItemsType(values, 'array')){
            this[objectName][mapName] = new QuantizedMap(keyspan, keys, values)
            return true
        }
        else{
            throw new Error('Expected values array to be filled with arrays which contain numbers')
            return false
        }
    }
    createNoteMaps (objectName, mapName, keyspan, keys, values){
        if (checkNoteMap(keyspan, keys, values)){
            this[objectName][mapName] = new QuantizedMap(keyspan, keys, values)
            return true
        }
        else {
            return false
        }
    }
    createRhythmPatternMap (objectName, mapName, keyspan, keys, values){
        if (checkRhythmPatternMap(keyspan, keys, values)){
            this.rhythmPatterns[mapName] = new RhythmPattern(mapName, keyspan, keys, values)
            return true
        }
        else {
            return false
        }
    }
    createDefaultMaskMap (objectName, mapName, keyspan, keys, values){
        if (checkMaskMap(keyspan, keys, values)){
            this.maskMaps[mapName] = new QuantizedMap(keyspan, keys, A.flipBooleans(values))
            return true
        }
        else {
            return false
        }
    }
    createSongMap (objectName, mapName, keyspan, keys, values){
        if (checkSongMap(keyspan, keys, values, this)){
            this.songMaps[mapName] = new QuantizedMap(keyspan, keys, values)
            return true
        }
        else {
            return false
        }
    }
    createDefaultMap (objectName, mapName, keyspan, keys, values){
            this[objectName][mapName] = new QuantizedMap(keyspan, keys, values)
    }
    createModeFilters (objectName, mapName, keyspan, keys, values){
        if(checkModeFilter(keyspan, keys, values)){
            this[objectName][mapName] = new QuantizedMap(keyspan, keys, values)
            return true
        }
        else {
            return false
        }
    }
    checkVariableFor (variableName, mapName){
        this[variableName][mapName] !== undefined
    }
    createControlChangeMap (objectName, mapName, keyspan, keys, values){
        if (checkControlChangeMap(keyspan, keys, values)){
            this.controlChangeMaps[mapName] = new QuantizedMap(keyspan, keys, values)
            return true
        }
        else {
            return false
        }
    }
    createChordMap (objectName, mapName, keyspan, keys, values){
        if (checkChordMap(keyspan, keys, values)){   
            this.chordMaps[mapName] = new QuantizedMap(keyspan, keys, values) 
        }
        else {
            return false
        }
    }
    createModeMap (objectName, mapName, keyspan, keys, values){
        if (checkModeMap(keyspan, keys, values, e)){
            this.modeMaps[mapName] = new QuantizedMap(keyspan, keys, values)
            return false
        }
        else {
            return false
}
    }
    createRootMap (objectName, mapName, keyspan, keys, values){
        if (checkRootMap(keyspan, keys, values)){
            let reformattedValues = values.map((x, i) => {
                return Note.get(x).name
            })
            this.rootMaps[mapName] = new QuantizedMap(keyspan, keys, reformattedValues)
            return true
        }
        else {
            return false
        }
    }
    createMidiProgramMap(objectName, mapName, keyspan, keys, values){
        if (checkMidiProgramMap(keyspan, keys, values)){
            this.midiProgramMaps[mapName] = new QuantizedMap(keyspan, keys, values)
            return true
        }
        else {
            return false
        }
    }
    addMap (objectName, mapName, keyspan, keys, values, verbose){
        this.checkingAddMapToMusicalEnvironmentArguments(objectName, mapName, keyspan, keys, values)
        switch (objectName){
            case'rhythmMaps':
                this.createDefaultRhythmMap(objectName, mapName, keyspan, keys, values)
                break;
            case 'noteMaps':
                this.createNoteMaps(objectName, mapName, keyspan, keys, values)
                break;
            case 'rhythmPatterns':
                this.createRhythmPatternMap(objectName, mapName, keyspan, keys, values)
            case 'maskMaps':
                this.createDefaultMaskMap(objectName, mapName, keyspan, keys, values)
                break;
            case 'songMaps':
                this.createSongMap(objectName, mapName, keyspan, keys, values)
                break;
            case 'chordMaps':
                this.createChordMap(objectName, mapName, keyspan, keys, values)
                break;
            case 'controlChangeMaps':
                this.createControlChangeMap(objectName, mapName, keyspan, keys, values)
                break;
            case 'midiProgramMaps':
                this.createMidiProgramMap(objectName, mapName, keyspan, keys, values)
                break;
            case 'modeMaps':
                this.createModeMap(objectName, mapName, keyspan, keys, values)
                break;
            case 'rootMaps':
                this.createRootMap(objectName, mapName, keyspan, keys, values)
                break;
            case 'modeFilters':
                this.createModeFilters(objectName, mapName, keyspan, keys, values)
                break;
             case 'midiInputs':
                throw new Error('Use the updateMidiInputList function while passing the MusicalEnvironment as an argument without it assigning to anything. Like this: updateMidiInputList(nameOfMusicalEnvironment)')
                break;
             case 'midiOutputs':
                throw new Error('Use the updateMidiOutputList function while passing the MusicalEnvironment as an argument without it assigning to anything. Like this: updateMidiOutputList(nameOfMusicalEnvironment)')
                break;
             case 'legatoMaps':
             case 'modeFilters':
             case 'octaveMaps':
             case 'channelMaps':
             case 'velocityMaps':
             case 'maxPolyphonyMaps':
             case 'noteDurationMaps':
                this.createDefaultMap(objectName, mapName, keyspan, keys, values);
                break;
             default:
                throw new Error(objectName + 'not supported by addMap method. Supported variables include most if not all the variables that end with "Maps". Exceptions include, rhythmPatterns, chordProgressions, modeFilters.');
        }
        if (verbose !== false){
            console.log('Successfully created ', objectName, ' named ', mapName)
        }
        return true
    }
    checkMap (objectName, mapName, keyspan, keys, values){
        let e = this
        let namesToCheck = Object.keys(e[objectName]).map(x => {
            if (x.includes(mapName) === true){
                return x
            }
        })
        let correctMap = new QuantizedMap(keyspan, keys, values)
        let currentMap = e[objectName][mapName]
        if (currentMap === undefined){
            return undefined
        }
        else if (correctMap.isEqualTo(currentMap) === true){
            return true
        }
        let name = false
        namesToCheck.every(x => {
            if (correctMap.isEqualTo(e[objectName][x]) === true){
                name = x
                return false
            }
            return true
        })
        return name
    }
    convertMusicalEnvironmentToString (){
        let e = this
        let env = {}
        Object.keys(e).forEach(x => {
            if (e[x] instanceof Object && typeof e[x][Object.keys(e[x])[0]] === 'function'){
                env[x] = {}
                Object.keys(e[x]).forEach(v => {
                    env[x][v] = e[x][v].toString()
                })
            }
            else if (e[x] instanceof TaskTimer === false){
                env[x] = JSON.stringify(e[x])
            }
            else {
                env[x] = e[x].toString()
            }
        })
        return env
    }
    saveMusicalEnvironmentToFile (filePath){
        fs.writeFileSync(filePath, JSON.stringify(this.convertMusicalEnvironmentToString))
        return true
    }
    //this was considered (inspect has potential?): https://mattbatman.com/programmatically-writing-javascript-files-in-node/
    convertObjectToPlayer (name, playerObj){
        let currentPlayer = new Player(name)
        Object.keys(playerObj).forEach(v => {
            currentPlayer[v] = playerObj[v]
        })
        return currentPlayer
    }
    readPlayerFromFile (playersString){
        let e = this
        let players = JSON.parse(playersString)
        Object.keys(players).forEach(x => {
            e.players[x] = this.convertObjectToPlayer(x, players[x])
        })
    }
    readFunctionsFromFile (funcs, variableName){
        let e = this
//         let actionFuncs = JSON.parse(actionString)
        Object.keys(funcs).forEach(x => {
            return new Function('return (' + string + ')')()
        })
    }
    readQuantizedMapsFromFile (obj, variableName){
        let e = this
        if (typeof obj === 'string'){
            obj = JSON.parse(R.clone(obj))
        }
        let objKeys = Object.keys(obj).forEach(x => {
            if (checkIfObjectCompatibleWithQuantizedMap(obj[x]) === true){
                e[variableName][x] = convertObjectToQuantizedMap(obj[x])
            }
            else {
                e[variableName][x] = obj[x]
            }
        })
        return true
    }
    generalConvert (item){
         try{
             let parsedString = JSON.parse(item)
             return parsedString
         }
         catch{
            return item
         }
    }
    detectAndConvertString (string){
//         if (string === 'true' || string === 'false' || string === 'null' || string === 'undefined'){
//             return JSON.parse(string)
//         }
        if (typeof string !== 'string'){
            return string
        }
        else if (checkIfStringIsAFunction(string) === true){
            return convertStringToFunction(string)
        }
        else {
            return this.generalConvert(string)
        }
    }
    detectAndConvertObject (obj, name){
        if (obj instanceof Object === false){
            return obj
        }
        all(obj).forEach(x => {
//             console.log(x, obj[x])
            obj[x] = this.detectAndConvert(obj[x], x)
        })
        if (checkIfObjectCompatibleWithQuantizedMap(obj) === true){
            console.log('here yo', obj)
            console.log(obj, name    )
            return convertObjectToQuantizedMap(obj)
        }
        else if (checkIfObjectCompatibleWithPlayer(obj) === true){
            return this.convertObjectToPlayer(name, obj)
        }
        else {
            return this.generalConvert(obj)
        }
    }
    detectAndConvert (item, name){
        if (item instanceof Object){
            return this.detectAndConvertObject(item, name)
        }
        else if (typeof item === 'string'){
            return this.detectAndConvertString(item, name)
        }
        else {
            return item
        }
    }
    readObjectFromFile (parentContainer, variableName){
        Object.keys(parentContainer).forEach(x => {
            this[variableName][x] = this.detectAndConvert(parentContainer[x], x)
        })
    }
    readArrayFromFile (parentContainer, variableName){
        parentContainer.forEach(x => {
            this[variableName][x] = this.detectAndConvert(parentContainer[x], x)
        })
    }
    readMusicalEnvironmentFromFile (filePath){
        let convertedE = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        let itemsToRead = A.removeFirstInstance(Object.keys(convertedE), 'scheduler')
        itemsToRead = A.removeFirstInstance(itemsToRead, 'superDirtPath')
        itemsToRead = A.removeFirstInstance(itemsToRead, 'midiOutputs')
        itemsToRead = A.removeFirstInstance(itemsToRead, 'midiInputs')
//         this.readPlayerFromFile(convertedE.players)
//         this.readFunctionsFromFile(convertedE.actions, 'actions')
//         this.readFunctionsFromFile(converedE.IOIs, 'IOIs')
        itemsToRead.forEach(x => {
            let parentContainer = convertedE[x]
            if (parentContainer[0] === '{' && parentContainer[parentContainer.length - 1] === '}') {
                this[x] = {}
                this.readObjectFromFile(JSON.parse(parentContainer), x)
            }
            else if (parentContainer instanceof Object){
                this[x] = {}
                this.readObjectFromFile(parentContainer, x)
            }
            else if (parentContainer[0] === '[' && parentContainer[parentContainer.length - 1] === ']'){
                this[x] = []
                this.readArrayFromFile(JSON.parse(parentContainer), x)
            }
            else if (parentContainer instanceof Array){
                this[x] = []
                this.readArrayFromFile(parentContainer, x)
            }
            else {
                this[x] = this.detectAndConvertString(x)
            }
        })
        updateMidiInputList(this)
        updateMidiOutputList(this)
        console.log('itemsToRead', itemsToRead.sort())
    }
    startWebsocketTaskPlayer (){
        let taskPlayer = this.players[this.websocketTaskPlayer] 
        if (taskPlayer === undefined){
            logRedError('websocketTaskPlayer is not defined. Controlling MusicalEnvironment from the browser will not be available.')
            return false
        }
        if (this.tasksQueue[taskPlayer.assignedTask] === undefined){
//             console.log("\x1b[31m", , "\x1b[0m")
            logRedError('assignedTask in player is undefined or points to an undefined tasksQueue. Controlling MusicalEnvironment from the browser will not be available.')
            return false
        }
        if (taskPlayer.rhythmMap === undefined || this.rhythmMaps[taskPlayer.rhythmMap] === undefined){
            logRedError('rhythmMap is undefined. Controlling MusicalEnvironment from the browser will not be available')
            return false
        }
        if (taskPlayer.status === 'stopped'){
            this.play(this.websocketTaskPlayer)
        }
        return true
    }
    sendClientEnvInfo (clientIndex, server){
        this.startWebsocketTaskPlayer()
        wss.connectedMusicalEnvironment = this
        if (server !== undefined || typeof wss.address().port !== 'number'){
            console.log(server + ' is not a websocket server')
            return false
        }
        else if (typeof wss.address().port !== 'number'){
            console.log('wss is not a websocket server')
            return false
        }
        if (clientIndex === undefined){
            wss.clients.forEach(x => {
                x.send(JSON.stringify({action: 'showMusicalEnvInfo', info: this.convertMusicalEnvironmentToString()}))
            })
        }
        else if (clientIndex >= 0 && clientIndex < clients.length - 1){
            clients[clientIndex].send(JSON.stringify({action: 'showMusicalEnvInfo', info: this.convertMusicalEnvironmentToString()}))
        }
    }
    changeVerbose (state = true){
        Object.keys(this.players).forEach(x => {
            this.players[x].verbose = state
        })
    }
    findConnectedPlayers (player){
        let e = this
        let playersToPlay = []
        if (e.players[player].controlChangePlayer !== undefined){
            playersToPlay.push(e.players[player].controlChangePlayer)
        }
        if (e.players[player].midiProgramPlayer !== undefined){
            playersToPlay.push(e.players[player].midiProgramPlayer)
        }
        return playersToPlay
    }
    playWithConnected (player){
        let e = this
        if (e.players[player] === undefined){
            throw new Error('Player '+ player + ' not found. Could not run playWithConnected')
            return false
        }
        console.log('playing', [...this.findConnectedPlayers(player), player])
        this.playN([...this.findConnectedPlayers(player), player])
    }
    stopWithConnected (player){
        let e = this
        if (e.players[player] === undefined){
            throw new Error('Player '+ player + ' not found. Could not run stopWithConnected')
            return false
        }
        this.stopN([...this.findConnectedPlayers(player), player])
    }
    stopConnected (player){
        let e = this
        if (e.players[player] === undefined){
            throw new Error('Player '+ player + ' not found. Could not run stopConnected')
            return false
        }
        this.stopN(this.findConnectedPlayers(player))
    }
    playConnected (player){
        let e = this
        if (e.players[player] === undefined){
            throw new Error('Player '+ player + ' not found. Could not run playConnected')
            return false
        }
        this.playN(this.findConnectedPlayers(player))
    }
    verifyMapConnectionsToPlayerVariablesObject (playerToVerifyWith){
        let e = this
        let player = this.players[playerToVerifyWith]
        Object.keys(this.mapConnectionsToPlayerVariables).forEach(x => {
            if (player[x] === undefined){
                checkIfUseVerboseLogging(player, 'Player variable ' + x + ' is undefined')
            }
            else if (e[this.mapConnectionsToPlayerVariables[x]] === undefined){
                checkIfUseVerboseLogging(player, 'Variable ' + e[this.mapConnectionsToPlayerVariables[x]] + ' not found in current MusicalEnvironment')
            }
        })
    }
    checkUndefinedPlayerProperties (playerName){
        let player = this.players[playerName]
        return Object.keys(this.mapConnectionsToPlayerVariables).map(x => {
            if (player[x] === undefined){
                checkIfUseVerboseLogging(player, 'Player variable ' + x + ' is undefined')
                return x
            }
        }).filter(item => item !== undefined)
    }
    replaceUndefinedPlayerPropertiesWith (playerName, replaceWith = 'default'){
        let player = this.players[playerName]
        this.checkUndefinedPlayerProperties(playerName).forEach(x => {player[x] = replaceWith})
    }
}

function addMapsTests (e, verbose = true){
    e.addMap("rhythmMaps", 'hi', 4, [0, 1, 2, 3], [1, 1, 1, 1], verbose)
    e.addMap("noteMaps", 'hi', 4, [0, 1, 2, 3], [[1], [1], [1], [1]], verbose)
    e.addMap("rhythmPatterns", 'hi', 4, [0, 1, 2, 3], [true, false, true, true], verbose)
    e.addMap("maskMaps", 'hi', 4, [0, 1, 2, 3], [true, false, true, true], verbose)
    e.addMap("songMaps", 'hi', 4, [0, 1, 2, 3], ['default', 'default', 'exampleChords', 'default'], verbose)
    e.addMap("chordMaps", 'hi', 4, [0, 1, 2, 3], ['M', 'M', 'M', 'M'], verbose)
    e.addMap("controlChangeMaps", 'hi', 4, [0, 1, 2, 3], [[ { channel: 0, controller: 25, value: 123 } ],[ { channel: 0, controller: 25, value: 123 } ],[ { channel: 0, controller: 25, value: 123 } ],[ { channel: 0, controller: 25, value: 123 } ]], verbose)
    e.addMap("midiProgramMaps", 'hi', 4, [0, 1, 2, 3], [[2], [4], [6], [8]], verbose)
    e.addMap("modeMaps", 'hi', 4, [0, 1, 2, 3], ['chromatic', 'aeolian', 'dorian', 'blues'], verbose)
    e.addMap("rootMaps", 'hi', 4, [0, 1, 2, 3], ['A', 'B', 'C', 'D'], verbose)
    e.addMap("modeFilters", 'hi', 4, [0, 1, 2, 3], [1, 0, 5, 9], verbose)
    e.addMap("legatoMaps", 'hi', 4, [0, 1, 2, 3], [1, 1, 1, 1], verbose)
}

/**
  * Sets up the scheduler for the MusicalEnvironment.
  * @param musicalEnv - Variable name of MusicalEnvironment class.
*/
function setupScheduler (musicalEnv) {
        musicalEnv.scheduler.add([
            {
                id: 'schedulePlayers',       // unique ID of the task
                //tickInterval: musicalEnv.lookahead * 1000/20,
                tickInterval: 1,
                totalRuns: 0,      // (set to 0 for unlimited times)
                callback(task) {
                    // code to be executed on each run
                    //console.log("scheduled players " + musicalEnv.scheduledPlayers);
                    musicalEnv.scheduledPlayers.map(p => musicalEnv.scheduleEvents(p))
                }
            }
        ]);
    }

/** Class representing a Player. */
class Player {
    /**
      * Creates the player.
      * @param {string} name - Name of the player.
    */
    constructor(name) {
        this.name = name;
        this.status = "stopped";
        this.verbose = false;
        this.IOIFunc = "default";
        this.rhythmMap = "default";
        this.maskMap = "default";
        this.density = 1;
        this.densityGraph = "defaultTechno";
        this.action = "default";
        this.velocityMap = "default";
        this.samplePattern = undefined;
        this.cut = 0;
        this.counter = 0;
        this.interrupt = "default";
        this.startTime = undefined;
        this.lastScheduledTime = 0;
    }
}

/**
  * Converts beats to time.
  * @param {number} tempo - Current tempo. The current tempo of the MusicalEnvironment can be found out by running e.currentTempo
  * @param {number} beats - The beat to convert.
  * @example console.log(beatsToTime(100, 10)) //6
*/
function beatsToTime (tempo, beats) {
    let beatsPerSecond = (tempo/60);
    return beats/beatsPerSecond
}

/**
  * Converts time to beats.
  * @param {number} tempo - Current tempo. The current tempo of the MusicalEnvironment can be found out by running e.currentTempo
  * @param {number} time - The time to convert.
  * @example console.log(timeToBeats(80, 120)) //160
*/
function timeToBeats (tempo, time) {
    let beatsPerSecond = (tempo/60);
    return time * beatsPerSecond
}


//--------------------------------------------------------------------------

/**
  * Sets up Player for superDirt
  * @param env - MusicalEnvironment
  * @param {string} playerName - Name of a player in the MusicalEnvironment.
*/
function setupSuperDirtPlayer (env, playerName) {
        env.players[playerName] = new Player(playerName);
        env.players[playerName].maskMap = 'default'
        env.players[playerName].samplePattern = playerName;
        env.players[playerName].action = "superDirt";
        return playerName
}

/**
  * Sets up a simple sample pattern.
  * @param env - MusicalEnvironment
  * @param {string} playerName - Name of a player in the MusicalEnvironment.
  * @param {string} sampleName - Name of the sample.
  * @param {number} sampleIndex - Number of the sample.
*/
function simpleSamplePattern (env, playerName, sampleName, sampleIndex) {
        addSamplePattern (e, playerName, new QuantizedMap(4,[0],[{name: sampleName, index: sampleIndex}]));
        return playerName
}

/** Class representing a rhythm patter. */
class RhythmPattern {
    /**
      * Creates the rhythmPattern.
      * @param {string} n - Name of the rhythmPattern.
      * @param {number} l - Length of the the rhythmPattern.
      * @param {array} i - A number array representing IOIs.
      * @param {array} b - An array filled with the booleans "true" and "false".
    */
        constructor (n,l,i,b) {
                    this.patternName = n;
                    this.patternLength = l;
                    this.IOIs = i;
                    this.bools = b;
                    return this
        }
    /**
      * Adds this RhythmPattern to a player.
      * @param env - MusicalEnvironment.
      * @param {string} playerName - Name of the player to add to.
    */
        addToPlayer (env, playerName) {
            this.playerName = playerName
                    simpleRhythm (env, this.patternName, A.loopTo (this.patternLength,this.IOIs))
                    env.players[this.playerName].rhythmMap = this.patternName;
                    let mask = A.flipBooleans(this.bools);
                    env.players[this.playerName].maskMap = this.patternName;
                    env.maskMaps[this.patternName] = new QuantizedMap(this.patternLength,[0].concat(A.runningSum(0,this.IOIs)),mask)
        }
    /**
      * Adds to MusicalEnvironment but does not add to a player.
      * @param env - MusicalEnvironment.
      * @param {string} playerName - Name of the player to add to.
    */
        add (env, playerName) {
            this.playerName = playerName
                    simpleRhythm (env, this.patternName, A.loopTo (this.patternLength,this.IOIs))
                    let mask = A.flipBooleans(this.bools);
                    env.maskMaps[this.patternName] = new QuantizedMap(this.patternLength,[0].concat(A.runningSum(0,this.IOIs)),mask)
                }
}

/**
  * Creates a RhythmPattern
  * @param {object} argObj
  * @example createRhythmPattern({patternName: 'examplePattern', patternLength: 10, IOIs: [0, 1, 2, 3, 4], bools: [true, true, true, true]})
*/
function createRhythmPattern (argObj) {
    let pattern = new RhythmPattern (
                        argObj.patternName,
                        argObj.patternLength,
                        argObj.IOIs,
                        argObj.bools)
    return pattern
}

function simpleRhythmPattern (env, rhythmPatternArgObj) {
    let pattern = createRhythmPattern (rhythmPatternArgObj);
    pattern.add(env)
    return pattern.patternName
}


addToModuleExports({
  all,
  MusicalEnvironment,
  Player,
  Point,
  QuantizedMap,
  RhythmPattern,
  absoluteToDelta,
  addLog,
  addLog2,
  allNotesOff,
  beatsToTime,
  calculateDensity,
  createRhythmPattern,
  decreaseDensity,
  deltaToAbsolute,
  densityFromDeltas,
  densityStack,
  generateAndAddRhythms,
  generatePhrase,
  generateSeed,
  getAllAlphabets,
  getDelta,
  getIOI,
  getNextOnset,
  getNextOnsetFromRhythmMap,
  getNextOnsets,
  getRemainingDelta,
  increaseDensity,
  lerpValues,
  lerpedRange,
  linearFunctionArrayFromPoints,
  linearFunctionFromPoints,
  linearFunctionQuantizedMap,
  lsystem,
  makeRhythmMap,
  mask,
  now,
  parseItem,
  parseString,
  randomCharacterMapFromArray,
  randomMap,
  randomRangeInt,
  recursiveDecreaseDensity,
  recursiveIncreaseDensity,
  rewriteString,
  rulesGenerator,
  setupScheduler,
  setupSuperDirtPlayer,
  simpleRhythm,
  simpleRhythmPattern,
  simpleSamplePattern,
  structuredClone,
  timeToBeats,
  variousLsystems,
  whichWrapKey,
  ymd,
   version,
    checkKonduktivaVersionNumber,
    logRedError,
    checkIfObjectCompatibleWithQuantizedMap,
    checkArrayForQuantizedMapAndConvert,
    checkIfStringIsAFunction,
    checkIfStringIsArrowFunction,
    checkIfVariableIsInString,
    convertStringToFunction,
    checkIfObjectCompatibleWithPlayer,
    convertObjectToQuantizedMap,
    checkDefaultRhythmMap,
    checkNoteMap,
    checkRhythmPatternMap,
    checkSongMap,
    checkChordMap,
    checkControlChangeMap,
    checkModeMap,
    checkRootMap,
    checkMidiProgramMap,
    checkModeFilter,
    addMapsTests,
    workerLsystem,
    tempFiles,
    updateTempFilesVariable,
})

// --------------------------------------------------------------------------
//testingKonduktiva-revised.js

function defaultIOI (player, beat, e) {
    return getIOI (e, player, beat)
}


function setUpDefaultIOIsForMusicalEnvironment (e){
    e.IOIs.default = defaultIOI
    e.IOIs.kick = beat => getNextOnsetFromRhythmMap(densityTest5,1.2,beat)
    e.IOIs.snare = beat => getNextOnsetFromRhythmMap(densityTest5,1.2,beat)
}


function setUpDefaultCurrentDensityGraphsForMusicalEnvironment (e){
    e.currentDensityGraphs = ['mediumGlobal','defaultTechno']
    e.currentDensityGraphs = ['lowGlobal']
    e.currentDensityGraphs = ['mediumGlobal']
    e.currentDensityGraphs = ['higherGlobal']
    e.currentDensityGraphs = ['variedGlobalLong']
    e.currentDensityGraphs = ['veryHighGlobal']
    e.currentDensityGraphs = ['veryHighGlobal','rampUp8']
    e.currentDensityGraphs = ['higherGlobal','defaultTechno']
    e.currentDensityGraphs = ['veryHighGlobal','defaultTechno']
    e.currentDensityGraphs = ['lowGlobal','defaultTechno']
    e.currentDensityGraphs = ['mediumGlobal','defaultTechno']
}


function setUpDefaultDensityGraphsForMusicalEnvironment (e){
    e.densityGraphs.superLow =
        {
            snare: linearFunctionQuantizedMap(
                [new Point(0,0.2)
                ,new Point(1.5,0.1)
                ,new Point(3,0.2)
                ,new Point(4,0.3)
                ])
        }
    e.densityGraphs.defaultTechno =
        {
            synth: linearFunctionQuantizedMap(
                [new Point(0,0.5)
                ,new Point(1.5,1)
                ,new Point(3,0.6)
                ,new Point(4,1.5)
                ])
           ,drum: linearFunctionQuantizedMap(
                [new Point(0,0.2)
                ,new Point(1.7,0.2)
                ,new Point(2.5,0.5)
                ,new Point(4,0.8)
                ])
        }
    e.densityGraphs.sparse =
        {
            synth: linearFunctionQuantizedMap(
                [new Point(0,0.1)
                ,new Point(1.5,0.2)
                ,new Point(3,0.3)
                ,new Point(4,0.4)
                ])
           ,drum: linearFunctionQuantizedMap(
                [new Point(0,0.1)
                ,new Point(1.7,0.2)
                ,new Point(2.5,0.3)
                ,new Point(4,0.4)
                ])
        }
    e.densityGraphs.lowGlobal =
        {
           default: linearFunctionQuantizedMap(
                [new Point(0,0.3)
                ,new Point(2.7,0.4)
                ,new Point(3.1,0.35)
                ,new Point(4,0.6)
                ])
           , kick: linearFunctionQuantizedMap(
                [new Point(0,0.3)
                ,new Point(2.7,0.4)
                ,new Point(3.1,0.35)
                ,new Point(4,0.6)
                ])
        }
    e.densityGraphs.mediumGlobal =
        {
           default: linearFunctionQuantizedMap(
                [new Point(0,1)
                ,new Point(2.7,1.5)
                ,new Point(3.1,1)
                ,new Point(4,2)
                ,new Point(4,2)
                ,new Point(6.5,1.5)
                ,new Point(8,2.3)
                ])
        }
    e.densityGraphs.variedGlobalLong =
        {
           default: linearFunctionQuantizedMap(
                [new Point(0,0.5)
                ,new Point(2.7,1.5)
                ,new Point(3.1,0.7)
                ,new Point(4,3)
                ,new Point(5.1,0.8)
                ,new Point(6.1,3.8)
                ,new Point(8,5)
                ,new Point(9,0.7)
                ,new Point(9.7,1.5)
                ,new Point(10.1,1)
                ,new Point(12,2)
                ,new Point(13,3)
                ,new Point(14.7,3.5)
                ,new Point(15.3,1)
                ,new Point(16,5)
                ])
        }
    e.densityGraphs.higherGlobal =
        {
           default: linearFunctionQuantizedMap(
                [new Point(0,2)
                ,new Point(2.7,2.5)
                ,new Point(3.2,1)
                ,new Point(4,4)
                ])
           ,snare: linearFunctionQuantizedMap(
                [new Point(0,0.2)
                ,new Point(2.7,0.4)
                ,new Point(3.3,0.5)
                ,new Point(4,0.8)
                ])
        }
    e.densityGraphs.veryHighGlobal =
        {
           default: linearFunctionQuantizedMap(
                [new Point(0,3)
                ,new Point(2.7,3.5)
                ,new Point(3.3,1)
                ,new Point(4,5)
                ])
           ,snare: linearFunctionQuantizedMap(
                [new Point(0,0.5)
                ,new Point(2.7,0.8)
                ,new Point(3.3,0.6)
                ,new Point(4,0.5)
                ])
        }
    e.densityGraphs.rampUp8 =
        {
           default: linearFunctionQuantizedMap(
                [new Point(0,2)
                ,new Point(2.7,3)
                ,new Point(5.3,4)
                ,new Point(6.5,5)
                ])
        }
    // heating starts as mediumGlobal copy
    e.densityGraphs.heating =
        {
           default: linearFunctionQuantizedMap(
                [new Point(0,1)
                ,new Point(2.7,1.5)
                ,new Point(3.1,1)
                ,new Point(4,2)
                ,new Point(4,2)
                ,new Point(6.5,1.5)
                ,new Point(8,2.3)
                ])
        }
    e.densityGraphs.defaultTechno =
        {
            synth: linearFunctionQuantizedMap(
                [new Point(0,0.5)
                ,new Point(1.5,1)
                ,new Point(3,0.6)
                ,new Point(4,1.5)
                ])
           ,snare: linearFunctionQuantizedMap(
                [new Point(0,0.2)
                ,new Point(1.0,0.3)
                ,new Point(2.5,1.2)
                ,new Point(4,0.4)
                ,new Point(6.5,0.6)
                ,new Point(8,1.7)
                ])
           ,test: linearFunctionQuantizedMap(
                [new Point(0,2)
                ,new Point(2.7,2.5)
                ,new Point(3.2,1)
                ,new Point(4,4)
                ])
           ,kick: linearFunctionQuantizedMap(
                [new Point(0,0.4)
                ,new Point(1.7,0.6)
                ,new Point(2.5,0.9)
                ,new Point(4,1.4)
                ])
           //,kick: linearFunctionQuantizedMap(
           //     [new Point(0,0.2)
           //     ,new Point(1.7,0.2)
           //     ,new Point(2.5,0.5)
           //     ,new Point(4,0.8)
           //     ])
           ,hat: linearFunctionQuantizedMap(
                [new Point(0,3)
                ,new Point(2.7,3.5)
                ,new Point(3.3,2)
                ,new Point(4,5)
                ,new Point(6,4)
                ,new Point(8,8)
                ])
        }
    e.densityGraphs.mediumGlobal =
        {
           default: linearFunctionQuantizedMap(
                [new Point(0,1)
                ,new Point(2.7,1.5)
                ,new Point(3.1,1)
                ,new Point(4,2)
                ])
        }
}


function linearFunctionQuantizedMap (pointArray) {
    let times = pointArray.map(t => t.x);
    return new QuantizedMap(times[times.length-1], times, linearFunctionArrayFromPoints(pointArray))
}

myPoints = [
    new Point (0,0.25)
    , new Point (2,0.6)
    , new Point (3,0.3)
    , new Point (3.9,1.2)
    , new Point (4,1.4)
]

aDensityFuncTSM = linearFunctionQuantizedMap (myPoints)

function runTime (tsm, time) {
    let func = aDensityFuncTSM.wrapLookup(time).func;
    return func(time%(tsm.keyspan))
}

function changeRhythmPattern (env, players, rhythm) {
    players.forEach(p => env.players[p].rhythmMap = rhythm)
}

function setUpDefaultMaskMapsForMusicalEnvironment (e){
    e.maskMaps.default = new QuantizedMap(4,[0],[false])
}

function setUpDefaultActionToMusicalEnvironment (e){
    e.actions.superDirt = (p,b) => {if ((mask(p, e.maskMaps[e.players[p].maskMap] ,(e.currentBeat()),1)) != true) {playSuperDirtSample (e,p,b)}}
}

function setUpDefaultRhythmMapsToMusicalEnvironment (e) {
    e.rhythmMaps.straight = new QuantizedMap(1,[1],[new QuantizedMap(4,[0,1,2,3],[1,1,1,1])])
    let straightEights = A.buildArray(7,i => 0.5)
    let straight16ths = A.buildArray(15,i => 0.25)
    e.rhythmMaps.straight2 = new QuantizedMap(1,[1],[new QuantizedMap(4,[0].concat(A.runningSum(0,straightEights)),[0.5].concat(straightEights))])
    e.rhythmMaps.straight3 = new QuantizedMap(1,[1],[new QuantizedMap(4,[0].concat(A.runningSum(0,straight16ths)),[0.25].concat(straight16ths))])
}

addToModuleExports({
  aDensityFuncTSM,
  changeRhythmPattern,
  defaultIOI,
  linearFunctionQuantizedMap,
  runTime,
  setUpDefaultActionToMusicalEnvironment,
  setUpDefaultCurrentDensityGraphsForMusicalEnvironment,
  setUpDefaultDensityGraphsForMusicalEnvironment,
  setUpDefaultIOIsForMusicalEnvironment,
  setUpDefaultMaskMapsForMusicalEnvironment,
  setUpDefaultRhythmMapsToMusicalEnvironment
})

//--------------------------------------------------------------------------
//konduktiva-superdirt-revised.js

var udpPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 57121,
    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

// Open the socket.
// udpPort.open();

function gatherBySubstring (inputArray, substringArray) {
    return inputArray.filter(x => substringArray.some(y => x.includes(y)))
}

// let samples = fs.readdirSync(superDirtSamplesPath, { withFileTypes: true }).filter(de => de.isDirectory())

let percVoices = ['kick','snare','perc','hat'];
let synthVoices = ['sub','stab1','stab2','atmo'];

function buildSampleArray (dirtSamplePath) {
    let rawSampleDirs = fs.readdirSync(dirtSamplePath, { withFileTypes: true }).filter(de => de.isDirectory());
    let outputArray = [];
    rawSampleDirs.forEach ((x) => {
        let dirEntries = fs.readdirSync(dirtSamplePath+x.name);
        outputArray.push({name: x.name, number: dirEntries.length});
    });
    let sampleNames = rawSampleDirs.map(x => x.name);
    return {sampleList: sampleNames, sampleData:outputArray}
}

// let samples4 = buildSampleArray (superDirtSamplesPath)

// uses a random sample from the named directories in substringArray, see selectedSamples below
function samplePattern (allSamples, patternLength, substringArray, poolSize, stepLengthPool) {
    let prePool = gatherBySubstring (allSamples.sampleList, substringArray).map(x => allSamples.sampleData.find(y => y.name === x));
    // let pool = pickN(poolSize, gatherBySubstring (allSamples, substringArray));
    let pool = A.pickN(poolSize, prePool);
    let stepLengths = [];
    while (A.sum(stepLengths) < patternLength) {
        stepLengths.push(A.pick(stepLengthPool))
    };
    let selectedSampleDirs = stepLengths.map(x => A.pick(pool));
    let selectedSamples = selectedSampleDirs.map((x) => {return {name: x.name, index: randomRangeInt(0,x.number - 1)}});
    let absolutes = deltaToAbsolute(A.takeTo(patternLength,stepLengths));
    return new QuantizedMap(absolutes[0],absolutes[1],selectedSamples)
}

function playSuperDirtSample (env, player, beat) {
    let cb = env.currentBeat()
    let currentSample = env.samplePatterns[env.players[player].samplePattern].wrapLookup(cb);
    var msg = {
            address: '/play2',
            args: [
              { type: 's', value: 's' },
              //{ type: 's', value: randomSample},
              //{ type: 's', value: pick(kicks)},
              { type: 's', value: currentSample.name},
              //{ type: 's', value: '10000Tss'},
              //{ type: 's', value: pick(atmos)},
              //{ type: 's', value: pick(stabs)},
              //{ type: 's', value: pick(fx.concat(stabs))},
              //{ type: 's', value: pick(fx.concat(atmos))},
              { type: 's', value: 'n' },
              { type: 'i', value: currentSample.index },
              //{ type: 'i', value: 0},
              //{ type: 's', value: 'cps' },
              //{ type: 'f', value: (1000* Math.random()) },
              { type: 's', value: 'speed' },
              { type: 'f', value: 1},
              //{ type: 'f', value: (0.5 + (3* Math.random())) },
              //{ type: 'f', value: 0.5},
              //{ type: 'f', value: 0.25},
              //{ type: 'f', value: pick([0.25,0.5,1,2]) * 0.25},
              //{ type: 'f', value: pick([0.5,1,2,4]) * 0.25},
              //{ type: 'f', value: pick([0.5,1,2,4]) * 0.5},
              { type: 's', value: 'gain' },
              { type: 'f', value: 1 },
              { type: 's', value: 'cut' },
              //{ type: 'f', value: pick([0,1,1,2]) }
              { type: 'f', value: env.players[player].cut}
              //{ type: 'f', value: 1 }
            ]
    };
    checkIfUseVerboseLogging(player, "Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
}

//playSuperDirtSample(e,'kick',0)

function addSamplePattern (env, patternName, sp) {
    env.samplePatterns[patternName] = sp
}

addToModuleExports({
    udpPort,
  addSamplePattern,
  buildSampleArray,
  gatherBySubstring,
  percVoices,
  playSuperDirtSample,
  samplePattern,
//   samples,
//   superDirtSamplesPath,
  synthVoices
})

// --------------------------------------------------------------------------
//defaultSuperDirtPlayers-revised.js

function setUpDefaultPlayersForMusicalEnvironments (e){
    let playerNames = ['kick', 'snare', 'perc', 'hat', 'sub', 'stab1', 'stab2', 'atmo']
    playerNames.forEach(x => {
        e.players[x] = new Player(x)
        e.players[x].rhythmMap = 'straight'
        e.players[x].samplePattern = x
        e.players[x].action = 'superDirt'
    })
    e.players.atmo.densityGraph = 'sparse';
    {
    e.players.kick.cut = A.pick([0,1,1,2])
    e.players.snare.cut = A.pick([3,4])
    e.players.perc.cut = A.pick([5,6])
    e.players.hat.cut = 7
    e.players.sub.cut = A.pick([8,8,8])
    e.players.stab1.cut = A.pick([9,9,10])
    e.players.stab2.cut = A.pick([9,9,10])
    e.players.atmo.cut = 11
        }
}

module.exports.setUpDefaultPlayersForMusicalEnvironments = setUpDefaultPlayersForMusicalEnvironments

// --------------------------------------------------------------------------
//utilities-string.js:

/**
  * Count how many of the same letters there are before a new one is found:
  * @param {string} string - the string it counts from.
  * @example
  * console.log(countLetterChanges('kiisijsdvsddddddggggaa')) //[ 1, 2, 1, 1, 1, 1, 1, 1, 1, 6, 4, 2 ]
  * console.log(countLetterChanges('aaaaalllllfdh')) //[ 5, 5, 1, 1, 1 ]
*/
function countLetterChanges(string) {
  let counts = [];
  let stringArray = string.split('')
  let currentCount = 1;
  stringArray.forEach((x, i) =>{
    if (x !== string[i + 1] && string[i + 1] !== undefined) {
      counts.push(currentCount);
      currentCount = 1;
    }
    else if (string[i + 1] !== undefined){
      currentCount++;
    }
  })
  counts.push(currentCount); // Push the count of the last letter
  return counts;
}

/**
  * Shuffles a string in a random way
  * @param {string} str - The string to be shuffled
  * @example
  * console.log(shuffleString('abbbsdfhshfsdoih')) //bhfobsfsdbihsdah
  * console.log(shuffleString('HiHowAreYou')) //rHYwoeoHiAu
*/
function shuffleString(str) {
  let arr = str.split('');
  let len = arr.length;
  arr.forEach((x, c) =>{
    let i = len - 1 - c
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Use array destructuring for swapping
  })
  return arr.join('');
}

/**
  * Loops a string by a certain amount of times:
  * @param {number} times - Number of times the string should be repeated.
  * @param {string} string - The string that should be repeated.
  * @example
  * console.log(repeatString(2, 'Hi how are you')) //'Hi how are youHi how are you'
  * console.log(repeatString(3, 'Ha ')) //'Ha Ha Ha '
*/
function repeatString (times, string){
    return A.buildArray(times, x => {return string}).join('')
}

addToModuleExports({
 countLetterChanges, repeatString, shuffleString
})

// --------------------------------------------------------------------------
//utilities-music.js:

/**
  * Converts bars(music) to beats(music)
  * @param {numbers} beatsPerBar - Sets the beats per bar which the conversion uses.
  * @param {array} inputBars - Barsr to convert
  * @example console.log(barsToBeats(4, [0, 1, 2, 3])) //[ 0, 4, 8, 12 ]
*/
function barsToBeats(beatsPerBar, inputBars) {
    return inputBars.map(e => e *= beatsPerBar)
}

function melodyFromChordProgression (noteValues, iois){
    let notesToPlay = iois[1] - iois[0]
    notesToPlay += notesToPlay / 2
    return {notes: noteValues.map(x => {
        let chosenNotes = x.map(n => {return A.pick(x)})
        return chosenNotes
    }).flat(), iois: A.buildArray(iois.length, x => x * notesToPlay)}
}

addToModuleExports({
 barsToBeats, melodyFromChordProgression
})

// --------------------------------------------------------------------------
// utilities-general.js:

/**
  * Round a number to a specific number of decimal places.
  * @param {number} number - Number to round.
  * @param {number} decimalPlaces - Amount of decimal places to round numbe to.
  * @example console.log(roundTo(10.2332, 2)) //10.23
*/
function roundTo (number,decimalPlaces){
    let roundedNumber=number.toFixed(decimalPlaces);
    return JSON.parse(roundedNumber)
}

/**
  * Returns a random number between a range.
  * @param {number} min - Minimum amount the random number can be.
  * @param {number} max - Maximum amount the random number can be.
  * @param {number} decimalPlaces - The amount of decimal places the random number can have.
  * @example
  * console.log(randomRange(0, 4, 4)) //1.7395
  * console.log(randomRange(0, 4, 40)) //1.71246107249822
*/
function randomRange (min, max,decimalPlaces) {
    if (decimalPlaces==undefined){decimalPlaces=0}
      return roundTo(min + (max - min) * (Math.random()),decimalPlaces);
}

addToModuleExports({
randomRange, roundTo
})

// --------------------------------------------------------------------------
//lsystem.js:

async function waitFor (time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

/**
  * Generates an L-system for a number of generations based on a starting inputString and a set of rules.
  * @param {string} inputString - The axiom of the L-system.
  * @param {object} rules - The rules of the L-system.
  * @param {number} generations - The number of generations the L-system has.
  * @example
  * console.log(generativeParseString('a', {'a': 'ba', 'b': 'aaa'}, 5))
*/
function generativeParseString (inputString,rules,generations) {
    return Array.from({length: generations}, () => {
       inputString=parseString(inputString,rules)
        return inputString
   })[generations - 1]
}

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
async function generateRandomLsystemChordProgression (){
    let velocityString = await generateRandomLsystemString(20)
    let velocityData = countLetterChanges(velocityString)
    let boolsData = await generateLsystemBoolsData()
    boolsData = boolsData.split('')
    let octaveString = await generateRandomLsystemString(20)
    let octaveData = countLetterChanges(octaveString)
    let notesData = await generateLsystemNoteData()
    let noteDurationData = await generateLsystemNoteData()
    boolsData = A.resizeArray(notesData.length, boolsData)
    noteDurationData = A.resizeArray(notesData.length, noteDurationData)
    octaveData = A.resizeArray(notesData.length, octaveData).map(x => {return x * 2})
    velocityData = A.resizeArray(notesData.length, velocityData).map(x => {return x * (x * 10)})
    await waitFor(5)
    console.log('notesData', notesData)
    console.log('boolsData', boolsData)
    return new QuantizedMap(notesData.length, noteDurationData, notesData.map((x, i) => {return {data: [{note: x, octave: octaveData[i], velocity: velocityData[i]}], bool: boolsData[i] === 'a'}}))
}

let workerScript = `
// --------------------------------------------------------------------------
// -- worker.js
// --------------------------------------------------------------------------

const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

const A = require('array-toolkit')
/**
  * Round a number to a specific number of decimal places.
  * @param {number} number - Number to round.
  * @param {number} decimalPlaces - Amount of decimal places to round numbe to.
  * @example console.log(roundTo(10.2332, 2)) //10.23
*/
function roundTo (number,decimalPlaces){
    let roundedNumber=number.toFixed(decimalPlaces);
    return JSON.parse(roundedNumber)
}

/**
  * Returns a random number between a range.
  * @param {number} min - Minimum amount the random number can be.
  * @param {number} max - Maximum amount the random number can be.
  * @param {number} decimalPlaces - The amount of decimal places the random number can have.
  * @example
  * console.log(randomRange(0, 4, 4)) //1.7395
  * console.log(randomRange(0, 4, 40)) //1.71246107249822
*/
function randomRange (min, max,decimalPlaces) {
    if (decimalPlaces==undefined){decimalPlaces=0}
      return roundTo(min + (max - min) * (Math.random()),decimalPlaces);
}


function parseItem (input, rules) {
    if (Object.keys(rules).includes(input)) {
        return rules[input]}
    else {
        return input
    }
}
// let parseItem = (input,rules) => { if (Object.keys(rules).includes(input)) {return rules[input]} else {return input}}

// let parseString = (inputString,rules) => inputString.split("").map(x => parseItem(x,rules)).join().replace(/,/g,"")
function parseString (inputString, rules) {
    return inputString.split("").map(x => parseItem(x,rules)).join().replace(/,/g,"")
}

/**
  * Generates an L-system for a number of generations based on a starting inputString and a set of rules.
  * @param {string} inputString - The axiom of the L-system.
  * @param {object} rules - The rules of the L-system.
  * @param {number} generations - The number of generations the L-system has.
  * @example
  * console.log(generativeParseString('a', {'a': 'ba', 'b': 'aaa'}, 5))
*/
function generativeParseString (inputString,rules,generations) {
    return Array.from({length: generations}, () => {
       inputString=parseString(inputString,rules)
        return inputString
   })[generations - 1]
}

function generativeParseString(inputString, rules, generations) {
    let currentGeneration = inputString;
    while (generations > 0) {
        let tempGeneration = parseString(currentGeneration, rules);
        currentGeneration = tempGeneration;
        generations -= 1;
    }
    return currentGeneration;
}

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

//lsystem function with stale lsystem checks:
function generateRandomLsystemString (length = 30, pickedAlphabets){
    let configuration = generateRandomLSystemConfiguration(pickedAlphabets)
    if (configuration.startingLetters === generativeParseString(configuration.startingLetters, configuration.conditions, 1)){
        return configuration.startingLetters
    }
    let staleCounter = 0
//     console.log('configuration', configuration)
    let finalLsystem = ''
    let failedAttemps = 0
    while (finalLsystem.length < length && failedAttemps < 1000){
        failedAttemps += 1
        let newSystem = generativeParseString(configuration.startingLetters, configuration.conditions, 3 ** failedAttemps)
        if (staleCounter >= 5){
            return finalLsystem
        }
        else if (newSystem === finalLsystem){
            staleCounter += 1
        }
        else {
            staleCounter = 0
        }
        finalLsystem = newSystem
    }
    return finalLsystem
}

//generates alphabets for the lsystem chord progression:
function generateLsystemAlphabets (length = randomRange(2, 10)){
    let alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    return Array.from({length: length}, () => {
        return A.pick(alphabets)
    })
}

/**
  * Loops a string by a certain amount of times:
  * @param {number} times - Number of times the string should be repeated.
  * @param {string} string - The string that should be repeated.
  * @example
  * console.log(repeatString(2, 'Hi how are you')) //'Hi how are youHi how are you'
  * console.log(repeatString(3, 'Ha ')) //'Ha Ha Ha '
*/
function repeatString (times, string){
    return A.buildArray(times, x => {return string}).join('')
}

/**
  * Shuffles a string in a random way
  * @param {string} str - The string to be shuffled
  * @example
  * console.log(shuffleString('abbbsdfhshfsdoih')) //bhfobsfsdbihsdah
  * console.log(shuffleString('HiHowAreYou')) //rHYwoeoHiAu
*/
function shuffleString(str) {
  let arr = str.split('');
  let len = arr.length;
  arr.forEach((x, c) =>{
    let i = len - 1 - c
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Use array destructuring for swapping
  })
  return arr.join('');
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

//     parentPort.postMessage('Data received')
  let lsystemString = generateRandomLsystemString(workerData.length, workerData.pickedAlphabets)
  parentPort.postMessage(lsystemString);
  // Exit the worker thread (optional)
  process.exit();
`

//Generates lsystem in string for for for the lsystem chord progression:
/**
  * Generates an L-system of a specific length based on the pickedAlphabets.
  * @param {number} [length=30] - The minimum length of the L-system.
  * @param {array} pickedAlphabets - An array filled with letters.
  * @example
  * console.log(await generateRandomLsystemString()) //'qyppppyqyyqiqyppppyqyyqiqyppppyqyyqijqpiyqyppppyqyyqiqyppppyqyyqiqyppppyqyyqijyqqyppppyqyyqiqyppppyqyyqiqyppppyqyyqijypiip'
  * console.log(await generateRandomLsystemString(2)) //'jjuujuujuugjjjgjjjjuugjjjgjjjjuujuugjjjgjjjjuugjjjgujuujuujuugjjjgjjjjuugjjjgjjjjuujuugjjjgjjjjuugjjjg'
  * console.log(await generateRandomLsystemString(2, ['a'])) //'aaaaaaaaaaaaaaaa'
  * console.log(await generateRandomLsystemString(2, ['a', 'b'])) //'bbbbbbaababbaababbbaababbbbaababbaababbbaababbbbbaababbaababbbaababbbbbbbaababbaababbbaababbbbaababbaababbbaababbbbbaababbaababbbaababb'
*/
function generateRandomLsystemString(length = 30, pickedAlphabets){
    return new Promise((resolve, reject) => {
        if (isMainThread) {
          let inputData = {length: length, pickedAlphabets};
            let worker = new Worker(workerScript, {eval: true, workerData: inputData} )
            console.log('worker created',inputData)
          // Listen for messages from the worker thread
          worker.on('message', result => {
              console.log('worker done', result)
               resolve(result)
               worker.terminate()
          });
          worker.on('error', err => {
              console.log('worker crashed', err)
              // Reject the Promise with the error if something goes wrong
              reject(err);
              worker.terminate()
          });
          worker.postMessage(inputData);
        }
    })
}

//Generates bools data for the lsystem chord progression:
/**
  * Generatest L-system bools data. Returns an array filled with true or false booleans.
  * @example console.log(await generateLsystemBoolsData()) //[
  false, true,  false, true,  false,
  true,  false, true,  false, true,
  false, true,  false, true,  false,
  true,  true,  false, true,  false,
  true,  false, true,  false, true,
  false, true,  false, true,  false,
  true
]
*/
async function generateLsystemBoolsData (){
    let data = await generateRandomLsystemString(40, ['a', 'b'])
    data.split('').map(x => {
        if (x === 'a'){
            return true
        }
        else {
            return false
        }
    })
    return data
}

//generates note data for the lsystem chord progression:
async function generateLsystemNoteData (){
    let noteData = countLetterChanges(await generateRandomLsystemString(10) + await generateRandomLsystemString(10))
    console.log('noteData', noteData)
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
function generateLsystemAlphabets (length = randomRange(2, 10)){
    let alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    return Array.from({length: length}, () => {
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
function generateRandomLSystemConfiguration (pickedAlphabets = generateLsystemAlphabets()){
    let chosenAlphabets = pickedAlphabets
    let startingLetters = chosenAlphabets.map(x => {
        return repeatString(randomRange(1, 3), x)
    }).join('')
    let conditions = {}
    conditions[chosenAlphabets[0]] = generateCondition(chosenAlphabets, 0, 5) + chosenAlphabets[0]
    Array.from({length: randomRange(1, 5)}, () => {
        let rule = generateCondition(chosenAlphabets, 1, 3)
        conditions[rule] = generateCondition(chosenAlphabets, 0, 5)
    })
    return {conditions: conditions, startingLetter: shuffleString(startingLetters)}
}

function convertLsystemStringToNumbersViaAssignedLetters (chosenAlphabets, lsystem, availableNumbers){
    return lsystem.split('').map((x, i) =>{
        return availableNumbers[chosenAlphabets.indexOf(x)]
    })
}

async function generateLsystemByAssigningNumberToLetter (mode, octaves,length) {
    let chosenMode = Scale.get(mode.toLowerCase()).intervals.map(x => { return Interval.semitones(x)})
    let alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    let modeAlphabets = A.safeSplice(alphabets, alphabets.length, chosenMode.length)
    let modeData = convertLsystemStringToNumbersViaAssignedLetters(modeAlphabets, await generateRandomLsystemString(length, modeAlphabets), chosenMode)
    let octavesAlphabets = A.safeSplice(alphabets, alphabets.length, octaves.length)
    let octavesData = convertLsystemStringToNumbersViaAssignedLetters(octavesAlphabets,  await generateRandomLsystemString(length, octavesAlphabets), octaves)
    octavesData = A.resizeArray(modeData.length, octavesData)
    return modeData.map((x, i) =>{
        return {note: x, octave: octavesData[i]}
    })
}

addToModuleExports({
  convertLsystemStringToNumbersViaAssignedLetters,
  generateCondition,
  generateLsystemAlphabets,
  generateLsystemBoolsData,
  generateLsystemByAssigningNumberToLetter,
  generateLsystemNoteData,
  generateRandomLSystemConfiguration,
  generateRandomLsystemChordProgression,
  generateRandomLsystemString,
  generativeParseString,
  waitFor,
})

// --------------------------------------------------------------------------
//chords.js:

function addNoteMapFromChordMap(e, rootMapName, chordMapName, noteMapName) {
    let keyspan = e.rootMaps[rootMapName].keyspan;
    let keys = e.rootMaps[rootMapName].keys;
    let rootArray = e.rootMaps[rootMapName].values;
    let chords = [];
    let chordMapIndex = 0;
    rootArray.forEach(root => {
        chords.push(Chord.get(root + e.chordMaps[chordMapName].values[chordMapIndex]));
        chordMapIndex += 1;
    });
    let chordsIntervals = chords.map(c => c.intervals.map(x => Interval.semitones(x)));
    e.noteMaps[noteMapName] = new QuantizedMap(keyspan, keys, chordsIntervals);
}

function getChordComponents (values){
    let roots = [];
    let chords = [];
    values.forEach(x => {
        let both = Chord.tokenize(x)
        if (both[1].length == 0) {both[1] = 'M'}
        roots.push(both[0])
        chords.push(both[1])
    });
    return {
        roots: roots,
        //semitones: chordSemitones,
        qualities: chords
    }
}

//Yiler Function
function generateChords(root, octave, voicing, majorOrMinor) {
    let notes = Scale.get("C chromatic").notes 
    let keyScale = Scale.get(notes[root] + " " + majorOrMinor)
    let letterChords = [];
//     for (let i = 0; i < 12; i++) {
    Array.from({length: 12}).forEach((x, i) =>{
        if (i == 4 || i == 5) {
            letterChords.push(Chord.get(keyScale.notes[3] + voicing).notes.map(e => e + "" + octave))
        } else if (i == 8 || i == 9) {
            letterChords.push(Chord.get(keyScale.notes[4] + voicing).notes.map(e => e + "" + octave))
        } else {
            letterChords.push(Chord.get(keyScale.notes[0] + voicing).notes.map(e => e + "" + octave))
        }
    })
    let midiChords = letterChords.map(x => {
        return getMidiKeys(x)
    })
    return midiChords.map(x => {
            return x.map(c => {
                return {note: c % 12, octave: roundTo(c / 12)}
            })
    })
}

function generateChordsV2 (root, octave, progression) {
    let letterChords = Progression.fromRomanNumerals(root, progression);
    let noteChords = letterChords.map(chord => Chord.get(chord).notes);
    let midiChords = noteChords.map(c => c.map(n => Note.midi(n + "" + octave)));
    return midiChords
}

//Create noteDuration values for noteValueData
function createNoteSpans (noteValueData, e){
    noteValueData.noteDurationKeys = A.resizeArray(noteValueData.noteValues.length, noteValueData.noteDurationKeys)
//     noteValueData.bools = A.resizeArray(noteValueData.noteValues.length, noteValueData.bools)
    return noteValueData
}

//Creating notespan values from noteValueData:
function createNoteSpanValues (noteValueData, name, e){
    if (noteValueData.noteDurations !== undefined && noteValueData.noteDurationKeyspan !== undefined){
//         console.log('1aaaa')
    e.noteDurationMaps[name] = new QuantizedMap(noteValueData.noteDurationKeyspan, noteValueData.noteDurationKeys, noteValueData.noteDurations)
    }
    else if (noteValueData.noteDurations !== undefined && noteValueData.noteDurationKeyspan === undefined){
//         console.log('2')
//         console.log('noteDurations defined')
    e.noteDurationMaps[name] = new QuantizedMap(noteValueData.noteDurationKeys.length, noteValueData.noteDurationKeys, noteValueData.noteDurations)
    }
    else{
//         console.log('3')
    e.noteDurationMaps[name] = new QuantizedMap(noteValueData.noteDurationKeys.length, A.buildArray(noteValueData.noteDurationKeys.length, x => {return x}), noteValueData.noteDurationKeys)
    }
}

//Create quantizedMaps that have to do with notes and other things related to note:
function createNoteRelatedMaps (noteValueData, name, e){
    createNoteSpanValues(noteValueData, name, e)
    if (noteValueData.noteValuesKeys === undefined){
        noteValueData.noteValuesKeys = A.buildArray(noteValueData.noteValues.length, x => {return x})
    }
    e.noteMaps[name] = new QuantizedMap(noteValueData.noteValuesKeyspan, noteValueData.noteValuesKeys, noteValueData.noteValues)
}

//Create octave related things:
function createOctaveMaps (noteValueData, name, e){
    if (noteValueData.octaveMapKeys === undefined){
        e.octaveMaps[name] = new QuantizedMap(noteValueData.octave.length, A.buildArray(noteValueData.octave.length, x => {return x}), noteValueData.octave)
    }
    else {
        e.octaveMaps[name] = new QuantizedMap(noteValueData.octaveMapKeyspan, noteValueData.octaveMapKeys, noteValueData.octave)
    }
}

function createRootMap (noteValueData, name, e){
    if (noteValueData.rootMapKeys === undefined){
        e.rootMaps[name] = new QuantizedMap(noteValueData.rootMap.length, A.buildArray(noteValueData.rootMap.length, x => {return x}), noteValueData.rootMap)
    }
    else {
        e.rootMaps[name] = new QuantizedMap(noteValueData.rootMapKeyspan, noteValueData.rootMapKeys, noteValueData.rootMap)
    }
}

// function makeNote (note, octave, add){
//     const notes = ["C", "D", "E", "F", "G", "A", "B"];
//     let modifiedNote = note
//     if (add !== 0 && add !== undefined){
//         modifiedNote = notes[notes.indexOf(note.toUpperCase()) + (add - 1)]
//     }
//     return Note.get(modifiedNote + octave)
// }

//Generate the note related part of the configuration object to change chord progressions:
function noteRelatedNecessaryConfigurations (chosenProgression, configurationObj){
    configurationObj.rootNote = retreiveDataFromChosenProgressionValuesData('note', chosenProgression)
    configurationObj.noteValues = chosenProgression.values.map(x => {
        return x.data.map(b => {
            return b.note
        })
    })
    return configurationObj
}
//Generate the necessary configurations of the configuration object to change chord progressions:
function necessaryConfigurations (chosenProgression){
    let configurationObj = {bools: chosenProgression.values.map(x => {return x.bool})}
    configurationObj = noteRelatedNecessaryConfigurations(chosenProgression, configurationObj)
    configurationObj.total = chosenProgression.values.length
    configurationObj.octave = retreiveDataFromChosenProgressionValuesData('octave', chosenProgression)
    configurationObj.noteDurationKeyspan = chosenProgression.keyspan
    configurationObj.rhythmMapKeys = chosenProgression.keys
    return configurationObj
}

//Retreive data from chord progression variable in musical environment:
function retreiveDataFromChosenProgressionValuesData (dataToRetreive, chosenProgression){
    return chosenProgression.values.map(x => {
        return x.data.map(n => {
            return n[dataToRetreive]
        })
    })
}

//Generate the conditional configurations of the configuration object to change chord progressions:
function conditionalNoteConfigurations (chosenProgression, configurationObj){
    if (chosenProgression.values[0].data[0].noteDuration === undefined){
        let beatCounter = 0
        configurationObj.noteDurationKeys = []
        chosenProgression.keys.forEach(x => {
            configurationObj.noteDurationKeys.push(beatCounter)
            beatCounter += x
        })
    }
    else {
        configurationObj.noteDurationKeys = retreiveDataFromChosenProgressionValuesData('noteDuration', chosenProgression)
    }
    if (chosenProgression.values[0].data[0].noteDurations === undefined){
        configurationObj.noteDurations = chosenProgression.keys
    }
    else {
        configurationObj.noteDurations = retreiveDataFromChosenProgressionValuesData('noteDurations', chosenProgression)
    }
    if (chosenProgression.values[0].data[0].keySpan === undefined){
        configurationObj.rhythmMapValues = A.buildArray(chosenProgression.keys.length, x => {
            return 1})
    }
    else {
        configurationObj.rhythmMapValues = retreiveDataFromChosenProgressionValuesData('keySpan', chosenProgression)
    }
    return configurationObj
}

// //Generate configuration obj from chord progression:
// function assignChordProgressionToPlayer (playerName, chosenChordProgression){
//     let chosenProgression = e.chordMaps[chosenChordProgression]
//     let configurationObj = necessaryConfigurations(chosenProgression)
//     configurationObj = conditionalNoteConfigurations (chosenProgression, configurationObj)
//     if (chosenProgression.values[0].data[0].velocity === undefined){
//         configurationObj.velocity = [100, 100]
//     }
//     else {
//         configurationObj.velocity = chosenProgression.values.map(x => {
//             if (x.data[0].velocity <= 127){
//                 return x.data[0].velocity
//             }
//             else {
//                 return 127
//             }
//         })
//     }
//     if (chosenProgression.values[0].data[0].polyphony === undefined){
//         configurationObj.polyphonyMap = [10000000000000000000000, 10000000000000000000000]
//     }
//     else {
//         configurationObj.polyphonyMap = retreiveDataFromChosenProgressionValuesData('polyphony', chosenProgression)
//     }
//     return configurationObj
// }

function assignChordProgressionToPlayer (chosenChordProgression, e){
    let chosenProgression = e.chordMaps[chosenChordProgression]
    let configurationObj = sortIntoConfigurationObj(chosenProgression)
    configurationObj = inputOtherNecessaryConfigurationVariables(configurationObj)
    return configurationObj
}

function sortIntoConfigurationObj (chosenProgression){
    let configurationObj = {}
    configurationObj.octaves = chosenProgression.values.map(x => {return x.octaves})
    configurationObj.rootNote = chosenProgression.values.map(x => {return x.note})
    configurationObj.velocity = chosenProgression.values.map(x => {return x.velocity})
    configurationObj.rhythmMap = chosenProgression.keys
    configurationObj.total = chosenProgression.keyspan
    configurationObj.notespan = chosenProgression.keys
    return configurationObj
}

function inputOtherNecessaryConfigurationVariables (chosenProgression){
    configurationObj.velocity = [100]
    configurationObj.bools = [true, true]
    configurationObj.polyphony = [50, 50]
    configurationObj.modeMap = [0, 1, 2, 3, 4 ,5 , 6, 7, 8, 9, 10, 11, 12]
}

//No longer in use.
//Check current if it is time to change chord progressions
// function checkIfChangeChordProgression (e, b, player){
// //     console.log('song', player.song)
//     if (player.songMap === undefined){
//         return true
//     }
//     let correctCurrentChordProgression = e.songMaps[player.songMap].wrapLookup(b)
//     checkIfUseVerboseLogging(player, 'changin chord progression to' +  correctCurrentChordProgression)
// //     console.log('correct', correctCurrentChordProgression)
//     if (player.chordMap === correctCurrentChordProgression){
//         return true
//     }
//     else {
//         let defaultName = A.findMostFrequentItem(Object.values(player))
//     recordConfigurationDataIntoMusicalEnvironment(assignChordProgressionToPlayer(correctCurrentChordProgression, e), defaultName, e)
//         assignPlayerForMusicSynthesizerMidiOutput(e, 3, exampleMusicalEnvironmentsExtraConfig, defaultName)
//         player.chordMap = correctCurrentChordProgression
//     }
// }

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

function reformatIoisToRelative (iois){
    if (A.isArrayAscending(iois) === false){
        return iois
    }
    return iois.map((x, i) =>{
        if (iois[i + 1] !== undefined){
            return iois[i + 1] - x
        }
    }).slice(0, iois.length - 1)
}

function convertMusicalLettersToMidi (letterArray){
    if (typeof letterArray[0] !== 'string'){
        return letterArray
    }
    return letterArray.map(x => {
        return Note.midi(x)
    })
}

addToModuleExports({
    addNoteMapFromChordMap,
  assignChordProgressionToPlayer,
//   checkIfChangeChordProgression,
  conditionalNoteConfigurations,
  convertMusicalLettersToMidi,
  createNoteRelatedMaps,
  createNoteSpanValues,
  createNoteSpans,
  createOctaveMaps,
  createRootMap,
  generateChords,
  generateChordsV2,
  inputOtherNecessaryConfigurationVariables,
  necessaryConfigurations,
  noteRelatedNecessaryConfigurations,
  reformatIoisToRelative,
  retreiveDataFromChosenProgressionValuesData,
  separateOctaveAndRoot,
  sortIntoConfigurationObj,
})

// --------------------------------------------------------------------------
//rhythm.js:

//Create rhythm map related things:
function configureRhythmMapVariables (noteValueData, name, e){
    if (A.isArrayAscending(noteValueData.rhythmMap) === true){
        logRedError('Possible issue: rhythmMap should be the time of each note. Not in absolute time. Right now rhythmMap is ascending.')
    }
    if (noteValueData.rhythmMap !== undefined){
        let qData = deltaToAbsolute(noteValueData.rhythmMap)
//         e.addMap('rhythmMap', name, qData[0], qData[1], noteValueData.rhythmMap)
        return {keyspan: qData[0], IOIs: noteValueData.rhythmMap, bools: noteValueData.bools}
    }
    else if (noteValueData.total !== undefined && noteValueData.noteDuration !== undefined){
//         console.log('second')
//         e.addMap('rhythmMap', name, noteValueData.total, noteValueData.noteDuration, [...absoluteToDelta(noteValueData.noteDuration), ...noteValueData.total - noteValueData.noteDuration[noteValueData.noteDuration.length]])
        return {keyspan: noteValueData.total, IOIs: noteValueData.noteDuration, values: [...absoluteToDelta(noteValueData.noteDuration), ...noteValueData.total - noteValueData.noteDuration[noteValueData.noteDuration.length]], bools: noteValueData.bools}
    }
}

//color logging: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color/41407246#41407246
//Create mask map from note value data:
function createMaskMap (noteValueData, name, e){
    if (noteValueData.maskMapKeyspan === undefined || noteValueData.maskMapKeys === undefined){
        return false
    }
//     e.maskMaps[name] = new QuantizedMap(noteValueData.total)
    let currentMaskMap = {}
    if (noteValueData.maskMapKeys === undefined){
        currentMaskMap.keys = A.buildArray(currentMaskMap.keyspan + 1, x => {return x})
    }
    else {
        currentMaskMap.keys = noteValueData.maskMapKeys
    }
    currentMaskMap.values = A.resizeArray(noteValueData.maskMapKeyspan, noteValueData.bools)
//     currentMaskMap.values = flipBooleans(resizeArray(currentMaskMap.keyspan, noteValueData.bools))
    e.addMap('maskMaps', name, noteValueData.maskMapKeyspan, currentMaskMap.keys, currentMaskMap.values, false)
    return true
}

addToModuleExports({
createMaskMap, configureRhythmMapVariables
})

// --------------------------------------------------------------------------
//websocket.js:

//sources used(unsure)?:
//https://stackoverflow.com/questions/53518607/nodejs-datacloneerror-function-native-code-could-not-be-cloned

const WebSocketServer = require("ws");

//Send Messages to Clients:
function sendMessageToClients(message) {
    let formatted = JSON.stringify(message);
    //Send to all clients
    wss.clients.forEach((x) => {
        x.send(formatted);
    });
}

//receiveCommand:
function receiveCommands(obj, client) {
    commands.forEach((x) => {
        if (obj.action == x.action) {
            x.func(obj.info);
        }
    });
}

/*
//call this changeToJSON:
function createFormat(message, color, size, log) {
    return JSON.stringify({
        message: message,
        size: size,
        color: color,
        log: log,
    });
}
*/

function messageAllClients(message) {
    let formatted = JSON.stringify(message);
    wss.clients.forEach((x) => {
        x.send(formatted);
    });
}

function messageSpecifiedClient (message, target){
    if (typeof message != 'string'){
        message = JSON.stringify(message)
    }
    if (typeof target == 'number'){
        try{
            clients[target].send(message)
        }
        catch{
            console.error('Index in clients array not found. Please provide a valid index')
        }
    }
    else if (typeof target == 'string'){
        try{
            findTargetClientByName(target).send(message)
        }
        catch{
            console.error('Target name not found! \nError from messageAllClients function. The requested target name was', target)
        }
    }
    else{
        console.error('Invalid target selection method. Provide their index in the clients array or the name given to them')
    }
}

function findTargetClientByName (name){
    let foundClient;
    clients.every(x => {
        if (x.name == name){
            foundClient = x
            return false
        }
        return true
    })
    return foundClient
}
//inspiration for using every: https://masteringjs.io/tutorials/fundamentals/foreach-break

async function addNewClients (){
    let newClientArray = [...wss.clients.values()]
    let originalTime = new Date().getTime()
    clients.push(newClientArray[newClientArray.length - 1])
//     for (let i = 0; i < 4; i++) {
    Array.from({length: 4}, () => {
        messageSpecifiedClient({action: 'getResponseTime'}, clients.length - 1)
    })
    clients[clients.length - 1].index = clients.length - 1
    await new Promise((resolve,reject) => {
       setInterval(() => {
            if (newResponseTimes.length == 4){
                let responseTimeInMilliseconds = newResponseTimes.map(x => {return x - originalTime})
                clients[clients.length - 1].responseTime = responseTimeInMilliseconds.reduce((a, b) => a + b, 0) / 4
                newResponseTimes = []
                resolve(true)
            }
       },10)
    })
}

//Reduce: https://stackoverflow.com/a/43363105/19515980

function removeClient (clientToRemove){
    wipeClientData(clientToRemove)
    //might want to fix schedule too
}

function wipeClientData (clientToRemove){
    console.log("\x1b[31m", 'Removing Client', clientToRemove.index, 'data', "\x1b[0m")
    console.log('clientToRemove.index', clientToRemove.index)
    clients = A.safeSplice(clients, 1, clientToRemove.index)
//     for (let i = 0; i < clients.length - clientToRemove.index; i++) {
    Array.from({length: clients.length - clientToRemove.index}).forEach((x, i) =>{
        clients[clientToRemove.index + i].index = clientToRemove.index + i
    })
    return true
}

//Color logging: https://stackoverflow.com/a/41407246/19515980

//messageAllClients({action:'loadSVG',info:filesArray[randomRange(0,filesArray.length-1)]})

//messageAllClients({action:'animationExample'})
//messageAllClients({action:'animate',info:['size',[0,500,100,100]]})

//Differenciate client part of inspiration from my old and this stack overflow link: https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients

// //Find availablePorts for websocketServer
// async function findAvailablePorts (min = 0, max){
//     let testPortCode = `;
//              let WebSocketServer = require("ws");
//              try{
//              tempServer = new WebSocketServer.Server({ port: portToTest })
//              tempServer.close()
//              returnToParent(portToTest)
//              }
//              catch{ returnToParent(new Error('port in use'))}
//              `
// //     while (currentPort <= max && availablePort === undefined) {
// //         console.log('testing', currentPort)
// //         try{
// //             tempServer = new WebSocketServer.Server({ port: currentPort })
// //             tempServer.close()
// //             tempServer = undefined
// //             availablePort = currentPort
// //         }
// //         catch {
// //         }
// //         currentPort++;
// //     }
//     for (let i = min; i < max; i++) {
//         let portToTestCode = 'let portToTest = ' + i 
//         let result = await giveWorkerWork(portToTestCode + testPortCode)
//         console.log(result)
//         if (result !== undefined){
//             return i
//         }
//     }
// //     console.log('Found available port at: ', availablePort)
// //     return availablePort
// }
// https://stackoverflow.com/a/19129614/19515980

addToModuleExports({
  WebSocketServer,
  findTargetClientByName,
  messageAllClients,
  messageSpecifiedClient,
  receiveCommands,
  removeClient,
  sendMessageToClients,
  wipeClientData,
})

// --------------------------------------------------------------------------
//configure-konduktiva.js

//Fill in the variables inside the player:
function assignPlayerForMusicSynthesizerMidiOutput (e, defaultName, playerName, playerData = {}){
    if (typeof playerName !== 'string'){
        logRedError('playerName needs to be a string in order to create or configure a player.')
        return new Error('playerName needs to be a string')
    }
//     else if (defaultName !== undefined && playerData.velocityMapName === undefined){
//         playerData.velocityMapName = defaultName
//     }
//     if (checkIfMidiOutputPlayerExist(playerData.channel, e) === undefined){
    if (checkIfPlayerExists(playerName, e) === undefined){
        createMidiOutputPlayer(defaultName, e, playerData.channel, playerData.velocityMapName, playerData.noteMapName, playerData.octaveMapName, playerData.rhythmMapName, playerData.polyphonyMapName, playerData.noteDurationMapName, playerData.maskMapName, playerData.rhythmPatternName, playerData.chordMapName, playerData.rootMapName, playerData.modeMapName, playerData.legatoMapName, playerData.midiProgramPlayerName, playerData.controlChangePlayerName, playerData.midiOutput, playerName)
    }
    else{
        editMidiOutputPlayer(defaultName, e, playerData.channel, playerData.velocityMapName, playerData.noteMapName, playerData.octaveMapName, playerData.rhythmMapName, playerData.polyphonyMapName, playerData.noteDurationMapName, playerData.maskMapName, playerData.rhythmPatternName, playerData.chordMapName, playerData.rootMapName, playerData.modeMapName, playerData.legatoMapName, playerData.midiProgramPlayerName, playerData.controlChangePlayerName, playerData.midiOutput, playerName)
    }
}


//Check if this player name has been used:
function checkIfPlayerExists (playerName, e){
    return Object.keys(e.players).find(x => x === playerName)
}
//Check if this player name has been used:
function checkIfMidiOutputPlayerExist (midiOutput, e){
    return Object.keys(e.players).find(x => x === 'exampleMidiPlayer' + midiOutput)
}

function checkIfAddChordProgressionMapToPlayer (chordMapName, e){
    try{
        if (e.songMaps[chordMapName] === undefined){
            return;
        }
        else {
            return chordMapName
        }
    }
    catch(e){
        console.log(e)
    }
}

function generalMidiOutputVariableAssigning (defaultName, e, channel = defaultName, velocityMapName = 'default', noteMapName = 'default', octaveMapName = 'default', rhythmMapName = 'default', polyphonyMapName = 'default', noteDurationMapName = 'default', maskMapName = 'default', rhythmPatternName = 'default', chordMapName = 'default', rootMapName = 'default', modeMapName = 'default', legatoMapName = 'default', midiProgramPlayerName = defaultName + 'MidiProgram', controlChangePlayerName = defaultName + 'ControlChange', midiOutput = 1, playerName){
    let channelPlayer = e.players[playerName]
    channelPlayer.velocityMap = velocityMapName
    channelPlayer.noteMap = noteMapName
    channelPlayer.octaveMap = octaveMapName
    channelPlayer.maskMap = maskMapName
    channelPlayer.rhythmMap = rhythmMapName
    //e.rhythmMaps[rhythmMapName].add(e)
    if (e.channelMaps[channel] === undefined){
        channelPlayer.channelMap = 'default'
    }
    else{
        channelPlayer.channelMap = channel
    }
    if (e.players[midiProgramPlayerName] !== undefined){
        channelPlayer.midiProgramPlayer = midiProgramPlayerName
        e.players[midiProgramPlayerName].channel = channel
        e.players[midiProgramPlayerName].channelMap = channel
        if (e.channelMaps[channel] === undefined){ 
            e.players[midiProgramPlayerName].channelMap = 'default'
        }
    }
    if (e.players[controlChangePlayerName] !== undefined){
        channelPlayer.controlChangePlayer = controlChangePlayerName
        e.players[controlChangePlayerName].channel = channel
        e.players[controlChangePlayerName].channelMap = channel
        if (e.channelMaps[channel] === undefined){ 
            e.players[controlChangePlayerName].channelMap = 'default'
        }
    }
    channelPlayer.polyphonyMap = polyphonyMapName
    channelPlayer.noteDurationMap = noteDurationMapName
    channelPlayer.modeMap = modeMapName
    channelPlayer.rootMap = rootMapName
    channelPlayer.chordMap = chordMapName
    channelPlayer.legatoMap = legatoMapName
    e.rhythmPatterns[rhythmPatternName].add(e, playerName)
    if (e.midiOutputs[midiOutput - 1] === undefined){
        logRedError('Extra outputs required.')
        throw new Error('Extra outputs required')
            //color logging from: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color/41407246#41407246
    }
    channelPlayer.midiOutput = midiOutput
//     try{
//     channelPlayer.chordMap = checkIfAddChordProgressionMapToPlayer(chordMapName, e)
//     }catch{}
}

//https://stackoverflow.com/a/43363105/19515980

//color logging: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color/41407246#41407246
//Create Player:
function createMidiOutputPlayer (defaultName, e, channel, velocityMapName, noteMapName, octaveMapName, rhythmMapName = 'default', polyphonyMapName, noteDurationMapName, maskMapName, rhythmPatternName, chordMapName, rootMapName, modeMapName, legatoMapName, midiProgramPlayerName, controlChangePlayerName, midiOutput, playerName){
    console.log('Chose to create player')
    setupMidiRhythm(e, playerName, rhythmMapName)
    generalMidiOutputVariableAssigning.apply(null, arguments)
}

//https://stackoverflow.com/a/43363105/19515980

//Edit Player:
function editMidiOutputPlayer (defaultName, e, channel, velocityMapName, noteMapName, octaveMapName, rhythmMapName, polyphonyMapName, noteDurationMapName, maskMapName, rhythmPatternName, chordMapName, rootMapName, modeMapName, legatoMapName, midiProgramPlayerName, controlChangePlayerName, midiOutput, playerName){
    console.log('Chose to edit player')
    generalMidiOutputVariableAssigning.apply(null, arguments)
}

//HERE name creation is wrong cannot be the same as the orignal player name it should be name + something
function createControlChangePlayers (noteValueData, name, e, midiOutput, mapDefaultName){
    if (noteValueData.controlChangePlayer !== undefined && noteValueData.controlChangePlayerKeys !== undefined && noteValueData.controlChangePlayerKeyspan !== undefined){
//         e.controlChangePlayers[name] = new QuantizedMap(noteValueData.controlChangePlayerKeyspan, noteValueData.controlChangePlayerKeys, noteValueData.controlChangePlayer)
         createMidiCCPlayer (e, name + 'ControlChange', noteValueData.controlChangePlayerKeyspan, noteValueData.controlChangePlayerKeys, noteValueData.controlChangePlayer, midiOutput, mapDefaultName)
        if (e.players[name] !== undefined){
            e.players[name].controlChangePlayer = name + 'ControlChange'
        }
    }
}

function createMidiProgramPlayers (noteValueData, name, e, midiOutput, mapDefaultName){
    if (noteValueData.midiProgramPlayer !== undefined && noteValueData.midiProgramPlayerKeys !== undefined && noteValueData.midiProgramPlayerKeyspan !== undefined){
         createMidiProgramPlayer(e, name + 'MidiProgram', noteValueData.midiProgramPlayerKeyspan, noteValueData.midiProgramPlayerKeys, noteValueData.midiProgramPlayer, midiOutput, mapDefaultName)
        if (e.players[name] !== undefined){
            e.players[name].midiProgramPlayer = name + 'MidiProgram'
        }
    }
}

function createModeFilters (noteValueData, name, e){
    let modeArray = noteValueData.modeFilter
    if (modeArray === undefined || noteValueData.modeFilterKeys === undefined){
        return false
    }
    let keySpan = noteValueData.modeFilterKeyspan
    if (keySpan === undefined){
        keySpan = modeArray[modeArray.length - 1] + 2
    }
    if (typeof modeArray === 'object'){
        e.modeFilters[name] = new QuantizedMap(keySpan, noteValueData.modeFilterKeys, modeArray)
    }
}

function createModeMaps (noteValueData, name, e){
    if (noteValueData.modeMap === undefined || noteValueData.modeMapKeys === undefined){
        return false
    }
    else if (noteValueData.modeMapKeyspan !== undefined){
        e.modeMaps[name] = new QuantizedMap(noteValueData.modeMapKeyspan, noteValueData.modeMapKeys, noteValueData.modeMap)
    }
    else {
        e.modeMaps[name] = new QuantizedMap(noteValueData.modeMapKeys[noteValueData.modeMapKeys.length - 1], noteValueData.modeMapKeys, noteValueData.modeMap)
    }
}

function createChannelMaps (noteValueData, name, e){
    if (noteValueData.channelKeys !== undefined && noteValueData.channelValues !== undefined && noteValueData.channelKeyspan !== undefined){
        e.channelMaps[name] = new QuantizedMap(noteValueData.channelKeyspan, noteValueData.channelKeys, noteValueData.channelValues)
        return true
    }
    return false
}

function createSongMap (noteValueData, name, e){
    if (noteValueData.songMap === undefined){
        return false
    }
    else if (noteValueData.songMapKeys === undefined && noteValues.songMapKeyspan === undefined){
        e.addMap(songMaps, name, noteValueData.songMap.length, noteValueData.songMap.map((x, i) => { return i}), noteValueData.songMap)
    }
    else {
        e.addMap('songMaps', name, noteValueData.songMapKeyspan, noteValueData.songMapKeys, noteValueData.songMap)
    }
}

function createChordMap (noteValueData, name, e){
    if (noteValueData.chordMap === undefined){
        return false
    }
    else if (noteValueData.chordMapKeys === undefined || noteValueData.chordMapKeyspan === undefined){
        e.addMap('chordMaps', name, noteValueData.chordMapKeyspan, noteValueData.chordMapKeys, noteValueData.chordMap)
    }
    else{
        e.addMaps('chordMaps', name, noteValueData.chordMap.length, noteValueData.chordMap.map((x, i) => {return i}), noteValueData.chordMap)
    }
}

function createLegatoMap (noteValueData, name, e){
    if (noteValueData.legatoMap === undefined){
        return false
    }
    else if (noteValueData.legatoMapKeys !== undefined && noteValueData.legatoMapKeyspan !== undefined){
        e.addMap('legatoMaps', name, noteValueData.legatoMapKeyspan, noteValueData.legatoMapKeys, noteValueData.legatoMap, false)
    }
    else {
        e.addMap('legatoMaps', name, noteValueData.legatoMap.length, noteValueData.legatoMap.map((x, i) => {return i}), noteValueData.legatoMap, false)
    }
}

//Create maps and other things from noteValue Data and save these new things in the musical environment:
function recordConfigurationDataIntoMusicalEnvironment (noteValueData, name, e){
    createNoteSpans(noteValueData, e)
    createNoteRelatedMaps(noteValueData, name, e)
    createOctaveMaps(noteValueData, name, e)
    createSongMap(noteValueData, name, e)
    createChordMap(noteValueData, name, e)
    createLegatoMap(noteValueData, name, e)
    if (noteValueData.velocityKeys === undefined){
        e.velocityMaps[name] = new QuantizedMap(noteValueData.velocity.length, A.buildArray(noteValueData.velocity.length, x => {return x}), noteValueData.velocity)
    }
    else {
        e.velocityMaps[name] = new QuantizedMap(noteValueData.velocity.length, noteValueData.velocityKeys, noteValueData.velocity)
    }
    if (noteValueData.polyphonyMap !== undefined){
        e.maxPolyphonyMaps[name] = new QuantizedMap(noteValueData.polyphonyMap.length, A.buildArray(noteValueData.polyphonyMap.length, x => {return x}), noteValueData.polyphonyMap, e)
    }
    createModeFilters(noteValueData, name, e)
    createModeMaps(noteValueData, name, e)
    createRootMap(noteValueData, name, e)
//     createRhythmMap(noteValueData, name)
    createMaskMap(noteValueData, name, e)
    let rhythmMapData = configureRhythmMapVariables(noteValueData)
    e.rhythmPatterns[name] = new RhythmPattern (name, rhythmMapData.keyspan, rhythmMapData.IOIs, rhythmMapData.bools)
    createChannelMaps(noteValueData, name, e)
    return name
}

function recordControlChangeConfigurationData (controlChangeConfigurationObject, name, e){
    createChannelMaps(controlChangeConfigurationObject, name, e)
    createControlChangePlayers(controlChangeConfigurationObject, name, e, controlChangeConfigurationObject.midiOutput, name)
}

function recordMidiProgramConfigurationData (midiProgramConfigurationObject, name, e){
    createChannelMaps(midiProgramConfigurationObject, name, e)
    createMidiProgramPlayers(midiProgramConfigurationObject, name, e, midiProgramConfigurationObject.midiOutput, name)
}

function populateModeFilters (e){
    Scale.names().forEach(x => {
        let filter = Scale.get(x).intervals.map(n => {return Interval.semitones(n)})
        let modeFilterMap = new QuantizedMap(12, filter, filter) 
        e.modeFilters[x] = R.clone(modeFilterMap)
        Scale.get(x).aliases.forEach(a => {
            e.modeFilters[a] = R.clone(modeFilterMap)
        })
    })
}

function setUpBasicTaskPlayer (e){
    setupTaskPlayer(e, 'taskTrooper', 'straight')
    e.players.taskTrooper.assignedTask = 'trooperTask'
    e.tasksQueue.trooperTask = []
}

function addToMusicalEnvironment (e){
    e.channelMaps = {'default': new QuantizedMap(4, [0], [1])}
     updateMidiOutputList(e)
    updateMidiInputList(e)
//     e.midiDataSets = {}
    e.velocityMaps = {'default': new QuantizedMap(4, [0, 1, 2, 3], [127,60,60,50])}
    e.noteMaps = {'default': new QuantizedMap(12,A.buildArray(12,i=> i), A.buildArray(12, i => [i]))}
    e.octaveMaps = {'default': new QuantizedMap(4, [0, 1, 2, 3], [3,3,3,3])}
//     e.rootNoteMaps = {}
    e.maxPolyphonyMaps = {'default': new QuantizedMap(4, [0, 1, 2, 3], [4, 6, 8, 10])}
//     e.noteDurationMaps = {}
    e.rhythmPatterns = {'default': new RhythmPattern('default', 4, [1, 1, 1, 1], [true, true, true, true])}
    e.noteDurationMaps = {"default": new QuantizedMap(4, [0, 1, 2, 3], [1, 1, 1, 1])}
//     e.pattern = undefined
     e.controlChangeMaps = {"default": new QuantizedMap(81, [20, 40, 60, 80], A.buildArray(4, x => {return [{
       channel: 0,
       controller: 25,
       value: randomRange(0, 126),
     }]}))
 }
    e.chordMaps = {}
    e.chordMaps['default'] = new QuantizedMap(16, [0,4,8,12],['M','m7','m9','maj9'])
    e.chordMaps['exampleChords'] = R.clone(e.chordMaps['default'])
    e.songMaps = {
//         'twelveBars-lsystem-scarbrofair': new QuantizedMap(15000, [1000, 5000, 10000], ['twelveBars', 'lsystem', 'scarboroughFair'])
           'default': new QuantizedMap(4, [0], ['default']),
    }
    e.modeFilters = {}
    populateModeFilters(e)
    e.modeFilters['default'] = e.modeFilters.chromatic
    e.modeMaps = {'default': new QuantizedMap(4, [0], [ 'chromatic']), 'chromatic': new QuantizedMap(4, [0], [ 'chromatic'])}
    e.rootMaps = {'default': new QuantizedMap(4, [0, 1, 2, 3], ['C', 'C', 'C', 'C'])} //English alphabets for music
     e.notesInputMode = 'relativeSemitone' //OR 'relativeScaleDegree'
//     e.notesInputMode = 'relativeScaleDegree'
    e.recordedMessages = {}
     e.messageMaps = {}
     e.legatoMaps = {'default': new QuantizedMap(16, [0, 4, 8, 12], [1, 1, 1, 1])}
     e.midiProgramMaps = {'default': new QuantizedMap(4, [0], [[2]])}
//     e.controlChangeMaps = {}
}

function checkIfAllMessagesExist (messageList, e){
    messageList.forEach(x => {
        try{
            if(e.recordedMessages[x] === undefined){
                throw new Error('recordedMessage ' + x + ' does not exist.')
            }
        }
        catch{
            throw new Error('recordedMessage ' + x + ' does not exist.')
        }
    })
}

function scaleQuantizedMapToKeyspan (newKeyspan, map){
    let scaleFactor = newKeyspan / map.keyspan
    map.keys = map.keys.map(x => {
        return x * scaleFactor
    })
    map.keyspan = newKeyspan
    return map
}

function combineQuantizeMaps (messageList, e){
    let returnedMap = new QuantizedMap(0, [], [])
    messageList.forEach(x => {
        e.recordedMessages[x].keys.forEach(b => {
            returnedMap.keys.push(b + returnedMap.keyspan)
        })
        returnedMap.keyspan += e.recordedMessages[x].keyspan
        returnedMap.values.push(e.recordedMessages[x].values)
    })
    returnedMap.values = returnedMap.values.flat()
    return returnedMap
}

// function splitOnePlaybackMapIntoMany(e, messageMapName, messageMap){
// }
// function createPlaybackPlayer (e, messageMapName, playerName = messageMapName, totalKeyspan = combineAllKeySpans(messageMapName)){
//     setupPlaybackPlayer(e, playerName, playerName)
//     let messageList = e.messageMaps[messageMapName]
//     checkIfAllMessagesExist(messageList, e)
//     e.messageMaps[messageMapName] = combineQuantizeMaps(messageList, e)
//     let currentMessageMap = e.messageMaps[messageMapName]
//     e.rhythmMaps[messageMapName] = new QuantizedMap(1, [1] ,new QuantizedMap(currentMessageMap.keyspan, currentMessageMap.keys, currentMessageMap.keys))
//     e.maskMaps[messageMapName] = new QuantizedMap(currentMessageMap.keyspan, currentMessageMap.keys,currentMessageMap.keys.map(x => {return true}))
//     e.noteMaps[messageMapName] = new QuantizedMap(0, [], [])
//     e.noteMaps[messageMapName] = new QuantizedMap(0, [], [])
//     e.noteMaps[messageMapName] = new QuantizedMap(0, [], [])
//     splitOnePlaybackMapIntoMany(e.messageMaps[messageMapName])
//     e.players[playerName].rhythmMap = messageMapName
//     e.players[playerName].maskMap = messageMapName
// }

// createPlaybackPlayer(e, 'testios', 'testios', 100)

// function checkChordProgressionDataType (values){
//     if (findItemType(values) !== 'Array'){
//         throw new Error('invalid values type. expected array. check values')
//     }
//     return values.every((x, i) => {
//         console.log(findItemType(x.data))
//         if (findItemType(x.data) !== 'Array'){
//             throw new error('invalid data type. expected number. check values[' + i + '].data.')
//         }
//         else if (findItemType(x.bool) !== 'boolean'){
//             throw new Error('Invalid boolean type. Expected number. Check values[' + i + '].data.boolean')
//         }
//         return x.data.every(d => {
//             if (findItemType(d.note) !== 'number'){
//                 throw new Error('Invalid data note type. Expected number. Check values[' + i + '].data.note')
//             }
//             else if (findItemType(d.octave) !== 'number'){
//                 throw new Error('Invalid octave type. Expected number. Check values[' + i + '].data.octave')
//             }
//             else if (findItemType(d.rootNote) !== 'string'){
//                 throw new Error('Invalid rootNote type. Expected number. Check values[' + i + '].data.rootNote')
//             }
//             else if (findItemType(d.velocity) !== 'number'){
//                 throw new Error('Invalid velocity type. Expected number. Check values[' + i + '].data.velocity')
//             }
//             return true
//         })
//     })
// }


function findItemType (item){
    if (typeof item === 'object' && item instanceof Array){
        //differentiating between object and array from: https://stackoverflow.com/a/7803271/19515980
        return 'Array'
    }
    else if (item instanceof MusicalEnvironment === true){
        return 'MusicalEnvironment'
    }
    else if (item instanceof QuantizedMap === true){
        return 'QuantizedMap'
    }
    return typeof item
}

function typesOfItemsInArray (inputArray){
    let types = {}
    inputArray.forEach((x, i) => {
        let finalType = findItemType(x)
        if (types[finalType] === undefined){
            types[finalType] = [i]
        }
        else {
            types[finalType].push(i)
        }
    })
    return types
}

function checkAllItemsType (inputArray, type){
    let arrayInfo = typesOfItemsInArray(inputArray)
    if (Object.keys(arrayInfo).length !== 1){
        return false
    }
    else if (Object.keys(arrayInfo)[0].toLowerCase() === type.toLowerCase()){
        return true
    }
    else {
        return false
    }
}

function addChordProgression(e, mapName, keyspan, keys, values) {
    //let chordSemitones = values.map(c => c.intervals.map(x => Interval.semitones(x)));
    let chordRoots = values.map(c2 => c2.tonic);
    let chordQualities = values.map(c3 => c3.aliases[0]);
    e.rootMaps[mapName] = new QuantizedMap(keyspan, keys, chordRoots);
    //e.noteMaps[mapName] = new QuantizedMap(keyspan, keys, chordSemitones);
    e.chordMaps[mapName] = new QuantizedMap(keyspan, keys, chordQualities);
}

function addChordProgressionFromRomanNumeral(musicalEnvironment, progressionName, progressionKeyspan, progressionKeys, progression, key) {
    let chordObjs = Progression.fromRomanNumerals(key, progression).map(chord => Chord.get(chord));
    addChordProgression(musicalEnvironment, progressionName, progressionKeyspan, progressionKeys, chordObjs)
}

function isLowerCase(string) {
  return string.toLowerCase() === string;
}

function includesLowerCase (string) {
    let bools = string.split('').map(c => isLowerCase(c));
    if (R.includes(true,bools)) {return true} else {return false}
}

function romanToUpperCase (roman) {
    if (isLowerCase(roman[0]) == true)
    {return roman.toUpperCase()+"m"}
    else {return roman}
}

function romanToChordSymbols (key,progression) {
    let revisedProgression = progression.map(c => romanToUpperCase(c))
    return Progression.fromRomanNumerals(key, revisedProgression).map(chord => Chord.get(chord).symbol);
}

addToModuleExports({
    getChordComponents,
    isLowerCase,
    includesLowerCase,
    romanToUpperCase,
    romanToChordSymbols,
    addChordProgressionFromRomanNumeral,
  addToMusicalEnvironment,
  assignPlayerForMusicSynthesizerMidiOutput,
  checkAllItemsType,
//   checkChordProgressionDataType,
  checkIfAddChordProgressionMapToPlayer,
  checkIfAllMessagesExist,
  checkIfPlayerExists,
  checkIfMidiOutputPlayerExist,
  combineQuantizeMaps,
  createControlChangePlayers,
    createMidiProgramPlayers,
  createModeFilters,
  createModeMaps,
  createPlaybackPlayer,
  createMidiOutputPlayer,
  editMidiOutputPlayer,
  findItemType,
  recordConfigurationDataIntoMusicalEnvironment,
  scaleQuantizedMapToKeyspan,
//   splitOnePlaybackMapIntoMany,
  typesOfItemsInArray,
    addChordProgression,
    populateModeFilters,
    recordControlChangeConfigurationData, 
    recordMidiProgramConfigurationData,
})

// --------------------------------------------------------------------------
//generate-melody.js:


//Generated a random melody and outputs an array with objects that contains notes and octaves:
function generateRandomMelody (rootNote, mode, melodyLength, octaveMin = 4, octaveMax = 7, melodyMin = 0, melodyMax = 11, chords){
    let chosenMode = Scale.get(mode.toLowerCase()).intervals.map(x => { return Interval.semitones(x)})
    let modeMap = new QuantizedMap(11, chosenMode, chosenMode)
    let randomMelody  = A.buildArray (melodyLength, x => randomRangeInt (melodyMin, melodyMax))
    return randomMelody.map((x, i) => {
        return {note: modeMap.nearestLookup(x % 11), octave: randomRangeInt (octaveMin, octaveMax), rootNote: rootNote}
    })
}

//Filters melody through a musical mode:
function quantizeMelody (melody, mode){
    let quantizedMode = new QuantizedMap(mode[mode.length - 1], mode, mode)
    console.log(quantizedMode)
    return melody.map(x => {return quantizedMode.floorLookup(x)})
}

function changeNoteBy (originalNumber, changeBy, min, max){
    let newNum = originalNumber
        console.log('changeBy', changeBy)
    if (changeBy === 'same'){
        return originalNumber
    }
    else if (changeBy === 'increase'){
        return randomRange(originalNumber, max)
    }
    else if (changeBy === 'decrease'){
        return randomRange(min, originalNumber)
    }
}

//lengthen Mode array to that it can filter MIDI values:
function createModeArray(mode) {
  let modeArray = [];
//   for (let i = 0; i < 128; i++) {
    Array.from({length: 128}).forEach((x, i) =>{
        let scaleDegree = i % 12;
        if (mode.includes(scaleDegree)) {
          modeArray.push(i);
        }
  })
  return modeArray;
}

function generateChangeMethod (rules){
    let randomNum = randomRange(0, 99)
    let currentMin = 0
    let changeBy;
    Object.keys(rules).map(x => {
        if (changeBy !== undefined){
            return true
        }
        if (randomNum >= currentMin && randomNum < currentMin + rules[x]){
            changeBy = x
        }
        else {
            currentMin += rules[x]
        }
    })
    return changeBy
}

function randomlyGeneratingMelodiesWithRules (mode, startValue, rules, min = 0, max = 127, melodyLength = 15){
    let currentValue = startValue
    let generatedMelody = []
//     for (let i = 0; i < melodyLength; i++) {
    Array.from({length: melodyLength}, () => {
        let generatedChange = generateChangeMethod(rules)
        currentValue = changeNoteBy(currentValue, generatedChange , min, max)
        console.log('currentValue', currentValue)
        generatedMelody.push(currentValue)
    })
    let modeArray = createModeArray(mode)
    let quantizedModeArray = new QuantizedMap(modeArray[modeArray.length - 1], modeArray, modeArray)
    return generatedMelody.map(x => {return quantizedModeArray.floorLookup(x)})
}

// randomlyGeneratingMelodiesWithRules([0,2,4,7,9,11], 80, {increase: 30, decrease: 30, same: 40},50, 120, 100)

addToModuleExports({
  changeNoteBy,
  createModeArray,
  generateChangeMethod,
  generateRandomMelody,
  quantizeMelody,
  randomlyGeneratingMelodiesWithRules
})

// --------------------------------------------------------------------------
//midi.js:

 function checkIfUseVerboseLogging (player){
    if ((player.verbose === true || player === true) && arguments.length === 2){
        console.log(arguments[1])
        return true
    }
    else if ((player.verbose === true || player === true) && arguments.length > 2){
        let combinedString = ''
        Object.values(arguments).splice(1).forEach(x => {combinedString += x + ' '})
        console.log(combinedString)
        return true
    }
    return false
}

function sendMidiData(info, player, note, channel, e, b) {
    // add2Log(note)
    //add2Log('--------------------------------------------------------------------------')
//     console.log(info.noteDuration)
    checkIfUseVerboseLogging(player, info)
//     addLog({data:info, beat: b})
//        addLog(JSON.stringify(info))
    checkIfUseVerboseLogging(player, 'note', note, 'velocity: ', info.velocity, 'channel', channel - 1, 'midiOutput', player.midiOutput - 1)
    checkIfUseVerboseLogging(player, 'duration: ', 1000 * beatsToTime(e.currentTempo, info.noteDuration) * e.legatoMaps[player.legatoMap].wrapLookup(e.currentBeat()))
checkIfUseVerboseLogging(player, 'TIME: ', beatsToTime(e.currentTempo, e.rhythmMaps[player.rhythmMap].values[0].wrapLookup(b)) * e.legatoMaps[player.legatoMap].wrapLookup(b) * 1000)
e.midiOutputs[player.midiOutput - 1].send('noteon', {
        note: note,
        velocity: info.velocity,
        channel: channel - 1,
    });
    setTimeout(() => {
        e.midiOutputs[player.midiOutput - 1].send('noteoff', {
            note: note,
            velocity: info.velocity,
            channel: channel - 1,
        });
    }, beatsToTime(e.currentTempo, b  - e.currentBeat()) * e.legatoMaps[player.legatoMap].wrapLookup(b) * 1000)
}

//Convert velocity values from 0-1 to midi 0-127:
function convertVelocityToMidiValues (inputVelocity){
    if (inputVelocity > 1){
        return inputVelocity
    }
    else {
        return inputVelocity * 127
    }
}

//This function is modified to set action as sequenceSize instead of superDirt
//HERE CHANGE ACTION
function setupMidiRhythm (env, sequenceName, rhythmPatternName = 'default') {
    env.players[sequenceName] = new Player(sequenceName);
    env.players[sequenceName].maskMap = 'default'
    //env.players[playerName].samplePattern = playerName;
    env.players[sequenceName].action = 'sendNotesMidiInfo';
//     env.players[sequenceName].action = 'midiSequencedRhythm';
    env.players[sequenceName].rhythmMap = rhythmPatternName
    return sequenceName
}

//This function is modified to set action as sendPlaybackMessage instead of superDirt
function setupPlaybackPlayer (env, sequenceName, rhythmPatternName = 'default') {
    env.players[sequenceName] = new Player(sequenceName);
    env.players[sequenceName].maskMap = 'default'
    //env.players[playerName].samplePattern = playerName;
    env.players[sequenceName].action = 'sendPlaybackMessage';
    env.players[sequenceName].rhythmMap = rhythmPatternName
    return sequenceName
}

//This function is modified to set action as send Midi CC messages instead of superDirt
function setupMidiCCPlayer (env, sequenceName, rhythmPatternName = 'default') {
    env.players[sequenceName] = new Player(sequenceName);
    env.players[sequenceName].maskMap = 'default'
    //env.players[playerName].samplePattern = playerName;
    env.players[sequenceName].action = 'sendMidiCCMessages';
    env.players[sequenceName].rhythmMap = rhythmPatternName
    return sequenceName
}

//This function is modified to set action as send Midi CC messages instead of superDirt
function setupMidiProgramPlayer (env, sequenceName, rhythmPatternName = 'default') {
    env.players[sequenceName] = new Player(sequenceName);
    env.players[sequenceName].maskMap = 'default'
    //env.players[playerName].samplePattern = playerName;
    env.players[sequenceName].action = 'sendMidiProgramMessages';
    env.players[sequenceName].rhythmMap = rhythmPatternName
    return sequenceName
}

//This function is modified to set action as send Midi CC messages instead of superDirt
function setupTaskPlayer (env, sequenceName, rhythmPatternName = 'default') {
    env.players[sequenceName] = new Player(sequenceName);
    env.players[sequenceName].maskMap = 'default'
    //env.players[playerName].samplePattern = playerName;
    env.players[sequenceName].action = 'completePendingTask';
    env.players[sequenceName].rhythmMap = rhythmPatternName
    return sequenceName
}

// function sendMidiCCMessages (p,b) {if ((mask(p, e.maskMaps[e.players[p].maskMap] ,(e.currentBeat()),1)) != true) {sendingMidiCCMessages(e, b, p);}}

function filterMode (note, e, b, player){
     let currentModeMap = e.modeMaps[player.modeMap]
    if (currentModeMap === undefined){
        return false
    }
    let currentMode = currentModeMap.wrapLookup(b)
    if (typeof currentMode !== 'string'){
        return false
    }
     let mode = e.modeFilters[currentMode]
    if (mode === undefined){
        return note
    }
    else if (e.notesInputMode === 'relativeSemitone'){
        checkIfUseVerboseLogging(player, 'originial note: ' + note + 'after: ' + mode.floorWrapLookup(note))
        return mode.floorWrapLookup(note)
    }
    else{
        return mode[note]
    }
}

function filterpolyphony (e, b, player, info){
    let playerpolyphony = e.maxPolyphonyMaps[player.polyphonyMap]
    if (playerpolyphony === undefined){
        return info
    }
    let maxpolyphonyAmount = playerpolyphony.wrapLookup(b)
    checkIfUseVerboseLogging(player, 'polyphony: ', info.noteValues.length, maxpolyphonyAmount, info.noteValues.length > maxpolyphonyAmount)
    if (info.noteValues.length > maxpolyphonyAmount){
//         for (let i = 0; i < maxpolyphonyAmount - info.noteDuration.length; i++) {
        info.noteValues = info.noteValues.slice(0, maxpolyphonyAmount)
        checkIfUseVerboseLogging(player, 'CUT DOWN notes playing to:' + maxpolyphonyAmount)
    }
    return info
}

function convertRomanNumeralsToMidi (info){
    let stringOctaves = info.octaves
    if (typeof info.octaves === 'string'){
        info.octaves = Note.midi(info.octaves)
    }
    else {
        stringOctaves = Note.fromMidi(info.octaves)
    }
//     console.log('testing for roman numerals', info.noteValues[0])
    if (typeof info.noteValues[0] === 'string'){
        info.finalValues = Progression.fromRomanNumerals(info.root[0] + info.octaves, info.noteValues)
        info.finalValues = info.finalValues.map(x => {
            return Midi.toMidi(x)
        })
        checkIfUseVerboseLogging(player, 'converted' + info.finalValues)
        return info
    }
    return info
}

function calculateFinalNoteValue (info, e){
    if (info.finalValues === undefined){
        checkIfUseVerboseLogging(e, 'finalNote not detected', info.finalNote)
        info.finalValues = info.noteValues.map(x => {
            return Note.midi(info.root + info.octaves) + x
        })
    }
    return info
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
//Function from: https://stackoverflow.com/a/5778071

function checkIfStringIncluesNumber (inputString){
    let splitArray = inputString.split('')
    return !splitArray.every(x => {
        if (isNumeric(x) === true){
            return false
        }
        else {return true}
    })
}

function convertLettersToMidi (info, player){
    if (info.finalValues !== undefined){
//             console.log('finalNote already defined')
        checkIfUseVerboseLogging(e, 'finalNote already defined')
        return info
    }
    if (typeof info.octaves === 'string'){
            if (checkIfStringIncluesNumber(info.octaves) === false){
                info.octaves = Note.midi(info.octaves + '-1')
            }
            else {
                info.octaves = Note.midi(info.octaves)
            }
    }
    if (typeof info.noteValues[0] === 'string'){
        info.noteValues = info.noteValues.map(x => {
            if (checkIfStringIncluesNumber(x) === false){
                return Note.midi(x + '-1')
            }
            else {
                return Note.midi(x)
            }
        })
    }
    checkIfUseVerboseLogging(player, 'Converting letters to MIDI')
    return info
}

function convertNumericChordToMusicalChordNotation (inputChord){
    let chromaticQM = new QuantizedMap(12, A.buildArray(12, x => x), Scale.get("C chromatic").notes)
    return Chord.detect(inputChord.map(e => chromaticQM.wrapLookup(e)))
}

function convertNoteValuesToMidi (info, e, b, player){
    if (info.finalValues !== undefined){
        checkIfUseVerboseLogging(player, 'finalNote already detected 2')
        return info
    }
    if (e.notesInputMode === 'relativeScaleDegree'){
         let currentModeMap = e.modeMaps[player.modeMap]
        if (currentModeMap === undefined){
            return false
        }
        let currentMode = currentModeMap.wrapLookup(b)
        if (typeof currentMode !== 'string'){
            return false
        }
         let mode = e.modeFilters[currentMode]
        info.noteValues = info.noteValues.map(x => {
            return mode.nearestWrapLookup(x)
        })
        checkIfUseVerboseLogging(player, 'mode', mode)
    }
    else{
        info.noteValues = info.noteValues.map(x => {
            return filterMode(x, e, b, player)
        })
    }
    return info
}

function getRelativeMode (modeName){
    if (modeName === undefined || modeName === 'chromatic' || modeName === 'none'){
        return A.buildArray(12, x => {return x})
    }
    return Mode.get(modeName).intervals.map(x => Interval.semitones(x))
}

// function checkIfChangeFilteredMode (e, b, player){
//      let currentModeMap = e.modeMaps[player.modeMap]
//     if (currentModeMap === undefined){
//         return false
//     }
//     let currentMode = currentModeMap.wrapLookup(b)
//     let correctMode = getRelativeMode(currentMode)
//     checkIfUseVerboseLogging(player, 'testing modeFilter', e.modeFilters[player.modeFilter], correctMode)
//     try{
//         if (JSON.stringify(e.modeFilters[player.modeFilter].keys) === JSON.stringify(correctMode)){
//             return false
//         }
//         else {
//             checkIfUseVerboseLogging(player, 'changing mode NOW')
//             e.modeFilters[player.modeFilter] = new QuantizedMap(correctMode[correctMode.length - 1], correctMode, correctMode)
//             return true
//         }
//     }
//     catch{
//             checkIfUseVerboseLogging(player, 'changing mode NOW')
//             e.modeFilters[player.modeFilter] = new QuantizedMap(correctMode[correctMode.length - 1], correctMode, correctMode)
//             return true
//     }
// }

function createMapsFromMode (variableName, name, e, keyspan, keys, values){
    let finalName = name
    let checkConclusion = e.checkMap(variableName, name, keyspan, keys, keys)
    if (checkConclusion === undefined){
        e.addMap(variableName, name, keyspan, keys, values)
    }
    else if (checkConclusion === false){
        finalName = generateUniqueString(Object.keys(e[variableName]), name)
        e.addMap(variableName, finalName , keyspan, keys, values)
    }
    else if (checkConclusion !== true){
        return checkConclusion
    }
    return finalName
}

//NEW BELL MIDI FUNCS:

function getAllInfoFromChordProgression (progression){
    let data = {
        bools: [],
        octave: [],
        rootNote: [],
        velocity: [],
        note: [],
        keyspan: progression.keyspan,
        keys: progression.keys,
    }
    progression.values.forEach(x => {
        data.bools.push(x.bool)
        let notes = []
        x.data.forEach(d => {
            data.octave.push(d.octave)
            data.rootNote.push(d.rootNote)
            notes.push(d.note)
            data.velocity.push(d.velocity)
        })
        data.note.push(note)
    })
    return data
}

function extractNumberFromString(str) {
  let numericPart = "";
  for (let i = str.length - 1; i >= 0; i--) {
    if (!isNaN(str[i])) {
      numericPart = str[i] + numericPart;
    } else {
      break;
    }
  }
  return numericPart.length > 0 ? parseInt(numericPart, 10) : null;
}

function removeNumberFromString(str) {
  const numericPart = extractNumberFromString(str);
  return numericPart ? str.slice(0, -numericPart.toString().length) : str;
}

function generateUniqueString(array, targetString) {
  // Remove any numeric part from the target string
  const strippedTargetString = removeNumberFromString(targetString);
  // Check if the stripped target string already exists in the array
  if (!array.includes(strippedTargetString)) {
    return strippedTargetString; // If not, return the stripped target string as it is unique
  }
  // Extract a number from the target string, if any
  let existingNumber = extractNumberFromString(targetString) || 0;
  // Generate a unique string by appending numbers
  let index = existingNumber + 1;
  let uniqueString = targetString;
  while (array.includes(uniqueString)) {
    index++;
//     uniqueString = `${strippedTargetString}${index}`;
      uniqueString = strippedTargetString + index
  }
  return uniqueString;
}

// generateUniqueString(['exampleMidiPlayer', 'exampleMidiPlayer2'], 'exampleMidiPlayer1')

function createMapsFromChordProgressions (variableName, mapInfo, name, e, keys, values){
    let finalName = name
    let checkConclusion = e.checkMap(variableName, name, mapInfo.keys, mapInfo.keyspan, mapInfo.keys)
    if (checkConclusion === undefined){
        e.addMap(variableName, name, keys, keyspan, values)
    }
    else if (checkConclusion === false){
        finalName = generateUniqueString(Object.keys(e[variableName]), name)
        e.addMap(variableName, finalName , keyspan, keys, values)
    }
    else if (checkConclusion !== true){
        return checkConclusion
    }
    return finalName
}

function checkAndCreateChordProgressionMaps (mapInfo, name, e){
    return {
        rhythmMap: createMapsFromChordProgressions('rhythmMaps', name, mapInfo, name, e, mapInfo.keys, mapInfo.keys),
    noteMap: createMapsFromChordProgressions('noteMaps', name, mapInfo, name, e, mapInfo.keys, mapInfo.notes),
    rhythmPattern: createMapsFromChordProgressions('rhythmPatterns', name, mapInfo, name, e, mapInfo.keys, mapInfo.bools),
    maskMap: createMapsFromChordProgressions('maskMaps', mapInfo, name, e, mapInfo.keys, mapInfo.bools),
    octaveMap: createMapsFromChordProgressions('octaveMaps', mapInfo, name, e, mapInfo.keys, mapInfo.octaves),
    velocityMaps: createMapsFromChordProgressions('velocityMaps', mapInfo, name, e, mapInfo.keys, mapInfo.octaves),
    }
}

function applyNewMapNamesToPlayer (e, player, newMapNames){
    player.rhythmMap = newMapNames.rhythmMap
    player.noteMap = newMapNames.noteMap
    e.rhythmPatterns[newMapNames.rhythmPattern].add(e, player.name)
    player.maskMap = newMapNames.maskMap
    player.octaveMap = newMapNames.octaveMap
    player.veloctiyMap = newMapNames.velocityMap
}

//If it is time to change chordProgressions, will check if the chordProgression exitst in noteMaps. If no create a noteMap. Change player to use the correct noteMap.
function checkChangeChordProgressionAndCreateNewMaps (e, b, player){
    if (player.songMap === undefined){
        return true
    }
    let correctCurrentChordProgression = e.songMaps[player.songMap].wrapLookup(b)
    checkIfUseVerboseLogging(player, 'changin chord progression to' +  correctCurrentChordProgression)
//     console.log('correct', correctCurrentChordProgression)
    if (player.chordMap === correctCurrentChordProgression){
        return true
    }
    let mapInfos = getAllInfoFromChordProgression(e.chordMaps[correctCurrentChordProgression])
    let newMapNames = checkAndCreateChordProgressionMaps(mapInfos, correctCurrentChordProgression, e)
    applyNewMapNamesToPlayer(e, player, newMapNames)
}

function findChannel (player, b, e){
    checkIfUseVerboseLogging(player, 'Finding channel, beat:', b)
    let channelMap = e.channelMaps[player.channelMap]
    checkIfUseVerboseLogging(player, 'ChannelMap:', JSON.stringify(channelMap))
    return channelMap.wrapLookup(b)
}

function checkIfSendMidiProgramChangeMessages (e, b, player){
    let programChangeMessages = e.programChangeMaps[player.programChangeMapName].wrapLookup(b)
    let currentChannel = findChannel(player, b, e)
    let output = e.midiOutputs[player.midiOutput - 1]
    if (programChangeMessages instanceof Array){
        programChangeMessages.forEach(x => {
            output.send('program', {
                number: x,
                channel: currentChannel
            })
        })
    }
    else {
        output.send('program', {
            number: programChangeMessages,
            channel: currentChannel
        })
    }
}

function sendChordMidiInfo (playerName, b, e){
//     b = e.currentBeat()
    let cb = e.currentBeat()
    let player = e.players[playerName];
    let info = getNoteInfoToSend(player, cb, playerName, e);
    info.noteValues = undefined;
    let chordMap = player.chordMap;
    let chord = e.chordMaps[chordMap].wrapLookup(cb);
    info.noteValues = Chord.getChord(chord).intervals.map(x => Interval.semitones(x));
    info = filterpolyphony(e, cb, player, info);
//     console.log(info)
    checkIfUseVerboseLogging(player, 'sendChordMidiInfo: ' + info)
    info.noteValues = info.noteValues.map(x => {
        return filterMode(x, e, cb, player)
    });
    info = calculateFinalNoteValue(info, player, e);
    info.finalValues.forEach((x, i) => {
//         addLog('beat: ' + b)
        sendMidiData(info, player, x, findChannel(player, cb, e), e, b)
    });
    return true
}

//only thing diffferent is I am getting all the info at once.
function sendNotesMidiInfo (playerName, b, e){
//     console.log('check if b is beat', b, e.currentBeat(), b === e.currentBeat())
//     b = e.currentBeat()
    let cb = e.currentBeat()
    let player = e.players[playerName]
    let info = getNoteInfoToSend(player, cb, playerName, e)
    info = filterpolyphony(e, cb, player, info)
    info.noteValues = info.noteValues.map(x => {
        return filterMode(x, e, cb, player)
    })
    info = calculateFinalNoteValue(info, player, e)
    info.finalValues.forEach((x, i) => {
        let chann = findChannel(player, cb, e)
        sendMidiData(info, player, x, chann, e, b)
    })
    return true
}

function sendMidiCCMessages (playerName, b, e){
    let cb = e.currentBeat()
    let player = e.players[playerName]
    let CCMessages = e.controlChangeMaps[player.controlChangeMap].wrapLookup(cb)
    let channel = e.channelMaps[player.channelMap].wrapLookup(cb)
    if (CCMessages instanceof Array){
        CCMessages.forEach(x => {
           checkIfUseVerboseLogging(player, 'Playing Midi CC message.\n controller', x.controller, 'value: ', x.value, 'channel', channel - 1, 'midiOutput', player.midiOutput - 1)
            e.midiOutputs[player.midiOutput - 1].send('cc', {
                controller: x.controller,
                value: x.value,
                channel: channel - 1,
            });
        })
    }
    else {
           checkIfUseVerboseLogging(player, 'Playing Midi CC message.\n controller', CCMessages.controller, 'value: ', CCMessages.value, 'channel', channel - 1, 'midiOutput', player.midiOutput - 1)
        e.midiOutputs[player.midiOutput - 1].send('cc', {
            controller: CCMessages.controller,
            value: CCMessages.value,
            channel: channel - 1,
        });
    }
    return true
}
    
function sendMidiProgramMessages (playerName, b, e){
    let cb = e.currentBeat()
    let player = e.players[playerName]
    let midiProgam = e.midiProgramMaps[player.midiProgramMap].wrapLookup(cb)
    let channel = e.channelMaps[player.channelMap].wrapLookup(cb)
    if (midiProgam instanceof Array){
        midiProgam.forEach(x => {
           checkIfUseVerboseLogging(player, 'Playing Midi program.\n number', x,  'channel', channel - 1, 'midiOutput', player.midiOutput - 1)
            e.midiOutputs[player.midiOutput - 1].send('program', {
                number: x,
                channel: channel - 1,
            });
        })
    }
    else {
           checkIfUseVerboseLogging(player, 'Playing Midi program.\n number', midiProgam,  'channel', channel - 1, 'midiOutput', player.midiOutput - 1)
            e.midiOutputs[player.midiOutput - 1].send('program', {
                number: midiProgam,
                channel: channel - 1,
            });
    }
    return true
}

function completePendingTask (playerName, b, e){
    let cb = e.currentBeat()
    let player = e.players[playerName]
    let currentTaskList = e.tasksQueue[player.assignedTask]
    if (currentTaskList === undefined){
        logRedError('Player: ', playerName, 'using did not failed to run completePendingTask action function.', "\x1b[0m", '\nThe action function completePendingTask requires assignedTask variable to be defined within the player. It should be defined with a variable in the tasks object in the MusicalEnvironment in form of a string.')
    }
    let currentTask = currentTaskList[0]
    if (currentTask !== undefined){
        currentTask.func(currentTask.info, cb, e)
        e.tasksQueue[player.assignedTask].shift()
    }
}
//color logging: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color/41407246#41407246

// END OF NEW BELL MIDI FUNCTIONS

function getNoteInfoToSend(player, b, midiOutput, e) {
    checkIfUseVerboseLogging(player, player.name, ' using this noteMap: ', player.noteMap)
    return {
        noteDuration: e.noteDurationMaps[player.noteDurationMap].wrapLookup(b),
        velocity: convertVelocityToMidiValues(e.velocityMaps[player.velocityMap].wrapLookup(b)),
        //         noteValues:  e.noteMaps[player.noteMap].wrapLookup(e.noteDurationMaps[player.noteDurationMap].wrapLookup(b)),
        noteValues: e.noteMaps[player.noteMap].wrapLookup(b),
        //         noteValues: (e.octaveMaps[player.noteMap].wrapLookup(e.noteDurationMaps[player.noteDurationMap].wrapLookup(b)) * 12) + e.rootNoteMaps[player.noteMap].wrapLookup(e.noteDurationMaps[player.noteDurationMap].wrapLookup(b)),
        octaves: e.octaveMaps[player.octaveMap].wrapLookup(b),
        root: e.rootMaps[player.rootMap].wrapLookup(b),
    }
}

//Update Midi outputs:
function updateMidiOutputList (e){
    let easymidiOutputs = easymidi.getOutputs()
    if (e.midiOutputs !== undefined){
        e.midiOutputs.forEach(x => {
            x.close()
        })
    }
    e.midiOutputs = easymidiOutputs.map(x => {
        return new easymidi.Output(x)
    })
}

//Yiler function:
function getMidiKeys(scaleOrChordNotesArray) {
    let outputArray = scaleOrChordNotesArray.map(e => Note.midi(e))
    return outputArray
}

//Get the root note of a midi Values:
function getRootMidiValues (note){
    note.forEach((x, i) =>{
        note[i] = x + 0
    })
    let midiValues = note.map ( x =>{
        return Midi.toMidi(x)
    })
    return midiValues.map (x =>{
        return x - 12
    })
}

//Converts midi values to musical notes:
function midiToMusicNotes (array){
    return array.map(x =>{
        return Midi.midiToNoteName(x)
    })
}

function updateMidiInputList (e){
    e.midiInputs = easymidi.getInputs().map(x => {
        return {inputName: x, recordMessage: false}
    })
}

function ignoreMessagesFromInput (e, inputIndex){
    let currentInput = e.midiInputs[inputIndex]
    currentInput.outputPort.off('message', currentInput.inputFunc)
}

//Yiler function start here:

let scaleDegreeToNote = Scale.degrees("C major")

let chromaticScale = Scale.get("C chromatic")

//the QuantizedMap that filters notes by chords
let filterQM = new QuantizedMap(12, [0, 4, 7, 11], [1, 3, 5, 7])

function noteToScaleDegree(note, scale) {
    // Make sure the note is in uppercase for case-insensitive comparison
    // Find the index of the note in the scale
    const scaleDegree = scale.indexOf(note);
    // If the note is not in the scale, return null
    if (scaleDegree === -1) {
        return null;
    }
    // Scale degrees usually start from 1, so add 1 to the index
    return scaleDegree + 1;
}

let playedNotes = []

function sortArrays(arrayA, arrayB) {
    // Combine the two arrays into an array of objects with original indices
    const combinedArray = arrayA.map((element, index) => ({
        element,
        index
    }));
    // Sort the combined array based on the elements of arrayA
    combinedArray.sort((a, b) => a.element - b.element);
    // Extract the sorted arrays from the combined array
    const sortedArrayA = combinedArray.map(item => item.element);
    const sortedArrayB = combinedArray.map(item => arrayB[item.index]);
    // Return the result as an object
    return {
        arrayA: sortedArrayA,
        arrayB: sortedArrayB
    };
}

function addInputMessageToRecordedMessages (inputIndex, recordedMessagesName, e){
    e.recordedMessages[recordedMessagesName] = e.midiInputs[inputIndex].recordedMessages
    let messages = e.recordedMessages[recordedMessages]
    let relativeKeys = [0]
    messages.keys.forEach((x, i) => {
        if (i < messages.length - 1){
            relativeKeys.push(messages[i] - x)
        }
    })
    messages.keys = relativeKeys
}

// --------------------------------------------------------------------------
// //Action function:

function convertQuantizedMapToRelativeForm (map){
    let amountToRemove = map.keys[0] - 0
    if (amountToRemove !== 0){
        map.keyspan -= amountToRemove
        map.keys = map.keys.map(x => {
            return x - amountToRemove
        })
    }
    return map
}

function sendPlaybackMessage (p, b, e){
    let cb = e.currentBeat()
    let midiOutput = p
//     console.log(typeof e, b, midiOutput)
//     if ((mask(p, e.maskMaps[e.players[p].maskMap] ,(e.currentBeat()),1)) != true) {
        let player = e.players[midiOutput]
        let dataToSend = e.recordedMessages[player.recordedMessages].wrapLookup(cb)
    console.log('data to send', dataToSend)
        e.midiOutputs[player.midiOutput - 1].send(dataToSend._type, dataToSend)
//     }
}


function generateQuantizedMapFromAbsoluteNumberArray (numbers){
    let numbersLength = numbers.length - 1
    return new QuantizedMap(numbers[numbers.length - 1], numbers, numbers.map((x, i) => {
        if (i < numbersLength){
            return numbers[i + 1] - x
        }
    }).slice(0, numbers.length - 1))
}

// function createPlaybackPlayer (e, midiOutput, recordedMessagesName){
//     let message = e.recordedMessages[recordedMessagesName]
// //     e.rhythmMaps[recordedMessagesName] = new QuantizedMap(1, [1], generateQuantizedMapFromAbsoluteNumberArray(message.keys))
// //     e.maskMaps[recordedMessagesName] = new QuantizedMap(message.keyspan, messages.keys, messages.keys.map(x => {return true}))
// //     player.rhythmMap = recordedMessagesName
// //     player.maskMap = recordedMessagesName
// //     console.log(typeof e, recordedMessagesName, e.players)
//     setupPlaybackPlayer(e, recordedMessagesName)
//     let player = e.players[recordedMessagesName]
//     let numbersLength = message.keys.length - 0
//     let numbers = message.keys
//     e.rhythmPatterns[recordedMessagesName + 'Playback'] = new RhythmPattern (recordedMessagesName, message.keyspan, numbers.map((x, i) => {
//         if (i < numbersLength){
//             return numbers[i + 1] - x
//         }
//     }).slice(0, numbers.length - 1), message.keys.map(x => {return true}))
//     e.rhythmPatterns[recordedMessagesName + 'Playback'].add(e, recordedMessagesName)
//     console.log('palyer', player)
//     player.rhythmMap = 'straight'
//     console.log('recordedMessagesName', recordedMessagesName)
//     player.recordedMessages = recordedMessagesName
//     player.midiOutput = midiOutput
// }

function createPlaybackPlayer (e, midiOutput, recordedMessagesName){
    let message = e.recordedMessages[recordedMessagesName]
//     e.rhythmMaps[recordedMessagesName] = new QuantizedMap(1, [1], generateQuantizedMapFromAbsoluteNumberArray(message.keys))
//     e.maskMaps[recordedMessagesName] = new QuantizedMap(message.keyspan, messages.keys, messages.keys.map(x => {return true}))
//     player.rhythmMap = recordedMessagesName
//     player.maskMap = recordedMessagesName
//     console.log(typeof e, recordedMessagesName, e.players)
    setupPlaybackPlayer(e, recordedMessagesName)
    let player = e.players[recordedMessagesName]
    let numbersLength = message.keys.length - 0
    let numbers = message.keys
    e.rhythmPatterns[recordedMessagesName + 'Playback'] = new RhythmPattern (recordedMessagesName, message.keyspan, numbers.map((x, i) => {
        if (i < numbersLength){
            return numbers[i + 1] - x
        }
    }).slice(0, numbers.length - 1), message.keys.map(x => {return true}))
    e.rhythmPatterns[recordedMessagesName + 'Playback'].add(e, recordedMessagesName)
    console.log('palyer', player)
    player.rhythmMap = 'straight'
    console.log('recordedMessagesName', recordedMessagesName)
    player.recordedMessages = recordedMessagesName
    player.midiOutput = midiOutput
}

function createExtensionPlayerBasics (e, name, keyspan, keys, midiOutput, mapDefaultName){
    let player = e.players[name]
    e.rhythmMaps[name] = new QuantizedMap(1, [1], [new QuantizedMap(keyspan, keys, keys.map(x => {return 1}))])
    e.rhythmPatterns[name] = new RhythmPattern (name, keyspan, keys.map((x, i) => {
        return 1
    }), keys.map(x => {return true}))
    e.rhythmPatterns[name].add(e, name)
    player.rhythmMap = 'straight'
    player.midiOutput = midiOutput
    player.channelMap = mapDefaultName
}

function createMidiCCPlayer (e, name, keyspan, keys, midiCCs, midiOutput, mapDefaultName){
    setupMidiCCPlayer(e, name)
    let player = e.players[name]
    createExtensionPlayerBasics (e, name, keyspan, keys, midiOutput, mapDefaultName)
    e.controlChangeMaps[name] = new QuantizedMap(keyspan, keys, midiCCs)
    e.rhythmMaps[name] = new QuantizedMap(1, [0], [new QuantizedMap(keyspan, keys, keys.map(x => {return 1}))])
    player.controlChangeMap = name
    player.rhythmMap = name
}

function createMidiProgramPlayer (e, name, keyspan, keys, midiPrograms, midiOutput, mapDefaultName){
    setupMidiProgramPlayer(e, name)
    let player = e.players[name]
    createExtensionPlayerBasics (e, name, keyspan, keys, midiOutput, mapDefaultName)
    e.midiProgramMaps[name] = new QuantizedMap(keyspan, keys, midiPrograms)
    e.rhythmMaps[name] = new QuantizedMap(1, [0], [new QuantizedMap(keyspan, keys, keys.map(x => {return 1}))])
    player.midiProgramMap = name
    player.rhythmMap = name
}

addToModuleExports({
  addInputMessageToRecordedMessages,
  calculateFinalNoteValue,
  checkIfStringIncluesNumber,
  convertLettersToMidi,
  convertNoteValuesToMidi,
  convertRomanNumeralsToMidi,
  convertVelocityToMidiValues,
  filterMode,
  filterpolyphony,
  getMidiKeys,
  getNoteInfoToSend,
  getRelativeMode,
  getRootMidiValues,
  ignoreMessagesFromInput,
  isNumeric,
  midiToMusicNotes,
  sendMidiData,
  setupMidiRhythm,
  setupPlaybackPlayer,
  updateMidiInputList,
  updateMidiOutputList,
    convertQuantizedMapToRelativeForm,
    sendPlaybackMessage,
    generateQuantizedMapFromAbsoluteNumberArray,
    createPlaybackPlayer,
    checkIfUseVerboseLogging,
    getAllInfoFromChordProgression,
    extractNumberFromString,
    removeNumberFromString,
    generateUniqueString,
    createMapsFromChordProgressions,
    checkAndCreateChordProgressionMaps,
    applyNewMapNamesToPlayer,
    checkChangeChordProgressionAndCreateNewMaps,
    sendChordMidiInfo,
    sendNotesMidiInfo,
    findChannel,
    createMidiCCPlayer,
    createMidiProgramPlayer,
    createExtensionPlayerBasics,
    setupTaskPlayer,
    convertNumericChordToMusicalChordNotation,
})

// --------------------------------------------------------------------------
//example-websocket-midiOutput.js:

function schedulePlayerAction (info, action){
    if (wss.connectedMusicalEnvironment === undefined){
        logRedError('Signal from websocketserver to' + action + ' player will be ignored. No MusicalEnvironmentConnected.', "\x1b[0m", '\nConnect MusicalEnvironment by opening the musical-environment-viewer/index.html file in the browser and run the sendClientEnvInfo method of the MusicalEnvironment in nodejs with no arguments')
        return false
    }
    else {
        info.action = action
        wss.connectedMusicalEnvironment.tasksQueue[wss.assignedTasksArray].push({func: websocketSignalPlayer, info: info})
    }
}
//color logging: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color/41407246#41407246

function websocketSignalPlayer (info){
    wss.connectedMusicalEnvironment[info.action](info.playerName)
    return true
}

let clients = [];

let newResponseTimes = []

let commands = [
    {
        action: "hi",
        func: function () {
            console.log("hi");
        },
    },{
        action: "recordResponseTime",
        func: function (info){
            newResponseTimes.push(info.date)
        }
    },{
        action: 'play',
        func: function (info){
            schedulePlayerAction(info, 'play')
        }
    },{
        action: 'stop',
        func: function (info){
            schedulePlayerAction(info, 'stop')
        }
    }
];

let wss = false
function createDefaultWebsocketServer () {
    if (wss !== undefined && wss !== false){
        wss.close()
    }
    wss = new WebSocketServer.Server({ port: 8080});
    wss.on("connection", (ws) => {
        console.log("new client connected");
        addNewClients()
        ws.onmessage = (e) => {
            console.log('data received')
            let data = JSON.parse(wss.connectedMusicalEnvironment.data)
            if (data != undefined) {
                //console.log("command received",e.target, e.data);
                receiveCommands(data, wss.connectedMusicalEnvironment.target);
            }
        };
        // handling what to do when clients disconnects from server
        ws.on("close", () => {
            removeClient(ws)
            console.log("the client has connected");
        });
        // handling client connection error
        ws.onerror = function () {
            console.log("Some Error occurred");
        };
    });
    return wss
}

function connectVariableToCurrentWss (){
    return wss
}

function changeWebsocketServerPort (newPort, wss){
    if (wss.address().port === newPort){
        console.log('WebSocketServer already on requested port')
        return false
    }
    else {
        console.log(typeof wss, wss.address())
        wss.close()
        wss = new WebSocketServer.Server({port: newPort});
        createDefaultWebsocketServer()
        console.log('WebSocketServer switched to port ', newPort)
        return wss
    }
}

addToModuleExports({
clients, commands, newResponseTimes, createDefaultWebsocketServer, wss, changeWebsocketServerPort, connectVariableToCurrentWss
})

// --------------------------------------------------------------------------
//example-melodies-data.js:

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
  rhythmMap: [0,5, 1, 2.5, 2.75, 4, 5, 6, 8, 8.3, 8.6, 9, 10, 10.5, 10.8],
  bools: [true, true, true, true, true, true, true, true, true, true],
  octave: chordProgressionScarboroughFair.map(x => {
      return x[0].octave
  }),
   noteDurationKeyspan: 64,
  noteDurations: A.buildArray(16, x => {return (x)}),
  noteDurationKeys: A.buildArray(16, x => {return x * 4}),
  noteValues: noteData.map(x => {
      return x.map(n => {
          return n.note
      })
  }),
   total: 64,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
    controlChangeMapKeys: [20, 40, 60, 80],
    controlChangeMap: A.buildArray(4, x => {return {
      channel: 0,
      controller: 25,
      value: randomRange(0, 159),
    }
    })
}

//noteData2 = generateRandomMelody('C', 'bluesPentatonic', 40, 4, 6)
noteData2 = chordProgressionScarboroughFair
randomMelody1 = {
  velocity: A.buildArray(40, x => {return randomRange(30, 50)}),
  bools: A.buildArray(48, x => {return true}),
  octave: chordProgressionScarboroughFair.map(x => {
      return 3
  }),
   noteDurationKeyspan: 64,
  noteDurations: A.buildArray(16, x => {return (x)}),
  noteDurationKeys: A.buildArray(16, x => {return x * 4}),
  noteValues: noteData.map(x => {
      return x.note
  }),
   total: 64,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
}

noteData3 = chordProgressionScarboroughFair

randomMelody2 = {
    velocity: [...A.buildArray(39, x => {return 0}), ...A.buildArray(8, x => { return 120})],
  bools: [...A.buildArray(39, x => {return true}), ...A.buildArray(8, x => {return true})],
  octave: chordProgressionScarboroughFair.map(x => {
      return x[0].octave
  }),
  polyphonyMap: A.buildArray(16, x => {return 50}),
   noteDurationKeyspan: 64,
  noteDurations: A.buildArray(16, x => {return (x)}),
  noteDurationKeys: A.buildArray(16, x => {return x * 4}),
  noteValues: noteData.map(x => {
      return x.map(n => {
          return n.note
      })
  }),
   total: 64,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
}

melodyDataNoteData = generateChords(0, 4, "7", "major")
melodyData = {
  channelKeyspan: 1,
  channelKeys: [0],
  channelValues: [2],
  noteValuesKeyspan: 12,
  rootMap: ['C', 'C', 'C', 'C'],
  velocity: [
    112, 107, 116, 115,
    109, 107,  97, 112,
    116,  91,  96, 113
  ],
  bools: A.buildArray(48, x => {return true}),
  octave: chordProgressionScarboroughFair.map(x => {
      return 3
  }),
   noteDurationKeyspan: 64,
  noteDurations: A.buildArray(16, x => {return (x)}),
  noteDurationKeys: A.buildArray(16, x => {return x * 4}),
  noteValues: noteData.map(x => {
      return x.map(n => {
          return n.note
      })
  }),
   total: 64,
  polyphonyMap: A.buildArray(16, x => {return 50}),
  rhythmMap: A.buildArray(16, x => {return x * 4}),
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
  channelKeyspan: 1,
  channelKeys: [0],
  channelValues: [1],
  rootMap: ['C', 'C', 'C', 'C'],
  velocity: velocityData,
   noteDurationKeyspan: 12,
  noteDurations: A.buildArray(12, x => {return (x)}),
  noteDurationKeys: A.buildArray(12, x => {return x}),
  bools: boolsData,
    modeFilter: getRelativeMode('chromatic'),
    modeFilterKeyspan: 12,
    modeFilterKeys: getRelativeMode('chromatic'),
  octave: chordProgressionScarboroughFair.map(x => {
      return x[0].octave + 1
  }),
  noteValuesKeyspan: 12,
  noteValues: [0,1,2,3,4,5,6,7,8,9,10,11].map(x => {return [x]}),
  total: 16,
  polyphonyMap: A.buildArray(12, x => {return 50}),
  rhythmMap: A.buildArray(12, x => {return x}),
  legatoMap: [1, 1, 1, 1]
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

function createCircleOfFifths(startingNote) {
    // Define the starting note
    let currentNote = startingNote;
    const circle = [currentNote];
    // Loop through 11 times to complete the circle of fifths
//     for (let i = 0; i < 11; i++) {
    Array.from({length: 11}, () => {
        // Get the next note in the circle (up a perfect fifth)
        currentNote = Note.transpose(currentNote, "P5");
        circle.push(currentNote);
    })
    // Print the circle of fifths
    return circle;
}

function generateCircleOfFifthsProgression (nChords, key) {
    let c1 = createCircleOfFifths(key)
    return R.reverse(A.buildArray(nChords, i => c1[i%(c1.length)]))
}

function unzip (inputArray) {
    let zeros = inputArray.map(x=> x[0]);
    let ones = inputArray.map(x=> x[1]);
    return [zeros, ones]
}

// argument is an array of weight/value pairs as arrays
function weightedPick (pairs) {
    let t2 = unzip(pairs)
    let absolutes = deltaToAbsolute(A.scaleToSum(1,t2[0]))
    let w1 = new QuantizedMap(absolutes[0], absolutes[1], t2[1])
    return w1.floorLookup(Math.random())
}

let chordTypes = {
        chordColor: ['M','m','dim','aug','sus2','sus4'],
        chordColorWeights: [2,4,0.5,1,1,0.5,0.5],
        chordAdd: ['','2','4','6','7','9','11','13'],
        chordAddWeights: [15,0.5,0.5,1,1,1,0.5,0.5],
}

function randomChord (rootNote, chordData) {
    let color = weightedPick(R.zip(chordData.chordColorWeights,chordData.chordColor))
    let add = weightedPick(R.zip(chordData.chordAddWeights,chordData.chordAdd))
    if (color === 'aug' && (add != '')) {add = '7'};
    if (color === 'dim' && add != '') {add = '7'};
    if (color === "sus2" || color === "sus4") {add = ''}
    if (add === '2') {color = ''};
    return [rootNote, color + add]
}

function generateCircleOfFifthsChordProgression(chordLengths, key, counterClockwiseChance) {
    let progression = [];
    let circleOfFifth = createCircleOfFifths(key);
    let currentNoteIndex = 0;
    //console.log(chordLengths.length)
//     for (let i = 0; i < chordLengths.length; i++) {
    Array.from({length: chordLengths.length}, () => {
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
    })
    let romanNumeralProgression = Progression.toRomanNumerals(key, progression);
    return romanNumeralProgression
}

let progression = generateCircleOfFifthsChordProgression([1,1,1,1], "C", 0.5)

let chords = generateChordsv2("C", 5, progression)

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
  channelKeyspan: 1,
  channelKeys: [0],
  channelValues: [4],
  velocity: A.buildArray(30, x => 90),
   noteDurationKeyspan: 16,
  noteDurations: [0, 1, 2, 3],
  noteDurationKeys: [4, 4, 4, 4],
  bools: boolsData,
  modeFilter: A.buildArray(12, x=> x),
  modeFilterKeyspan: 12,
  octave: newChords2.map(x => {
      return x.octaveNotes[0]
  }),
  noteValues: newChords2.map(x => {
      return x.rootNotes
  }),
  total: 12,
  rhythmMap: [0, 4, 8, 12],
  rootMap: ['C', 'C', 'C', 'C'],
    noteValuesKeyspan: 12,
}


circleOfFifthMelodyGeneration = melodyFromChordProgression(chords, circleOfFifthChords.rhythmMap)
circleOfFifthMelodySplitNotes = separateOctaveAndRoot(circleOfFifthMelodyGeneration.notes)
circleOfFifthMelody = {
  channelKeyspan: 1,
  channelKeys: [0],
  channelValues: [3],
    velocity: A.buildArray(30, x => 90),
    noteDurationKeyspan: 18,
    noteDurations: A.buildArray(24, x => x/2),
    noteDurationKeys: A.buildArray(24, x => 0.25),
    bools: boolsData,
    modeFilterKeyspan: 18,
    octave: circleOfFifthMelodySplitNotes.octaveNotes.map(x => {return 3}),
noteValues: circleOfFifthMelodySplitNotes.rootNotes.map(x => {return [x]}),
    total: 18,
    rhythmMap:  A.buildArray(12, x => x/2),
  rootMap: ['C', 'C', 'C', 'C'],
  modeMap: ['ionian', 'phrygian', 'mixolydian'],
  modeMapKeys: [0, 100, 200, 300, 400],
  noteValuesKeyspan: 12,
}

addToModuleExports({
  boolsData,
  chordProgressionScarboroughFair,
  chords,
  circleOfFifthChords,
  circleOfFifthMelody,
  circleOfFifthMelodyGeneration,
  circleOfFifthMelodySplitNotes,
  createCircleOfFifths,
  generateCircleOfFifthsProgression,
  unzip,
    weightedPick,
    chordTypes,
    randomChord,
  generateCircleOfFifthsChordProgression,
  generateChordsv2,
  generationData,
  getMidiKeys,
  lsystemData,
  melodyData,
  newChords2,
  noteData,
  noteData2,
  noteData3,
  progression,
  randomMelody1,
  randomMelody2,
  randomMelodyData,
  separateOctaveAndRoot,
  total,
  velocityData
})

//--------------------------------------------------------------------------
//Yiler keyboard filtering stuff:

function removeNumber(inputString) {
    // Use a regular expression to replace all numbers with an empty string
    var resultString = inputString.replace(/\d/g, '');
    return resultString;
}

function extractNumbers(inputString) {
    // Use regular expression to replace anything that is not a number with an empty string
    const numbersOnly = inputString.replace(/[^0-9]/g, '');
    return numbersOnly;
}

function noteToScaleDegree(note, scale) {
    // Make sure the note is in uppercase for case-insensitive comparison
    // Find the index of the note in the scale
    const scaleDegree = scale.indexOf(note);
    // If the note is not in the scale, return null
    if (scaleDegree === -1) {
        return null;
    }
    // Scale degrees usually start from 1, so add 1 to the index
    return scaleDegree + 1;
}

let keyboard;

// let filteredOutput = new easymidi.Output('filteredOut', true);

playedNotes = [];

function sortArrays(arrayA, arrayB) {
    // Combine the two arrays into an array of objects with original indices
    const combinedArray = arrayA.map((element, index) => ({
        element,
        index
    }));
    // Sort the combined array based on the elements of arrayA
    combinedArray.sort((a, b) => a.element - b.element);
    // Extract the sorted arrays from the combined array
    const sortedArrayA = combinedArray.map(item => item.element);
    const sortedArrayB = combinedArray.map(item => arrayB[item.index]);
    // Return the result as an object
    return {
        arrayA: sortedArrayA,
        arrayB: sortedArrayB
    };
}

function activateKeyboardFilter(keyboardName, e) {
    keyboard = new easymidi.Input(keyboardName);
    keyboard.on('noteon', function(event) {
        try {
            let currentChordRoot = e.rootMaps.testChordProgression1.wrapLookup((e.currentBeat() + 1));
            let currentChordQuality = e.chordMaps.testChordProgression1.wrapLookup((e.currentBeat() + 1))[0];
            let currentNoteMap = e.noteMaps.testChordProgression1.wrapLookup((e.currentBeat() + 1));
            let octave = extractNumbers(Note.fromMidi(event.note));
            let noteBeingPlayed = removeNumber(Note.fromMidi(event.note));
            chromaticScale = Scale.get(`${currentChordRoot} chromatic`)
            chromaticScale.notes = chromaticScale.notes.map(n => removeNumber(Note.fromMidi(Note.midi(n + "1"))))
            console.log("here")
            console.log(currentNoteMap)
            console.log(`root: ${currentChordRoot} quality: ${currentChordQuality}`)
            console.log(`${currentChordRoot} chromatic`)
            filterQM.keys = currentNoteMap;
            filterQM.values = currentNoteMap.map(semitone => chromaticScale.notes[semitone]);
            console.log("noteBeingPlayed: " + noteBeingPlayed)
            console.log("fQM: " + filterQM.values)
            let filteredNote = filterQM.wrapLookup(chromaticScale.notes.indexOf(noteBeingPlayed)) + octave
            playedNotes.push({
                originalNote: Note.fromMidi(event.note),
                filtered: filteredNote
            })
            console.log(playedNotes)
            console.log("filteredNote" + filteredNote)
            filteredOutput.send('noteon', {
                note: Note.midi(filteredNote),
                velocity: 90,
                channel: 2
            });
        } catch (err) {
            console.log(err)
        }
    });
    keyboard.on('noteoff', function(event) {
        try {
            let octave = Note.fromMidi(event.note).charAt(Note.fromMidi(event.note).length - 1)
            let filteredNote = filterQM.wrapLookup(chromaticScale.notes.indexOf("noteBeingPlayed")) + octave
            let noteOffObj = playedNotes.filter(note => note.originalNote == Note.fromMidi(event.note))[0]
            console.log(filteredNote)
            console.log('noteoff obj', noteOffObj)
            filteredOutput.send('noteoff', {
                note: Note.midi(noteOffObj.filtered),
                velocity: 90,
                channel: 2
            });
            //playedNotes = A.removeFirstInstance(playedNotes, filteredNote)
            playedNotes = A.removeFirstInstance(playedNotes, noteOffObj)
        } catch (err) {
            console.log(err)
        }
    });
}

addToModuleExports({
    removeNumber,
    extractNumbers,
    noteToScaleDegree,
    keyboard,
//     filteredOutput,
    playedNotes,
    sortArrays,
    activateKeyboardFilter
})

// activateKeyboardFilter("Arturia KeyStep 32")

//--------------------------------------------------------------------------
//Key Identifying (Krumhansl and Schmuckler Key Identifying Algorithm)

function findVariableWithMaxNumber(obj) {
  return Object.entries(obj).reduce((max, [key, value]) => value > obj[max] ? key : max, Object.keys(obj)[0]);
}

// https://www.dolmetsch.com/musictheory31.htm

function compareSimilarityBetweenStrings (stringToCheck, stringToCompare){
    let comparisonStringToModify = stringToCompare + ' ';
    Array.from({length: stringToCompare.length}).every(x => {
        comparisonStringToModify = comparisonStringToModify.slice(0, comparisonStringToModify.length - 1);
        return !stringToCheck.includes(comparisonStringToModify)
    })
    return comparisonStringToModify.length / stringToCompare.length
}

function getAllNoteOn (track){
    let notes = []
    track.forEach(x => {
        if (x.subtype == 'noteOn'){
            notes.push(x.noteNumber)
        }
    })
    return notes
}

function findKeyOfChordProgression (midiNotes){
    let letters;
//     if (midiNotes.length > 31){
//         letters = midiNotes.slice(0, 31).map(x => {return midiToRootAndValue(x).root})
//     }
//     else{
        letters = midiNotes.map(x => {return midiToRootAndValue(x).root})
//     }
    let letterCounts = lodash.countBy(letters);
    let detectedScale = K.Scale.detect(letters, {tonic: findVariableWithMaxNumber(letterCounts)});
    let scaleSimilarity = {}
    detectedScale.forEach(x => {
        scaleSimilarity[x] = compareSimilarityBetweenStrings(K.Scale.get(x).notes, letters)
    })
    return K.Scale.get(findVariableWithMaxNumber(scaleSimilarity)).tonic
}

addToModuleExports({
    midiToRootAndValue,
    findVariableWithMaxNumber,
    compareSimilarityBetweenStrings,
    findKeyOfChordProgression,
    getAllNoteOn,
})

//--------------------------------------------------------------------------
//MIDI-reading:

function getDataFromMidiFile (midiFileData, e){
    let tempos = []
    let timeSignatures = []
    let endsOfTracks = []
    let name;
    midiFileData.tracks.forEach(x => {
        let data = []
        x.forEach(e => {
            if (e.subtype === 'setTempo'){
                tempos.push(e)
            }
            else if (e.subtype === 'endOfTrack'){
                endsOfTracks.push(e)
            }
            else if (e.type === 'meta' && e.subtype === 'text'){
                name = e.text
            }
            else if (e.subtype === 'timeSignature'){
                timeSignatures.push(e)
            }
        })
    })
    return {name: name, timeSignatures: timeSignatures, tempos: tempos, endsOfTracks: endsOfTracks}
}

function groupByAbsoluteTime(objects) {
  let result = [];
  let currentGroup = [];
  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];
    let nextObj = objects[i + 1];
    currentGroup.push(obj);
    if (!nextObj || obj.absoluteTime !== nextObj.absoluteTime) {
      result.push(currentGroup);
      currentGroup = [];
    }
  }
  return result;
}

function midiToRootAndValue (midiNote){
    let rootAndValue = Note.fromMidi(midiNote)
    return {value: rootAndValue.slice(rootAndValue.length - 1), root: rootAndValue.slice(0, rootAndValue.length - 1)}
}

function splitMidiNote (midiNote, musicalKey){
    let noteInfo = Note.get(Note.fromMidi(midiNote))
    return {octave: noteInfo.oct, note: Interval.semitones(Interval.distance(musicalKey, noteInfo.pc)), key: musicalKey}
}

function checkIfTrackIncludesNoteOnOffMessages (midiTrack){
    return !midiTrack.every(x => {if (x.subtype === 'noteOn'){return false};return true})
}

function findFileNameFromFilePath (filePath){
    let pathArray = filePath.split('/').join('\\').split('\\');
    return pathArray[pathArray.length - 1].split('.')[0]
}

function getClosestSmallerDivisible(originalNumber, divisibleBy) {
  // If originalNumber is already divisible by divisibleBy, return originalNumber
  if (originalNumber % divisibleBy === 0 || divisibleBy > originalNumber) {
    return originalNumber;
  }
  // Decrease originalNumber until it can be divided by divisibleBy without remainder
  originalNumber = Math.floor(originalNumber / divisibleBy) * divisibleBy;
  return originalNumber;
}

function findDurationOfEachNote (midiTrack, ticksPerQuarter){
    let notesCurrentlyOn = []
    let completeNotes = []
    let absoluteTime = 0
    let programChangeMessages = []
    let controllerMessages = []
    midiTrack.forEach((x, i) => {
        if (typeof x.deltaTime === 'number'){
            absoluteTime += x.deltaTime
        }
        if (x.subtype === 'noteOn'){
            notesCurrentlyOn.push(Object.assign(x, {absoluteTime: absoluteTime / ticksPerQuarter}))
        }
        else if (x.subtype === 'noteOff'){
            notesCurrentlyOn.every((n, d) => {
                if (n.noteNumber === x.noteNumber){
                    notesCurrentlyOn[d].noteDuration = (absoluteTime - n.absoluteTime) / ticksPerQuarter
                    completeNotes.push(notesCurrentlyOn[d])
                    notesCurrentlyOn = A.safeSplice(notesCurrentlyOn, 1, d)
                    return false
                }
                return true
            })
        }
        else if (x.subtype === 'controller'){
            controllerMessages.push(Object.assign(x, {absoluteTime: absoluteTime / ticksPerQuarter}))
        }
        else if (x.subtype === 'programChange'){
            programChangeMessages.push(Object.assign(x, {absoluteTime: absoluteTime / ticksPerQuarter}))
        }
    })
    return {completeNotes: completeNotes.sort((a, b) => a.absoluteTime - b.absoluteTime), 'endOfTrackAbsoluteTime': absoluteTime / ticksPerQuarter, 'controllerMessages': controllerMessages, 'programChangeMessages': programChangeMessages}
}

function playerForMidiTrack (musicalKey, midiTrack, name, output, ticksPerQuarter, e){
    let completedNotesData = findDurationOfEachNote(midiTrack, ticksPerQuarter)
    let completedNoteOnEvents = groupByAbsoluteTime(completedNotesData.completeNotes)
     let keyspan = getClosestSmallerDivisible(completedNotesData.endOfTrackAbsoluteTime, e.timeSignature)
    let keys = completedNoteOnEvents.map(x => {return x[0].absoluteTime})
    configObj = {
        channelKeyspan: 1,
        channelKeys: [0],
        channelValues: [output],
        rootMap: [],
        velocity: completedNotesData.completeNotes.map(x => {return x.velocity}),
        bools: midiTrack.map(x => {return true}),
        noteDurationKeyspan: keyspan,
        noteDurations: completedNoteOnEvents.map(x => {return x[0].noteDuration}),
        noteDurationKeys: keys,
        rootMapKeys: keys,
        rootMapKeyspan: keyspan,
        octaveMapKeys: keys,
        octaveMapKeyspan: keyspan,
        noteValuesKeys: keys,
        noteValuesKeyspan: keyspan,
        noteValues: [],
        total: completedNotesData.endOfTrackAbsoluteTime,
        rhythmMap:  absoluteToDelta(completedNoteOnEvents.map(x => {return x[0].noteDuration})),
    }
    configObj.octave = []
         configObj.noteValues = completedNoteOnEvents.map(x => {return x.map(n => {
             let allData = splitMidiNote(n.noteNumber, musicalKey)
             configObj.rootMap.push(musicalKey)
           configObj.octave.push(allData.octave)
         return allData.note
     })})
        let extraConfig = {
            midiOutput: 1,
            polyphonyMapName: 'default', modeMapName: 'default', legatoMapName: 'default', controlChangePlayerName: false, midiProgramPlayerName: false}
    if (completedNotesData.controllerMessages.length > 0){
        configObj.controlChangePlayerKeyspan = keyspan
        let groupedCC = groupByAbsoluteTime(completedNotesData.controllerMessages)
        configObj.controlChangePlayerKeys = groupedCC.map(x => {return x[0].absoluteTime})
        configObj.controlChangePlayer = groupedCC.map(x => {
            return x.map(c => {
                return {channel: c.channel, controller: c.controllerType, value: c.value}
            })
        })
        delete extraConfig.controlChangePlayerName
    }
    if (completedNotesData.programChangeMessages.length > 0){
        configObj.midiProgramPlayerKeyspan = keyspan
        let groupedProgamChangeMessages = groupByAbsoluteTime(completedNotesData.programChangeMessages)
        configObj.midiProgramPlayerKeys = groupedProgamChangeMessages.map(x => {return x[0].absoluteTime})
        configObj.midiProgramPlayer = groupedProgamChangeMessages.map(x => {
            return x.map(p => {
                return p.programNumber
            })
        })
        delete extraConfig.midiProgramPlayerName
    }
    recordConfigurationDataIntoMusicalEnvironment(configObj, name, e)
//     assignPlayerForMusicSynthesizerMidiOutput(e, name, name, extraConfig)
//     e.rhythmMaps[name].values[0] = new QuantizedMap(keyspan, keys, absoluteToDelta(keys))
//     e.rhythmMaps[name].values[0].values.push(keyspan - keys[keys.length - 1])
    return {name: name, extraConfig: extraConfig, keyspan: keyspan, keys: keys, configObj: configObj, midiOutput: 1}
}

function createExtensionPlayers (noteValueData, playerName, e, midiOutput, mapDefaultName){
    createControlChangePlayers.apply(null, arguments)
    createMidiProgramPlayers.apply(null, arguments)
}

function addParsedDataMidiDataToMusicalEnvironment (midiData, parsedData, musicalKey, filePath, e){
    let ticksPerQuarter = midiData.header.ticksPerQuarter
    let tempo = 60e6 / parsedData.tempos[0].microsecondsPerBeat
//     e.changeTempo(60e6 / parsedData.tempos[0].microsecondsPerBeat)
//     e.timeSignature = parsedData.timeSignatures[0].numerator
    let timeSignature = parsedData.timeSignatures[0].numerator
    let playerName = findFileNameFromFilePath(filePath)
    let playerToCreate = []
    midiData.tracks.forEach((x, i) => {
        if (checkIfTrackIncludesNoteOnOffMessages(x) === true){
                playerToCreate.push(playerForMidiTrack(musicalKey, x, playerName + i, playerToCreate.length + 1, ticksPerQuarter, e))
        }
    })
    return function (playerNames){
        let nameTypes = Object.keys(typesOfItemsInArray(playerNames))
        if (playerNames instanceof Array === false || nameTypes.length !== 1 || nameTypes[0] !== 'string'){
            throw new Error ('Provide an array with at least ' + playerToCreate.length + ' player name(s) in form of strings.')
            return false
        }
        if (playerToCreate.length > playerNames.length){
            throw new Error('Insufficient player name(s) provided. Provide an array with at least ' + playerToCreate.length + ' player name(s) in form of strings.')
            return false         
        }
        let mapLocationsToSetAsDefault = ['rhythmMap', 'maskMap', 'velocityMap', 'noteMap', 'octaveMap', 'channelMap', 'noteDurationMap', 'rootMap', 'chordMap']
        let playersCreated = playerToCreate.map((x, i) =>{
            mapLocationsToSetAsDefault.forEach(m => {
                if (x.extraConfig[m + 'Name'] === undefined){
                    x.extraConfig[m + 'Name'] = x.name
                }
            })
            assignPlayerForMusicSynthesizerMidiOutput(e, x.name, playerNames[i], x.extraConfig)
            e.rhythmPatterns[x.name].add(e, x.name)
            createExtensionPlayers(x.configObj, playerNames[i], e, x.midiOutput, x.name)
            e.rhythmMaps[x.name].values[0] = new QuantizedMap(x.keyspan, x.keys, absoluteToDelta(x.keys))
            e.rhythmMaps[x.name].values[0].values.push(x.keyspan - x.keys[x.keys.length - 1])
            return playerNames[i]
        })
        e.changeTempo(tempo)
        e.timeSignature = timeSignature
        return playersCreated
    }
}

function addMidiFileToMusicalEnvironment (filePath, musicalKey, e){
    let midiFile = fs.readFileSync(filePath, 'binary')
    let midiData = midiFileIO.parseMidiBuffer(midiFile);
    let parsedData = getDataFromMidiFile(midiData, e)
    return addParsedDataMidiDataToMusicalEnvironment(midiData, parsedData, musicalKey, filePath, e)
//     return parsedData
}

addToModuleExports({
    getDataFromMidiFile,
    groupByAbsoluteTime,
    midiToRootAndValue,
    splitMidiNote,
    checkIfTrackIncludesNoteOnOffMessages,
    findFileNameFromFilePath,
    getClosestSmallerDivisible,
    playerForMidiTrack,
    addParsedDataMidiDataToMusicalEnvironment,
    addMidiFileToMusicalEnvironment,
    findDurationOfEachNote
})

//--------------------------------------------------------------------------
//Bell useful navigation funcitons:

function logPlayersVariables (players, variable, e){
    players.forEach(x => {
        console.log('Player: ' + e.players[x].name)
        console.log(variable + ': ' + e.players[x][variable] + '\n')
    })
    return true
}

function assignValuesToPlayerVariables (players, variable, value, e){
    players.forEach(x => {
        e.players[x][variable] = value
        checkIfUseVerboseLogging(e.players[x], 'Player Variable Assignment: ' + x + ' ' +  variable + ' = ' + value)
    })
    return true
}

function changeVariableValueToChromaticMap (names, variable, e) {
    let chromaticMap;
    if (variable === 'noteMaps'){
        chromaticMap =  new QuantizedMap(12,A.buildArray(12,i=> i), A.buildArray(12, i => [i]))
    }
    else {
        chromaticMap =  new QuantizedMap(12,A.buildArray(12,i=> i), A.buildArray(12, i => i))
    }
    names.forEach(x => {
        e[variable][x] = chromaticMap
    })
    console.log(variable + 'variables assigned to default chromatic QuantizedMap ' + names)
    return true
}

addToModuleExports({
    logPlayersVariables,
    assignValuesToPlayerVariables,
    changeVariableValueToChromaticMap,
})

//--------------------------------------------------------------------------
//worker-functions.js

let workerCodeForArguments = `
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

function returnToParent (info){
    parentPort.postMessage(info)
}

try{
    eval(workerData)
}
catch {
    process.exit()
}

process.exit()
`

let workerTemplate = `const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

function returnToParent (info){
    parentPort.postMessage(info)
}
`

function writeWorkerFileSetupToFile (filePath){
    fs.writeFileSync(filePath, workerTemplate)
}

// //code in workerCode has to be stringified. Eval version.
// function giveWorkerWork (workerCode){
//     return new Promise((resolve, reject) => {
//         worker = new Worker(workerCodeForArguments, {eval: true, workerData: workerCode})
//         worker.on('message', result => {
//               console.log('worker done', result)
//               resolve(result)
//         })
//         worker.on('error', err => {
//             console.log('worker crashed', err)
//             // Reject the Promise with the error if something goes wrong
//             reject(err);
//             worker.terminate()
//         });
//     })
// }

function findExistingFilesIncludingStringAmount (nameToIdentify){
    let filesInDir = fs.readdirSync(process.cwd())
    let existingAmount = 0
    filesInDir.forEach(x => {
        if (x.includes(nameToIdentify)){
            existingAmount += 1
        }
    })
    return existingAmount
}

//code in workerCode has to be stringified.
function giveWorkerWork(workerCode){
    return new Promise((resolve, reject) => {
        let tempFilePath = process.cwd() + '/' + 'Konduktiva-worker-temp-file-date' + Date.now() + '-random-string-to-prevent-accidental-writes-' + generateLsystemAlphabets(80).join('')
        let existingFiles = findExistingFilesIncludingStringAmount(tempFilePath)
//         console.log(tempFilePath)
        if (existingFiles > 0){
            tempFilePath += '-' + existingFiles 
        }
        tempFilePath += '.js'
        let copiedWorkerTemplate = R.clone(workerTemplate)
        fs.writeFileSync(tempFilePath, copiedWorkerTemplate + '\n' + workerCode)
        tempFiles[tempFilePath] = true
            if (isMainThread){
                let worker = new Worker(tempFilePath, {workerData: workerCode})
                worker.on('message', result => {
//                       console.log('worker done', result)
                    fs.unlinkSync(tempFilePath)
                    delete tempFiles[tempFilePath]
                    worker.terminate()
                    resolve(result)
                })
            worker.on('error', err => {
                console.log('worker crashed', err)
                fs.unlinkSync(tempFilePath)
                delete tempFiles[tempFilePath]
                worker.terminate()
                reject(err);
            });
        }
    })
}

// //code in workerCode has to be stringified. Eval version.
// function giveWorkerWork (workerCode){
//     return new Promise((resolve, reject) => {
//         worker = new Worker(workerCodeForArguments, {eval: true, workerData: R.clone(workerTemplate) + ';' + workerCode})
//         worker.on('message', result => {
//               console.log('worker done', result)
//               resolve(result)
//         })
//         worker.on('error', err => {
//             console.log('worker crashed', err)
//             // Reject the Promise with the error if something goes wrong
//             reject(err);
//             worker.terminate()
//         });
//     })
// }

addToModuleExports({writeWorkerFileSetupToFile, giveWorkerWork, workerTemplate, findExistingFilesIncludingStringAmount})
// --------------------------------------------------------------------------
//Other setup functions:

let exampleMusicalEnvironmentsExtraConfig = {
    rhythmMapName: 'straight',
    velocityMapName: 'default', 
    polyphonyMapName: 'default', 
    chordMapName: 'default', 
    controlChangeMapName: 'default', 
    modeMapName: 'default',
    legatoMapName: 'default',
    midiProgramPlayerName: false,
    controlChangePlayerName: false,
    midiOutput: 1,
    channel: 'default'
}

let legatoOnlyConfig = {
    midiOutput: 1,
    legatoMapName: 'default',
    midiProgramPlayerName: false,
    controlChangePlayerName: false,
}

function setUpMusicalEnvironmentExamples (){
    let e = new MusicalEnvironment()
    setUpDefaultRhythmMapsToMusicalEnvironment(e)
    setUpDefaultActionToMusicalEnvironment(e)
    udpPort.open();
    createDefaultWebsocketServer()
    setUpDefaultMaskMapsForMusicalEnvironment(e)
    setUpDefaultIOIsForMusicalEnvironment(e)
    setUpDefaultCurrentDensityGraphsForMusicalEnvironment(e)
    setUpDefaultDensityGraphsForMusicalEnvironment(e)
    setUpDefaultPlayersForMusicalEnvironments(e)
    addToMusicalEnvironment(e)
//     updateMidiOutputList(e)
    setupScheduler(e)
    e.startScheduler()
    e.actions.sendChordMidiInfo = sendChordMidiInfo
    e.actions.sendNotesMidiInfo = sendNotesMidiInfo
    e.actions.sendPlaybackMessage = sendPlaybackMessage
    e.actions.sendMidiCCMessages = sendMidiCCMessages
    e.actions.sendMidiProgramMessages = sendMidiProgramMessages
    e.actions.completePendingTask = completePendingTask
    if (wss.connectedMusicalEnvironment === undefined){
        wss.connectedMusicalEnvironment = e
        wss.assignedTasksArray = 'trooperTask'
    }
    return e
}

function setUpDefaultMusicalEnvironmentFourPlayers (){
    let e = setUpMusicalEnvironmentExamples()
    recordConfigurationDataIntoMusicalEnvironment(lsystemData, 'p1', e)
    recordConfigurationDataIntoMusicalEnvironment(circleOfFifthChords, 'p4', e)
    recordConfigurationDataIntoMusicalEnvironment(circleOfFifthMelody, 'p3', e)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'p1', 'exampleMidiPlayer1', exampleMusicalEnvironmentsExtraConfig)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'p3', 'exampleMidiPlayer3', exampleMusicalEnvironmentsExtraConfig)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'p4', 'exampleMidiPlayer4', legatoOnlyConfig)
    recordConfigurationDataIntoMusicalEnvironment(melodyData, 'p2', e)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'p2', 'exampleMidiPlayer2', legatoOnlyConfig)
    return e
}

function duplicatePlayer (newPlayerName, existingPlayerName, e){
    e.players[newPlayerName] = R.clone(e.players[existingPlayerName])
    let newPlayer = e.players[newPlayerName] 
    newPlayer.name = newPlayerName
    return newPlayer
}

let simpleMelodyDataTemplate = {
        noteValuesKeyspan: 4,
        bools: [true, true, true, true],
        total: 4,
        octave: [5, 6, 7, 8],
        noteDurationKeys: A.buildArray(12, x => {return x}),
        noteDurationKeyspan: 12,
        noteDurations: [1, 2, 3, 4],
        noteDurationKeys: [0, 4, 8, 12],
}

let defaultConfigurationObject = {
  channelKeyspan: 1,
  channelKeys: [0],
  channelValues: [1],
  velocity: A.buildArray(30, x => 90),
   noteDurationKeyspan: 4,
  noteDurations: [0, 1, 2, 3],
  noteDurationKeys: [1, 1, 1, 1],
  bools: [true, true, true, true],
  modeFilter: A.buildArray(12, x=> x),
  octave: [3, 3, 3, 3],
  noteValues: [[5], [6], [7], [8]],
  total: 4,
  rhythmMap: [1,1,1,1],
  rootMap: ['C', 'C', 'C', 'C'],
    noteValuesKeyspan: 1,
    legatoMap: [1, 1, 1, 1]
}

function setUpTestMusicalEnvironment (copies = 4){
    let e = setUpMusicalEnvironmentExamples()
    let simpleMelodyData = R.clone(simpleMelodyDataTemplate)
    simpleMelodyData.rhythmMap = [1, 2, 3, 4]
    simpleMelodyData.noteValues = [[1], [2], [3], [4]]
    simpleMelodyData.rootMap = [ 'C', 'C', 'C', 'C' ]
    simpleMelodyData.velocity = [100, 100, 100, 100]
    let customTestConfig = R.clone(legatoOnlyConfig)
    customTestConfig.noteMapName = 'default'
    customTestConfig.maskMapName = 'default'
    customTestConfig.velocityMapName = 'default'
    customTestConfig.octaveMapName = 'default'
    customTestConfig.polyphonyMapName = 'default'
    customTestConfig.noteDurationMap = 'default'
    customTestConfig.rootMapName = 'default'
    customTestConfig.chordMapName = 'default'
    customTestConfig.rhythmMapName = 'straight'
    customTestConfig.modeMapName = 'default'
    recordConfigurationDataIntoMusicalEnvironment(simpleMelodyData, 'testMidiPlayer1', e)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'testMidiPlayer1', 'testMidiPlayer1', customTestConfig)
    Array.from({length: copies}).forEach((x, i) =>{
        let currentPlayerName = 'testMidiPlayer' + (i + 1)
        if (i > 0 ) {
            duplicatePlayer(currentPlayerName, 'testMidiPlayer1', e)
        }
        let currentPlayer = e.players[currentPlayerName]
        currentPlayer.channelMap = currentPlayerName
        e.channelMaps[currentPlayerName] = new QuantizedMap(4, [0], [i + 1])
    })
    return e
}

function setUpVerySimpleMusicalEnvironment (){
    let e = setUpMusicalEnvironmentExamples()
    let simpleMelodyData = R.clone(simpleMelodyDataTemplate)
    simpleMelodyData.velocity = [100, 100, 100, 100]
    simpleMelodyData.rhythmMap = [1, 2, 3, 4]
    simpleMelodyData.noteValues = [[1], [2], [3], [4]]
    simpleMelodyData.rootMap = [ 'C', 'C', 'C', 'C' ]
    recordConfigurationDataIntoMusicalEnvironment(simpleMelodyData, 'p1', e, legatoOnlyConfig)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'p1','exampleMidiPlayer1', legatoOnlyConfig)
    e.players.exampleMidiPlayer1.modeMap = 'default'
    return e
}

function setUpSimpleMusicalEnvironment (){
    let e = setUpMusicalEnvironmentExamples()
    let simpleMelodyData = R.clone(simpleMelodyDataTemplate)
    simpleMelodyData.velocity = [120, 40, 80, 65]
    simpleMelodyData.rhythmMap = [0.5, 1.5, 3,1 ]
    simpleMelodyData.noteValues = [[10, 4], [6, 4], [8, 7], [3]]
    simpleMelodyData.rootMap = [ 'C', 'D', 'A', 'G']
    recordConfigurationDataIntoMusicalEnvironment(simpleMelodyData, 'p1', e)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'p1', 'exampleMidiPlayer1', legatoOnlyConfig)
    e.players.exampleMidiPlayer1.polyphonyMap = 'default'
    e.players.exampleMidiPlayer1.modeMap = 'default'
    return e
}

function setUpLongMusicalEnvironment (){
    let e = setUpMusicalEnvironmentExamples()
    let longerMelodyData = {
        velocity : A.buildArray(12, x => {return 100}),
        noteDurationKeys: A.buildArray(12, x => {return x}),
        bools: A.buildArray(12, x => {return true}),
        rhythmMap: A.buildArray(12, x => {return true}),
        octave: A.buildArray(12, x => {return x}),
        total: 12,
        noteDurationKeyspan: 24,
        noteDurations: A.buildArray(12, x => {return x}),
        noteDurationKeys: A.buildArray(12, x => {return x * 2}),
        noteValues: [[10, 4], [6, 4], [8, 7], [3], [4], [5], [6], [7], [8,], [9],[10],[11]],
        rootMap: A.buildArray(12, x => {return 'C'}),
    }
    recordConfigurationDataIntoMusicalEnvironment(longerMelodyData, 'p1', e, legatoOnlyConfig)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'p1', 'exampleMidiPlayer1')
    e.players.exampleMidiPlayer1.polyphonyMap = 'default'
    e.players.exampleMidiPlayer1.modeMap = 'default'
    return e
}

function setUpTwoPlayerMusicalEnvironment (){
    let e = setUpVerySimpleMusicalEnvironment()
    let exampleData = R.clone(simpleMelodyDataTemplate)
    exampleData.channelKeyspan = 1
    exampleData.channelKeys = [0];
    exampleData.channelValues = [2];
    exampleData.noteValuesKeyspan = 4;
    exampleData.velocity = [100, 100, 100, 100];
    exampleData.rhythmMap = [4, 3, 2, 1];
    exampleData.octave = [5, 4, 3, 2];
    exampleData.noteValues = [[4], [6], [8], [10]].reverse();
    exampleData.rootMap = [ 'C', 'C', 'C', 'C' ]
    recordConfigurationDataIntoMusicalEnvironment(exampleData, 'p2', e)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'p2', 'exampleMidiPlayer2', legatoOnlyConfig)
    e.players.exampleMidiPlayer2.modeMap = 'default'
    return e
}

function setUpDefaultMusicalEnvironmentOnePlayer (){
    let e = setUpMusicalEnvironmentExamples()
    recordConfigurationDataIntoMusicalEnvironment(lsystemData, 'p1', e)
    assignPlayerForMusicSynthesizerMidiOutput(e, 'p1', 'exampleMidiPlayer1', legatoOnlyConfig)
    e.players.exampleMidiPlayer1.polyphonyMap = 'default'
     e.players.exampleMidiPlayer1.modeMap = 'default'
    return e
}

function addDuplicatePlayersWithConfigObj (e, nOfPlayers, configObj, baseName, extraConfig){
    configObj.channelValues = configObj.channelValues.map(x => {
        return x - 1
    })
    return Array.from({length: nOfPlayers}).map((x, i) => {
        let currentPlayerName = baseName + (i + 1)
        configObj.channelValues = configObj.channelValues.map(x => { return (x + 1) % 17})
        recordConfigurationDataIntoMusicalEnvironment(configObj, currentPlayerName, e)
        assignPlayerForMusicSynthesizerMidiOutput(e, 'default', currentPlayerName, extraConfig)
        e.players[currentPlayerName].channelMap = currentPlayerName
        e.replaceUndefinedPlayerPropertiesWith(currentPlayerName)
        return currentPlayerName
    })
}

function createPlayerBasedOnInfo (e, name, configObj, extraConfig){
    recordConfigurationDataIntoMusicalEnvironment(configObj, name, e)
    assignPlayerForMusicSynthesizerMidiOutput(e, name, name, extraConfig)
    return true
}

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

// export let e = setUpDefaultMusicalEnvironment()

// function setUpMusicalEnvironment (param, extraInfo){
//     if (typeof param === 'number'){
//         return checkNumInputMusicalEnv(param, extraInfo)
//     }
//     else if (typeof param === 'string'){
//         return checkStringInputMusicalEnv(param, extraInfo)
//     }
//     return false
// }

function setUpMusicalEnvironment (configObj, nOfPlayers, baseName, extraConfig){
    let e = setUpMusicalEnvironmentExamples()
    addDuplicatePlayersWithConfigObj(e, nOfPlayers, configObj, baseName, extraConfig)
    setUpBasicTaskPlayer(e)
    e.websocketTaskPlayer = 'taskTrooper'
    return e
}

function emptyConfigObj (){
    return {
        total: undefined, //number
        noteValuesKeyspan: undefined, //number
        octaveMapKespan: undefined, //number
        noteDurationKeyspan: undefined, //number
        rootMapKeyspan: undefined, //number
        modeFilterKeyspan: undefined, //number
        modeMapKeyspan: undefined, //number
        rootMapKeyspan: undefined, //number
        channelKeyspan: undefined, //number
        songMapKeyspan: undefined, //number
        chordMapKeyspan: undefined, //number
        legatoMapKeyspan: undefined, //number
        maskMapKeyspan: undefined, //number

        noteValuesKeys: undefined, //number
        rootMapKeys: undefined, //number 
        octaveMapKeys: undefined, //[number]
        noteDurationKeys: undefined, //[number]
        velocityKeys: undefined, //[number]
        modeFilterKeys: undefined, //[number]
        modeMapKeys: undefined, //[number]
        rootMapKeys: undefined, //[number]
        channelKeys: undefined, //[number]
        songMapKeys: undefined, //[number]
        chordMapKeys: undefined, //[number]
        legatoMapKeys: undefined, //[number]
        maskMapKeys: undefined, //[number]

        noteValues: undefined, //[[number],[number]]
        bools: undefined, //[booleans]
        rootMap: undefined, //[Musical letter notation]
        octaveMap: undefined, //[number]
        noteDurations: undefined, //[number]
        velocity: undefined, //[number]
        polyphonyMap: undefined, //[number]
        modeFilter: undefined, //[number]
        modeMap: undefined, //[number]
        rootMap: undefined, //[string]
        channelValues: undefined, //[number]
        songMap: undefined, //[string]
        chordMap: undefined, //[string]
        legatoMap: undefined, //[string]
        rhythmMap: undefined, //[number]
    }
}

//keyspan and keys not total and keys?
function emptyOtherConfigObj (){
    return {
        keyspan: undefined, //number
        keys: undefined, //[number]
        channelKeyspan: undefined, //number
        channelKeys: undefined, //[number]
        channelValues: undefined, //[number]
        bools: undefined, //[booleans]
        rhythmMap: undefined, //[number]
        midiOutput: undefined, //number
    }
}

function emptyControlChangeConfigurationObject (){
    return Object.assign(emptyOtherConfigObj(), {
        controlChangePlayer: undefined, /*[{channel: number, controller: number, value: number}]*/
        controlChangePlayerKeys: undefined, //[number]
        controlChangePlayerKeyspan: undefined, //number
    })
}

function emptyMidiProgramConfigurationObject (){
    return Object.assign(emptyOtherConfigObj(), {
        midiProgramPlayer: undefined, /*[{channel: number, controller: number, value: number}]*/
        midiProgramPlayerKeys: undefined, //[number]
        midiProgramPlayerKeyspan: undefined, //number
    })
}

function configObjCreation (total, keys, octave, root, note, noteDuration, velocity, rhythmMap){
    return Object.assign(emptyConfigObj(), {
        total: total,
        noteValuesKeyspan: total,
        bools: note.map(x => {return true}),
        octaveMapKeyspan: total, 
        noteDurationKeyspan: total,
        rootMapKeyspan: total,
        noteValuesKeys: keys,
        rootMapKeys: keys, 
        octaveMapKeys: keys,
        noteDurationKeys: keys,
        noteValues: note,
        rootMap: root,
        octave: octave,
        noteDurations: noteDuration,
        velocityKeys: keys,
        velocity: velocity,
        rhythmMap: rhythmMap,
    })
}

function emptyPlayerDataConfigObj (){
    return {
        channel: undefined, //number
        midiOutput: undefined, //number
        velocityMapName: undefined, //string
        noteMapName: undefined, //string
        octaveMapName: undefined, //string
        rhythmMapName: undefined, //string
        polyphonyMapName: undefined, //string
        noteDurationMapName: undefined, //string
        maskMapName: undefined, //string
        rhythmPatternName: undefined, //string
        chordMapName: undefined, //string
        rootMapName: undefined, //string
        modeMapName: undefined, //string
        legatoMapName: undefined, //string
        midiProgramPlayerName: undefined, //string
        controlChangePlayerName: undefined, //string
    }
}

addToModuleExports({ 
    setUpMusicalEnvironmentExamples,
    setUpDefaultMusicalEnvironmentFourPlayers,
    setUpKonduktiva,
    setUpDefaultMusicalEnvironmentOnePlayer,
    setUpVerySimpleMusicalEnvironment,
    setUpSimpleMusicalEnvironment,
    setUpLongMusicalEnvironment,
    setUpTwoPlayerMusicalEnvironment,
    setUpMusicalEnvironment,
    exampleMusicalEnvironmentsExtraConfig,
    legatoOnlyConfig,
    duplicatePlayer,
    setUpTestMusicalEnvironment,
    emptyConfigObj,
    configObjCreation,
    simpleMelodyDataTemplate,
    addDuplicatePlayersWithConfigObj,
    defaultConfigurationObject,
    emptyOtherConfigObj,
    emptyControlChangeConfigurationObject,
    emptyMidiProgramConfigurationObject,
})

//let K = require('./combined.js')
//let e = setUpDefaultMusicalEnvironment()
