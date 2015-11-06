var fs = require('fs');
var path = require('path');

var allHamstersArr = [];

(function () {
    var files = fs.readdirSync(__dirname);

    var inFile = null;
    var outFile = null;

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
    result = countHamsters(packages);
    console.log('result = ' + result);
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
    return arr;
}

function countHamsters(packages) {
    var myHamsters;

    sortHamsters('single');

    if (allHamstersArr[0].single < packages) {
        myHamsters = countHamstersWithNeighbours(packages, 1);
    } else if(allHamstersArr[0].single == packages) {
        return 1;
    } else {
        return 0;
    }
    return myHamsters;
}

/**
 * @ param {Number} qtyOfNeighbours
 * @ return {Number}
 */
function countPackages(qtyOfNeighbours) {
    var qty = qtyOfNeighbours;

    for (var i = 0; i < allHamstersArr.length; i++) {
        allHamstersArr[i][qty] = parseInt(allHamstersArr[i].single)
                                            + (parseInt(allHamstersArr[i].withNeighbour) * parseInt(qty));
    }
    sortHamsters(qty);
    console.log('sortHamsters =');
    console.log(allHamstersArr);
    var currentPackages = 0;

    for(var j = 0; j <= qty; j++) {
        currentPackages += parseInt(allHamstersArr[j][qty]);
    }
    return currentPackages;
}

/**
 * @ param {Number} packages
 * @ param {Number} qtyOfNeighbours
 * @ return {Number}
 */
function countHamstersWithNeighbours(packages, qtyOfNeighbours) {
    var qty = parseInt(qtyOfNeighbours);
    var currentPackages = countPackages(qty);

    while (currentPackages < packages && qty < allHamstersArr.length-1) {
        currentPackages = countPackages(parseInt(qty) + 1);
        qty++;
    }
    if (currentPackages > packages && qty <= allHamstersArr.length - 1) {
        return parseInt(qty);
    } else if (currentPackages < packages && qty == allHamstersArr.length - 1) {
        return parseInt(qty) + 1;
    }else if (currentPackages == packages || qty == allHamstersArr.length - 1) {
        return parseInt(qty) + 1;
    } else {
        return qty;
    }
}

/**
 * function shuffles array of hamsters
 * @ param {Array} hamsters
 * @ return {Array}
 */
function shuffle() {

    for (var i = allHamstersArr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = allHamstersArr[i];
        allHamstersArr[i] = allHamstersArr[j];
        allHamstersArr[j] = temp;
    }
}

/**
 * function sorts array of hamsters
 * @ param {Array} hamsters
 * @ return {Array}
 */
function sortHamsters(sortBy) {
    shuffle();
    quickSortRecursive(0, allHamstersArr.length - 1, sortBy);
}

function quickSortRecursive(low, high, sortBy) {
    if (high > low) {
        var pivotPosition = partition(low, high, sortBy);
        quickSortRecursive(low, (parseInt(pivotPosition) - 1), sortBy);
        quickSortRecursive((parseInt(pivotPosition) + 1), high, sortBy);
    }
}

function partition(low, high, sortBy) {
    var left = low + 1;
    var right = high;

    var pivot = allHamstersArr[low][sortBy];

    while(left < right) {
        while(allHamstersArr[left][sortBy] <= pivot && left < high) {
            left++;
        }

        while(allHamstersArr[right][sortBy] >= pivot && right > low) {
            right--;
        }

        if(left <= right) {
            swap(left, right);
        }
    }
    if (pivot > allHamstersArr[right][sortBy]) {
        swap(low, right);
    }
    return right;
}

function swap(firstIndex, secondIndex){
    var temp = allHamstersArr[firstIndex];
    allHamstersArr[firstIndex] = allHamstersArr[secondIndex];
    allHamstersArr[secondIndex] = temp;
}

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