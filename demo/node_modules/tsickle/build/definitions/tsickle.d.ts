import * as ts from 'typescript';
export { convertDecorators } from './decorator-annotator';
export { processES5 as convertCommonJsToGoogModule } from './es5processor';
export interface Options {
    untyped?: boolean;
    logWarning?: (warning: ts.Diagnostic) => void;
    typeBlackListPaths?: Set<string>;
}
export interface Output {
    output: string;
    externs: string | null;
    diagnostics: ts.Diagnostic[];
}
/**
 * Symbols that are already declared as externs in Closure, that should
 * be avoided by tsickle's "declare ..." => externs.js conversion.
 */
export declare let closureExternsBlacklist: string[];
export declare function formatDiagnostics(diags: ts.Diagnostic[]): string;
export declare function annotate(program: ts.Program, file: ts.SourceFile, options?: Options): Output;
