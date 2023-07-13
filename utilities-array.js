// --------------------------------------------------------------------------
// -- utilities-array.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//Takes the length the array should be changed into as argument. If array longer, will shorten array. If array shorter will loop the array until desiredLength:
//Generated with Chatgpt:
function adjustArrayLength(number, array) {
  const arrayLength = array.length;
  if (arrayLength === number) {
    return array;
  } else if (arrayLength < number) {
    const numCopies = Math.ceil(number / arrayLength);
    return array.concat(...Array(numCopies).fill(array)).slice(0, number);
  } else {
    return array.slice(0, number);
  }
}

//Find the closest number that is smaller than it:
function findClosestSmaller(arr, num) {
  let left = 0;
  let right = arr.length - 1;
  let closest = null;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] < num) {
      closest = arr[mid];
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return closest;
}

//Set a size of the array and the array will be expanded or shrunk to fix that size. To expand it will just loop the array:
function resizeArray(number, array) {
  var arrayLength = array.length;
  if (arrayLength >= number) {
    return array.slice(0, number);
  }
  var repetitions = Math.ceil(number / arrayLength);
  var expandedArrayLength = repetitions * arrayLength;
  var expandedArray = new Array(expandedArrayLength);
  for (var i = 0; i < expandedArrayLength; i++) {
    expandedArray[i] = array[i % arrayLength];
  }
  return expandedArray.slice(0, number);
}

//Find most frequent item that appears in array: change to find most frequen item
function findMostFrequentItem(array) {
  var itemCounts = new Map();
  var maxItem = array[0];
  var maxCount = 0;
  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    if (itemCounts.has(item)) {
      itemCounts.set(item, itemCounts.get(item) + 1);
    } else {
      itemCounts.set(item, 1);
    }
    var currentCount = itemCounts.get(item);
    if (currentCount > maxCount) {
      maxItem = item;
      maxCount = currentCount;
    }
  }
  return maxItem;
}

function safeSplice(inputArray, amountToRemove,indexToRemove,replaceWith) {
  let array1 = inputArray.slice(0, indexToRemove )
if (replaceWith!=undefined){
array1.push(replaceWith)}
  let array2 = inputArray.slice(indexToRemove + amountToRemove, inputArray.length)
  return array1.concat(array2)
    }
