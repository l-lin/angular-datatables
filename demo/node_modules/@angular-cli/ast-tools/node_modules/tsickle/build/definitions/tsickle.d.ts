/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SourceMapGenerator } from 'source-map';
import * as ts from 'typescript';
export { convertDecorators } from './decorator-annotator';
export { processES5 } from './es5processor';
export interface Options {
    /**
     * If true, convert every type to the Closure {?} type, which means
     * "don't check types".
     */
    untyped?: boolean;
    /**
     * If provided a function that logs an internal warning.
     * These warnings are not actionable by an end user and should be hidden
     * by default.
     */
    logWarning?: (warning: ts.Diagnostic) => void;
    /** If provided, a set of paths whose types should always generate as {?}. */
    typeBlackListPaths?: Set<string>;
    /**
     * Convert shorthand "/index" imports to full path (include the "/index").
     * Annotation will be slower because every import must be resolved.
     */
    convertIndexImportShorthand?: boolean;
}
export interface Output {
    /** The TypeScript source with Closure annotations inserted. */
    output: string;
    /** Generated externs declarations, if any. */
    externs: string | null;
    /** Error messages, if any. */
    diagnostics: ts.Diagnostic[];
    /** A source map mapping back into the original sources. */
    sourceMap: SourceMapGenerator;
}
/**
 * Symbols that are already declared as externs in Closure, that should
 * be avoided by tsickle's "declare ..." => externs.js conversion.
 */
export declare let closureExternsBlacklist: string[];
export declare function formatDiagnostics(diags: ts.Diagnostic[]): string;
export declare function annotate(program: ts.Program, file: ts.SourceFile, options?: Options, host?: ts.ModuleResolutionHost, tsOpts?: ts.CompilerOptions): Output;
