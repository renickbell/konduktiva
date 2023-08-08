// --------------------------------------------------------------------------
// -- utilities-general.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

function roundTo (number,decimalPlaces){
    let roundedNumber=number.toFixed(decimalPlaces);
    return JSON.parse(roundedNumber)
}

function randomRange (min, max,decimalPlaces) {
    if (decimalPlaces==undefined){decimalPlaces=0}
      return roundTo(min + (max - min) * (Math.random()),decimalPlaces);
}

