// --------------------------------------------------------------------------
// -- README.txt
// -- initial author: Steve Wang (stevesg168@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Renick Bell (renick@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

--------------------------------------------------------------------------
Installation:

1. Download all the files.
2. Install Nodejs. If npm does not automatically get installed with Nodejs, install npm.
3. Open the terminal and run this command: node installer.js
4. After that code has finished running, the installation should be complete.

--------------------------------------------------------------------------
Running the code:

1. Launch 4 sessions of your prefered music synthesizer that supports having multiple instances running at the same time (each with a different midi inputs). Yoshimi is suggested for Linux and Surge is recomended for MacOS. 
https://yoshimi.sourceforge.io/
https://surge-synthesizer.github.io/
2. Open a terminal session and run: node
3. Paste the contents of example-session-with-melodies.js inside the terminal session from before
4. Now you can try pasting the code in example-playing-melodies.js in the terminal session. You will see that now you are able to control the music.

--------------------------------------------------------------------------
Debugging:

Issue 1:

Function updateMidiOutputList might not work correctly for your midi configuration. That function is in midi.js so you might want to edit it to work properly for you.

To edit this function run this code in nodejs: easymidi.getOutputs()

This will give you all the outputs easymidi detects and you can edit the function so that it works properly for you.

Issue 2:

MIDI configuration. Configure your system so that easymidi can detect midi outputs. 

That is OS specific.

