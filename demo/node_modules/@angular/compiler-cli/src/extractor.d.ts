/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Extract i18n messages from source code
 */
import 'reflect-metadata';
import * as compiler from '@angular/compiler';
import * as tsc from '@angular/tsc-wrapped';
import * as ts from 'typescript';
import { ReflectorHost } from './reflector_host';
import { StaticReflector } from './static_reflector';
export declare class Extractor {
    private options;
    private program;
    host: ts.CompilerHost;
    private staticReflector;
    private messageBundle;
    private reflectorHost;
    private metadataResolver;
    constructor(options: tsc.AngularCompilerOptions, program: ts.Program, host: ts.CompilerHost, staticReflector: StaticReflector, messageBundle: compiler.MessageBundle, reflectorHost: ReflectorHost, metadataResolver: compiler.CompileMetadataResolver);
    extract(): Promise<compiler.MessageBundle>;
    static create(options: tsc.AngularCompilerOptions, translationsFormat: string, program: ts.Program, compilerHost: ts.CompilerHost, resourceLoader: compiler.ResourceLoader, reflectorHost?: ReflectorHost): Extractor;
}
