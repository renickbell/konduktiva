// --------------------------------------------------------------------------
// -- example-playing-melodies.js 
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

updateMidiOutputList(e)
//e.changeTempo(250)

e.play('musicSynthesizerSession1')
e.play('musicSynthesizerSession3')
e.play('musicSynthesizerSession4')
e.play('musicSynthesizerSession2')

// messageAllClients({action: 'animationExample'})
e.stopAll()

e.stop('musicSynthesizerSession2')

e.currentBeat()
//use an L-system to create a melod:
    //keys in L system represent scale degree or operations in scale degree


//Avoid disonace.
//Solution: handleDissonance function checks for disonace and flags it and blocks it. Changes it to 0. Prevents disonance from playing.
//Status: complete.

//Longer melody that sounds like is leading to something.
//Solution: Make one part of the melody louder and quicker.
//Status: complete

//Be able to live code from another file.
//Solution: fs.watchFile
//Status: complete. RUn code below and will change randomMelody1.

//Connect to SVG.js. Circles show when trhere is sound and bigger circle for bigger volume.
//Solution: websocket.
//Status: complete.

//do another one based on lsystem

/*
store melodies by name in musical environment

use playername to check which melody should be played

play on emeody for 64 beats

quantized map that includes times and melody name

prepare a presentation to explain how I use an lsystem to make a melody

easy to read print out of the musical environment
*/

//     let twelveBarsConfa = assignChordProgressionToPlayer('p1', 'twelveBars')
// recordConfigurationDataIntoMusicalEnvironment(twelveBarsConfa, 'p1', e)
//         assignPlayerForMusicSynthesizerSession(e, 3, {rhythmMapName: 'straight'}, defaultName)
//         player.currentChordProgression = correctCurrentChordProgression


