# Using-Konduktiva-With-MIDI
## initial author: Steve Wang (stevesg168@gmail.com)
##  initial creation date: Wed Jun 28 10:08:48 AM CST 2023 
## contributors: Yiler Huang (yiler7777@gmail.com); Renick Bell (renick@gmail.com)
## license: GPL 3.0

## This code allows Konduktiva to work with music synthesizers that use MIDI.

### Installation:

1. Install the files by dowloading the files on this page as a zip or use git to download the files by typing this command in the terminal:
    ```
    git clone https://github.com/mrname5/Using-Konduktiva-With-MIDI.git
    ```
2. Install [Nodejs](https://nodejs.org/en). If [npm](https://www.npmjs.com/package/npm) does not automatically get installed with Nodejs, [install npm](https://github.com/npm/cli).
    1. Check if nodejs is installed by running this command in the terminal: 
    ```
    node -v
    ```
    2. Check if npm is installed by running this command in the terminal: 
    ```
    npm -v
    ```
    3. You can close the terminals your have opened prior to this step.
3. Open the terminal, navigate to using-konduktiva-with-midi. This effect can be achieved by using the ``` cd [directory name] ``` command or navigator to that direcotry with the file manager and right click to open a terminal session there. We will call this terminal session t1. Then, run this command:
    ```
    node installer.js
    ```
4. After that code has finished running, the installation should be complete.

### Running the code:

1. Launch 4 sessions/instances of your preferred music synthesizer that supports having multiple instances running at the same time (each with a different midi inputs). Yoshimi is suggested for [Linux](https://yoshimi.sourceforge.io/) and [Surge](https://surge-synthesizer.github.io/) is recomended for MacOS. 
2. Go back to t1 and type this command in it:

    ```
    node 
    ```
3. Paste the contents of example-session-with-melodies.js inside t1.
4. Now you can try pasting the code in example-playing-melodies.js into t1. You will see that now you are able to control the music. Instructions on how to do so are below.

### Specifics On How to Control Music:

#### To make all the sessions/instances of the music synthesizer play do this:

    e.play('musicSynthesizerSession1')
    e.play('musicSynthesizerSession3')
    e.play('musicSynthesizerSession4')
    e.play('musicSynthesizerSession2')

----

#### To make all the sessions/instances of the music synthesizers stop do this:

    e.stopAll()

----

### Debugging:

#### Issue 1:

Function updateMidiOutputList might not work correctly for your midi configuration. That function is in midi.js so you might want to edit it to work properly for you.

To edit this function run this code in nodejs: easymidi.getOutputs()

This will give you all the outputs easymidi detects and you can edit the function so that it works properly for you.

#### Issue 2:

MIDI configuration. Configure your system so that easymidi can detect midi outputs. 

That is OS specific.


### OS:

#### MacOs:

##### Launching surge:

When installing Surge music synthesizer, you get Surge XT and Surge ET Effects. Open this application called [Hosting AU](http://ju-x.com/hostingau.html) and choose surge as  the instrument in the application. Surge will be launched automatically by Hosting AU
