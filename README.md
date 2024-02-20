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

2. Install Konduktiva by using NPM:
    ```
    npm i konduktiva
    ```
3. Install a Digital Audio Workstation. [Ardour is recommended](https://ardour.org/)
### Setting Up Other related software (MIDI routing in device)

[Here](http://konduktiva.org/doku.php?id=first_steps)

### Setting Up An Editor (VIM + TMUX)

[Here]()

### OS Specific Tips:

#### MacOs:

##### Launching surge:

When installing Surge music synthesizer, you get Surge XT and Surge ET Effects. Open this application called [Hosting AU](http://ju-x.com/hostingau.html) and choose surge as the instrument in the application. Surge will be launched automatically by Hosting AU
### Debugging:

#### Issue 1:

Function updateMidiOutputList might not work correctly for your midi configuration. That function is in midi.js so you might want to edit it to work properly for you.

To edit this function run this code in nodejs: easymidi.getOutputs()

This will give you all the outputs easymidi detects and you can edit the function so that it works properly for you.

#### Issue 2:

MIDI configuration. Configure your system so that easymidi can detect midi outputs.

This is OS specific.
