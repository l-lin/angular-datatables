/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
import { SourceMapGenerator } from 'source-map';
import { Rewriter } from './rewriter';
/**
 * postprocesses TypeScript compilation output JS, to rewrite shorthand imports like from 'foo'
 * to from 'foo/index'.
 * Note that Webpack and Rollup happen to follow the CommonJS convention of allowing shorthand
 * imports,
 * but this is not specified by the ECMAScript standard so some loaders (eg closure compiler) do not
 * handle it.
 */
export declare class ESMRewriter extends Rewriter {
    protected program: ts.Program;
    private opts;
    private host;
    constructor(program: ts.Program, file: ts.SourceFile, opts: ts.CompilerOptions, host: ts.ModuleResolutionHost);
    /**
     * maybeProcess lets subclasses optionally processes a node.
     *
     * @return True if the node has been handled and doesn't need to be traversed;
     *    false to have the node written and its children recursively visited.
     */
    protected maybeProcess(node: ts.Node): boolean;
}
export declare function fixIndexImports(program: ts.Program, sourceFile: ts.SourceFile, opts: ts.CompilerOptions, host: ts.ModuleResolutionHost): {
    output: string;
    diagnostics: ts.Diagnostic[];
    sourceMap: SourceMapGenerator;
};
