"use strict";
var path = require('path');
// Postprocess generated JS.
function pathToModuleName(context, fileName) {
    if (fileName[0] === '.') {
        fileName = path.join(path.dirname(context), fileName);
    }
    return fileName.replace(/\.js$/, '').replace(/\//g, '.');
}
exports.pathToModuleName = pathToModuleName;

//# sourceMappingURL=cli_support.js.map
