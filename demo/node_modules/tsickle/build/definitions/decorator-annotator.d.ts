import * as ts from 'typescript';
export declare const ANNOTATION_SUPPORT_CODE: string;
export declare function convertDecorators(typeChecker: ts.TypeChecker, sourceFile: ts.SourceFile): {
    output: string;
    diagnostics: ts.Diagnostic[];
};
