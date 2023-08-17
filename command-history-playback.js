// --------------------------------------------------------------------------
// -- command-history-playback.js
// --------------------------------------------------------------------------
// Works as long as all dependencies are there.
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
            console.log('running action', currentCommandInfo)
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
//     reformatFunctions (command){
//         let functionStart = command.indexOf(command.slice(0, 9))
//         let functionNameEnd = command.indexOf('(')
//         return 'global.' + command.slice(functionStart + 9, functionNameEnd) + '= function ' + command.slice(functionNameEnd)
//     }
    reformDefiningVariables(command) {
      const definingKeywords = ['const', 'let', 'var'];
      const keyword = definingKeywords.find((keyword) => command.startsWith(keyword));
      if (keyword) {
        return command.slice(keyword.length).trim();
      }
      return command;
    }
    reformatDefiningClasses (command){
        let endOfName = command.indexOf('{') - 1
        let className = command.slice(5, endOfName)
        return className + '=' + command + '\n'
    }
    changeCommandToAsyncEval (command){
        return '(async () => {' + command + '})()'
        //Using async with eval from: https://stackoverflow.com/a/56187201/19515980
    }
    reformatImportingDependencies (command){
        let libraryName = command.slice(command.indexOf('(') + 1, command.indexOf(')'))
        let variableName = command.slice(0, command.indexOf('='))
        return '(() => { \n import(' + libraryName + ').then(module => {' + variableName + '= module.default || module})})()'
    }
    preEvaluateChecks (command){
        if (command.slice(0, 6).includes('.load') || command.slice(0, 2) === '//'){
            return false
        }
         else if (command.slice(0,9).includes('function ')){
             console.log('reformating function')
             this.combineWithCurrentCommand = command + '\n'
             return false
         }
        else if (this.combineWithCurrentCommand.slice(0, 6) === 'class '){
            this.combineWithCurrentCommand = this.reformatDefiningClasses(command)
            return false
        }
        else if (this.combineWithCurrentCommand === ''){
            console.log('reformating defining statement')
            this.combineWithCurrentCommand = this.reformDefiningVariables(command)
        }
        else{
            this.combineWithCurrentCommand += command + '\n';
        }
        if (this.combineWithCurrentCommand.includes('await import')){
            this.combineWithCurrentCommand = this.reformatImportingDependencies(this.combineWithCurrentCommand)
        }
      else if (this.combineWithCurrentCommand.includes('await')){
          this.combineWithCurrentCommand = this.changeCommandToAsyncEval(this.combineWithCurrentCommand)
      }
    }
    evaluateCommand (command){
        let checkStatus = this.preEvaluateChecks(command)
        if (checkStatus === false){
            return false
        }
        console.log('gonna try:', this.combineWithCurrentCommand)
        try {
//           console.log('evaluating:', command, this.combineWithCurrentCommand);
//           eval(JSON.stringify(this.combineWithCurrentCommand));
//           I got this method of using eval from: https://stackoverflow.com/a/23699187/19515980
              (true, eval)(this.combineWithCurrentCommand)
//           console.log('evaluated:', this.combineWithCurrentCommand)
        this.combineWithCurrentCommand = '';
                console.log('command worked')
        } catch (error) {
          if (error instanceof SyntaxError) {
            // Incomplete command
           console.log('command incomplete', this.combineWithCurrentCommand)
          } else {
            console.log(error);
          }
        }
    }
}

// let historyPlayer1 = new CommandHistoryPlayer('./10June-repl-history-2-.txt')
//console.log('running action', currentCommandInfo)

historyPlayer1 = new CommandHistoryPlayer('./16Aug-repl-history-4-.txt')
historyPlayer1.play()

historyPlayer1.arop()

historyPlayer1.repeat()

//historyPlayer1.stop()

// let testFunc = 'function testingIfFunctionsWork(arg) { console.log("hi", arg); console.log("Function testing success"); return arg; }';
// 
// const repl = require('repl');
// const replServer = repl.start({ prompt: '> ' });
// 
// const fs = require('fs');
// const path = require('path');
// const { Writable } = require('stream');
// 
// const outputFile = path.join(process.cwd(), 'output.txt');
// const outputStream = fs.createWriteStream(outputFile);
// 
// const originalEval = replServer.eval;
// 
// replServer.eval = function (cmd, context, filename, callback) {
//   const writableCallback = new Writable({
//     write(chunk, encoding, callback) {
//       // Write the output to the file or perform other handling
//       outputStream.write(chunk);
//       callback();
//     },
//   });
//   originalEval.call(replServer, cmd, context, filename, writableCallback);
// };
// 
// // Now the evaluated code output will be redirected to the file
// replServer.eval(`console.log('hi')`);
// 

function asynImportEvalTest (libraryToImport, variableName){
    let toEval = 'async () => {' + variableName + '= await import("' + libraryToImport + '")}()'
    console.log('hi', JSON.stringify(toEval))
    (1, eval)(toEval)
}
