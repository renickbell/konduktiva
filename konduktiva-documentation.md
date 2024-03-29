# Konduktiva Documentation
Konduktiva is a JavaScript library for live coding, an improved version of the Conductive library for live coding in the Haskell programming language by Renick Bell. At present, it is intended for use within Nodejs. 

[Konduktiva website](http://konduktiva.org/doku.php?id=start)
[Renick Bell's Website](https://renickbell.net/doku.php?id=start)

## Installation:

1. Install [Nodejs](https://nodejs.org/en). If [npm](https://www.npmjs.com/package/npm) does not automatically get installed with Nodejs, [install npm](https://github.com/npm/cli).

    2.1. Check if nodejs is installed by running this command in the terminal:
    ```
    node -v
    ```
    2.2. Check if npm is installed by running this command in the terminal:
    ```
    npm -v
    ```

    2.3. You can close the terminals you have opened prior to this step.

2. Install Konduktiva by using NPM:
    ```
    npm i konduktiva
    ```
3. Install a Digital Audio Workstation. [Ardour is recommended](https://ardour.org/)
## Setting Up Other related software (MIDI routing in device)

[Here](http://konduktiva.org/doku.php?id=first_steps)

## Setting Up An Editor (VIM + TMUX)

[Here](https://konduktiva.org/doku.php?id=vim-tmux-setup)

## Tutorials: 
[Click here for tutorials about Konduktiva](https://konduktiva.org/doku.php?id=start)

## Conceptual Overview

Konduktiva is a JavaScript library for live coding performances using a metaphor of a conductor conducting an ensemble.

A [MusicalEnvironment](#MusicalEnvironment) is used to store all of the necessary data.

[Players](#Players) represent processes that can be started or stopped using the metaphor of a player in a musical ensemble like a band or orchestra.

The Players execute action functions which do things like play samples, trigger MIDI events, or even change the state of the system. They do so according to timing determined by IOI functions. IOI means interonset interval, which is the time between events. This timing is what determines the rhythm of a Player.

Players can be used for a single or multiple outputs. Anything that can be manipulated with a JavaScript function call can be an output. Actions for the SuperDirt sampler and MIDI are included in the distribution.

By starting and stopping Players, a performance can be realized.

----

One of the services that it provides is a sequencer with regular timing. If you use setInterval alone, you will eventually accumulate a time lag, which means that your rhythm will be slow and fall behind what you expect, or that two different processes would fall out of time.

The exact timing is controlled by an IOI function, which is one of two functions called by a Player. Players are a metaphor for a repeating set of function calls.

An IOI function produces a time interval that is used to space out events. It produces an interval which is the space between events. The simplest IOI function could return a single number, such as 1, which would indicate an event on each beat.

Ableton sequences by putting blocks on a grid. Konduktiva has a grid aligned to a BPM, except instead of placing blocks on the grid, you are placing fu

In a DAW like Ableton, you sequence music by placing blocks on a grid which is defined by BPM and time signature (4 beats per bar). In Konduktiva, there doesn't need to be a bar.

If you think about the piano roll in a DAW, you paint on notes. In Konduktiva, we write a function to determine the position of the notes. As for which notes they are, in a DAW the vertical position is painted as well. In Konduktiva, we write a function to determine that.

Think of an orchestra. You might have one player playing a violin and another playing a flute. In Konduktiva, you might represent each of these with a Player, each with a different function for rhythm and a different function for what sound to make.

In a piano roll, you press play, and each of the painted notes is sounded according to its position on the roll, and when all of the notes have been played, the DAW will produce silence (unless you have set a loop point). In Konduktiva, you press play for an individual Player (or for all of the Players together, or a subset, depending on your design), and the default behavior is to repeat a Player's function for rhythm indefinitely until the Player is stopped.

In Konduktiva, by editing the Players on the fly, you can perform complex musical sequences, like a conductor conducting players in an ensemble.

Because we have the power of a programming language, we can produce sequences which are much more complex than those that you would draw on a piano roll.

## Players and the two important functions they reference: IOI functions and action functions

Each Player references two functions: an IOI (interonset interval) function which controls timing of events, and an action function which determines what to do according to that timing.

These functions are separate from the Player itself so that different Players can use the same IOI or action functions. Imagine a violin Player and a flute Player, each having a different action function corresponding to those two sounds, yet both using the same IOI function, resulting in them playing the same rhythm. Alternatively, you could have a single violin action function being used by two different Players, each with a different IOI function, resulting in two different rhythms of violin melody.
IOI functions

IOI stands for interonset interval: the interval between the onset of events, or how much time passes between the triggering of events. This is like the space between notes on a piano roll, but more specifically the distance between the start of each note.

With an IOI function, we specify the gaps between notes in order to define our rhythm. An IOI function that produces the looping sequence of numbers 2, 3, 2, a rhythm of 2 beats, 3 beats, and then 2 beats results.

|X-X--X--|X-X--X--|X-X--X--|X-X--X-- (... indefinitely)

An IOI function produces rhythm. Rhythm implies at least two notes. By repeating an IOI function, a rhythm emerges.

It's important to remember that this doesn't necessarily have anything to do with note duration; it's just when the note starts.

You might want to think of it as defining the negative space between notes.
action functions

In Konduktiva, the position of the notes is controlled by an IOI function. What happens at those notes is determined by the action function.

In Konduktiva instead of a block, you

Musical Environment

You populate the MusicalEnvironment with Players, IOI functions, and action functions. The tempo exists as a property of this MusicalEnvironment.

QuantizedMap

## MusicalEnvironment

This is a class used for storing all of the data that is needed for producing a performance with Konduktiva, including Players, Actions, IOI functions, RhythmMaps, and so on.
You populate the MusicalEnvironment with Players, IOI functions, and action functions. The tempo exists as a property of this MusicalEnvironment.

### Constructor
 The constructor takes no arguments. Call it to get a default MusicalEnvironment which can then be adjusted to your needs.
 
 ```
 e = new MusicalEnvironment();
 ```

### Variables in the MusicalEnvironment
The titles of each variable in this documentation are aimed at giving as much information as possible. For example, the first title "bools: boolean[]". "bools" is the variable name and "boolean[]" tells you that the variable bools is supposed to be an array full of booleans.

#### actions: function{}
Actions functions that can be used are stored here. [Learn more here](https://konduktiva.org/doku.php?id=action-functions)

Connected to player variable: action
#### beatOfChangeToCurrentTempo: number
#### channelMaps: QuantizedMap{}
Channel Maps that players can use. These maps control which channel player should send midi info to at a given time.

Connected to player variable: channelMap
#### chordMaps: QuantizedMap{}
Chord maps that players can use. These maps control which chords a player should use at a given time. The values are letter musical notation. (eg. M or m7)

Connected to player variable: chordMap
#### controlChangeMaps: QuantizedMap{}
Control change maps that players can use. These map control which control change midi messages a player should send at a given time. The values are the midi controlChange information in form of objects with the variables controller and, value.

Connected to control change player variable: controlChangeMap
#### currentDensityGraphs: string[]
An array of densityGraph names. The acutal densityGraphs are stored in the [densityGraphs variable](#densityGraphs).
#### currentTempo: 
Returns the current tempo of the MusicalEnvironment. To change the tempo use the [changeTempo method](#changeTempo).
#### currentBeatsPerMeasure: number
Shows the current beats per measure. Default is 4.
#### densityGraphs: object{}
An object filled with densityGraphs. The actual graphs are in form of QuantizedMaps. So, it is a QuantizedMap in an object in another object.
#### IOIs: function{}
IOI function are stored here.
#### legatoMaps: QuantizedMap{}
Controls how long each note plays for. Similar to noteDurationMaps. Works with noteDuration. This is the equation used for calculating a duration of a note. noteDuration * legatoMap.
#### lookahead: number
Returns the lookahead time.
#### maskMaps: QuantizedMap{}
maskMaps are basically the booleans. The keys are the time and the values are trues or falses. If it is a true for a specific time, the action function will be called. If it is a false, action function will not be called. To supress events.
#### maxPolyphonyMaps: QuantizedMap{} (optional)
Not filling this in will deactivate this specific feature.

Sets the amount of midi notes a player is allowed to play at a given beat. The keys are the beats and the values are the amount of midi notes the player is allowed to play.

#### midiInputs: Object{}
The midiInputs that Konduktiva/Easymidi can detect.
#### midiOutputs: Object{}
the midiOutputs that Konduktiva/Easymidi can detect.
#### midiProgramMaps: QuantizedMap{}
Used by the players that send Midi Program messages. Controls which Midi program messages to send at a given time.
#### modeFilters: QuantizedMap{}
The mode players should be filtered through. It passes the note to filter through the modeFilter QuantizedMap via wrapLookup method.
#### modeMaps: QuantizedMap{}
The modeFilter that the player should use.
#### noteDurationMaps: QuantizedMap{}
These QuantizeMaps store how long each note should play for at a given beat. They are the note spans. Works with legatoMaps. This is the equation used for calculating a duration of a note. noteDuration * legatoMap.
#### noteMaps: QuantizedMap{}
Stores the noteValues. The keys is the beats and the values are the notes to play.
#### notesInputMode: string
Two options ```relativeSemitone``` or ```relativeScaleDegree```. This changes how the action function uses the noteMaps
#### octaveMaps: QuantizedMap{}
Stores the octaves the action function should use at a given beat. The keys are the beats and the values are the octaves to use.
#### players: object[]
An array full of player objects. Find out more by looking at the [player](#Players-and-the-two-important-functions-they-reference:-IOI-functions-and-action-functions) section.
#### recordedMessages: QuantizedMap{}
For use in recording midi inputs.
#### rhythmMaps: QuantizedMap{}
Controls when a note is played (keys) and how long each note should play for (values).
#### rhythmPatterns: QuantizedMap{}
Needed to call ```rhythmPattern.add(e, playerName) for things to work correctly. To create events.
#### root: string
The root letter. By default it is 'A'.
#### rootMaps: QuantizedMap{}
Stores the root English letters. The keys are the beats and the values are the English letters.
#### sampleKits
superDirt stuff.
#### samplePatternCount
superDirt stuff.
#### samplePatternStore
superDirt stuff.
#### samplePatterns: QuantizedMap{}
superDirt instrument QuantizedMap.
#### samples
#### scheduledPlayers
Players that are schedules to play stored in an array.
#### songMaps: QuantizedMap{}
Controls which chordMap a player is using
#### scheduler
Tasktimer
#### superDirtPath
Location of the superDirt samples.
#### timeOfChangeToCurrentTempo
#### velocityMaps: QuantizedMap{}
Controls the midi velocity variable from 0-127 at a given beat. The keys are the beats and the values are the velocity.

### Methods in the MusicalEnvironment
### currentBeat
-> Number

Returns the current beat of the MusicalEnvironment
##### Syntax
```
e.currentBeat()
```

##### Parameters

##### Examples
```
console.log(e.currentBeat())
```

---

---

### changeTempo
Number ->

Takes a number as an argument and changes the currentTempo to that number.
##### Syntax
```
e.changeTempo(tempo)
```

##### Parameters
###### tempo
New tempo of the current MusicalEnvironment

##### Examples
```
console.log(e.changeTempo(100)) //TEMPO CHANGE! time: 5.690928572999313; beat: 8.493846618000418
console.log(e.changeTempo(120)) //TEMPO CHANGE! time: 22.66408885199949; beat: 36.78241345300153
```

---

---

### getAction
string -> Function

Returns the action function of a specific player in this MusicalEnvironment
Takes player name in form of a string as an argument.
##### Syntax
```
e.getAction(player)
```

##### Parameters
###### player
Name of a variable in e.players

##### Examples
```
console.log(e.getAction('kick')) //[Function (anonymous)]
console.log(e.getAction('snare')) //[Function (anonymous)]
```

---

---

### getIOIFunc
string -> Function

Returns the IOI function of a specific player in this MusicalEnvironment.

##### Syntax
```
e.getIOIFunc(player)
```

##### Parameters
###### player
Name of a variable in e.players

##### Examples
```
console.log(e.getIOIFunc('kick')) //[Function: defaultIOI]
console.log(e.getIOIFunc('snare')) //[Function: defaultIOI]
```

---

---

### scheduleEvents
schedules events.
string -> 

Returns the IOI function of a specific player in this MusicalEnvironment. Not meant to be called by user.
##### Syntax
```
e.scheduledPlayers(player)
```

##### Parameters
###### player
Name of a variable in e.players

##### Examples
```
e.scheduleEvents('musicSynthesizerSession1')
```

---

---

### startScheduler

Starts the scheduler for the MusicalEnvironment. It takes no arguments and returns nothing.
##### Syntax
```
e.startScheduler()
```

##### Parameters

##### Examples
```
e.startScheduler()
```

---

---

### stopScheduler

Stops the scheduler for the MusicalEnvironment. Takes no arguments and retunrs nothing.
##### Syntax
```
e.stopScheduler()
```

##### Parameters

##### Examples
```
e.stopScheduler()
```

---

---

### play
String -> 

#### Syntax
```
e.play(player)
```

#### Parameters
##### players
Player name

### Examples
```
e.play('musicSynthesizerSession1')
```

---

---

### stop
String -> 

#### Syntax
```
e.stop(player)
```

#### Parameters
##### players
Player name

### Examples
```
e.stop('musicSynthesizerSession1')
```

---

---

### allPlayers
 -> 

Returns an array of all the player names.
##### Syntax
```
e.allPlayers()
```

##### Parameters

##### Examples
```
console.log(e.allPlayers)
```

---

---

### allPlayerStatus
 -> [[String, String] ...]

Returns an array full of arrays. Each sub array contains the player name and their status. All the player names and their status also gets logged into the console.
##### Syntax
```
e.allPlayerStatus()
```

##### Parameters

##### Examples
```
console.log(e.allPlayerStatus())
/*
[
  [ 'kick', 'stopped' ],
  [ 'snare', 'stopped' ],
  [ 'perc', 'stopped' ],
  [ 'hat', 'stopped' ],
  [ 'sub', 'stopped' ],
  [ 'stab1', 'stopped' ],
  [ 'stab2', 'stopped' ],
  [ 'atmo', 'stopped' ],
  [ 'musicSynthesizerSession1', 'stopped' ]
]
*/
```

---

---

### playingPlayers
 ->

Returns an array of all the names of players that are currently playing.
##### Syntax
```
e.playingPlayers()
```

##### Parameters

##### Examples
```
console.log(e.playingPlayers()) //[]
```

---

---

### playN
[String] -> 

Starts playing all the player names in the array.

##### Syntax
```
e.playN(ps)
```

##### Parameters
###### ps
An array of player names.

##### Examples
```
e.playN(['musicSynthesizerSession1', 'musicSynthesizerSession2'])
```

---

---


### stopN
[String] -> 

Stops playing all the player names in the array.

##### Syntax
```
e.stopN(ps)
```

##### Parameters
###### ps
An array of player names.

##### Examples
```
e.stopN(['musicSynthesizerSession1', 'musicSynthesizerSession2'])
```

---

---

### playAll
 ->

All players start playing.

##### Syntax
```
e.playAll()
```

##### Parameters

##### Examples
```
e.playAll()
```

---

---

### stopAll
 ->

All players stop playing.

##### Syntax
```
e.stopAll()
```

##### Parameters

##### Examples
```
e.stopAll()
```

---

---

### solo

[String] ->

Stops playing all the player names in the array after checking if the players exist inside the MusicalEnvironment.
##### Syntax
```
e.solo(ps)
```

##### Parameters
###### ps
An array of player names.

##### Examples
```
e.stopN(['musicSynthesizerSession1', 'musicSynthesizerSession2'])
```

---

---

### togglePlayer
String -> 

Toggles the state of a specific player. If that player is playing it will be stopped. If that player is stopped, it will start playing.

##### Syntax
```
e.togglePlayer(p)
```

##### Parameters
###### p
Player name

##### Examples
```
e.togglePlayer('musicSynthesizerSession1')
```

### findSuperDirtSamples
-> String

Checks if superDirt samples exists at the location(file path) they are supposed to be at.

#### Syntax 
```
e.findSuperDirtSamples()
```

#### Parameters
#### Examples:
```
e.findSuperDirtSamples()
//'/home/steve/.local/share/SuperCollider/downloaded-quarks/Dirt-Samples'
```

### getSuperDirtSamplesPath
-> String

Returns the path of where superDirt samples should be on a specific system.

#### Syntax
```
e.getSuperDirtSamplesPath()
```

#### Parameters
#### Examples
```
e.getSuperDirtSamplesPath()
//'/home/steve/.local/share/SuperCollider/downloaded-quarks/Dirt-Samples'
```

### checkingAddMapToMusicalEnvironmentArguments

String -> String ->  Number, [Number] -> [[Number]]|[Number] -> 

Checks the arguments of addMap method.

#### Syntax 
e.checkingAddMapToMusicalEnvironmentArguments(objectName, mapName, keyspan, keys, values)

#### Parameters
###### objectName
Name of a variable in the MusicalEnvironment to add to.
###### mapName
Name of the new QuantizedMap.
###### keyspan
Th keyspan of the new QuantizedMap.
###### keys
The keys of the new QuantizedMap.
###### values
The values of the new QuantizedMap.

##### Example:
```
e.checkingAddMapToMusicalEnvironmentArguments('rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])
//undefined
```

### createDefaultRhythmMap
String -> String ->  Number, [Number] -> [Number] -> Boolean

Creates the default a rhythmMap with the information provided

#### Syntax 
e.createDefaultRhythmMap(objectName, mapName, keyspan, keys, values)

##### Parameters
###### objectName
Name of a variable in the MusicalEnvironment to add to.
###### mapName
Name of the new QuantizedMap.
###### keyspan
Th keyspan of the new QuantizedMap.
###### keys
The keys of the new QuantizedMap.
###### values
The values of the new QuantizedMap.

#### Examples
```
e.createDefaultRhythmMap('rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])
//true
```

### createSubarrayMap 
String -> String ->  Number, [Number] -> [Number] -> Boolean

Creates subArray QuantizedMaps and adds them to MusicalEnvivronment. This is used for noteMaps and octaveMaps.

#### Syntax
e.createSubarrayMap(objectName, mapName, keyspan, keys, values)

##### Parameters
###### objectName
Name of a variable in the MusicalEnvironment to add to.
###### mapName
Name of the new QuantizedMap.
###### keyspan
Th keyspan of the new QuantizedMap.
###### keys
The keys of the new QuantizedMap.
###### values
The values of the new QuantizedMap.

#### Examples
```
e.createSubarrayMap('rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])
//true
```

### createNoteMaps


### createRhythmPatternMap 
String -> String ->  Number, [Number] -> [Boolean] -> Boolean

Creates the default rhythmPattern maps based on the information.

#### Syntax
```
e.createRhythmPatternMap(objectName, mapName, keyspan, keys, values)
```

##### Parameters
###### objectName
Name of a variable in the MusicalEnvironment to add to.
###### mapName
Name of the new QuantizedMap.
###### keyspan
Th keyspan of the new QuantizedMap.
###### keys
The keys of the new QuantizedMap.
###### values
The values of the new QuantizedMap.

#### Examples
```
e.createRhythmPatternMap('rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])
//true
```

### createDefaultMaskMap
String -> String ->  Number, [Number] -> [Boolean] -> Boolean

Creates the default maskMap based on the information provided.

#### Syntax
```
e.createDefaultMaskMaps(objectName, mapName, keyspan, keys, values)
```

##### Parameters
###### objectName
Name of a variable in the MusicalEnvironment to add to.
###### mapName
Name of the new QuantizedMap.
###### keyspan
Th keyspan of the new QuantizedMap.
###### keys
The keys of the new QuantizedMap.
###### values
The values of the new QuantizedMap.

#### Examples
```
e.createDefaultMaskMap('rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])
```

### createChordProgressionMap
String -> String ->  Number, [Number] -> [Boolean] -> Boolean

Create default chord progression map with information provided.

#### Syntax
e.createChordProgressionMap(objectName, mapName, keyspan, keys, values)

##### Parameters
###### objectName
Name of a variable in the MusicalEnvironment to add to.
###### mapName
Name of the new QuantizedMap.
###### keyspan
Th keyspan of the new QuantizedMap.
###### keys
The keys of the new QuantizedMap.
###### values
The values of the new QuantizedMap.

#### Examples
```
e.createDefaultMaskMap('rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])
//true
```

### createSongMap
String -> String ->  Number, [Number] -> [Boolean] -> Boolean

Creates the default song map with based on the information provided.

#### Syntax
```
e.createSongMap(objectName, mapName, keyspan, keys, values)
```

##### Parameters
###### objectName
Name of a variable in the MusicalEnvironment to add to.
###### mapName
Name of the new QuantizedMap.
###### keyspan
Th keyspan of the new QuantizedMap.
###### keys
The keys of the new QuantizedMap.
###### values
The values of the new QuantizedMap.

#### Examples
```
e.createSongMap('rhythmMaps', 'chalk', 15000, [1000, 5000, 10000], ['twelveBars', 'lsystem', 'scarboroughFair'])

//true
```

### createDefaultMap
String -> String ->  Number, [Number] -> [Boolean] -> Boolean

Create default chord progression map with information provided.

#### Syntax
```
e.createDefaultMap(objectName, mapName, keyspan, keys, values)
//true
```

##### Parameters
###### objectName
Name of a variable in the MusicalEnvironment to add to.
###### mapName
Name of the new QuantizedMap.
###### keyspan
Th keyspan of the new QuantizedMap.
###### keys
The keys of the new QuantizedMap.
###### values
The values of the new QuantizedMap.

#### Examples
```
e.createDefaultMap('rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])
//true
```

### addMap

This function helps add QuantizedMaps into the MusicalEnvironment with correct types. If something is wrong, this function will throw an error. It is safer and in some situations easier and quicker to use this method than to create a QuantizedMap manually.
##### Syntax
```
e.addMap(objectName, mapName, keyspan, keys, values)
```

##### Parameters
###### objectName
Name of a variable in the MusicalEnvironment to add to.
###### mapName
Name of the new QuantizedMap.
###### keyspan
Th keyspan of the new QuantizedMap.
###### keys
The keys of the new QuantizedMap.
###### values
The values of the new QuantizedMap.

##### Examples
```
e.addMap('rhythmMaps', 'chalk', 10, [0, 1, 2, 3], [4, 5, 6, 7])
console.log(e.rhythmMaps.chalk)
/*
QuantizedMap {
  keyspan: 1,
  keys: [ 1 ],
  values: QuantizedMap {
    keyspan: 10,
    keys: [ 0, 1, 2, 3 ],
    values: [ 4, 5, 6, 7 ]
  }
}
*/
```

---

---
## Interacting with the Musical Environment

There are different ways you can interacte and change things in the MusicalEnvironment. You can change it by doing ```e.variable = ```. This way is excellent if you are familliar with what you are doing and if you have time. When live coding we often have to act and think quickly. When doing this is is especially easy to make mistakes when making QuanitzedMaps. 


### Players
Players are processes that can be started or stopped using the metaphor of a player in a musical ensemble like a band or orchestra.

Players are data structures to represent an agent which carries out Action functions in time according to an IOI function.

Players can be used for a single or multiple outputs. Anything that can be manipulated with a JavaScript function call can be an output. Actions for the SuperDirt sampler and MIDI are included in the distribution.

By starting and stopping Players, a performance can be realized.


##### Syntax
```
new Player(name)
```

##### Parameters
###### name
Name of the player. This will also be the value of the name variable in the player.

##### Examples
```
e.players.testPlayer = new Player('testPlayer')
e.players.testPlayer.maskMap = 'default'
e.players.testPlayer.action = 'midiSequencedRhythm'
e.players.testPlayer.rhythmMap = 'default'
console.log(e.palyers.testPlayer)
```

This class is usually called by helper functions like setupMidiRhythm or setupPlaybackPlayer. To make the the player work, the user needs to give it a maskMap, action function and, a rhythmMap.

---

---

### QuantizedMap

A QuantizedMap is a discrete function in which an input returns one of a set of possible outputs.

A common use is to provide a set of time intervals from 0 to n in which each interval is mapped to a specific output.

##### Quantized Map
###### Keyspan: number
Keyspan is the total
###### Keys: number[]
An array of numbers in ascending order.
###### values: number[]
###### To make a new Quantized Map
```
new QuantizedMap(keyspan, keys, values)
```
###### nearestLookup: Method
Takes a number as an input and will look for a number in the keys array that is closest to it compared to the others. It will then take the index of that number and return the value array using that index.
###### floorLookup: Method
The floorLookup method does something similar to nearestLookup but when it looks for the closest it always looks for a number smaller than it.
###### wrapLookup: Method
The wrapLookup method is also similar to the nearestLookup method but when the number provided is greater than the keyspan, it does not return the last item in the values array instead it loops back around.

---

---

### RhythmPattern

A RhythmPattern is a set of parameters bundled as an object which is used to create a rhythm pattern and mask pattern for a particular Player.

#### Methods 
##### constructor
String -> Number -> [Number ...] -> [Boolean] -> Object

Creates the RhythmPattern
##### Syntax
```
new RhythmPattern(n, l, i, b)
```

##### Parameters
###### n
Name of the rhythmPattern.
###### l
Length of the rhythmPattern
###### i
A number array filled with the booleans "true" and "false".

##### Examples
```
let testR = new RhythmPattern('dopeRhythm', 5, [2, 2, 2, 2, 2], [true, false, true, true])
```

---

---
##### addToPlayer
MusicalEnvironment -> String -> 

Adds this RhythmPattern to a player.
##### Syntax
```
testR.addToPlayer(env, playerName)
```

##### Parameters
###### env
MusicalEnvironment
###### playerName
Name of the player to add to.

##### Examples
```
testR.addToPlayer(e, 'p3')
```

---

---
##### add
MusicalEnvironment -> String -> 

Adds to MusicalEnvironment but does not add to a player.
##### Syntax
```
testR.add(env, playerName)
```

##### Parameters
###### env
MusicalEnvironment
###### playerName
Name of the player to add to.

##### Examples
```
testR.add(e, 'p3')
```

---

---

## Action functions

To Note: None of the action functions or the functions called by/in the action functions are intended to be directly called by users.

Action function are a key part of Konduktiva. Click (here)[http://konduktiva.org/doku.php?id=action-functions] to get a simple explanation of action functions and click (here)[http://konduktiva.org/doku.php?id=custom-actions] to see a simple explanation on how to create custom action functions.

Here the details of what each action function does will be documented more specifically.

### default
Number -> Number -> MusicalEnvironment

A simple action function for testing and debugging purposes which will log all of the arguments into the console disregarding the verbose variable of the player. (Not meant to be called by user)

#### Syntax
```
e.actions.default(midiOutput, b, e)
```

##### Parameters
###### midiOutput
The index in the array e.midiOutputs. 
###### b
Beat
###### e
MusicalEnvironment.

##### Examples
```
e.actions.default(1, 100, e)
/*
Hi this is the default action function being triggered
This is the midiOutput:  1
This is the beat:  100
undefined
*/
```

### midiSequencedRhythm/callMusicSynthesizerRhythm:
Object -> Number -> 

DEPRECATED

### sendNotesMidiInfo:
String -> Number -> MusicalEnvironment -> Boolean

Sends note MIDI messages using the information provided.
Note other functions called in this function documented below.
#### Syntax
```
e.actions.sendNotesMidiInfo(playerName, b, e)
```

#### Parameter
##### playerName
The name of the player to be played
###### b
Beat
###### e
MusicalEnvironment

##### Example
```
e.actions.sendNotesMidiInfo('exampleMidiPlayer1', 100, e)
```

### sendChordMidiInfo:
String -> Number -> MusicalEnvironment -> Boolean

Sends chord MIDI messages using the information provided.
Note other functions called in this function documented below.
#### Syntax
```
e.actions.sendChordMidiInfo(playerName, b, e)
```

#### Parameter
##### playerName
The name of the player to be played
###### b
Beat
###### e
MusicalEnvironment

##### Example
```
e.actions.sendChordMidiInfo('exampleMidiPlayer1', 100, e)
```

### superDirt/playSuperDirtSample:
Object -> Number -> 

Plays the information of a player using superdirt

#### Syntax
```
e.actions.superDirt(e.players.exampleMidiPlayer1, 100)
```

#### Parameter
##### p
Player
##### b
Beat

#### Example
```
e.actions.superDirt(e.players.exampleMidiPlayer1, 100)
```

### Functions used by action functions

#### getNoteInfoToSend
Object -> Number -> Number -> Object

Gets MIDI information that the player should be playing at a specific beat.

#### Syntax
```
K.getNoteInfoToSend(player, b, midiOutput)
```

#### Parameter
##### player
Player that should be playing
##### b
Beat
##### midiOutput
The index of the array in e.midiOutputs.

#### checkIfUseVerboseLogging
Object -> ... -> Boolean

Checks if player verbose player is true and if so log messages requested.

#### Syntax
```
K.checkIfUseVerboseLogging(player, ...)
```

#### Parameters
##### players
Player to check for verbose variable.
##### other things to log
There can be as many other arguments as the user wants and it will be logged in the console if player.verbose is true.

#### Example
K.checkIfUseVerboseLogging(e.players.exampleMidiPlayer1, ...)

### filterPolyphany
MusicalEnvironment -> Number -> Object -> Object -> Object

Checks the maxPolyphany map for how many chords can be played at a specific beat. Notes over the polyphany limit will be dropped.

#### Syntax 
```
K.filterPolyphany(e, b, player, info)
```

#### Parameter
##### e
MusicalEnvironment
##### b
Beat
##### player
Player to play
##### info
Information gotten from getNoteInfoToSend function

#### Examples
```
K.filterPolyphany(e, 100, e.players.exampleMidiPlayer1, K.getNoteInfoToSend(e.players.exampleMidiPlayer1, 100, 1))
```

### filterMode
Number -> MusicalEnvironment -> Number -> Object -> Number

Filters note through modes.

#### Syntax
```
K.filterMode(note, e, b, player)
```

#### Parameter
##### note
Note to filter
##### e 
MusicalEnvironment
##### b
Beat
##### player
Player

#### Example
```
K.filterMode(4, e, 100, e.players.exampleMidiPlayer1)
//4
```

### calculateFinalNoteValue
Object -> Object

Calculates the note variable of the final MIDI message.

#### Syntax
```
K.calculateFinalNoteValue(info)
```

#### Parameter
##### info
The object returned by getNoteInfoToSend.

#### Example
```
K.calculateFinalNoteValue(K.getNoteInfoToSend(e.players.exampleMidiPlayer1, 100, 1))
```

### checkIfSendMidiControlChange
MusicalEnvironment -> Number -> Object ->

Checks if player is supposed to send MIDI CC messages at the current beat and if yes sends the correct MIDI CC message.

### Syntax 
```
K.checkIfSendMidiControlChange(e, b, player)
```

#### Parameters 
##### e
MusicalEnvironment
##### b
Beat
##### player
Player

#### Example
```
K.checkIfSendMidiControlChange(e, 100, e.players.exampleMidiPlayer1)
```

### findChannel
Object -> Number -> MusicalEnvironment -> Number

Checks which channel the player should be sending MIDI messages to.
#### Syntax
```
K.findChannel(player, b, e)
```

#### Parameter
##### Player
Player that should be checked
##### b
Beat
##### e
MusicalEnvironment

#### Examples
```
K.findChannel(e.players.exampleMidiPlayer1, 100, e)
```

### sendMidiData
Object -> Object -> Number -> Number ->

Sends MIDI noteon and noteoff messages.

#### Syntax
```
K.sendMidiData(info, player, note, channel)
```

#### Parameters
##### info
Object returned from getNoteInfoToSend function.
##### player
Player to check
##### Channel
Channel to send MIDI message to.

#### Examples 
```
K.sendMidiData(K.getNoteInfoToSend(e.players.exampleMidiPlayer1, 100, 1), e.players.exampleMidiPlayer1, 50, 1)
```
