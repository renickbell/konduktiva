// --------------------------------------------------------------------------
// -- save-command-history.js
// --------------------------------------------------------------------------

fs = require('fs')
let months = ['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec']
let day = new Date()
let backups = 0

fs.readdir(process.cwd(), (err, files) => {
    files.forEach(x=>{
        if (x.includes(day.getDate() + months[day.getMonth()] + '-repl-history-') == true){
            backups+=1
            //console.log('hi')
        }
    })
    if (backups == 0){
        backups = ''
    }
});

const readline = require('node:readline');
const { stdin: input} = require('node:process');
const rl = readline.createInterface({input});

let historyStream = {startTime: new Date().getTime(), userInputs: []}

function saveHistoryToFile (){
        historyStream.endTime = new Date().getTime()
        fs.writeFileSync(day.getDate() + months[day.getMonth()] + '-repl-history-'+ backups + '-' + '.txt' , JSON.stringify(historyStream))
}

// function saveInputs (){
//     //console.log('saving inputs', repl.repl.history.indexOf(lastLineSave))
//   if (repl.repl.history.indexOf(lastLineSave) <= 0){
//       historyStream.userInputs.push({time: new Date().getTime(), input: repl.repl.history[0]}); // Append command to history
//   }
//     else{
//         let lastSaveIndex = repl.repl.history.indexOf(lastLineSave)
//         for (let i = 0; i < lastSaveIndex; i++) {
//               historyStream.userInputs.push({time: new Date().getTime(), input: repl.repl.history[lastSaveIndex - 1 - i]}); // Append command to history
//         }
//     }
//     lastLineSave = repl.repl.history[0]
// }

function saveInputs() {
  let currentIndex = repl.repl.history.indexOf(lastLineSave) - 1
    console.log('current last save', currentIndex,lastLineSave)
    if (currentIndex < 0){
        return false
    }
    console.log('new save', repl.repl.history[currentIndex])
    historyStream.userInputs.push({
      time: new Date().getTime() - 100,
      input: repl.repl.history[currentIndex]
    });
    lastLineSave = repl.repl.history[currentIndex];
    try{
        if (lastLineSave.slice(0, 6) === '.load ' && fs.existsSync(lastLineSave.slice(6)) === true){
            console.log('loading file detected', currentIndex, repl.repl.history[0])
            for (let i = currentIndex; i > 0; i--) {
                currentIndex -= 1
                historyStream.userInputs.push({
                  time: new Date().getTime() - 100,
                  input: repl.repl.history[currentIndex]
                });
            }
            lastLineSave = repl.repl.history[currentIndex];
        }
    }
    catch{}
}

console.log('history recording started')

// Event listener for when the user closes the program
process.on('exit', () => {
  saveHistoryToFile()
});

//https://stackoverflow.com/a/49961675/19515980
rl.on('line', (input) => {
    setTimeout(() => {
   saveInputs() 
    }, 100)
  // Your logic to handle the command goes here
});
let lastLineSave = repl.repl.history[0]

