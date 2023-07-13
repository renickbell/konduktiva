//------------------------------------------------------------------------------
//-- konduktiva-revised.js
//-- Wed Feb  2 07:28:37 PM JST 2022
// license not yet decided; please do not distribute yet.
//------------------------------------------------------------------------------

const R = require('ramda');
const performance = require('perf_hooks').performance;
const { TaskTimer } = require('tasktimer');
//const easymidi = require('easymidi');
const fs = require('fs')
const path = require('path')
const osc = require("osc");
const v8 = require('v8');

// year month day (yyMMdd)
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

function addLog2 (x) {addLog(util.inspect(x, {maxArrayLength: null, depth: null}))}

// performance now in seconds
function now () {
    return 0.001 * performance.now()
}

function flipBooleans (arr) {
    return arr.map (a => !a)
}

function sum (inputArray) {
    return inputArray.reduce((acc,cur) => {return acc + cur},0)
}

function runningSum (startingVal,inputArray) {
    let currentSum = startingVal;
    let output = [];
    for (let i = 0; i < inputArray.length; i++) {
        let newSum = inputArray[i] + currentSum;
        output.push(newSum);
        currentSum = newSum;
    }
    return output
}

function mean (inputArray) {
      return sum(inputArray)/inputArray.length
}

function includesOneOf (inputArray, things) {
    let bools = things.map(t => inputArray.includes(t));
    if (bools.includes(true)) {return true} else {return false}
}

function matchesOneOf (candidates, thing) {
    return includesOneOf([thing],candidates)
}

function removeItem(arr, item){
     return arr.filter(f => f !== item)
    }

function buildArray (n, fillFunction) {
  let outputArray = [];
  for (let i = 0; i < n; i++) {
    outputArray.push(fillFunction(i))
  }
  return outputArray
}

function numArray (start,end) {
    let output = [];
    for(let i = start; i <= end; i++) {output.push(i)};
    return output
}

// modify so that it doesn't have crash potential
function linearArray (start, step, end) {
    let output = [start];
    for (let i = 1; (start + (i*step)) <= end; i++) {
        output.push(start + (i*step))
    }
    return output
}

function geometricArray (start, step, end) {
    let output = [start];
    for (let i = 1; (start * (i*step)) <= end; i++) {
        output.push(start * (i*step))
    }
    return output
}

function randomRange (min, max) {
  return min + ((max-min) * Math.random())
}

function randomRangeInt (min, max) {
    return Math.floor(randomRange(min, max))
}

function lerpValues (y1, y2, s) {return y1 + s * (y2 - y1)}

function lerpedRange (start, stop, steps) {
    let stepArray = numArray(0,steps-1);
    let stepSize = 1/(stepArray.length-1);
    let scalars = stepArray.map(x => x * stepSize);
    return scalars.map(x => lerpValues (start, stop, x))
}

function scaleToRange (inputArray, inputMin, inputMax, outputMin, outputMax) {
    // add a check to make sure that inputMin and inputMax are not exceeded by values in inputArray?
    let scale = (outputMax - outputMin)/(inputMax - inputMin)
    return inputArray.map(x => ((x - inputMin) * scale) + outputMin)
}

function scaleToSum (span,vals) {
    return vals.map(x => x * span/sum(vals))
}

let pick = inputArray => inputArray[Math.round((inputArray.length - 1) * Math.random())];

let pickN = (n,inputArray) => {
        let a = new Array(n);
        a.fill(0,0,n);
        let out = [];
        a.forEach(i => out.push(pick(inputArray)));
        return out }

function low2HighSort (inputArray) { return inputArray.sort((a, b) => a - b)}

function high2LowSort (inputArray) { return inputArray.sort((a, b) => b - a)}

function takeN (inputArray, n) {
    let outputArray = [];
    for (let i = 0; i < n; i++)
    { outputArray.push(inputArray[i%(inputArray.length)])};
    return outputArray
}

function takeTo (targetLength, inputArray) {
    let output = [];
    let counter = 0;
    while (sum(output) < targetLength){
        let nextVal = inputArray[counter%(inputArray.length)];
        output.push(nextVal);
        counter++
    }
    if (sum(output) > targetLength) {
        outputSum = sum(output);
        let difference = outputSum - targetLength;
        output[output.length - 1] = output[output.length - 1] - difference;
    }
    return output
}

function loopTo (targetLength, inputArray) {
    let inputSum = sum(inputArray);
    let loopN = Math.ceil(targetLength/inputSum);
    let pre = R.flatten(buildArray(loopN, x => inputArray))
    return takeTo(targetLength,pre)
}

