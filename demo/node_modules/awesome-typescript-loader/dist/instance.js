"use strict";
var host_1 = require('./host');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var helpers_1 = require('./helpers');
var checker_1 = require('./checker');
var colors = require('colors/safe');
var pkg = require('../package.json');
function getRootCompiler(compiler) {
    if (compiler.parentCompilation) {
        return getRootCompiler(compiler.parentCompilation.compiler);
    }
    else {
        return compiler;
    }
}
function getInstanceStore(compiler) {
    var store = getRootCompiler(compiler)._tsInstances;
    if (store) {
        return store;
    }
    else {
        throw new Error('Can not resolve instance store');
    }
}
function ensureInstanceStore(compiler) {
    var rootCompiler = getRootCompiler(compiler);
    if (!rootCompiler._tsInstances) {
        rootCompiler._tsInstances = {};
    }
}
function resolveInstance(compiler, instanceName) {
    return getInstanceStore(compiler)[instanceName];
}
var COMPILER_ERROR = colors.red("\n\nTypescript compiler cannot be found, please add it to your package.json file:\n    npm install --save-dev typescript\n");
var BABEL_ERROR = colors.red("\n\nBabel compiler cannot be found, please add it to your package.json file:\n    npm install --save-dev babel-core\n");
var id = 0;
function ensureInstance(webpack, query, instanceName) {
    ensureInstanceStore(webpack._compiler);
    var exInstance = resolveInstance(webpack._compiler, instanceName);
    if (exInstance) {
        return exInstance;
    }
    var compilerInfo = setupTs(query.compiler);
    var tsImpl = compilerInfo.tsImpl;
    var _a = readConfigFile(process.cwd(), query, tsImpl), configFilePath = _a.configFilePath, compilerConfig = _a.compilerConfig, loaderConfig = _a.loaderConfig;
    applyDefaults(configFilePath, compilerConfig, loaderConfig);
    var babelImpl = setupBabel(loaderConfig);
    var cacheIdentifier = setupCache(loaderConfig, tsImpl, webpack, babelImpl);
    var forkChecker = loaderConfig.forkChecker && getRootCompiler(webpack._compiler)._tsFork;
    var tsState = new host_1.State(loaderConfig, configFilePath, compilerConfig, compilerInfo);
    var compiler = webpack._compiler;
    setupWatchRun(compiler, instanceName);
    if (loaderConfig.doTypeCheck) {
        setupAfterCompile(compiler, instanceName, forkChecker);
    }
    var webpackOptions = _.pick(webpack._compiler.options, 'resolve');
    var atlOptions = webpack.options.atl;
    var plugins = [];
    if (atlOptions && atlOptions.plugins) {
        plugins = atlOptions.plugins;
    }
    var initedPlugins = [];
    if (!forkChecker) {
        initedPlugins = plugins.map(function (plugin) {
            return require(plugin.file)(plugin.options);
        });
    }
    return getInstanceStore(webpack._compiler)[instanceName] = {
        id: ++id,
        tsState: tsState,
        babelImpl: babelImpl,
        compiledFiles: {},
        loaderConfig: loaderConfig,
        configFilePath: configFilePath,
        compilerConfig: compilerConfig,
        externalsInvoked: false,
        checker: forkChecker
            ? checker_1.createChecker(compilerInfo, loaderConfig, compilerConfig.options, webpackOptions, tsState.defaultLib, plugins)
            : null,
        cacheIdentifier: cacheIdentifier,
        plugins: plugins,
        initedPlugins: initedPlugins,
        shouldUpdateProgram: true
    };
}
exports.ensureInstance = ensureInstance;
function setupTs(compiler) {
    var compilerPath = compiler || 'typescript';
    var tsImpl;
    var tsImplPath;
    try {
        tsImplPath = require.resolve(compilerPath);
        tsImpl = require(tsImplPath);
    }
    catch (e) {
        console.error(e);
        console.error(COMPILER_ERROR);
        process.exit(1);
    }
    var compilerInfo = {
        compilerPath: compilerPath,
        tsImpl: tsImpl,
    };
    return compilerInfo;
}
exports.setupTs = setupTs;
function setupCache(loaderConfig, tsImpl, webpack, babelImpl) {
    var cacheIdentifier = null;
    if (loaderConfig.useCache) {
        if (!loaderConfig.cacheDirectory) {
            loaderConfig.cacheDirectory = path.join(process.cwd(), '.awcache');
        }
        if (!fs.existsSync(loaderConfig.cacheDirectory)) {
            fs.mkdirSync(loaderConfig.cacheDirectory);
        }
        cacheIdentifier = {
            'typescript': tsImpl.version,
            'awesome-typescript-loader': pkg.version,
            'awesome-typescript-loader-query': webpack.query,
            'babel-core': babelImpl
                ? babelImpl.version
                : null
        };
    }
}
function setupBabel(loaderConfig) {
    var babelImpl;
    if (loaderConfig.useBabel) {
        try {
            var babelPath = loaderConfig.babelCore || path.join(process.cwd(), 'node_modules', 'babel-core');
            babelImpl = require(babelPath);
        }
        catch (e) {
            console.error(BABEL_ERROR);
            process.exit(1);
        }
    }
    return babelImpl;
}
function applyDefaults(configFilePath, compilerConfig, loaderConfig) {
    compilerConfig.typingOptions.exclude = compilerConfig.typingOptions.exclude || [];
    var initialFiles = compilerConfig.fileNames;
    _.defaults(compilerConfig.options, {
        sourceMap: true,
        verbose: false,
        skipDefaultLibCheck: true,
        suppressOutputPathCheck: true,
    });
    _.defaults(compilerConfig.options, {
        sourceRoot: compilerConfig.options.sourceMap ? process.cwd() : undefined
    });
    _.defaults(loaderConfig, {
        externals: [],
        doTypeCheck: true,
        sourceMap: true,
        verbose: false,
    });
    delete compilerConfig.options.outDir;
    delete compilerConfig.options.outFile;
    delete compilerConfig.options.out;
    delete compilerConfig.options.noEmit;
    loaderConfig.externals.push.apply(loaderConfig.externals, initialFiles);
}
function absolutize(fileName) {
    if (path.isAbsolute(fileName)) {
        return fileName;
    }
    else {
        return path.join(process.cwd(), fileName);
    }
}
function readConfigFile(baseDir, query, tsImpl) {
    var configFilePath;
    if (query.tsconfig && query.tsconfig.match(/\.json$/)) {
        configFilePath = absolutize(query.tsconfig);
    }
    else {
        configFilePath = tsImpl.findConfigFile(process.cwd(), tsImpl.sys.fileExists);
    }
    var existingOptions = tsImpl.convertCompilerOptionsFromJson(query, process.cwd(), 'atl.query');
    if (!configFilePath || query.tsconfigContent) {
        return {
            configFilePath: configFilePath || path.join(process.cwd(), 'tsconfig.json'),
            compilerConfig: tsImpl.parseJsonConfigFileContent(query.tsconfigContent || {}, tsImpl.sys, process.cwd(), _.extend({}, tsImpl.getDefaultCompilerOptions(), existingOptions.options), process.cwd()),
            loaderConfig: query
        };
    }
    var jsonConfigFile = tsImpl.readConfigFile(configFilePath, tsImpl.sys.readFile);
    var compilerConfig = tsImpl.parseJsonConfigFileContent(jsonConfigFile.config, tsImpl.sys, path.dirname(configFilePath), existingOptions.options, configFilePath);
    return {
        configFilePath: configFilePath,
        compilerConfig: compilerConfig,
        loaderConfig: _.defaults(query, jsonConfigFile.config.awesomeTypescriptLoaderOptions)
    };
}
exports.readConfigFile = readConfigFile;
var EXTENSIONS = /\.tsx?$|\.jsx?$/;
function setupWatchRun(compiler, instanceName) {
    compiler.plugin('watch-run', function (watching, callback) {
        var instance = resolveInstance(watching.compiler, instanceName);
        var state = instance.tsState;
        var mtimes = watching.compiler.fileTimestamps || watching.compiler.watchFileSystem.watcher.mtimes;
        var changedFiles = Object.keys(mtimes).map(helpers_1.toUnix);
        changedFiles.forEach(function (changedFile) {
            state.fileAnalyzer.validFiles.markFileInvalid(changedFile);
        });
        try {
            changedFiles.forEach(function (changedFile) {
                if (EXTENSIONS.test(changedFile)) {
                    if (state.hasFile(changedFile)) {
                        state.readFileAndUpdate(changedFile);
                        state.fileAnalyzer.checkDependencies(changedFile);
                    }
                }
            });
            if (!state.loaderConfig.forkChecker) {
                state.updateProgram();
            }
            callback();
        }
        catch (err) {
            console.error(err.toString());
            callback();
        }
    });
}
var runChecker = function (instance, payload) {
    instance.checker.send({
        messageType: 'compile',
        payload: payload
    });
};
runChecker = _.debounce(runChecker, 200);
function setupAfterCompile(compiler, instanceName, forkChecker) {
    if (forkChecker === void 0) { forkChecker = false; }
    compiler.plugin('after-compile', function (compilation, callback) {
        if (compilation.compiler.isChild()) {
            callback();
            return;
        }
        var instance = resolveInstance(compilation.compiler, instanceName);
        var state = instance.tsState;
        var deps = state.fileAnalyzer.dependencies;
        if (forkChecker) {
            var payload = {
                files: state.allFiles(),
                moduleResolutionCache: deps.moduleResolutions,
                typeReferenceResolutionCache: deps.typeReferenceResolutions
            };
            runChecker(instance, payload);
        }
        else {
            if (!state.program || instance.shouldUpdateProgram) {
                state.updateProgram();
                instance.shouldUpdateProgram = false;
            }
            var diagnostics = state.ts.getPreEmitDiagnostics(state.program);
            var emitError = function (msg) {
                if (compilation.bail) {
                    console.error('Error in bail mode:', msg);
                    process.exit(1);
                }
                compilation.errors.push(new Error(msg));
            };
            var ignoreDiagnostics_1 = instance.loaderConfig.ignoreDiagnostics;
            diagnostics
                .filter(function (err) { return !ignoreDiagnostics_1 || ignoreDiagnostics_1.indexOf(err.code) == -1; })
                .map(function (err) { return ("[" + instanceName + "] ") + helpers_1.formatError(err); })
                .forEach(emitError);
            instance.initedPlugins.forEach(function (plugin) {
                plugin.processProgram(state.program);
            });
        }
        var phantomImports = [];
        state.allFileNames().forEach(function (fileName) {
            if (!instance.compiledFiles[fileName]) {
                phantomImports.push(fileName);
            }
        });
        if (instance.compilerConfig.options.declaration) {
            phantomImports.forEach(function (imp) {
                var output = instance.tsState.services.getEmitOutput(imp);
                var declarationFile = output.outputFiles.filter(function (filePath) {
                    return !!filePath.name.match(/\.d.ts$/);
                })[0];
                if (declarationFile) {
                    var assetPath = path.normalize(path.relative(process.cwd(), declarationFile.name));
                    compilation.assets[assetPath] = {
                        source: function () { return declarationFile.text; },
                        size: function () { return declarationFile.text.length; }
                    };
                }
            });
        }
        instance.compiledFiles = {};
        var fileDeps = compilation.fileDependencies;
        fileDeps.push.apply(fileDeps, phantomImports.map(path.normalize));
        compilation.fileDependencies = _.uniq(fileDeps);
        callback();
    });
}
//# sourceMappingURL=instance.js.map