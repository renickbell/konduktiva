# Konduktiva 
Using-Konduktiva-With-MIDI
initial author: Renick Bell (renick@gmail.com)

initial creation date: Wed Jun 28 10:08:48 AM CST 2023

contributors: Yiler Huang (yiler7777@gmail.com);Steve Wang (stevesg168@gmail.com)

license: GPL 3.0

## This code allows Konduktiva to work with music synthesizers that use MIDI.

This document works as both a documentation and a tutorial about how to use the code and how to install the code. These sections follow in this order:
1. The first part covers the [installation process](#installation). 
2. Next, it covers the basics of just [playing some sounds](#running-the-code).
3. Next, a part about (controlling music)[#controlling-musc], then how to put those [configurations into the musical environment](#record-configuration-objects-to-musical-environment) and about [assigning players for music synthesizer sessions](#assigning-player-for-music-synthesizer-session)
4. Finally, there is a section that might [help if installation or playing music does not work](#debugging) and some [configuration specifics about different operating systems](#os).

### Installation:

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

2. Install Konduktiva by using NPM or use git to download the files by typing this command in the terminal. You might choose to move the installation location to outside the node modules folder because it is not meant to be used with await import or requrie. It is meant to be used in the global scope.:
    ```
    git clone https://github.com/mrname5/Using-Konduktiva-With-MIDI.git
    ```
    OR
    ```
    npm i @renickbell/konduktiva
    ```

3. Open the terminal, move to the directory where the code has been installed in. This effect can be achieved by using the ``` cd [directory name command] ``` command or navigate to that directory with the file manager and right click to open a terminal session there. We will call this terminal session t1. Then, run this command:
    ```
    node installer.js
    ```

4. After that code has finished running, the installation should be complete.

### Running the code:

1. Launch 4 sessions/instances of your preferred music synthesizer that supports having multiple instances running at the same time (each with a different midi inputs). Yoshimi is suggested for [Linux](https://yoshimi.sourceforge.io/) and [Surge](https://surge-synthesizer.github.io/) is recommended for MacOS.

2. Go back to t1 and type this command in it:

    ```
    node
    ```

3. Inside the nodejs session in t1 paste this the contents of example-session-with-melodies.js.

**NOTE**: This called is not meant to be used in the global scope. Things might not work as intended when it is used with require or await import.

4. Now you can try pasting the code in example-playing-melodies.js(A file where all the other necessary files are loaded) into t1. You will see that now you are able to control the music. Instructions on how to do so are below.

### Playing and Pausing music:

#### To make all the sessions/instances of the music synthesizer play do this:

    e.play('musicSynthesizerSession1')
    e.play('musicSynthesizerSession3')
    e.play('musicSynthesizerSession4')
    e.play('musicSynthesizerSession2')

----

#### To make all the sessions/instances of the music synthesizers stop do this:

    e.stopAll()

----

### OS:

#### MacOs:

##### Launching surge:

When installing Surge music synthesizer, you get Surge XT and Surge ET Effects. Open this application called [Hosting AU](http://ju-x.com/hostingau.html) and choose surge as the instrument in the application. Surge will be launched automatically by Hosting AU

### Controlling Music (Configuration Objects):

To control what a player plays, a configuration object will have to be created. This object will control everything from what to play, when to play and what to filter out.

Here the different properties of the configuration object will be listed:
#### Example of a valid configuration object:

```
let newChords2 = chords.map(e => separateOctaveAndRoot(e))

circleOfFifthChords = {
  velocity: A.buildArray(30, x => 90),
   noteDurationKeyspan: 16,
  noteDurationValues: [0, 1, 2, 3],
//   noteDurations: [0, 4, 8, 12],
  noteDurations: [4, 4, 4, 4],
  bools: boolsData,
  modeFilter: A.buildArray(12, x=> x),
  modeFilterKeyspan: 12,
  octave: newChords2.map(x => {
      return x.octaveNotes
  }),
  noteValues: newChords2.map(x => {
      return x.rootNotes
  }),
  total: 12,
//   polyphonyMap: A.buildArray(12, x => {return 50}),
  rhythmMap: [0, 4, 8, 12],
//   noteValues: chords,
  rootMap: ['C', 'C', 'C', 'C']
}

//More explanations of each variable below.
```

#### Some things to know:

##### Titles

The titles of each variable in this documentation are aimed at giving as much information as possible. For example, the first title "bools: boolean[]". "bools" is the variable name and "boolean[]" tells you that the variable bools is supposed to be an array full of booleans.

##### Optional

Those without "(optional)" in the title means that without filling in that variable the configuration object will not be valid or work as expected.

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

#### Variables:

##### bools: boolean[]

An array filled with true or false values. If it is false on that beat the sound will not play.

##### modeFilter: number[] (optional)

Not filling it in just deactivates this specific feature.

Before a note is played it will go through a filterMode function. The function will check if it needs to filter the notes by checking if the modeFilter for that player exists. If it does it will proceed to check if the root note matches one of the root notes in the mode. If it does, it is allowed to be played. If it does not, it is switched out for the note that is in the mode that is closest to it.

ONLY ADD ROOT NOTES IN THE modeFilter array because before the function gets played the code will combine the root notes and the octaves.

A mode map is a quantized map in which the keys are beats and the values are modes.
##### modeFilterKeyspan: number (optional)

Not filling in will make the keyspan of the modeFilter the last number of the array plus 2.

This variable allows the keyspan of the modeFilter variable to be manually set.

##### modeMap: string[] (optional)

Not filling it in will deactivate the automatic modeFilter switching feature. If this is filled in modeMapKeys must be filled in too.

An array of mode names. This is the information the modeFilter will be updated to at some beat. The beats are controlled by modeMapKeys.

##### modeMapKeys: number[] (optional)

This MUST be filled in IF modeMap is filled in. Can only be left empty when modeMap is empty.

The beats numbers to update the modeFilter.

##### modeMapKeyspan: number (optional)

Not filling it in will cause the keyspan of the keyspan variable to be the last number in the modeMapKeys array if modeMap is filled in. If modeMap is not filled in, nothing will happen if this variable is not filled in.

The keyspan for the modeMap Quantized map.

##### noteValues: number[] string[]

The numbers here define the root note that is played. The final note will be calculated by combining the octave with the root note. The numbers here can be inputed in differnt ways. Currently there are four ways: relativeSemitone, relativeScaleDegree, noteNames, romanNumeral or, rawMidi. The input methods can be switched by editing the  ``` notesInputMode ``` variable of the MusicalEnvironment.

##### noteDuration: number[]

This controls how long a specific note will be played.

##### noteDurationKeyspan: number (optional)

Not filling this in will cause the keyspan of the noteDurationMaps to be the length of the noteDuration array.

This variable allows the keyspan of the noteDuration to be manually set.

A noteDurationMap is a way to implement a melody. The keys are beats, and the values are notes without octave or root note.
##### noteDurationValues: number[]

This variable allows the values of the noteDuration QuantizedMap to be set.

##### octave: number[]

The octaves of the root notes played must be defined here.

##### polyphony Map: number[] (optional)

Not filling this in will deactivate this specific function.

The numbers here define the amount of notes that can be played on a beat. If there are too many it will randomly drop notes until they do not go over the defined amount.
##### rootMap: string[]

An array of musical letters.

##### rhythmMap: number[]
Controls when each note is played. It is the ioi [(interonset interval)](https://en.wikipedia.org/wiki/Time_point).

##### total: number
The keyspan of the sub QuantizedMap in the value variable of the main rhythmMap QuantizedMap.

Also the keyspan for maskMap
##### velocity: number[]
Volume. From 0-127.

#### Next Step
After creating the configuration object, you will need to add it to the [musical environment](#record-configuration-objects-to-musical-environment). Then you will need to [assign it to a player](#assigning-player-for-music-synthesizer-session)

### Record Configuration Objects to Musical Environment
To do so, you need a valid configuration object. Then you will need to call the function called ```recordConfigurationDataIntoMusicalEnvironment```. That function will take 3 arguments. First argument the configuration object, second, the name you want to record those things under. Third, the musical environment.

#### Example:
```
recordConfigurationDataIntoMusicalEnvironment(circleOfFifthChords, 'p4', e)
```

### Assigning Player For Music Synthesizer Session
After recording you configuration object into the [musical environment](#record-configuration-objects-to-musical-environment), you need to assign it to a player. To do so, call the ```assignPlayerForMusicSynthesizerSession``` function. It takes 4 arguments. The last argument is optional. The first one is the musical environment, the second one is the music synthesizer session you want it to be tied to. It should be in the form of a number and it will refer to a specific output point of ```e.outputs```. Third, the name of the data is recorded under. The last one is anything you want to manually overide before you assign it to the player. This argument will be an object and the variables will be listed below. This should be a string. If there are no errors after running that, you will be able to play the music by doing ```e.play('musicSynthesizerSession2')```. Change the number 2 to whatever number you inputted for your second argument.

#### Example:
```
assignPlayerForMusicSynthesizerSession(e, 4, 'p4')
```

#### Variables:
##### velocityMapName
##### noteMapName
##### octaveMapName
##### rootNoteMapName
##### rhythmMapName
##### polyphanyMapName
##### noteDurationMapName
##### maskMapName
##### rhythmPatternName
##### chordProgressionName
A chord progression map is a quantized map in which the keys are beats and the values are names of chord progressions. This requires a separate key-value store which maps chord progression names to chord maps.
##### controlChangeMapName
##### modeFilterName
##### rootMapName
##### modeMapName
##### channel
MIDI channel


### Debugging:

#### Issue 1:

Function updateMidiOutputList might not work correctly for your midi configuration. That function is in midi.js so you might want to edit it to work properly for you.

To edit this function run this code in nodejs: easymidi.getOutputs()

This will give you all the outputs easymidi detects and you can edit the function so that it works properly for you.

#### Issue 2:

MIDI configuration. Configure your system so that easymidi can detect midi outputs.

That is OS specific.

### Playing with MIDI
The final MIDI value which is played is a function of:
1. The note value in relative semitones. If the mode contains the relative interval values in semitones of [0,3,7,9], and the note values are [0,0,1,0], the resulting relative interval values would be [0,0,0,0].
2. The octave value
3. The scale/mode which filters the relative semitones
4. A root note ( = the key)

Each of these items can be determined by a map with beat keys.

Use all of this information to calculate the final MIDI value.

