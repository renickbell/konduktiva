// --------------------------------------------------------------------------
// -- rhythm.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//Create rhythm map related things:
function createRhythmMap (noteValueData, name, e){
    if (typeof noteValueData.rhythmMap !== 'string'){
        //let generatedRhythmPattern = new QuantizedMap(1, [1], [new QuantizedMap(noteValueData.total, quantizedKeys, noteValueData.rhythmMap)])
        let generatedRhythmPattern = new QuantizedMap(1, [1], [new QuantizedMap(noteValueData.total, noteValueData.noteDuration, noteValueData.rhythmMap)])
        e.rhythmMaps[name] = generatedRhythmPattern
    }
}

//Create mask map from note value data:
function createMaskMap (noteValueData, name, e){
    e.maskMaps[name] = new QuantizedMap(noteValueData.total)
    let currentMaskMap = e.maskMaps[name]
    if (noteValueData.maskMapKeys === undefined){
        currentMaskMap.keys = A.buildArray(currentMaskMap.keyspan + 1, x => {return x})
    }
    else {
        currentMaskMap.keys = noteValueData.maskMapKeys
    }
    currentMaskMap.values = A.resizeArray(currentMaskMap.keyspan, noteValueData.bools)
//     currentMaskMap.values = flipBooleans(resizeArray(currentMaskMap.keyspan, noteValueData.bools))
}

module.exports = {
createMaskMap, createRhythmMap 
}
