// --------------------------------------------------------------------------
// -- dataToArray.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

function buildArray (n, fillFunction) {
  let outputArray = [];
  for (let i = 0; i < n; i++) {
    outputArray.push(fillFunction(i))
  }
  return outputArray
}

// modify so that it doesn't have crash potential
function linearArray (start, step, end) {
    let output = [start];
    for (let i = 1; (start + (i*step)) <= end; i++) {
        output.push(start + (i*step))
    }
    return output
}

function integerArray (start,end) {
    return linearArray(start, 1, end)
}

function geometricArray (start, step, end) {
    let output = [start];
    for (let i = 1; (start * (i*step)) <= end; i++) {
        output.push(start * (i*step))
    }
    return output
}

