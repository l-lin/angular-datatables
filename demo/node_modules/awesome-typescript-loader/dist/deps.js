"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var helpers_1 = require('./helpers');
var path = require('path');
function isTypeDeclaration(fileName) {
    return /\.d.ts$/.test(fileName);
}
exports.isTypeDeclaration = isTypeDeclaration;
var FileAnalyzer = (function () {
    function FileAnalyzer(state) {
        this.dependencies = new DependencyManager();
        this.validFiles = new ValidFilesManager();
        this.state = state;
    }
    FileAnalyzer.prototype.checkDependencies = function (fileName, isDefaultLib) {
        if (isDefaultLib === void 0) { isDefaultLib = false; }
        var isValid = this.validFiles.isFileValid(fileName);
        if (isValid) {
            return isValid;
        }
        this.validFiles.markFileValid(fileName);
        this.dependencies.clearDependencies(fileName);
        var changed = false;
        try {
            if (!this.state.hasFile(fileName)) {
                this.state.readFileAndAdd(fileName, isDefaultLib);
                changed = true;
            }
            this.checkDependenciesInternal(fileName);
        }
        catch (err) {
            this.validFiles.markFileInvalid(fileName);
            throw err;
        }
        return changed;
    };
    FileAnalyzer.prototype.checkDependenciesInternal = function (fileName) {
        var _this = this;
        var imports = this.findImportDeclarations(fileName);
        imports.forEach(function (imp) {
            _this.dependencies.addDependency(fileName, imp);
            _this.checkDependencies(imp);
        });
        return null;
    };
    FileAnalyzer.prototype.findImportDeclarations = function (fileName) {
        var sourceFile = this.state.getSourceFile(fileName);
        var isJavaScript = sourceFile.flags & this.state.ts.NodeFlags.JavaScriptFile;
        var info = this.state.ts.preProcessFile(sourceFile.text, true, !!isJavaScript);
        var options = this.state.compilerConfig.options;
        var ts = this.state.ts;
        var deps = this.state.fileAnalyzer.dependencies;
        var imports = [];
        imports.push.apply(imports, info.importedFiles
            .map(function (file) { return file.fileName; })
            .map(function (depName) {
            var moduleName = helpers_1.withoutTypeScriptExtension(depName);
            var resolvedModule = ts.resolveModuleName(moduleName, fileName, options, ts.sys).resolvedModule;
            if (resolvedModule) {
                deps.addModuleResolution(fileName, depName, resolvedModule);
                return resolvedModule.resolvedFileName;
            }
        })
            .filter(Boolean));
        imports.push.apply(imports, info.referencedFiles
            .map(function (file) { return file.fileName; })
            .map(function (depName) {
            var relative = /^[a-z0-9].*\.d\.ts$/.test(depName)
                ? './' + depName
                : depName;
            return path.resolve(path.dirname(fileName), relative);
        })
            .map(function (depName) {
            var moduleName = helpers_1.withoutTypeScriptExtension(depName);
            var resolvedModule = ts.classicNameResolver(moduleName, fileName, options, ts.sys).resolvedModule;
            if (resolvedModule) {
                deps.addModuleResolution(fileName, depName, resolvedModule);
                return depName;
            }
        })
            .filter(Boolean));
        if (info.typeReferenceDirectives) {
            imports.push.apply(imports, info.typeReferenceDirectives
                .map(function (file) { return file.fileName; })
                .map(function (depName) {
                var resolvedTypeReferenceDirective = ts.resolveTypeReferenceDirective(depName, fileName, options, ts.sys).resolvedTypeReferenceDirective;
                if (resolvedTypeReferenceDirective) {
                    deps.addTypeReferenceResolution(fileName, depName, resolvedTypeReferenceDirective);
                    return resolvedTypeReferenceDirective.resolvedFileName;
                }
            })
                .filter(Boolean));
        }
        return imports;
    };
    return FileAnalyzer;
}());
exports.FileAnalyzer = FileAnalyzer;
var DependencyManager = (function () {
    function DependencyManager() {
        this.dependencies = {};
        this.moduleResolutions = {};
        this.typeReferenceResolutions = {};
        this.compiledModules = {};
    }
    DependencyManager.prototype.addModuleResolution = function (fileName, depName, resolvedModule) {
        this.moduleResolutions[(fileName + "::" + depName)] = resolvedModule;
    };
    DependencyManager.prototype.addTypeReferenceResolution = function (fileName, depName, resolvedModule) {
        this.typeReferenceResolutions[(fileName + "::" + depName)] = resolvedModule;
    };
    DependencyManager.prototype.getModuleResolution = function (fileName, depName) {
        return this.moduleResolutions[(fileName + "::" + depName)];
    };
    DependencyManager.prototype.getTypeReferenceResolution = function (fileName, depName) {
        return this.typeReferenceResolutions[(fileName + "::" + depName)];
    };
    DependencyManager.prototype.addDependency = function (fileName, dep) {
        if (!this.dependencies.hasOwnProperty(fileName)) {
            this.clearDependencies(fileName);
        }
        this.dependencies[fileName].push(dep);
    };
    DependencyManager.prototype.addCompiledModule = function (fileName, depFileName) {
        if (!this.compiledModules.hasOwnProperty(fileName)) {
            this.clearCompiledModules(fileName);
        }
        var store = this.compiledModules[fileName];
        if (store.indexOf(depFileName) === -1) {
            store.push(depFileName);
        }
    };
    DependencyManager.prototype.clearDependencies = function (fileName) {
        this.dependencies[fileName] = [];
    };
    DependencyManager.prototype.clearCompiledModules = function (fileName) {
        this.compiledModules[fileName] = [];
    };
    DependencyManager.prototype.getDependencies = function (fileName) {
        if (!this.dependencies.hasOwnProperty(fileName)) {
            this.clearDependencies(fileName);
        }
        return this.dependencies[fileName].slice();
    };
    DependencyManager.prototype.getDependencyGraph = function (fileName) {
        var _this = this;
        var appliedDeps = {};
        var result = {
            fileName: fileName,
            dependencies: []
        };
        var walk = function (fileName, context) {
            _this.getDependencies(fileName).forEach(function (depFileName) {
                var depContext = {
                    fileName: depFileName,
                    dependencies: []
                };
                context.dependencies.push(depContext);
                if (!appliedDeps[fileName]) {
                    appliedDeps[fileName] = true;
                    walk(fileName, depContext);
                }
            });
        };
        walk(fileName, result);
        return result;
    };
    DependencyManager.prototype.applyCompiledFiles = function (fileName, deps) {
        if (!this.compiledModules.hasOwnProperty(fileName)) {
            this.clearCompiledModules(fileName);
        }
        this.compiledModules[fileName].forEach(function (mod) {
            deps.add(mod);
        });
    };
    DependencyManager.prototype.applyChain = function (fileName, deps) {
        if (!this.dependencies.hasOwnProperty(fileName)) {
            this.clearDependencies(fileName);
        }
        var appliedDeps = {};
        var graph = this.getDependencyGraph(fileName);
        var walk = function (item) {
            var itemFileName = item.fileName;
            if (!appliedDeps[itemFileName]) {
                appliedDeps[itemFileName] = true;
                deps.add(itemFileName);
                item.dependencies.forEach(function (dep) { return walk(dep); });
            }
        };
        walk(graph);
    };
    return DependencyManager;
}());
exports.DependencyManager = DependencyManager;
var ValidFilesManager = (function () {
    function ValidFilesManager() {
        this.files = {};
    }
    ValidFilesManager.prototype.isFileValid = function (fileName) {
        return this.files[fileName];
    };
    ValidFilesManager.prototype.markFileValid = function (fileName) {
        this.files[fileName] = true;
    };
    ValidFilesManager.prototype.markFileInvalid = function (fileName) {
        this.files[fileName] = false;
    };
    return ValidFilesManager;
}());
exports.ValidFilesManager = ValidFilesManager;
var ResolutionError = (function (_super) {
    __extends(ResolutionError, _super);
    function ResolutionError() {
        _super.apply(this, arguments);
    }
    return ResolutionError;
}(Error));
exports.ResolutionError = ResolutionError;
//# sourceMappingURL=deps.js.map