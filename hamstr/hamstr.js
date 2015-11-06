var fs = require('fs');
var path = require('path');

(function () {
    var files = fs.readdirSync(__dirname);

    var inFile = null;
    var outFile = null;
    var allHamstersArr = [];
    var allHamstersQty;

    var result;

    //get *.in and *.out files
    for (var i in files) {
        if(files[i].match(/.in/)) {
            inFile = files[i];
        } else if(files[i].match(/.out/)) {
            outFile = files[i];
        }
    }

    //read data from *.in file
    if (isfileExist(inFile)) {
        var content = fs.readFileSync(path.join(__dirname, inFile),'utf8');
        if(content){
            var tmpContent = content.trim().split(/\n/);
            packages = tmpContent[0].trim();
            console.log('packages = ' + packages);
            allHamstersQty = tmpContent[1].trim();
            allHamstersArr = convertDocToArr(tmpContent, allHamstersQty);
        } else {
            console.log('*.in file is empty');
            writeResult(outFile, totalSum);
            return;
        }
    } else {
        console.log('*.in file is not found');
        writeResult(outFile, totalSum);
        return;
    }
    result = countHamsters(allHamstersArr, packages, allHamstersQty);
    writeResult(outFile, result);
})();

/**
 * check if file exists
 * @ param {String} file
 * @ return {Boolean}
 */
function isfileExist(file) {
    return file ? true : false;
}

/**
 * check if file exists
 * @ param {Array} tmpContent
 * @ param {String} allHamstersQty
 * @ return {Array}
 */
function convertDocToArr(tmpContent, allHamstersQty) {
    var arr = new Array(allHamstersQty);

    for (var i = 2; i < tmpContent.length; i++) {
        var hamster = tmpContent[i].trim().split(' ');
 
        var tmpObj = {
            single: hamster[0],
            withNeighbour: hamster[1]
        };
        arr[i-2] = tmpObj;
    };
    console.log(arr);
    return arr;
}

function countHamsters(hamsters, packages, allHamstersQty) {
    var myHamsters;

    if (allHamstersQty > 1) {
        var hamsters = sortHamsters(hamsters, 'single');
    }

    if (parseInt(hamsters[0].single) <= parseInt(packages)) {
        myHamsters = countHamstersWithNeighbours(hamsters, packages, 1);
    } else {
        return 0;
    }
    return myHamsters;
}

/*
 * @ param {Number} packages
 * @ param {Number} qtyOfNeighbours
 * @ return {Number}
 */
function countHamstersWithNeighbours(hamsters, packages, qty) {
    var qty = parseInt(qty);
    var currentPackages = countPackages(hamsters, qty);

    while (currentPackages <= packages && qty < hamsters.length-1) {
        currentPackages = countPackages(hamsters, qty + 1);
        qty++;
    }
    if (currentPackages > packages && qty <= hamsters.length - 1) {
        return parseInt(qty);
    } else if (currentPackages <= packages && qty == hamsters.length - 1) {
        return parseInt(qty) + 1;
    }else if (currentPackages == packages || qty == hamsters.length - 1) {
        return parseInt(qty) + 1;
    } else {
        return qty;
    }
}

/**
 * @ param {Number} qtyOfNeighbours
 * @ return {Number}
 */
function countPackages(hamsters, qty) {
    for (var i = 0; i < hamsters.length; i++) {
        hamsters[i][qty] = parseInt(hamsters[i].single)
                            + (parseInt(hamsters[i].withNeighbour) * parseInt(qty));
    }
    var sortedHamsters = sortHamsters(hamsters, qty);
    console.log('sorted');
    console.log(sortedHamsters);
    var currentPackages = 0;

    for(var j = 0; j <= qty; j++) {
        currentPackages += parseInt(sortedHamsters[j][qty]);
    }
    return currentPackages;
}

// Merge sort
function sortHamsters(hamsters, sortBy) {
    var len = hamsters.length - 1;
    var sortedHamsters = sortHamstersRecursively(hamsters, 0, len, sortBy);

    return sortedHamsters;
}

