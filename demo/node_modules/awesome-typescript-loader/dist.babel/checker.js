"use strict";

var _ = require('lodash');
var childProcess = require('child_process');
var path = require('path');
function createChecker(compilerInfo, loaderConfig, compilerOptions, webpackOptions, defaultLib, plugins) {
    var checker = childProcess.fork(path.join(__dirname, 'checker-runtime.js'));
    checker.send({
        messageType: 'init',
        payload: {
            compilerInfo: _.omit(compilerInfo, 'tsImpl'),
            loaderConfig: loaderConfig,
            compilerOptions: compilerOptions,
            webpackOptions: webpackOptions,
            defaultLib: defaultLib,
            plugins: plugins
        }
    }, null);
    checker.inProgress = false;
    checker.compilerInfo = compilerInfo;
    checker.loaderConfig = loaderConfig;
    checker.compilerOptions = compilerOptions;
    checker.webpackOptions = webpackOptions;
    checker.on('message', function (msg) {
        if (msg.messageType == 'progress') {
            checker.inProgress = msg.payload.inProgress;
        }
    });
    return checker;
}
exports.createChecker = createChecker;
function resetChecker(checker) {
    if (checker.inProgress) {
        checker.kill('SIGKILL');
        return createChecker(checker.compilerInfo, checker.loaderConfig, checker.compilerOptions, checker.webpackOptions, checker.defaultLib, checker.plugins);
    } else {
        return checker;
    }
}
exports.resetChecker = resetChecker;
//# sourceMappingURL=checker.js.map