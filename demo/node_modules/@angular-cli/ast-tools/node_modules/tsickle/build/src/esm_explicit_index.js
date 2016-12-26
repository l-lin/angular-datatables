/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require('typescript');
var rewriter_1 = require('./rewriter');
/**
 * postprocesses TypeScript compilation output JS, to rewrite shorthand imports like from 'foo'
 * to from 'foo/index'.
 * Note that Webpack and Rollup happen to follow the CommonJS convention of allowing shorthand
 * imports,
 * but this is not specified by the ECMAScript standard so some loaders (eg closure compiler) do not
 * handle it.
 */
var ESMRewriter = (function (_super) {
    __extends(ESMRewriter, _super);
    function ESMRewriter(program, file, opts, host) {
        _super.call(this, file);
        this.program = program;
        this.opts = opts;
        this.host = host;
    }
    /**
     * maybeProcess lets subclasses optionally processes a node.
     *
     * @return True if the node has been handled and doesn't need to be traversed;
     *    false to have the node written and its children recursively visited.
     */
    ESMRewriter.prototype.maybeProcess = function (node) {
        var rewrite = false;
        if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            var importClause = node.importClause;
            this.emit('import');
            if (importClause)
                this.visit(importClause);
            rewrite = true;
        }
        if (node.kind === ts.SyntaxKind.ExportDeclaration &&
            node.moduleSpecifier) {
            var exportClause = node.exportClause;
            this.emit('export');
            if (exportClause)
                this.visit(exportClause);
            rewrite = true;
        }
        if (rewrite) {
            this.emit(" from '");
            var importModule = node.moduleSpecifier.text;
            var resolved = ts.resolveModuleName(importModule, this.file.fileName, this.opts, this.host);
            if (resolved && resolved.resolvedModule) {
                var resolvedModule = resolved.resolvedModule.resolvedFileName.replace(/(\.d)?\.ts$/, '');
                if (resolvedModule.indexOf('/index') === resolvedModule.length - '/index'.length &&
                    importModule.indexOf('/index') !== importModule.length - '/index'.length) {
                    importModule += '/index';
                }
            }
            this.emit(importModule);
            this.emit("';\n");
            return true;
        }
        return false;
    };
    return ESMRewriter;
}(rewriter_1.Rewriter));
exports.ESMRewriter = ESMRewriter;
function fixIndexImports(program, sourceFile, opts, host) {
    var rewriter = new ESMRewriter(program, sourceFile, opts, host);
    rewriter.visit(sourceFile);
    return rewriter.getOutput();
}
exports.fixIndexImports = fixIndexImports;

//# sourceMappingURL=esm_explicit_index.js.map
