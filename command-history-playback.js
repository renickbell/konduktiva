// --------------------------------------------------------------------------
// -- command-history-playback.js
// --------------------------------------------------------------------------
fs = require('fs')
path = require('path');

/*
let replServer = repl.start({
      ignoreUndefined: true,
      input: process.stdin,
      output: process.stdout
})
*/

function getAbsoluteFilePath (filePath){
    if (path.isAbsolute(filePath)){
        return filePath
    }
    else if (filePath[0] == '/'){
        return process.cwd() + filePath
    }
    else {
        return process.cwd() + '/' + filePath
    }
}

function loadPlaybackFile (filePath){
    let absoluteFilePath = getAbsoluteFilePath(filePath)
    return JSON.parse(fs.readFileSync(absoluteFilePath, 'utf-8'))
}

class CommandHistoryPlayer {
    constructor (filePath){
        this.originalFilePath = filePath
        this.playbackFile = loadPlaybackFile(filePath)
        this.actionIndex = 0
        this.lastTime = this.playbackFile.startTime
        this.combineWithCurrentCommand = ''
    }
    play (){
        this.state = 'playing'
        this.scheduleNextAction()
    }
    stop (){
        this.state = 'stopped'
    }
    repeat (){
        this.actionIndex = 0
        this.lastTime = this.playbackFile.startTime
        this.combineWithCurrentCommand = ''
        this.play()
    }
    scheduleNextAction (){
        if (this.state === 'playing' && this.actionIndex < this.playbackFile.userInputs.length){
            console.log('time till next action', this.playbackFile.userInputs[this.actionIndex].time - this.lastTime)
            setTimeout(() => {
                this.runNextAction()
            }, this.playbackFile.userInputs[this.actionIndex].time - this.lastTime)
        }
        else {
            console.log('All actions from', this.originalFilePath, 'have been run. Use the repeat method to repeat')
        }
    }
    runNextAction () {
        if (this.state === 'playing'){
            let currentCommandInfo = this.playbackFile.userInputs[this.actionIndex]
            //console.log('running action', currentCommandInfo)
            if (currentCommandInfo.input.includes('historyStream')){
                this.evaluateCommand(this.playbackFile)
            }
            else {
                this.evaluateCommand(currentCommandInfo.input)
            }
            this.lastTime = currentCommandInfo.time
            this.actionIndex += 1
            this.scheduleNextAction()
        }
    }
    reformatFunctions (command){
        let functionStart = command.indexOf(command.slice(0, 9))
        let functionNameEnd = command.indexOf('(')
        return 'global.' + command.slice(functionStart + 9, functionNameEnd) + '= function ' + command.slice(functionNameEnd)
    }
    reformDefiningVariables(command) {
      const definingKeywords = ['const', 'let', 'var'];
      const keyword = definingKeywords.find((keyword) => command.startsWith(keyword));
      if (keyword) {
        return command.slice(keyword.length).trim();
      }
      return command;
    }
    evaluateCommand (command){
        if (command.slice(0, 6).includes('.load')){
            return false
        }
        else if (command.slice(0,9).includes('function ')){
            console.log('reformating function')
            this.combineWithCurrentCommand = this.reformatFunctions(command)
            return false
        }
        else if (this.combineWithCurrentCommand === ''){
            console.log('reformating defining statement')
            this.combineWithCurrentCommand = this.reformDefiningVariables(command)
        }
        try {
          console.log('evaluating:', command, this.combineWithCurrentCommand);
          eval(JSON.stringify(this.combineWithCurrentCommand));
          console.log('evaluated:', this.combineWithCurrentCommand)
          this.combineWithCurrentCommand = '';
        } catch (error) {
          if (error instanceof SyntaxError) {
            // Incomplete command
            this.combineWithCurrentCommand += command + ';';
          } else {
            console.log(error);
          }
        }
    }
}

let historyPlayer1 = new CommandHistoryPlayer('./11June-repl-history--.txt')
//console.log('running action', currentCommandInfo)

historyPlayer1.play()

//historyPlayer1.stop()

let testFunc = 'function testingIfFunctionsWork(arg) { console.log("hi", arg); console.log("Function testing success"); return arg; }';

const repl = require('repl');
const replServer = repl.start({ prompt: '> ' });

const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');

const outputFile = path.join(process.cwd(), 'output.txt');
const outputStream = fs.createWriteStream(outputFile);

const originalEval = replServer.eval;

replServer.eval = function (cmd, context, filename, callback) {
  const writableCallback = new Writable({
    write(chunk, encoding, callback) {
      // Write the output to the file or perform other handling
      outputStream.write(chunk);
      callback();
    },
  });
  originalEval.call(replServer, cmd, context, filename, writableCallback);
};

// Now the evaluated code output will be redirected to the file
replServer.eval(`console.log('hi')`);