function zip (a,b) {return a.map((x, i) => { return [x, b[i]]; })}

function buildZip (a,b) {return a.map((x,i) => x.concat(b[i]))}

class Point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  move(xDistance, yDistance) {
    return new Point(this.x + xDistance, this.y + yDistance)
  }
  moveByAngle (angle, distance) {
            let r = angle * Math.PI / 180;
            return new Point(this.x + distance*Math.sin(r), this.y + distance*Math.cos(r))
            }    
}

function linearFunctionFromPoints(p1,p2) {
    let rise = p2.y - p1.y;
    let run = p2.x - p1.x;
    let slope = rise/run; 
    // y = mx + b
    let b = p1.y - (slope * p1.x);
    //console.log('the linear function is: y = ' + slope + 'x + ' + b);
    return {func: (x => (x * slope) + b), note: 'y = ' + slope + 'x + ' + b}
}

function linearFunctionArrayFromPoints (pointArray) {
    let output = [];
    for (let i = 0; i < (pointArray.length - 1); i++){
        output.push(linearFunctionFromPoints(pointArray[i],pointArray[i+1]))
    }
    return output
}

function linearFunctionQuantizedMap (pointArray) {
    let times = pointArray.map(t => t.x);
    return new QuantizedMap(times[times.length-1], times, linearFunctionArrayFromPoints(pointArray)) 
}

// knuth shuffle from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
 
//------------------------------------------------------------------------------
// lsystem functions

let parseItem = (input,rules) => { if (Object.keys(rules).includes(input)) {return rules[input]} else {return input}}
let parseString = (inputString,rules) => inputString.split("").map(x => parseItem(x,rules)).join().replace(/,/g,"")

function lsystem (inputString,rules,generations) {
        if (generations > 0) {return lsystem (parseString(inputString,rules),rules,generations-1)}
        else {return inputString}
}

function rewriteString (inputString, stringMap) {
    let splitString = inputString.split('');
    return splitString.map(c => stringMap[c])
}

// uses code from Javier Conde https://stackoverflow.com/questions/34929094/how-can-i-get-all-possible-characters-in-javascript

function allAlphabeticChars () {
    // generate all of the alphabetic characters
    let allLowercaseChars = [];
    for (var i=97; i<123; i++) {
        allLowercaseChars.push(String.fromCharCode(i));
        };
    let allUppercaseChars = [];
    for (var i=65; i<91; i++) {
        allUppercaseChars.push(String.fromCharCode(i));
        };
    // randomly assign 
    return allChars = allLowercaseChars.concat(allUppercaseChars);
}

function randomCharacterMapFromArray (inputArray) {
    let allChars = allAlphabeticChars();
    if (allChars.length < inputArray.length) {return "error: inputArray is longer than array of alphabetic characters"};
    let outputMap = {};
    charactersToUse = takeN(allChars,inputArray.length);
    let shuffled = shuffle(inputArray);
    charactersToUse.forEach((x,i) => {outputMap[x] = shuffled[i]})
    return outputMap
}

function randomMap (keyArray, valueArray) {
    if (keyArray.length < valueArray.length) {return "error: key array is longer than value array"};
    let outputMap = {};
    charactersToUse = takeN(keyArray,valueArray.length);
    let shuffled = shuffle(valueArray);
    charactersToUse.forEach((x,i) => {outputMap[x] = shuffled[i]})
    return outputMap
}

function rulesGenerator (inputPool, maxRuleLength) {
    let ruleLengths = pickN (inputPool.length, linearArray(1,1,maxRuleLength));
    return (ruleLengths.map(x => pickN(x, inputPool) ) )
}

function variousLsystems(baseName,n,patternLength,rules,generations,replacementValues,inputString) {
    let replacements = buildArray(n, x => randomMap(allAlphabeticChars(), replacementValues));
    let thisL = lsystem (inputString, rules, generations);
    let lsystems = replacements.map(x => loopTo(patternLength,rewriteString(thisL,x)))
    let names = buildArray(n, i => baseName+i);
    let outputMap = {};
    names.forEach((x,i) => outputMap[x] = lsystems[i]);
    return outputMap
}

//--------------------------------------------------------------------------
//midi actions

function allNotesOff (channelNum) {
    for (i = 0; i < 128; i++){
        output.send('noteoff', {
              note: i,
              velocity: 0,
              channel: channelNum
        });
    }
}

//--------------------------------------------------------------------------
// the easiest way to make a rhythm

function simpleRhythm (env, rhythmName, deltas) {
    env.rhythmMaps[rhythmName] = new QuantizedMap(1,[1],[new QuantizedMap(sum(deltas),[0].concat(runningSum(0,deltas)),deltas)])
    return rhythmName
}

