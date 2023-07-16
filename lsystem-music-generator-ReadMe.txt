// --------------------------------------------------------------------------
// -- lsystem-music-generator-ReadMe.txt
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------
--------------------------------------------------------------------------
Generate Lsystem String:

generativeParseString is a function that can be used to do that.

generativeParseString(Letters, Rules, Generations)

--------------------------------------------------------------------------
Method 1 (Counting Amount Of Letters Before Change):

The countLetterChanges function will take an lsystem in string form as an argument. It will then count the amount of times each letter appears before the next one comes out. So, for example, 'aaabbaaabb' will be [3, 2, 3, 2]. 

This function can be seen put into use in the example-melodies-data.js
--------------------------------------------------------------------------
Method 2 (Assigning a Value To Each Letter):

The function generateLsystemByAssigningNumberToLetter takes a mode array, an octave array and, the length of the output lsystem as arguments. The function will automatically generate letters according to the length of each array and a number will be automatically assigned to each letter and the lsystem generated generate from those letters will be converted to number arrays with this method. The function will then output an array filled with objects. Each object will contain a note and an octave.

Function in lsystem.js and example usage also in the same file (last line).
