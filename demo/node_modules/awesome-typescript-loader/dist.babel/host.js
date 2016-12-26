"use strict";

var fs = require('fs');
var util = require('util');
var path = require('path');
var deps_1 = require('./deps');
var helpers_1 = require('./helpers');
var RUNTIME = helpers_1.loadLib('../lib/runtime.d.ts');
exports.TSCONFIG_INFERRED = '__inferred type names__.ts';
var Host = function () {
    function Host(state) {
        this.state = state;
    }
    Host.prototype.getSourceFile = function (fileName) {
        return this.state.program.getSourceFile(fileName);
    };
    Host.prototype.getScriptFileNames = function () {
        return this.state.allFileNames();
    };
    Host.prototype.getScriptVersion = function (fileName) {
        if (this.state.getFile(fileName)) {
            return this.state.getFile(fileName).version.toString();
        }
    };
    Host.prototype.getScriptSnapshot = function (fileName) {
        var file = this.state.getFile(fileName);
        if (!file) {
            return null;
        }
        return this.state.ts.ScriptSnapshot.fromString(file.text);
    };
    Host.prototype.getCurrentDirectory = function () {
        return process.cwd();
    };
    Host.prototype.getScriptIsOpen = function () {
        return true;
    };
    Host.prototype.getCompilationSettings = function () {
        return this.state.compilerConfig.options;
    };
    Host.prototype.getDefaultLibFileName = function (options) {
        return this.state.defaultLib;
    };
    Host.prototype.resolveTypeReferenceDirectives = function (typeDirectiveNames, containingFile) {
        var deps = this.state.fileAnalyzer.dependencies;
        if (containingFile.indexOf(exports.TSCONFIG_INFERRED) !== -1) {
            containingFile = exports.TSCONFIG_INFERRED;
        }
        return typeDirectiveNames.map(function (moduleName) {
            return deps.getTypeReferenceResolution(containingFile, moduleName);
        });
    };
    Host.prototype.resolveModuleNames = function (moduleNames, containingFile) {
        var deps = this.state.fileAnalyzer.dependencies;
        var resolvedModules = moduleNames.map(function (moduleName) {
            return deps.getModuleResolution(containingFile, moduleName);
        });
        return resolvedModules;
    };
    Host.prototype.getDefaultLibLocation = function () {
        return path.dirname(this.state.ts.sys.getExecutingFilePath());
    };
    Host.prototype.log = function (message) {};
    return Host;
}();
exports.Host = Host;
var State = function () {
    function State(loaderConfig, configFilePath, compilerConfig, compilerInfo) {
        this.files = {};
        this.ts = compilerInfo.tsImpl;
        this.compilerInfo = compilerInfo;
        this.host = new Host(this);
        this.compilerHost = this.ts.createCompilerHost(compilerConfig.options);
        this.services = this.ts.createLanguageService(this.host, this.ts.createDocumentRegistry());
        this.loaderConfig = loaderConfig;
        this.configFilePath = configFilePath;
        this.compilerConfig = compilerConfig;
        this.fileAnalyzer = new deps_1.FileAnalyzer(this);
        if (loaderConfig.emitRequireType) {
            this.addFile(RUNTIME.fileName, RUNTIME.text);
        }
        this.loadDefaultLib();
        this.loadTypesFromConfig();
    }
    State.prototype.loadTypesFromConfig = function () {
        var _this = this;
        var options = this.compilerConfig.options;
        var directives = this.ts.getAutomaticTypeDirectiveNames(options, this.compilerHost);
        if (directives) {
            directives.forEach(function (type) {
                var resolvedTypeReferenceDirective = _this.ts.resolveTypeReferenceDirective(type, _this.configFilePath, options, _this.ts.sys).resolvedTypeReferenceDirective;
                if (resolvedTypeReferenceDirective) {
                    var fileName = resolvedTypeReferenceDirective.resolvedFileName;
                    _this.fileAnalyzer.checkDependencies(fileName);
                    _this.fileAnalyzer.dependencies.addTypeReferenceResolution(exports.TSCONFIG_INFERRED, type, resolvedTypeReferenceDirective);
                }
            });
        }
    };
    State.prototype.loadDefaultLib = function () {
        var _this = this;
        var options = this.compilerConfig.options;
        if (!options.noLib) {
            if (options.lib && options.lib.length > 0) {
                var libraryDir_1 = this.host.getDefaultLibLocation();
                options.lib.forEach(function (libName, i) {
                    var fileName = path.join(libraryDir_1, libName);
                    _this.fileAnalyzer.checkDependencies(fileName, true);
                    if (i === 0) {
                        _this.defaultLib = fileName;
                    }
                });
            } else {
                var defaultLib = this.ts.getDefaultLibFilePath(options);
                if (defaultLib) {
                    this.defaultLib = defaultLib;
                    this.fileAnalyzer.checkDependencies(defaultLib, true);
                }
            }
        }
    };
    State.prototype.updateProgram = function () {
        this.program = this.services.getProgram();
    };
    State.prototype.allFileNames = function () {
        return Object.keys(this.files);
    };
    State.prototype.getSourceFile = function (fileName) {
        var services = this.services;
        return (services.getSourceFile || services.getNonBoundSourceFile)(fileName);
    };
    State.prototype.allFiles = function () {
        return this.files;
    };
    State.prototype.emit = function (fileName) {
        if (!this.program) {
            this.program = this.services.getProgram();
        }
        var outputFiles = [];
        function writeFile(fileName, data, writeByteOrderMark) {
            outputFiles.push({
                sourceName: fileName,
                name: fileName,
                writeByteOrderMark: writeByteOrderMark,
                text: data
            });
        }
        var source = this.program.getSourceFile(fileName);
        if (!source) {
            this.updateProgram();
            source = this.program.getSourceFile(fileName);
            if (!source) {
                throw new Error("File " + fileName + " was not found in program");
            }
        }
        var emitResult = this.program.emit(source, writeFile);
        var output = {
            outputFiles: outputFiles,
            emitSkipped: emitResult.emitSkipped
        };
        if (!output.emitSkipped) {
            return output;
        } else {
            throw new Error("Emit skipped");
        }
    };
    State.prototype.fastEmit = function (fileName) {
        var file = this.getFile(fileName);
        if (!file) {
            throw new Error("Unknown file " + fileName);
        }
        var transpileResult = this.ts.transpileModule(file.text, {
            compilerOptions: this.compilerConfig.options,
            reportDiagnostics: false,
            fileName: fileName
        });
        return {
            text: transpileResult.outputText,
            sourceMap: transpileResult.sourceMapText
        };
    };
    State.prototype.updateFile = function (fileName, text, checked) {
        if (checked === void 0) {
            checked = false;
        }
        var prevFile = this.files[fileName];
        var version = 0;
        var changed = false;
        var isDefaultLib = false;
        if (prevFile) {
            isDefaultLib = prevFile.isDefaultLib;
            if (!checked || checked && text !== prevFile.text) {
                version = prevFile.version + 1;
                changed = true;
            }
        } else {
            changed = true;
        }
        if (changed) {
            this.files[fileName] = {
                text: text,
                version: version,
                isDefaultLib: isDefaultLib
            };
        }
        return changed;
    };
    State.prototype.addFile = function (fileName, text, isDefaultLib) {
        if (isDefaultLib === void 0) {
            isDefaultLib = false;
        }
        return this.files[fileName] = {
            text: text,
            isDefaultLib: isDefaultLib,
            version: 0
        };
    };
    State.prototype.getFile = function (fileName) {
        return this.files[fileName];
    };
    State.prototype.hasFile = function (fileName) {
        return this.files.hasOwnProperty(fileName);
    };
    State.prototype.readFile = function (fileName) {
        return fs.readFileSync(fileName, { encoding: 'utf-8' });
    };
    State.prototype.readFileAndAdd = function (fileName, isDefaultLib) {
        if (isDefaultLib === void 0) {
            isDefaultLib = false;
        }
        var text = this.readFile(fileName);
        this.addFile(fileName, text, isDefaultLib);
    };
    State.prototype.readFileAndUpdate = function (fileName, checked) {
        if (checked === void 0) {
            checked = false;
        }
        var text = this.readFile(fileName);
        return this.updateFile(fileName, text, checked);
    };
    return State;
}();
exports.State = State;
function TypeScriptCompilationError(diagnostics) {
    this.diagnostics = diagnostics;
}
exports.TypeScriptCompilationError = TypeScriptCompilationError;
util.inherits(TypeScriptCompilationError, Error);
//# sourceMappingURL=host.js.map