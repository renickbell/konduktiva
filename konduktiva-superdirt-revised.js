//------------------------------------------------------------------------------
//-- konduktiva-superdirt-revised.js
//-- Wed Feb  2 07:20:00 PM JST 2022
// license not yet decided; please do not distribute yet.
//------------------------------------------------------------------------------

// change this path to the path on your computer
let superDirtSamplesPath = "/home/steve/.local/share/SuperCollider/downloaded-quarks/"

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
udpPort.open();

function gatherBySubstring (inputArray, substringArray) {
    return inputArray.filter(x => substringArray.some(y => x.includes(y)))
}

let samples = fs.readdirSync(superDirtSamplesPath, { withFileTypes: true }).filter(de => de.isDirectory())

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

let samples4 = buildSampleArray (superDirtSamplesPath)

// uses a random sample from the named directories in substringArray, see selectedSamples below
function samplePattern (allSamples, patternLength, substringArray, poolSize, stepLengthPool) {
    let prePool = gatherBySubstring (allSamples.sampleList, substringArray).map(x => allSamples.sampleData.find(y => y.name === x));
    // let pool = pickN(poolSize, gatherBySubstring (allSamples, substringArray));
    let pool = pickN(poolSize, prePool);
    let stepLengths = [];
    while (sum(stepLengths) < patternLength) {
        stepLengths.push(pick(stepLengthPool))
    };
    let selectedSampleDirs = stepLengths.map(x => pick(pool));
    let selectedSamples = selectedSampleDirs.map((x) => {return {name: x.name, index: randomRangeInt(0,x.number - 1)}});
    let absolutes = deltaToAbsolute(takeTo(patternLength,stepLengths));
    return new QuantizedMap(absolutes[0],absolutes[1],selectedSamples)
}

function playSuperDirtSample (env, player, beat) {
    let currentSample = env.samplePatterns[e.players[player].samplePattern].wrapLookup(beat);
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
              { type: 'f', value: e.players[player].cut}
              //{ type: 'f', value: 1 }
            ]
    };
    //console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
}

//playSuperDirtSample(e,'kick',0)

function addSamplePattern (env, patternName, sp) {
    env.samplePatterns[patternName] = sp
}

