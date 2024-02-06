//Load konductiva files first then load server.
//--------------------------------------------------------------------------
//Setup:

function roundOff (number,decimalPlaces){
    let roundedNumber=number.toFixed(decimalPlaces);
    return JSON.parse(roundedNumber)
}

function randomRange(min, max,decimalPlaces) {
if (decimalPlaces==undefined){decimalPlaces=0}
  return roundOff(min + (max - min) * (Math.random()),decimalPlaces);
}

//Create SVG.js canvas:
// let draw = SVG().addTo('body').size(window.innerWidth - 20, window.innerHeight - 30)

//Connect to websocket:
const ws = new WebSocket("ws://localhost:8080");

// Connect to WebSocket server
const serverHostname = window.location.hostname ; // Replace with the hostname or IP address of the server device
const serverPort = 8080; // Replace with the port number on which the server is running

// const ws = new WebSocket(`ws://${serverHostname}:${serverPort}`);


//Add event listeners for websocket:

ws.addEventListener("open", () =>{
     console.log("We are connected");
 });

ws.addEventListener('message', function (e) {
 if (typeof e.data =='object'){
     blobToString(e)
 }
 else {
    receiveCommands(JSON.parse(e.data))
 }
});

//blobToString parses data received through websocket:
function blobToString(e){
    let reader = new FileReader();
    reader.onload = function() {
        displayMessage(reader.result)
       // document.body.innerHTML+='<br>'+reader.result
    }
    reader.readAsText(e.data);
}

//Creates the format for sending data through websocket:
function createFormat (message,color,size,log){
    return JSON.stringify({message:message,size:size,color:color,log:log,})
}

let shapes=[]

let currentEnv;

//Commands that can be called through websocket is defined here:
let commands=[
    {action:'hi', func: function (){ console.log('hi')}},
    {action:'rect', func: function (obj){draw.rect(obj.size.x,obj.size.y).fill('black').move(obj.pos.x,obj.pos.y)}},
    {action:'loadSVG', func:function (path){svg.src+=path}},
    {action:'animate', func:function (info){
//         console.log('info', info)
//         animateFuncs[info.type](info.info)
    }
    },
    {action:'animationExample', func: function (){shapes.push(draw.circle(100).fill('blue').move(200,200))}},
    {action:'reload', func: function (){document.location.reload()}},
    {action: 'showMusicalEnvInfo', func: function (info){currentEnv = info;console.log('MusicalEnvironment info received.');generateItemsAccordingToCurrentEnv();displayMusicEnvMainPage()}},
]

/*
let time = {hour:13, minute: 20, second: 0} 

//differenceInTime(new Date(), time)

function scheduleRunTime (time, func) {
    let startTime = performance.now()
    let date = new Date()
    let millisecondDifference = time.getTime() - date.getTime()
    setTimeout(()=>{
        checkIfRunScheduled (time, func)
    },totalMillisecondsLeft - (performance.now() - startTime))
}
//Run time: https://stackoverflow.com/a/31470325/19515980

function checkIfRunScheduled (time, func){
//run a few millisceonds before and keep checking every fram if it is time
}
*/

//Finds which animation server wants to call
function findMatchingAnimation (type){
    console.log('type', type)
   return animateFuncs.find(elem => elem.action==type)
}

//This function is called by the event listener that is triggered after getting data from server side:
function receiveCommands (obj){
    commands.forEach(x=>{
        if (obj.action==x.action){
            x.func(obj.info)
        }
    })
}

//Animations functions that can be called through websocket are defined here:
let animateFuncs={
    size: function (args){console.log('animating',args);shapes[args.shapesIndex].animate({duration:args.time}).size(args.x,args.y)},
    move: function (args){ shapes[args.shapesIndex].animate({duration:args.time}).move(args.x,args.y)},
    dMove: function (args){ shapes[args.shapesIndex].animate({duration:args.time}).dmove(args.x,args.y)},
    //color: function (args){ console.log(args);shapes[args.shapesIndex].animate({duration:args.time}).fill(args.color)},
    color: function (args){ console.log(args);shapes[args.shapesIndex].fill(args.color)},
}
//How to decode blob: https://stackoverflow.com/a/23024504

