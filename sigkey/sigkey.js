var fs = require('fs');
var path = require('path');

var keys = [];
var AKeys = [];

(function () {
    var files = fs.readdirSync(__dirname);

    var inFile = null;
    var outFile = null;
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

    divideArray(tmpContent);
    result = countKeys();
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
 * @ param {Array} tmpContent
 */
function divideArray (tmpContent) {
    for(var i = 1; i < tmpContent.length; i++) {
        var tmpArr = tmpContent[i].trim().split('');
        tmpArr.sort();

        if(tmpArr[0] === 'a') {
            AKeys.push(tmpArr);
        } else {
            keys.push(tmpArr);
        }
    }
};

function countKeys () {
    var alphaArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var count = 0;

    var AStart = 0;
    var start = 0;

    for(var i = 0; i < AKeys.length; i++) {
        var alphaCount = 0;
        for(var j = 0; j < keys.length; j++) {
            if (alphaArray[alphaCount] === AKeys[i][start]) {
                alphaCount++;
                AStart++;
            } else if (alphaArray[alphaCount] === keys[j][start]) {
                alphaCount++;
                start++;
            } else {
                continue;
            }
        }
        count++;
    }

    return count;
}

/**
 * write total summ
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
        fs.writeFile('sigkey.out', totalSum, 'utf8', function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}