var fs = require('fs');
var path = require('path');

(function () {
    var files = fs.readdirSync(__dirname);

    var inFile = null;
    var outFile = null;
    var cards = [];
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
            cards = tmpContent[0].trim().split(' ');
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

    var jockers = selectJockers(cards);
    console.log('jockers = ' + jockers);
    var sortedCards = sortCards(cards);
    console.log('sorted = ' + sortedCards);
    var unique = selectUnique(sortedCards);
    console.log('unique = ' + unique);
    result = getLongestSeries(unique, jockers) + jockers;
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
 * @ param {Array} cards
 * @ return {Number}
 */
function selectJockers (cards) {
    var jockers = 0;

    for(var i = 0; i < cards.length; i++) {
        if (cards[i] < 1) {
            jockers++;
        }
    }

    return jockers;
}

/**
 * check if file exists
 * @ param {Array} sortedCards
 * @ return {Array}
 */
function selectUnique (sortedCards) {
    var arr = [];
    for (var i = 0; i < sortedCards.length; i++) {
        if(sortedCards[i] != sortedCards[i-1] && sortedCards[i] > 0) {
            arr.push(sortedCards[i]);
        }
    }
    return arr;
}

function getLongestSeries (cards, jockers) {
    var longestSeries = 0;
    for(var i = 0; i < cards.length; i++) {
        for (var j = 1; j < cards.length; j++) {

            if(((cards[j] - cards[i]) - (j - i)) <= jockers) {
                var series = j - i + 1;
                if (series > longestSeries) {
                    longestSeries = series;
                }
            } else {
                break;
            }
        }
    }
    return longestSeries;
}

// Merge sort
function sortCards(cards, sortBy) {
    var len = cards.length - 1;
    var sortedCards = sortCardsRecursively(cards, 0, len);

    return sortedCards;
}

function sortCardsRecursively(cards, left, right) {
    if(left < right) {
        var middle = Math.floor((left + right) / 2);

        var leftPart = sortCardsRecursively(cards, left, middle);
        var rightPart = sortCardsRecursively(cards, middle + 1, right);

        var sortedCards = merge(leftPart, rightPart);
        return sortedCards;
    } else {
        return cards[left];
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