/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @whatItDoes Provides a way to migrate Angular 1 applications to Angular 2.
 *
 * @experimental
 */
export var UrlHandlingStrategy = (function () {
    function UrlHandlingStrategy() {
    }
    return UrlHandlingStrategy;
}());
/**
 * @experimental
 */
export var DefaultUrlHandlingStrategy = (function () {
    function DefaultUrlHandlingStrategy() {
    }
    DefaultUrlHandlingStrategy.prototype.shouldProcessUrl = function (url) { return true; };
    DefaultUrlHandlingStrategy.prototype.extract = function (url) { return url; };
    DefaultUrlHandlingStrategy.prototype.merge = function (newUrlPart, wholeUrl) { return newUrlPart; };
    return DefaultUrlHandlingStrategy;
}());
//# sourceMappingURL=url_handling_strategy.js.map