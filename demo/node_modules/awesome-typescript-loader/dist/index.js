"use strict";
var _ = require('lodash');
var path = require('path');
var objectAssign = require('object-assign');
var cache_1 = require('./cache');
var helpers = require('./helpers');
var deps_1 = require('./deps');
var instance_1 = require('./instance');
var paths_plugin_1 = require('./paths-plugin');
var loaderUtils = require('loader-utils');
function loader(text) {
    try {
        compiler.call(undefined, this, text);
    }
    catch (e) {
        console.error(e, e.stack);
        throw e;
    }
}
function compiler(webpack, text) {
    if (webpack.cacheable) {
        webpack.cacheable();
    }
    var options = loaderUtils.parseQuery(webpack.query);
    var instanceName = options.instanceName || 'default';
    var instance = instance_1.ensureInstance(webpack, options, instanceName);
    var state = instance.tsState;
    var callback = webpack.async();
    var fileName = helpers.toUnix(webpack.resourcePath);
    var depsInjector = {
        add: function (depFileName) { return webpack.addDependency(path.normalize(depFileName)); },
        clear: webpack.clearDependencies.bind(webpack)
    };
    var applyDeps = _.once(function () {
        depsInjector.clear();
        depsInjector.add(fileName);
        state.fileAnalyzer.dependencies.applyCompiledFiles(fileName, depsInjector);
        if (state.loaderConfig.reEmitDependentFiles) {
            state.fileAnalyzer.dependencies.applyChain(fileName, depsInjector);
        }
    });
    invokeKnownFilesOneTime(instance);
    instance.compiledFiles[fileName] = true;
    var doUpdate = false;
    if (state.updateFile(fileName, text, true)) {
        state.fileAnalyzer.validFiles.markFileInvalid(fileName);
        doUpdate = true;
    }
    try {
        var wasChanged = state.fileAnalyzer.checkDependencies(fileName);
        if (wasChanged || doUpdate) {
            instance.shouldUpdateProgram = true;
        }
        var compiledModule = void 0;
        if (instance.loaderConfig.usePrecompiledFiles) {
            compiledModule = cache_1.findCompiledModule(fileName);
        }
        var transformation = null;
        if (compiledModule) {
            state.fileAnalyzer.dependencies.addCompiledModule(fileName, compiledModule.fileName);
            transformation = {
                text: compiledModule.text,
                map: compiledModule.map
                    ? JSON.parse(compiledModule.map)
                    : null
            };
        }
        else {
            var transformationFunction = function () { return transform(webpack, instance, fileName, text); };
            if (instance.loaderConfig.useCache) {
                transformation = cache_1.cache({
                    source: text,
                    identifier: instance.cacheIdentifier,
                    directory: instance.loaderConfig.cacheDirectory,
                    options: webpack.query,
                    transform: transformationFunction
                });
            }
            else {
                transformation = transformationFunction();
            }
        }
        var resultText = transformation.text;
        var resultSourceMap = transformation.map;
        if (resultSourceMap) {
            var sourcePath = path.relative(instance.compilerConfig.options.sourceRoot || process.cwd(), loaderUtils.getRemainingRequest(webpack));
            resultSourceMap.sources = [sourcePath];
            resultSourceMap.file = fileName;
            resultSourceMap.sourcesContent = [text];
        }
        try {
            callback(null, resultText, resultSourceMap);
        }
        catch (e) {
            console.error('Error in bail mode:', e, e.stack.join
                ? e.stack.join('\n')
                : e.stack);
            process.exit(1);
        }
    }
    catch (err) {
        console.error(err.toString(), err.stack.toString());
        callback(err, helpers.codegenErrorReport([err]));
    }
    finally {
        applyDeps();
    }
}
function transform(webpack, instance, fileName, text) {
    var resultText;
    var resultSourceMap = null;
    var state = instance.tsState;
    var useSlowEmit = state.compilerConfig.options.declaration || state.loaderConfig.disableFastEmit;
    if (useSlowEmit) {
        var output = state.emit(fileName);
        var result = helpers.findResultFor(output, fileName);
        if (result.text === undefined) {
            throw new Error('No output found for ' + fileName);
        }
        if (result.declaration) {
            webpack.emitFile(path.relative(process.cwd(), result.declaration.sourceName), result.declaration.text);
        }
        resultText = result.text;
        resultSourceMap = result.sourceMap;
    }
    else {
        var result = state.fastEmit(fileName);
        resultText = result.text;
        resultSourceMap = result.sourceMap;
    }
    var sourceFileName = fileName.replace(process.cwd() + '/', '');
    if (resultSourceMap) {
        resultSourceMap = JSON.parse(resultSourceMap);
        resultSourceMap.sources = [sourceFileName];
        resultSourceMap.file = sourceFileName;
        resultSourceMap.sourcesContent = [text];
        resultText = resultText.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '');
    }
    if (instance.loaderConfig.useBabel) {
        var defaultOptions = {
            inputSourceMap: resultSourceMap,
            sourceRoot: process.cwd(),
            filename: fileName,
            sourceMap: true
        };
        var babelOptions = objectAssign({}, defaultOptions, instance.loaderConfig.babelOptions);
        var babelResult = instance.babelImpl.transform(resultText, babelOptions);
        resultText = babelResult.code;
        resultSourceMap = babelResult.map;
    }
    return {
        text: resultText,
        map: resultSourceMap
    };
}
function invokeKnownFilesOneTime(instance) {
    if (instance.loaderConfig.externals && !instance.externalsInvoked) {
        instance.loaderConfig.externals
            .filter(deps_1.isTypeDeclaration)
            .forEach(function (ext) { return instance.tsState.fileAnalyzer.checkDependencies(ext); });
        instance.externalsInvoked = true;
    }
}
var ForkCheckerPlugin = (function () {
    function ForkCheckerPlugin() {
    }
    ForkCheckerPlugin.prototype.apply = function (compiler) {
        compiler.plugin("watch-run", function (params, callback) {
            compiler._tsFork = true;
            callback();
        });
    };
    return ForkCheckerPlugin;
}());
loader.ForkCheckerPlugin = ForkCheckerPlugin;
loader.TsConfigPathsPlugin = paths_plugin_1.PathsPlugin;
module.exports = loader;
//# sourceMappingURL=index.js.map