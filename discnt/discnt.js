var fs = require('fs');
var path = require('path');

(function () {
    var files = fs.readdirSync(__dirname);

    var inFile = null;
    var outFile = null;

    var prices = [];
    var sortedPrices = [];
    var discount = null;

    var totalSum = 0;

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
            prices = tmpContent[0].trim().split(' ');
            discount = (100 - parseFloat(tmpContent[tmpContent.length - 1]))/100;
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
    //console.log('prices = ' + prices);
    /*prices = prices.filter(function(price) {
        return price && parseFloat(price) > 0 ;
    });*/
    //console.log('filtered prices = ' + prices);
    sortedPrices = prices.length < 3 ? prices : sortPrices(prices);
    //console.log('sorted prices = ' + sortedPrices);
    totalSum = countTotalSum(sortedPrices, discount);
    writeResult(outFile, totalSum);
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
 * function sorts array of prices
 * @ param {Array} prices
 * @ return {Array}
 */

// Merge sort
function sortPrices(prices) {
    var len = prices.length - 1;
    var sortedPrices = sortPricesRecursively(prices, 0, len);

    return sortedPrices;
}

function sortPricesRecursively(prices, left, right) {
    if(left < right) {
        var middle = Math.floor((left + right) / 2);

        var leftPart = sortPricesRecursively(prices, left, middle);
        var rightPart = sortPricesRecursively(prices, middle + 1, right);

        sortedPrices = merge(leftPart, rightPart);
        return sortedPrices;


    } else {
        return prices[left];
    }
}

function merge(leftPart, rightPart) {
    var leftPart = leftPart.toString().split(',');
    var rightPart = rightPart.toString().split(',');
    var result = new Array(leftPart.length + rightPart.length);

    var leftPosition = 0;
    var rightPosition = 0;
    var resultPosition = 0;

    while(resultPosition < result.length) {

        if(((leftPosition >= leftPart.length)
            || (rightPosition < rightPart.length))
            && compare(rightPart[rightPosition], leftPart[leftPosition])) {

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

// Insertion sort
/*function sortPrices(prices) {
     var sortedPrices = prices.slice();
     var minIndex;

     for (var i = 1; i <= sortedPrices.length; i++) {
        minIndex = i;
        while (minIndex > 0 && compare(sortedPrices[minIndex], sortedPrices[minIndex - 1])) {
              var tmp = sortedPrices[minIndex];
            sortedPrices[minIndex] = sortedPrices[minIndex - 1];
            sortedPrices[minIndex - 1] = tmp;

              minIndex -= 1;
        }
      }
     return sortedPrices;
}*/
// Bubble sort
/*function sortPrices(prices) {
    var isSorted = false;
    while(!isSorted) {
        isSorted = true;
        for (var i = 1; i < prices.length; i++) {
            if(compare(prices[i], prices[i-1])) {
                var tmp = prices[i];
                prices[i] = prices[i-1];
                prices[i-1] = tmp;
                isSorted = false;
            }
        };
    }
    return prices;
}*/

/**
 * compare numbers
 * @ param {Number} num1
 * @ param {Number} num2
 * @ return {Boolean}
 */
function compare (num1, num2) {
    if(!num1) return false;
    if(!num2) return true;
    if(parseFloat(num1) < parseFloat(num2)) {
        return true;
    } else {
        return false;
    }
}

/**
 * count total summ
 * @ param {Array} sortedPrices
 * @ param {Number} discount
 * @ return {Number}
 */
function countTotalSum (sortedPrices, discount) {
    var discountItemsQty = sortedPrices.length > 2 ? Math.floor(sortedPrices.length/3) : 0;

    var totalSum = sortedPrices.reduce(function(sum, current, index) {

        if(index < (sortedPrices.length - discountItemsQty)){
            return parseFloat(sum) + parseFloat(current);
        } else {
            return parseFloat(sum) + parseFloat(current)*parseFloat(discount);
        }
    }, 0);

    return totalSum.toFixed(2);
}

/**
 * count total summ
 * @ param {String} outFile
 * @ param {Number} totalSum
 */
function writeResult (outFile, totalSum) {
    if(isfileExist(outFile)) {
        fs.writeFile(path.join(__dirname, outFile), totalSum, 'utf8', function(err) {
            if(err) {
                console.log(err);
            }
        });
    } else {
        fs.writeFile('discnt.out', totalSum, 'utf8', function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}