function sortHamstersRecursively(hamsters, left, right, sortBy) {
    if(left < right) {
        var middle = Math.floor((left + right) / 2);

        var leftPart = sortHamstersRecursively(hamsters, left, middle, sortBy);
        var rightPart = sortHamstersRecursively(hamsters, middle + 1, right, sortBy);

        sortedHamsters = merge(leftPart, rightPart, sortBy);
        return sortedHamsters;


    } else {
        return hamsters[left];
    }
}

function merge(leftPart, rightPart, sortBy) {
    var leftPart = !leftPart.length ? new Array(leftPart) : leftPart;
    var rightPart = !rightPart.length ? new Array(rightPart) : rightPart;

    var result = new Array(leftPart.length + rightPart.length);

    var leftPosition = 0;
    var rightPosition = 0;
    var resultPosition = 0;

    while(resultPosition < result.length) {

        if(((leftPosition >= leftPart.length)
            || (rightPosition < rightPart.length))
            && compare(rightPart[rightPosition], leftPart[leftPosition], sortBy)) {

            result[resultPosition] = rightPart[rightPosition];
            rightPosition = rightPosition + 1;
        } else {
            result[resultPosition] = leftPart[leftPosition];
            leftPosition = leftPosition + 1;
        }
        resultPosition = resultPosition + 1;
    }
    return result;
}

/**
 * compare numbers
 * @ param {Number} num1
 * @ param {Number} num2
 * @ return {Boolean}
 */
function compare (num1, num2, sortBy) {
    if(!num1) return false;
    if(!num2) return true;
    if(parseFloat(num1[sortBy]) < parseFloat(num2[sortBy])) {
        return true;
    } else {
        return false;
    }
}

/**
 * function shuffles array of hamsters
 * @ param {Array} hamsters
 * @ return {Array}
 
function shuffle(hamsters) {

    for (var i = hamsters.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = hamsters[i];
        hamsters[i] = hamsters[j];
        hamsters[j] = temp;
    }
}*/

/**
 * function sorts array of hamsters
 * @ param {Array} hamsters
 * @ return {Array}
 

function sortHamsters(hamsters, sortBy) {
    shuffle(hamsters);
    quickSortRecursive(hamsters, 0, hamsters.length - 1, sortBy);
}

function quickSortRecursive(hamsters, low, high, sortBy) {
    if (high > low) {
        var obj = partition(hamsters, low, high, sortBy);
        var pivotPosition = obj.pivotPosition;
        var hamstersArr = obj.hamsters;
        quickSortRecursive(hamstersArr, low, (parseInt(pivotPosition) - 1), sortBy);
        quickSortRecursive(hamstersArr, (parseInt(pivotPosition) + 1), high, sortBy);
    }
}

function partition(hamsters, low, high, sortBy) {
    var left = low + 1;
    var right = high;
    var hamstersArr = hamsters;
    var pivot = hamstersArr[low][sortBy];

    while(left < right) {
        while(hamstersArr[left][sortBy] <= pivot && left < high) {
            left++;
        }

        while(hamstersArr[right][sortBy] >= pivot && right > low) {
            right--;
        }

        if(left <= right) {
            hamstersArr = swap(hamstersArr, left, right);
        }
    }

    if (pivot > hamstersArr[right][sortBy]) {
        hamstersArr = swap(hamstersArr, low, right);
    }

    var obj = {
        pivotPosition: right,
        hamsters: hamstersArr
    };
    
    return obj;
}

function swap(hamsters, firstIndex, secondIndex){
    var temp = hamsters[firstIndex];
    hamsters[firstIndex] = hamsters[secondIndex];
    hamsters[secondIndex] = temp;

    return hamsters;
}*/

/**
 * count total summ
 * @ param {String} outFile
 * @ param {Number} totalSum
 */
function writeResult (outFile, totalSum) {
    var result = parseInt(totalSum);
    console.log('result = ' + result);
    if(isfileExist(outFile)) {
        fs.writeFile(path.join(__dirname, outFile), totalSum, 'utf8', function(err) {
            if(err) {
                console.log(err);
            }
        });
    } else {
        fs.writeFile('hamstr.out', totalSum, 'utf8', function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}