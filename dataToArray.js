// --------------------------------------------------------------------------
// -- dataToArray.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

function buildArray(n, fillFunction) {
    return Array.from({ length: n }, (_, i) => fillFunction(i));
}

// modify so that it doesn't have crash potential
function linearArray(start, step, numberOfSteps) {
    let output = this.buildArray(numberOfSteps, (i) => start + i * step);
    return output;
}

function integerArray(start, end) {
    return this.linearArray(start, 1, end);
}

function geometricArray(start, step, numberOfSteps) {
    let output = this.buildArray(numberOfSteps, (i) => i * step);
    output[0] = start;
    return output;
}

module.exports = {
    buildArray,
    linearArray,
    integerArray,
    geometricArray,
};
