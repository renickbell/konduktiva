// --------------------------------------------------------------------------
// -- utilities-string.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

/**
  * Count how many of the same letters there are before a new one is found:
  * @param {string} string - the string it counts from.
  * @example
  * console.log(countLetterChanges('kiisijsdvsddddddggggaa')) //[ 1, 2, 1, 1, 1, 1, 1, 1, 1, 6, 4, 2 ]
  * console.log(countLetterChanges('aaaaalllllfdh')) //[ 5, 5, 1, 1, 1 ]
*/
function countLetterChanges(string) {
  let counts = [];
  let stringArray = string.split('')
  let currentCount = 1;
  stringArray.forEach((x, i) =>{
    if (x !== string[i + 1] && string[i + 1] !== undefined) {
      counts.push(currentCount);
      currentCount = 1;
    } 
    else if (string[i + 1] !== undefined){
      currentCount++;
    }
  })
  counts.push(currentCount); // Push the count of the last letter
  return counts;
}

/**
  * Shuffles a string in a random way
  * @param {string} str - The string to be shuffled
  * @example
  * console.log(shuffleString('abbbsdfhshfsdoih')) //bhfobsfsdbihsdah
  * console.log(shuffleString('HiHowAreYou')) //rHYwoeoHiAu
*/
function shuffleString(str) {
  let arr = str.split('');
  let len = arr.length;
  arr.forEach((x, c) =>{
    let i = len - 1 - c
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Use array destructuring for swapping
  })
  return arr.join('');
}
//One of the versions generated by Chatgpt

/**
  * Loops a string by a certain amount of times:
  * @param {number} times - Number of times the string should be repeated.
  * @param {string} string - The string that should be repeated.
  * @example 
  * console.log(repeatString(2, 'Hi how are you')) //'Hi how are youHi how are you'
  * console.log(repeatString(3, 'Ha ')) //'Ha Ha Ha '
*/
function repeatString (times, string){
    return A.buildArray(times, x => {return string}).join('')
}

module.exports = {
 countLetterChanges, repeatString, shuffleString 
}

