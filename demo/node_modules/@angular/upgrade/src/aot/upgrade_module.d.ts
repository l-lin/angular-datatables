/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector, NgZone } from '@angular/core';
/**
 * @whatItDoes
 *
 * *Part of the [upgrade/static](/docs/ts/latest/api/#!?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * Allows Angular 1 and Angular 2+ components to be used together inside a hybrid upgrade
 * application, which supports AoT compilation.
 *
 * Specifically, the classes and functions in the `upgrade/static` module allow the following:
 * 1. Creation of an Angular 2+ directive that wraps and exposes an Angular 1 component so
 *    that it can be used in an Angular 2 template. See {@link UpgradeComponent}.
 * 2. Creation of an Angular 1 directive that wraps and exposes an Angular 2+ component so
 *    that it can be used in an Angular 1 template. See {@link downgradeComponent}.
 * 3. Creation of an Angular 2+ root injector provider that wraps and exposes an Angular 1
 *    service so that it can be injected into an Angular 2+ context. See
 *    {@link UpgradeModule#upgrading-an-angular-1-service Upgrading an Angular 1 service} below.
 * 4. Creation of an Angular 1 service that wraps and exposes an Angular 2+ injectable
 *    so that it can be injected into an Angular 1 context. See {@link downgradeInjectable}.
 * 3. Bootstrapping of a hybrid Angular application which contains both of the frameworks
 *    coexisting in a single application. See the
 *    {@link UpgradeModule#example example} below.
 *
 * ## Mental Model
 *
 * When reasoning about how a hybrid application works it is useful to have a mental model which
 * describes what is happening and explains what is happening at the lowest level.
 *
 * 1. There are two independent frameworks running in a single application, each framework treats
 *    the other as a black box.
 * 2. Each DOM element on the page is owned exactly by one framework. Whichever framework
 *    instantiated the element is the owner. Each framework only updates/interacts with its own
 *    DOM elements and ignores others.
 * 3. Angular 1 directives always execute inside the Angular 1 framework codebase regardless of
 *    where they are instantiated.
 * 4. Angular 2+ components always execute inside the Angular 2+ framework codebase regardless of
 *    where they are instantiated.
 * 5. An Angular 1 component can be "upgraded"" to an Angular 2+ component. This is achieved by
 *    defining an Angular 2+ directive, which bootstraps the Angular 1 component at its location
 *    in the DOM. See {@link UpgradeComponent}.
 * 6. An Angular 2+ component can be "downgraded"" to an Angular 1 component. This is achieved by
 *    defining an Angular 1 directive, which bootstraps the Angular 2+ component at its location
 *    in the DOM. See {@link downgradeComponent}.
 * 7. Whenever an "upgraded"/"downgraded" component is instantiated the host element is owned by
 *    the framework doing the instantiation. The other framework then instantiates and owns the
 *    view for that component.
 *    a. This implies that the component bindings will always follow the semantics of the
 *       instantiation framework.
 *    b. The DOM attributes are parsed by the framework that owns the current template. So
 * attributes
 *       in Angular 1 templates must use kebab-case, while Angular 1 templates must use camelCase.
 *    c. However the template binding syntax will always use the Angular 2+ style, e.g. square
 *       brackets (`[...]`) for property binding.
 * 8. Angular 1 is always bootstrapped first and owns the root component.
 * 9. The new application is running in an Angular 2+ zone, and therefore it no longer needs calls
 * to
 *    `$apply()`.
 *
 * @howToUse
 *
 * `import {UpgradeModule} from '@angular/upgrade/static';`
 *
 * ## Example
 * Import the {@link UpgradeModule} into your top level {@link NgModule Angular 2+ `NgModule`}.
 *
 * {@example upgrade/static/ts/module.ts region='ng2-module'}
 *
 * Then bootstrap the hybrid upgrade app's module, get hold of the {@link UpgradeModule} instance
 * and use it to bootstrap the top level [Angular 1
 * module](https://docs.angularjs.org/api/ng/type/angular.Module).
 *
 * {@example upgrade/static/ts/module.ts region='bootstrap'}
 *
 *
 * ## Upgrading an Angular 1 service
 *
 * There is no specific API for upgrading an Angular 1 service. Instead you should just follow the
 * following recipe:
 *
 * Let's say you have an Angular 1 service:
 *
 * {@example upgrade/static/ts/module.ts region="ng1-title-case-service"}
 *
 * Then you should define an Angular 2+ provider to be included in your {@link NgModule} `providers`
 * property.
 *
 * {@example upgrade/static/ts/module.ts region="upgrade-ng1-service"}
 *
 * Then you can use the "upgraded" Angular 1 service by injecting it into an Angular 2 component
 * or service.
 *
 * {@example upgrade/static/ts/module.ts region="use-ng1-upgraded-service"}
 *
 * @description
 *
 * This class is an `NgModule`, which you import to provide Angular 1 core services,
 * and has an instance method used to bootstrap the hybrid upgrade application.
 *
 * ## Core Angular 1 services
 * Importing this {@link NgModule} will add providers for the core
 * [Angular 1 services](https://docs.angularjs.org/api/ng/service) to the root injector.
 *
 * ## Bootstrap
 * The runtime instance of this class contains a {@link UpgradeModule#bootstrap `bootstrap()`}
 * method, which you use to bootstrap the top level Angular 1 module onto an element in the
 * DOM for the hybrid upgrade app.
 *
 * It also contains properties to access the {@link UpgradeModule#injector root injector}, the
 * bootstrap {@link NgZone} and the
 * [Angular 1 $injector](https://docs.angularjs.org/api/auto/service/$injector).
 *
 * @experimental
 */
export declare class UpgradeModule {
    /** The root {@link Injector} for the upgrade application. */
    injector: Injector;
    /** The bootstrap zone for the upgrade application */
    ngZone: NgZone;
    /**
     * The Angular 1 `$injector` for the upgrade application.
     */
    $injector: any;
    constructor(
        /** The root {@link Injector} for the upgrade application. */
        injector: Injector, 
        /** The bootstrap zone for the upgrade application */
        ngZone: NgZone);
    /**
     * Bootstrap an Angular 1 application from this NgModule
     * @param element the element on which to bootstrap the Angular 1 application
     * @param [modules] the Angular 1 modules to bootstrap for this application
     * @param [config] optional extra Angular 1 bootstrap configuration
     */
    bootstrap(element: Element, modules?: string[], config?: any): void;
}
