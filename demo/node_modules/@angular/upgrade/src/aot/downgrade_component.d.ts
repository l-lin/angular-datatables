/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Type } from '@angular/core';
/**
 * @whatItDoes
 *
 * *Part of the [upgrade/static](/docs/ts/latest/api/#!?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * Allows an Angular 2+ component to be used from Angular 1.
 *
 * @howToUse
 *
 * Let's assume that you have an Angular 2+ component called `ng2Heroes` that needs
 * to be made available in Angular 1 templates.
 *
 * {@example upgrade/static/ts/module.ts region="ng2-heroes"}
 *
 * We must create an Angular 1 [directive](https://docs.angularjs.org/guide/directive)
 * that will make this Angular 2+ component available inside Angular 1 templates.
 * The `downgradeComponent()` function returns a factory function that we
 * can use to define the Angular 1 directive that wraps the "downgraded" component.
 *
 * {@example upgrade/static/ts/module.ts region="ng2-heroes-wrapper"}
 *
 * In this example you can see that we must provide information about the component being
 * "downgraded". This is because once the AoT compiler has run, all metadata about the
 * component has been removed from the code, and so cannot be inferred.
 *
 * We must do the following:
 * * specify the Angular 2+ component class that is to be downgraded
 * * specify all inputs and outputs that the Angular 1 component expects
 *
 * @description
 *
 * A helper function that returns a factory function to be used for registering an
 * Angular 1 wrapper directive for "downgrading" an Angular 2+ component.
 *
 * The parameter contains information about the Component that is being downgraded:
 *
 * * `component: Type<any>`: The type of the Component that will be downgraded
 * * `inputs: string[]`: A collection of strings that specify what inputs the component accepts.
 * * `outputs: string[]`: A collection of strings that specify what outputs the component emits.
 *
 * The `inputs` and `outputs` are strings that map the names of properties to camelCased
 * attribute names. They are of the form `"prop: attr"`; or simply `"propAndAttr" where the
 * property and attribute have the same identifier.
 *
 * @experimental
 */
export declare function downgradeComponent(info: {
    component: Type<any>;
    inputs?: string[];
    outputs?: string[];
}): any;