//The shapes in the shapes array are the only SVG.js shapes that the can be manipulated from the server side. So, to enable shape usage from server side, a shape must be pushed into the shape array.

// --------------------------------------------------------------------------
// Display info funcs:

let graphInfo = {}

function checkMusicalEnvType (e){
    if (e.outputs !== undefined && e.noteMaps !== undefined && e.modeFilters !== undefined){
        return 'MusicalEnvironment extened'
    }
    else {
        return 'MusicalEnvironment'
    }
}

function infoAreaTransition (){
    infoArea.style.opacity = '0'
    setTimeout(() => {
        infoArea.style.opacity = '1'
    }, 202)
}

document.getElementById('infoArea').style.opacity = '0'
function displayMusicEnvMainPage (){
    infoAreaTransition()
    setTimeout(() => {
        document.getElementById('infoArea').innerHTML = '<p><b> Type: </b>' + checkMusicalEnvType(currentEnv) + '</p><p><b> noteInputMode: </b>' + currentEnv.notesInputMode + '</p><p><b>currentTempo: </b>' + currentEnv.currentTempo + '</p>';
    }, 100)
}


function displayNumInfo (parsedVarable){
    infoAreaTransition()
    setTimeout(() => {
        document.getElementById('infoArea').innerHTML = '<p><b>Variable Name: </b>' + name + '</p><p><b>Amount: </b>' + parsedVarable + '</p>'
    }, 100)
}

function displayStringInfo (parsedVarable, name){
    infoAreaTransition()
    setTimeout(() => {
        document.getElementById('infoArea').innerHTML = '<p><b>Variable Name: </b>' + name + '</p><p><b>Value: </b>' + parsedVarable + '</p>'
    }, 100)
}

function displayArrayInfo (parsedVarable, name){
    infoAreaTransition()
    setTimeout(() => {
        document.getElementById('infoArea').innerHTML = '<p><b>Variable Name: </b>' + name + '</p><p><b>Length: </b>' + parsedVarable.length + '</p><p><b>Content: </b>' + JSON.stringify(parsedVarable) + '</p>'
    }, 100)
}

function displayQuantizedMaps (obj, name){
    let data = []
    let keys = Object.keys(obj)
    keys.forEach((x, i) => {
        let currentTrace = {
            x: obj[x].keys,
            y: obj[x].values,
            name: x,
            marker: {
                color: 'rgb(' + randomRange(0, 225) + ',' + randomRange(0, 225) + ',' + randomRange(0, 225) + ')',
                size: 12,
            },
            type: 'scatter',
        }
        data.push(currentTrace)
    })
    let layout = {
        title: name,
         xaxis: {
            title: 'Keys/time',
            showgrid: false,
            zeroline: false
          },
          yaxis: {
            title: 'Values',
            showline: false
          }
    }
    graphInfo.data = data
    graphInfo.layout = layout
    Plotly.newPlot('graphArea', data, layout);
}

function checkIfVariableIncludesQuantizedMap(parsedVariable){
    let testVar = parsedVariable[Object.keys(parsedVariable)[0]]
    if (testVar instanceof Object === false){
        return false
    }
    else if (typeof testVar.keyspan !== 'number' || testVar.keys instanceof Array !==  true || testVar.values instanceof Array !== true){
        return false
    }
    return true
}

function displayObjectInfo (parsedVarable, name){
    infoAreaTransition()
    console.log(parsedVarable)
    setTimeout(() => {
        console.log('if QMap', checkIfVariableIncludesQuantizedMap(parsedVarable))
    if (checkIfVariableIncludesQuantizedMap(parsedVarable) === true){
        document.getElementById('infoArea').innerHTML = '<p><b>Variable Name: </b>' + name + '</p><p><b>Length: </b>' + Object.keys(parsedVarable).length + '</p><p><b>Content: <br></b><div id="graphArea"></div></p>'
        displayQuantizedMaps(parsedVarable)
    }
        else{
        document.getElementById('infoArea').innerHTML = '<p><b>Variable Name: </b>' + name + '</p><p><b>Length: </b>' + Object.keys(parsedVarable).length + '</p><p><b>Content: <br></b><code>' + JSON.stringify(parsedVarable) + '</code></p>'
         }
    }, 100)
}

