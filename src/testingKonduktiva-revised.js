//------------------------------------------------------------------------------
//-- testingKonduktiva-revised.js
//-- Wed Feb  2 07:44:11 PM JST 2022
// license not yet decided; please do not distribute yet.
//------------------------------------------------------------------------------

//Creates a MusicalEnvironment
// e = new MusicalEnvironment()

let A = require('array-toolkit')
//Creates a MusicalEnvironment
// e = new MusicalEnvironment()

let {QuantizedMap} = require('./konduktiva-revised-2.js')
let {linearFunctionArrayFromPoints} = require('./konduktiva-revised-2.js')
let {Point} = require('./konduktiva-revised-2.js')


function defaultIOI (player, beat) {
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
    players.forEach(p => e.players[p].rhythmMap = rhythm)
} 

function setUpDefaultMaskMapsForMusicalEnvironment (e){
    e.maskMaps.default = new QuantizedMap(4,[0],[false])
}


//e.actions.superDirt = (p,b) => playSuperDirtSample (e,p,b)

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


// function setUpDefaultMusicalEnvironment (e){
//     setUpDefaultRhythmMapsToMusicalEnvironment(e)
//     setUpDefaultActionToMusicalEnvironment(e)
//     setUpDefaultMaskMapsForMusicalEnvironment(e)
//     setUpDefaultIOIsForMusicalEnvironment(e)
//     setUpDefaultCurrentDensityGraphsForMusicalEnvironment(e)
//     setUpDefaultDensityGraphsForMusicalEnvironment(e)
// }

// setUpDefaultMusicalEnvironment(e)

module.exports = {
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
}
