/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Transform template html and css into executable code.
 * Intended to be used in a build step.
 */
import * as compiler from '@angular/compiler';
import { AngularCompilerOptions, NgcCliOptions } from '@angular/tsc-wrapped';
import * as ts from 'typescript';
import { ReflectorHost, ReflectorHostContext } from './reflector_host';
import { StaticReflector, StaticReflectorHost, StaticSymbol } from './static_reflector';
export declare class CodeGenerator {
    private options;
    private program;
    host: ts.CompilerHost;
    private staticReflector;
    private compiler;
    private reflectorHost;
    constructor(options: AngularCompilerOptions, program: ts.Program, host: ts.CompilerHost, staticReflector: StaticReflector, compiler: compiler.OfflineCompiler, reflectorHost: StaticReflectorHost);
    private calculateEmitPath(filePath);
    codegen(options: {
        transitiveModules: boolean;
    }): Promise<any>;
    static create(options: AngularCompilerOptions, cliOptions: NgcCliOptions, program: ts.Program, compilerHost: ts.CompilerHost, reflectorHostContext?: ReflectorHostContext, resourceLoader?: compiler.ResourceLoader, reflectorHost?: ReflectorHost): CodeGenerator;
}
export declare function extractProgramSymbols(program: ts.Program, staticReflector: StaticReflector, reflectorHost: StaticReflectorHost, options: AngularCompilerOptions): StaticSymbol[];
