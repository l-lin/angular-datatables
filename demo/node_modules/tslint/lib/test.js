"use strict";
var colors = require("colors");
var diff = require("diff");
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var Linter = require("./tslint");
var parse = require("./test/parse");
var FILE_EXTENSION = ".lint";
function runTest(testDirectory, rulesDirectory) {
    var filesToLint = glob.sync(path.join(testDirectory, "**/*" + FILE_EXTENSION));
    var tslintConfig = Linter.findConfiguration(path.join(testDirectory, "tslint.json"), null);
    var results = { directory: testDirectory, results: {} };
    for (var _i = 0, filesToLint_1 = filesToLint; _i < filesToLint_1.length; _i++) {
        var fileToLint = filesToLint_1[_i];
        var fileBasename = path.basename(fileToLint, FILE_EXTENSION);
        var fileText = fs.readFileSync(fileToLint, "utf8");
        var fileTextWithoutMarkup = parse.removeErrorMarkup(fileText);
        var errorsFromMarkup = parse.parseErrorsFromMarkup(fileText);
        var lintOptions = {
            configuration: tslintConfig,
            formatter: "prose",
            formattersDirectory: "",
            rulesDirectory: rulesDirectory,
        };
        var linter = new Linter(fileBasename, fileTextWithoutMarkup, lintOptions);
        var errorsFromLinter = linter.lint().failures.map(function (failure) {
            var startLineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            var endLineAndCharacter = failure.getEndPosition().getLineAndCharacter();
            return {
                endPos: {
                    col: endLineAndCharacter.character,
                    line: endLineAndCharacter.line,
                },
                message: failure.getFailure(),
                startPos: {
                    col: startLineAndCharacter.character,
                    line: startLineAndCharacter.line,
                },
            };
        });
        results.results[fileToLint] = {
            errorsFromMarkup: errorsFromMarkup,
            errorsFromLinter: errorsFromLinter,
            markupFromLinter: parse.createMarkupFromErrors(fileTextWithoutMarkup, errorsFromMarkup),
            markupFromMarkup: parse.createMarkupFromErrors(fileTextWithoutMarkup, errorsFromLinter),
        };
    }
    return results;
}
exports.runTest = runTest;
function consoleTestResultHandler(testResult) {
    var didAllTestsPass = true;
    for (var _i = 0, _a = Object.keys(testResult.results); _i < _a.length; _i++) {
        var fileName = _a[_i];
        var results = testResult.results[fileName];
        process.stdout.write(fileName + ":");
        var diffResults = diff.diffLines(results.markupFromMarkup, results.markupFromLinter);
        var didTestPass = !diffResults.some(function (diff) { return diff.added || diff.removed; });
        if (didTestPass) {
            console.log(colors.green(" Passed"));
        }
        else {
            console.log(colors.red(" Failed!"));
            console.log(colors.green("Expected (from " + FILE_EXTENSION + " file)"));
            console.log(colors.red("Actual (from TSLint)"));
            didAllTestsPass = false;
            for (var _b = 0, diffResults_1 = diffResults; _b < diffResults_1.length; _b++) {
                var diffResult = diffResults_1[_b];
                var color = colors.grey;
                if (diffResult.added) {
                    color = colors.green;
                }
                else if (diffResult.removed) {
                    color = colors.red;
                }
                process.stdout.write(color(diffResult.value));
            }
        }
    }
    return didAllTestsPass;
}
exports.consoleTestResultHandler = consoleTestResultHandler;
