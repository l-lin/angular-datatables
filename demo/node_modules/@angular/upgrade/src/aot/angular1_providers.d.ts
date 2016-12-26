/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as angular from '../angular_js';
export declare function setTempInjectorRef(injector: angular.IInjectorService): void;
export declare function injectorFactory(): angular.IInjectorService;
export declare function rootScopeFactory(i: angular.IInjectorService): any;
export declare function compileFactory(i: angular.IInjectorService): any;
export declare function parseFactory(i: angular.IInjectorService): any;
export declare const angular1Providers: ({
    provide: string;
    useFactory: () => angular.IInjectorService;
} | {
    provide: string;
    useFactory: (i: angular.IInjectorService) => any;
    deps: string[];
})[];
