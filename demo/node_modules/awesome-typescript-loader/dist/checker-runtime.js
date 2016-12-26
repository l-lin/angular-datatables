"use strict";
var host_1 = require('./host');
var path = require('path');
var colors = require('colors/safe');
(function (MessageType) {
    MessageType[MessageType["Init"] = 'init'] = "Init";
    MessageType[MessageType["Compile"] = 'compile'] = "Compile";
})(exports.MessageType || (exports.MessageType = {}));
var MessageType = exports.MessageType;
var env = {};
var ModuleResolutionHost = (function () {
    function ModuleResolutionHost(servicesHost) {
        this.servicesHost = servicesHost;
    }
    ModuleResolutionHost.prototype.fileExists = function (fileName) {
        return this.servicesHost.getScriptSnapshot(fileName) !== undefined;
    };
    ModuleResolutionHost.prototype.readFile = function (fileName) {
        var snapshot = this.servicesHost.getScriptSnapshot(fileName);
        return snapshot && snapshot.getText(0, snapshot.getLength());
    };
    return ModuleResolutionHost;
}());
exports.ModuleResolutionHost = ModuleResolutionHost;
var Host = (function () {
    function Host() {
        this.moduleResolutionHost = new ModuleResolutionHost(this);
    }
    Host.prototype.getScriptFileNames = function () {
        return Object.keys(env.files);
    };
    Host.prototype.getScriptVersion = function (fileName) {
        if (env.files[fileName]) {
            return env.files[fileName].version.toString();
        }
    };
    Host.prototype.getScriptSnapshot = function (fileName) {
        var file = env.files[fileName];
        if (!file) {
            return null;
        }
        return env.compiler.ScriptSnapshot.fromString(file.text);
    };
    Host.prototype.getCurrentDirectory = function () {
        return process.cwd();
    };
    Host.prototype.getScriptIsOpen = function () {
        return true;
    };
    Host.prototype.getCompilationSettings = function () {
        return env.compilerOptions;
    };
    Host.prototype.resolveTypeReferenceDirectives = function (typeDirectiveNames, containingFile) {
        if (containingFile.indexOf(host_1.TSCONFIG_INFERRED) !== -1) {
            containingFile = host_1.TSCONFIG_INFERRED;
        }
        return typeDirectiveNames.map(function (moduleName) {
            return env.typeReferenceResolutionCache[(containingFile + "::" + moduleName)];
        });
    };
    Host.prototype.resolveModuleNames = function (moduleNames, containingFile) {
        return moduleNames.map(function (moduleName) {
            return env.moduleResolutionCache[(containingFile + "::" + moduleName)];
        });
    };
    Host.prototype.getDefaultLibFileName = function (options) {
        return env.defaultLib;
    };
    Host.prototype.log = function (message) {
    };
    return Host;
}());
exports.Host = Host;
function processInit(payload) {
    env.compiler = require(payload.compilerInfo.compilerPath);
    env.compilerInfo = payload.compilerInfo;
    env.loaderConfig = payload.loaderConfig;
    env.compilerOptions = payload.compilerOptions;
    env.webpackOptions = payload.webpackOptions;
    env.defaultLib = payload.defaultLib;
    env.host = new Host();
    env.service = env.compiler.createLanguageService(env.host, env.compiler.createDocumentRegistry());
    env.plugins = payload.plugins;
    env.initedPlugins = env.plugins.map(function (plugin) {
        return require(plugin.file)(plugin.options);
    });
}
var DECLARATION_FILE = /\.d\.ts/;
function processCompile(payload) {
    var instanceName = env.loaderConfig.instanceName || 'default';
    var silent = !!env.loaderConfig.forkCheckerSilent;
    if (!silent) {
        console.log(colors.cyan("[" + instanceName + "] Checking started in a separate process..."));
    }
    var timeStart = +new Date();
    process.send({
        messageType: 'progress',
        payload: {
            inProgress: true
        }
    });
    env.files = payload.files;
    env.moduleResolutionCache = payload.moduleResolutionCache;
    env.typeReferenceResolutionCache = payload.typeReferenceResolutionCache;
    var program = env.program = env.service.getProgram();
    var allDiagnostics = [];
    if (env.loaderConfig.skipDeclarationFilesCheck) {
        var sourceFiles = program.getSourceFiles();
        sourceFiles.forEach(function (sourceFile) {
            if (!sourceFile.fileName.match(DECLARATION_FILE)) {
                allDiagnostics = allDiagnostics.concat(env.compiler.getPreEmitDiagnostics(program, sourceFile));
            }
        });
        allDiagnostics = env.compiler.sortAndDeduplicateDiagnostics(allDiagnostics);
    }
    else {
        allDiagnostics = env.compiler.getPreEmitDiagnostics(program);
    }
    if (allDiagnostics.length) {
        allDiagnostics.forEach(function (diagnostic) {
            var message = env.compiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            if (diagnostic.file) {
                var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                console.error("[" + instanceName + "] " + colors.red(path.normalize(diagnostic.file.fileName)) + ":" + (line + 1) + ":" + (character + 1) + " \n    " + colors.red(message));
            }
            else {
                console.error(colors.red("[" + instanceName + "] " + message));
            }
        });
        console.error(colors.red("[" + instanceName + "] Checking finished with " + allDiagnostics.length + " errors"));
    }
    else {
        if (!silent) {
            var timeEnd = +new Date();
            console.log(colors.green("[" + instanceName + "] Ok, " + (timeEnd - timeStart) / 1000 + " sec."));
        }
    }
    env.initedPlugins.forEach(function (plugin) {
        plugin.processProgram(program);
    });
    process.send({
        messageType: 'progress',
        payload: {
            inProgress: false
        }
    });
}
process.on('message', function (msg) {
    switch (msg.messageType) {
        case MessageType.Init:
            processInit(msg.payload);
            break;
        case MessageType.Compile:
            processCompile(msg.payload);
            break;
    }
});
//# sourceMappingURL=checker-runtime.js.map