//--------------------------------------------------------------------------
// rhythm pattern with density

// increase density

function getMinIndex (inputArray) {
    let currentMin = [];
    for (let i = 0; i< inputArray.length; i++){
        if (currentMin[0] == undefined) {currentMin[0] = [0,inputArray[i]]}
        else if (inputArray[i] < currentMin[0][1]) {currentMin = [[i,inputArray[i]]]}
        else if (inputArray[i] == currentMin[0][1]) {currentMin.push([i,inputArray[i]])}
    }
    return currentMin
}

function getMaxIndex (inputArray) {
    let currentMax = [];
    for (let i = 0; i< inputArray.length; i++){
        if (currentMax[0] == undefined) {currentMax[0] = [0,inputArray[i]]}
        else if (inputArray[i] > currentMax[0][1]) {currentMax = [[i,inputArray[i]]]}
        else if (inputArray[i] == currentMax[0][1]) {currentMax.push([i,inputArray[i]])}
    }
    return currentMax
}

// revise these so that the algorithm is swappable

function increaseDensity (minVal,ratio,inputArray) {
    let max = getMaxIndex(inputArray);
    if (max[0][1] <= minVal) {console.log("max is already at minVal");return inputArray} 
    else {
        let toIncrease = pick(max);
        console.log("this is the max: " + toIncrease);
        let outputA = inputArray.slice(0,toIncrease[0]);
        console.log("this is outputA: " + outputA);
        let outputB = inputArray.slice(toIncrease[0]+1);
        let newVals = [toIncrease[1]*ratio,toIncrease[1] - (toIncrease[1]*ratio)];
        return outputA.concat(newVals.concat(outputB))
    }
}

function decreaseDensity (inputArray) {
    let target = (pick(numArray(0,inputArray.length - 2)));
    let outputA = inputArray.slice(0,target);
    let outputB = [inputArray[target] + inputArray[target+1]].concat(inputArray.slice(target+2))
    return outputA.concat(outputB)
}

function recursiveIncreaseDensity (minVal, ratios, stack) {
    if (getMaxIndex(stack[0])[0][1] > minVal) {
        let r = pick(ratios);
        let addToStack = increaseDensity(minVal,r,stack[0]);
        return recursiveIncreaseDensity(minVal, ratios, [addToStack].concat(stack))
    }
    return stack
}

function recursiveDecreaseDensity (stack) {
   console.log(stack);
   let targetArray = stack[(stack.length -1)];
   if (targetArray.length > 1) {
       console.log("this is the target array");
       return recursiveDecreaseDensity(stack.concat([decreaseDensity(stack[stack.length -1])]))
   }
    return stack
}

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
    [head, ...tail] = inputArray;
    tail.forEach((e,i) => output.push(e - inputArray[i]))
    return output
}

function densityFromDeltas (inputDeltas) {
    return inputDeltas.length/sum(inputDeltas)
}

//  keyspan is max value, keys is an array of absolutes (increasing values), values is an array of anything of the same length as keys 

class QuantizedMap {
    constructor(limitValue,keys,vals) {
        this.keyspan = limitValue;
        this.keys = keys;
        this.values = vals;
        }
    wrapLookup(time) {
        let lookupTime = time%this.keyspan;
        let filteredTime = this.keys.filter(x => x <= lookupTime);
        if (filteredTime[0] == undefined) {filteredTime = [0]};
        return this.values[(filteredTime.length - 1)]
        }
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
}

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
    return mean(densities)
}

function makeRhythmMap (minIOI, ratios, deltas) {
    let stack = densityStack(minIOI,ratios,deltas);
    let absolutes = stack.map(deltaToAbsolute);
    let densities = stack.map(densityFromDeltas)
    let rows = [];
    for (let i = 0; i < stack.length; i++){
        rows.push(new QuantizedMap(absolutes[i][0],absolutes[i][1],stack[i]))
    }
    return new QuantizedMap(densities[0],R.reverse(densities),R.reverse(rows))
}

//------------------------------------------------------------------------------
// stochastic rhythmMap functions

function generateSeed (onsetValues, seedLengths) {
    let seedLength = pick(seedLengths);
    return pickN(seedLength, onsetValues)
}

function generatePhrase (onsetValues, seedLengths, noOfSeeds, phraseLength) {
    let seeds = buildArray(noOfSeeds, x => generateSeed(onsetValues, seedLengths));
    return takeTo(phraseLength,R.flatten(seeds))
}

