// --------------------------------------------------------------------------
// -- command-history-playback.js
// --------------------------------------------------------------------------
// Works as long as all dependencies are there.
// Tried using eval to use require and await import. DID not work require and await import only works in top level modules not meant to be called programmatically
// Tried using .load 
// Using tmux send keys might be an option. This example is from bard AI:
// tmux send-keys -t <window number>.<pane number> <stuff>
// tmux send-keys -t 1.2 "Hello, world!"
// I got the eval method I use from: https://stackoverflow.com/a/23699187/19515980
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
        this.waitFor = undefined
    }
    play (){
        if (this.checkForWaitFor() === false){
            return false
        }
        this.state = 'playing'
        this.scheduleNextAction()
        this.waitFor = undefined
        this.waitingFor = undefined
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
    checkForWaitFor (){
        if (this.waitFor === undefined){
            return true
        }
        else if (typeof (1, eval)(this.waitFor) === 'object'){
            return true
        }
        else {
            console.log('Please import this library by running this command before continueing playback')
            console.log('\x1b[0m', this.waitingFor)
            console.log('You will be unable to continue playback before running this line of code. To overide this behaviour run [nameOfPlaybackClass].waitFor = undefined')
            return false
        }
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
        //Idea of reformatting classes from: https://stackoverflow.com/a/39299283
    }
    changeCommandToAsyncEval (command){
        return '(async () => {' + command + '})()'
        //Using async with eval from: https://stackoverflow.com/a/56187201/19515980
    }
    promptUserToManuallyImportLibrary (command, variableName){
        this.stop()
        console.log('The history save imports this library at this time. The state of this code is currently unable to automatically import it. You will have to manually run this line of code in this nodejs session')
        console.log('\x1b[1m', command)
        console.log('You will be unable to continue playback before running this line of code. To overide this behaviour run [nameOfPlaybackClass].waitFor = undefined')
        this.waitFor = variableName
        this.waitingFor = command
    }
    checkForEndVariableName (command, variableName){
        let nextCommand = this.playbackFile.userInputs[this.actionIndex + 1].input
        console.log('Checking for end variable', variableName, nextCommand)
        console.log(nextCommand.includes(variableName + '.default'))
        if (nextCommand.includes(variableName + '.default') === true){
            console.log('found end variable')
            let reformatedCommand = this.reformDefiningVariables(nextCommand)
            return nextCommand.slice(0, command.indexOf('='))
        }
    }
    tryImportingDependencies (command){
        let command = 'R = await import(ramda)'
//         let libraryName = command.slice(command.indexOf('(') + 1, command.indexOf(')'))
//         let variableName = command.slice(0, command.indexOf('='))
//         console.log('importing modules')
//         let importInString = variableName + "= await import('" + libraryName +" ')"
        fs.writeFileSync('importing-library.js', command)
        (1, eval)(".load ./importing-library.js")
//         let endVariableName = this.checkForEndVariableName(command, variableName)
//         try{
//             if ((1, eval)(variableName) !== undefined){
//                 return true
//             }
//         }catch{}
//         try{
//             if (endVariableName === undefined){
//                 console.log('trying require to import library: ', '(' + variableName + ' = require(' + libraryName + '))')
//                 (1, eval)('(' + variableName + ' = require(' + libraryName + '))')
//                 console.log('succeded with importing with require')
//             }
//             else {
//                 console.log('trying require to import library: ', '(' + endVariableName + ' = require(' + libraryName + '))')
//                 (1, eval)('(' + endVariableName + ' = require(' + libraryName + '))')
//                 console.log('succeded with importing with require')
//                 this.playbackFile.userInputs.splice(this.actionIndex + 1, 1)
//             }
//         catch{
//             try{
//                 (1, eval)('(() => {import(' + libraryName + ').then(module => {' + variableName + '= module.default || module})})()')
//             }
//             catch{
//                 this.promptUserToManuallyImportLibrary(command, variableName)
//             }
//         }
//     }
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
            this.combineWithCurrentCommand = this.eformatDefiningClasses(command)
            return false
        }
        else if (this.combineWithCurrentCommand === ''){
            console.log('reformating defining statement')
            this.combineWithCurrentCommand = this.reformDefiningVariables(command)
        }
        else{
            this.combineWithCurrentCommand += command + '\n';
        }
        console.log('combineWithCurrentCommand', this.combineWithCurrentCommand, typeof this.combineWithCurrentCommand)
        console.log('testing if importing modules: ', this.combineWithCurrentCommand.includes('await import'), this.combineWithCurrentCommand)
        if (this.combineWithCurrentCommand.includes('await import') === true){
            this.tryImportingDependencies(this.combineWithCurrentCommand)
            this.combineWithCurrentCommand = ''
            return false
        }
      else if (this.combineWithCurrentCommand.includes('await')){
          this.combineWithCurrentCommand = this.changeCommandToAsyncEval(this.combineWithCurrentCommand)
      }
    }
    evaluateCommand (command){
        let checkStatus = this.preEvaluateChecks(command)
        console.log('check status', checkStatus)
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

// historyPlayer1 = new CommandHistoryPlayer('./15Aug-repl-history-9-.txt')
historyPlayer1 = new CommandHistoryPlayer('./libraries-to-import.txt')
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

function asyncImportEvalTest (libraryName, variableName){
    (1, eval)('(' + variableName + ' = require(' + JSON.stringify(libraryName) + '))')
}

function importingLibraries(command) {
  console.log('trying to import shit', command, fs);
  fs.writeFileSync('importing-library.js', command);
  let variableName = command.slice(0, command.indexOf('='))

//    (1, eval)(".load ./importing-library.js");
}

importingLibraries("A = await import('array-toolkit')")

