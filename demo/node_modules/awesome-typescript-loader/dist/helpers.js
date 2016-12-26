"use strict";
var fs = require('fs');
var path = require('path');
var double = /\/\//;
function toUnix(fileName) {
    var res = fileName.replace(/\\/g, '/');
    while (res.match(double)) {
        res = res.replace(double, '/');
    }
    return res;
}
exports.toUnix = toUnix;
function withoutExt(fileName) {
    return path.join(path.dirname(fileName), path.basename(fileName).split('.')[0]);
}
function isFileEmit(fileName, outputFileName, sourceFileName) {
    return sourceFileName === fileName
        && (outputFileName.substr(-3) === '.js' || outputFileName.substr(-4) === '.jsx');
}
function isSourceMapEmit(fileName, outputFileName, sourceFileName) {
    return sourceFileName === fileName
        && (outputFileName.substr(-7) === '.js.map' || outputFileName.substr(-8) === '.jsx.map');
}
function isDeclarationEmit(fileName, outputFileName, sourceFileName) {
    return sourceFileName === fileName
        && (outputFileName.substr(-5) === '.d.ts');
}
function findResultFor(output, fileName) {
    var text;
    var sourceMap;
    var declaration;
    fileName = withoutExt(fileName);
    for (var i = 0; i < output.outputFiles.length; i++) {
        var o = output.outputFiles[i];
        var outputFileName = o.name;
        var sourceFileName = withoutExt(o.sourceName);
        if (isFileEmit(fileName, outputFileName, sourceFileName)) {
            text = o.text;
        }
        if (isSourceMapEmit(fileName, outputFileName, sourceFileName)) {
            sourceMap = o.text;
        }
        if (isDeclarationEmit(fileName, outputFileName, sourceFileName)) {
            declaration = o;
        }
    }
    return {
        text: text,
        sourceMap: sourceMap,
        declaration: declaration
    };
}
exports.findResultFor = findResultFor;
function codegenErrorReport(errors) {
    return errors
        .map(function (error) {
        return 'console.error(' + JSON.stringify(error) + ');';
    })
        .join('\n');
}
exports.codegenErrorReport = codegenErrorReport;
function formatError(diagnostic) {
    var lineChar;
    if (diagnostic.file) {
        lineChar = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    }
    return ((diagnostic.file ? path.normalize(diagnostic.file.fileName) : '')
        + (lineChar ? formatLineChar(lineChar) + ' ' : '') + "\n"
        + (typeof diagnostic.messageText == "string" ?
            diagnostic.messageText :
            formatMessageChain(diagnostic.messageText)));
}
exports.formatError = formatError;
function formatMessageChain(chain) {
    var result = "";
    var separator = "\n  ";
    var current = chain;
    while (current) {
        result += current.messageText;
        if (!!current.next) {
            result += separator;
            separator += "  ";
        }
        current = current.next;
    }
    return result;
}
exports.formatMessageChain = formatMessageChain;
function formatLineChar(lineChar) {
    return ':' + (lineChar.line + 1) + ':' + lineChar.character;
}
exports.formatLineChar = formatLineChar;
function loadLib(moduleId) {
    var fileName = require.resolve(moduleId);
    var text = fs.readFileSync(fileName, 'utf8');
    return {
        fileName: fileName,
        text: text
    };
}
exports.loadLib = loadLib;
var TYPESCRIPT_EXTENSION = /\.(d\.)?(t|j)s$/;
function withoutTypeScriptExtension(fileName) {
    return fileName.replace(TYPESCRIPT_EXTENSION, '');
}
exports.withoutTypeScriptExtension = withoutTypeScriptExtension;
//# sourceMappingURL=helpers.js.map