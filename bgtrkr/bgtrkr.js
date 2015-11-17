var fs = require('fs');
var path = require('path');

(function () {
    var files = fs.readdirSync(__dirname);

    var inFile = null;
    var outFile = null;
    var qty, width, height, result;

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
            var tmpContent = content.trim().split(' ');
            qty = tmpContent[0].trim();
            width = tmpContent[1].trim();
            height = tmpContent[2].trim();

            console.log('qty = ' + qty +'; width = ' + width + '; height = ' + height);
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
    result = countMinLength(qty, width, height);

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
 * @ param {Number} qty
 * @ param {Number} width
 * @ param {Number} height
 * @ return {Number}
 */
function countMinLength(qty, width, height) {
    var newQty = 1,
        totalWidth = parseInt(width) * parseInt(qty),
        totalHeight = parseInt(height),
        result;

        while (totalHeight < totalWidth && qty > newQty){
            newQty++;
            totalHeight = parseInt(height) * parseInt(newQty);
            totalWidth = parseInt(width) * parseInt(qty) / parseInt(newQty);
        }

        if(totalHeight >= totalWidth) {
            result = totalHeight;
        } else if (qty === newQty){

            if (totalHeight > totalWidth) {
                result = totalHeight;
            } else {
                result = totalWidth;
            }
        }
    return result;
}

/**
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
        fs.writeFile('bgtrkr.out', totalSum, 'utf8', function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}