function generateAndAddRhythms(env, n, baseName, onsetValues, minIOI, ratios, seedLengths, noOfSeeds, phraseLength) {
    let names = buildArray(n, x => baseName + x);
    let rhythms = buildArray(n, x => generatePhrase(onsetValues,seedLengths,noOfSeeds,phraseLength));
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

// write a generalized version of this that can accept any IOIFunc

function getNextOnsets (densityMap, density, beat, limitBeat, output) {
    if (beat > limitBeat) {
        return output
    }
    else {
        // replace getNextOnset with generalized IOIFunc here?
        let nextOnset = getNextOnset(densityMap, density, beat);
        output = output.concat(nextOnset)
        return getNextOnsets (densityMap, density, beat+nextOnset, limitBeat, output)
    }
}

function getNextOnsets2 (ioiFunc, beat, limitBeat, output) {
    if (beat > limitBeat) {
        return output
    }
    else {
        // replace getNextOnset with generalized IOIFunc here?
        let nextOnset = ioiFunc(beat);
        output = output.concat(nextOnset)
        return getNextOnsets2 (ioiFunc, beat+nextOnset, limitBeat, output)
    }
}

function getNextOnsets3 (ioiFunc, player, beat, limitBeat, output) {
    if (beat > limitBeat) {
        return output
    }
    else {
        // replace getNextOnset with generalized IOIFunc here?
        let nextOnset = ioiFunc(player, beat);
        output = output.concat(nextOnset)
        return getNextOnsets3 (ioiFunc, player, beat+nextOnset, limitBeat, output)
    }
}

// probability of masking
function mask (player, maskMap, beat, probability) {
    let maskVal = maskMap.wrapLookup(beat);
    if (maskVal == true && (Math.random() < probability)) {maskVal = true} else {maskVal = false};
    //if (maskVal == true) {addLog(''+player+' function was masked at beat '+beat+'.')}
    return maskVal
}

class MusicalEnvironment {
    constructor (){
        this.players = {};
        this.actions = {};
        this.IOIs = {};
        this.densityGraphs = {};
        this.rhythmMaps = {};
        this.maskMaps = {};
        this.superDirtPath = undefined;
        this.samples = undefined;
        this.sampleKits = {};
        this.samplePatterns = {};
        this.samplePatternCount = 0;
        this.samplePatternStore = {};
        this.currentDensityGraphs = [];
        this.currentBeatsPerMeasure = 4;
        this.currentTempo = 120;
        this.beatOfChangeToCurrentTempo = undefined;
        this.timeOfChangeToCurrentTempo = undefined;
        this.scheduler = new TaskTimer(20);
        this.lookahead = 0.1;
        this.scheduledPlayers = [];
        this.scale = "minor";
        this.root = "A";
    }
    currentBeat () {
        let elapsed = now() - this.timeOfChangeToCurrentTempo;
        return timeToBeats(this.currentTempo, elapsed) + this.beatOfChangeToCurrentTempo
    }
    changeTempo(tempo) {
        this.beatOfChangeToCurrentTempo = this.currentBeat ();
        this.timeOfChangeToCurrentTempo = now();
        // this.beatOfChangeToCurrentTempo = beatOfChangeToCurrentTempo + timeToBeats(timeSinceTempoChange())
        console.log("TEMPO CHANGE! time: " + this.timeOfChangeToCurrentTempo + "; beat: " + this.beatOfChangeToCurrentTempo);
        this.currentTempo = tempo;
    }
    getAction (player) {
        // console.log("running action for player " + player + " at beat " + this.currentBeat())
        return this.actions[(this.players[player].action)];
    }
    getIOIFunc (player) {
        return this.IOIs[(this.players[player].IOIFunc)];
    }

    scheduleEvents (player) {
        //console.log("scheduling " + player);
        let ioiFunc = this.getIOIFunc (player);
        let onsets = getNextOnsets3(ioiFunc,player, this.currentBeat(), this.currentBeat() + timeToBeats(this.currentTempo,this.lookahead),[]);
        let onsetsAfterLastScheduled = onsets.filter(x => x > this.players[player].lastScheduledTime);
        if (player.verbose == true) {
        console.log(" -------------------------------------------------------------------------- " );
        console.log("current beat: " + this.currentBeat());
        console.log("onsets after last scheduled: " + onsetsAfterLastScheduled)};
        if (onsetsAfterLastScheduled[0] !== undefined) {
            this.players[player].lastScheduledTime = R.last(onsetsAfterLastScheduled);
            // run the masking here
            //let currentMaskMap = this.maskMaps[this.players[player].maskMap];
            //let unmaskedOnsets = onsetsAfterLastScheduled.filter(t => (mask(player,currentMaskMap,(t),1)) != true);
            let unmaskedOnsets = onsetsAfterLastScheduled;
            let times = unmaskedOnsets.map(x => beatsToTime(this.currentTempo, x - (this.currentBeat())));
            if (player.verbose == true) { console.log("these are the times for events of player " + player + ": " + times)};
            //if (player == 'kick') {console.log(unmaskedOnsets)}
            times.forEach(
                (t,i) => {
                    setTimeout(x => (this.getAction(player))(player,unmaskedOnsets[i]),
                    Math.max(1000 * (t - now()),0))
                }
            );
        };
        if (player.verbose == true) { console.log("last scheduled time: " + this.lastScheduledTime)}
    }

    startScheduler () {
        this.timeOfChangeToCurrentTempo = now();
        this.beatOfChangeToCurrentTempo = 0;
        this.scheduler.start()
    }
    stopScheduler () {
        this.timeOfChangeToCurrentTempo = undefined; 
        this.beatOfChangeToCurrentTempo = undefined;
        //this.lastScheduledTime = 0;
        this.scheduler.stop()
    }
    play (player) {
        if (this.players[player].status == "playing") 
            {console.log("Player " + this.players[player].name + " is already playing!")}
        else {
            this.scheduledPlayers = this.scheduledPlayers.concat(player);
            this.players[player].status = "playing";
            this.players[player].startTime = now();
        }
    }
    stop (player) {
        if (this.players[player].status == "stopped") 
            {console.log("Player " + this.players[player].name + " is not playing!")}
        else {
            this.scheduledPlayers = removeItem(this.scheduledPlayers,player)
            this.players[player].status = "stopped";
            this.players[player].startTime = undefined;
            this.players[player].lastScheduledTime = 0;
        }
    }
    allPlayers () {
        return Object.keys(this.players)
    }
    allPlayerStatus () {
        Object.keys(this.players).forEach(x => console.log(x,this.players[x].status))
        return Object.keys(this.players).map(x => [x,this.players[x].status])
    }
    playingPlayers () {
       let ps = this.allPlayerStatus ();
       let withStatus = ps.filter(p => p[1] == 'playing')
       return withStatus.map(p => p[0])
    }
    playN (ps) {
        ps.forEach(p => this.play(p))
    }
    stopN (ps) {
        ps.forEach(p => this.stop(p))
    }
    playAll () {
        this.allPlayers().forEach(p => this.play(p))
    }
    stopAll () {
        this.allPlayers().forEach(p => this.stop(p))
    }
    solo (ps) {
        this.stopN(this.allPlayers().filter(p => !matchesOneOf(ps,p)))
    }
    togglePlayer (p) {
       if (this.players[p].status == 'playing') {this.stop(p)} else {this.play(p)}
    }
}

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

class Player {
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

function beatsToTime (tempo, beats) {
    let beatsPerSecond = (tempo/60);
    return beats/beatsPerSecond
}

function timeToBeats (tempo, time) {
    let beatsPerSecond = (tempo/60);
    return time * beatsPerSecond
}


//--------------------------------------------------------------------------

function setupSuperDirtPlayer (env, playerName) {
        env.players[playerName] = new Player(playerName);
        env.players[playerName].maskMap = 'default'
        env.players[playerName].samplePattern = playerName;
        env.players[playerName].action = "superDirt";
        return playerName
}

function simpleSamplePattern (env, playerName, sampleName, sampleIndex) {
        addSamplePattern (e, playerName, new QuantizedMap(4,[0],[{name: sampleName, index: sampleIndex}]));
        return playerName
}

class RhythmPattern {
        constructor (n,l,i,b) {
                    this.patternName = n;
                    this.patternLength = l;
                    this.IOIs = i;
                    this.bools = b;
                    return this
                }
        addToPlayer (env, playerName) {
            this.playerName = playerName
                    simpleRhythm (env, this.patternName, loopTo (this.patternLength,this.IOIs))
                    env.players[this.playerName].rhythmMap = this.patternName;
                    let mask = flipBooleans(this.bools);
                    env.players[this.playerName].maskMap = this.patternName;
                    env.maskMaps[this.patternName] = new QuantizedMap(this.patternLength,[0].concat(runningSum(0,this.IOIs)),mask)
                }
        add (env, playerName) {
            this.playerName = playerName
                    simpleRhythm (env, this.patternName, loopTo (this.patternLength,this.IOIs))
                    let mask = flipBooleans(this.bools);
                    env.maskMaps[this.patternName] = new QuantizedMap(this.patternLength,[0].concat(runningSum(0,this.IOIs)),mask)
                }
}

function createRhythmPattern (argObj) {
    let pattern = new RhythmPattern (
                        argObj.voice,
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


