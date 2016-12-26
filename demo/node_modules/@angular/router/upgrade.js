/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ApplicationRef } from '@angular/core';
import { ROUTER_CONFIGURATION, ROUTER_INITIALIZER, Router, RouterPreloader } from '@angular/router';
import { UpgradeModule } from '@angular/upgrade/static';
/**
 * @whatItDoes Creates an initializer that in addition to setting up the Angular 2
 * router sets up the ngRoute integration.
 *
 * @howToUse
 *
 * ```
 * @NgModule({
 *  imports: [
 *   RouterModule.forRoot(SOME_ROUTES),
 *   UpgradeModule
 * ],
 * providers: [
 *   RouterUpgradeInitializer
 * ]
 * })
 * export class AppModule {
 *   ngDoBootstrap() {}
 * }
 * ```
 *
 * @experimental
 */
export var RouterUpgradeInitializer = {
    provide: ROUTER_INITIALIZER,
    useFactory: initialRouterNavigation,
    deps: [UpgradeModule, ApplicationRef, RouterPreloader, ROUTER_CONFIGURATION]
};
export function initialRouterNavigation(ngUpgrade, ref, preloader, opts) {
    return function () {
        var router = ngUpgrade.injector.get(Router);
        var ref = ngUpgrade.injector.get(ApplicationRef);
        router.resetRootComponentType(ref.componentTypes[0]);
        preloader.setUpPreloading();
        if (opts.initialNavigation === false) {
            router.setUpLocationChangeListener();
        }
        else {
            setTimeout(function () { router.initialNavigation(); }, 0);
        }
        // History.pushState does not fire onPopState, so the angular2 location
        // doesn't detect it. The workaround is to attach a location change listener
        // that will call navigate directly.
        ngUpgrade.$injector.get('$rootScope')
            .$on('$locationChangeStart', function (_, next, __) {
            var url = document.createElement('a');
            url.href = next;
            router.navigateByUrl(url.pathname);
        });
    };
}
//# sourceMappingURL=upgrade.js.map