function displayUnknownInfo (parsedVarable, name){
    displayStringInfo(parsedVarable, name)
}

function highlightSelectedVariable (name){
    let items = document.getElementsByClassName('item')
    for (let i = 0; i <= items.length - 1 ; i++) {
        if (items[i].innerText === name){
            items[i].style.backgroundColor = 'grey'
        }
        else{
            items[i].style.backgroundColor = 'black'
        }
    }
}

function displayVariable (name){
    toggleSide()
    if (typeof currentEnv[name] === 'object' && currentEnv[name] instanceof Object === true){
        console.log('object detected')
        displayObjectInfo(currentEnv[name], name)
        return true
    }
    else if (currentEnv[name] === undefined){
        displayUnknownInfo(undefined, name)
        return true
    }
    else if (currentEnv[name] === "[object Object]" ){
        displayUnknownInfo("[object Object]")
    }
    let parsedVarable = JSON.parse(currentEnv[name])
    console.log('type', typeof parsedVarable)
    if (typeof parsedVarable === 'number'){
        displayNumInfo(parsedVarable, name)
    }
    else if (typeof parsedVarable === 'string'){
        displayStringInfo(parsedVarable, name)
    }
    else if (typeof parsedVarable === 'object' && parsedVarable instanceof Array === true){
        displayArrayInfo(parsedVarable, name)
    }
    else if (typeof parsedVarable === 'object'){
        console.log('object detected')
        displayObjectInfo(parsedVarable, name)
    }
    else {
        displayUnknownInfo(parsedVarable, name)
    }
    highlightSelectedVariable(name)
}

// let items = document.getElementsByClassName('item')
// for (let i = 0; i < items.length - 1; i++) {
//     items[i].onclick = function () {
//         displayVariable(items[i].innerText)
//     }
// }

function generateItemsAccordingToCurrentEnv (){
    let side = document.getElementById('side')
    let items = document.getElementsByClassName('item')
    for (let i = 0; i = items.length ; i++) {
        items[0].remove()
    }
    Object.keys(currentEnv).forEach(x => {
        let newElem = document.createElement('div')
        newElem.className = 'item'
        newElem.onclick = function (){
            displayVariable(x)
        }
        newElem.innerText = x
        side.appendChild(newElem)
    })
}


// --------------------------------------------------------------------------
//Search logic:

let search = document.getElementById('search')

function filterItemsAccordingToInput (){
    let items = document.getElementsByClassName('item')
    let searchContent = search.value
    for (let i = 0; i <= items.length - 1 ; i++) {
        if (items[i].innerText.includes(searchContent) === false){
            items[i].style.display = 'none'
        }
        else{
            items[i].style.display = 'block'
        }
    }
}

search.addEventListener("input", function (e){
    filterItemsAccordingToInput()
})

// --------------------------------------------------------------------------
// Side menu stuff:

function toggleSide (e){
    if (screen.orientation.type !== "portrait-primary" && screen.width > 900){
        return false
    }
    console.log('toggling')
    let side = document.getElementById('side')
    if (side.style.display === 'none'){
        side.style.display = 'block'
    }
    else {
        side.style.display = 'none'
    }
}

 document.getElementById('openMenu').addEventListener('pointerdown', function (e){
toggleSide(e)
})

// document.getElementById('openMenu').addEventListener('click', function (e){
//     console.log('touch start worked')
//     toggleSide(e)
// })


function handleResize (){
    if (screen.orientation.type === "portrait-primary" ){
        document.getElementById('side').style.display = 'none'
    }
    else {
        document.getElementById('side').style.display = 'block'
    }
    if (document.getElementById('graphArea') !== undefined){
        document.getElementsByClassName('plot-container plotly')[0].remove()
        Plotly.newPlot('graphArea', graphInfo.data, graphInfo.layout);
    }
}

window.addEventListener("orientationchange", () => {
     handleResize()
});

window.addEventListener("resize", handleResize);

if (screen.orientation.type === "portrait-primary" ){
    document.getElementById('side').style.display = 'none'
}
else {
    document.getElementById('side').style.display = 'block'
}
