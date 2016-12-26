/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
import * as angular from '../angular_js';
import { looseIdentical } from '../facade/lang';
import { controllerKey } from '../util';
import { $COMPILE, $CONTROLLER, $HTTP_BACKEND, $INJECTOR, $SCOPE, $TEMPLATE_CACHE } from './constants';
var REQUIRE_PREFIX_RE = /^(\^\^?)?(\?)?(\^\^?)?/;
var NOT_SUPPORTED = 'NOT_SUPPORTED';
var INITIAL_VALUE = {
    __UNINITIALIZED__: true
};
var Bindings = (function () {
    function Bindings() {
        this.twoWayBoundProperties = [];
        this.twoWayBoundLastValues = [];
        this.expressionBoundProperties = [];
        this.propertyToOutputMap = {};
    }
    return Bindings;
}());
/**
 * @whatItDoes
 *
 * *Part of the [upgrade/static](/docs/ts/latest/api/#!?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * Allows an Angular 1 component to be used from Angular 2+.
 *
 * @howToUse
 *
 * Let's assume that you have an Angular 1 component called `ng1Hero` that needs
 * to be made available in Angular 2+ templates.
 *
 * {@example upgrade/static/ts/module.ts region="ng1-hero"}
 *
 * We must create a {@link Directive} that will make this Angular 1 component
 * available inside Angular 2+ templates.
 *
 * {@example upgrade/static/ts/module.ts region="ng1-hero-wrapper"}
 *
 * In this example you can see that we must derive from the {@link UpgradeComponent}
 * base class but also provide an {@link Directive `@Directive`} decorator. This is
 * because the AoT compiler requires that this information is statically available at
 * compile time.
 *
 * Note that we must do the following:
 * * specify the directive's selector (`ng1-hero`)
 * * specify all inputs and outputs that the Angular 1 component expects
 * * derive from `UpgradeComponent`
 * * call the base class from the constructor, passing
 *   * the Angular 1 name of the component (`ng1Hero`)
 *   * the {@link ElementRef} and {@link Injector} for the component wrapper
 *
 * @description
 *
 * A helper class that should be used as a base class for creating Angular directives
 * that wrap Angular 1 components that need to be "upgraded".
 *
 * @experimental
 */
export var UpgradeComponent = (function () {
    /**
     * Create a new `UpgradeComponent` instance. You should not normally need to do this.
     * Instead you should derive a new class from this one and call the super constructor
     * from the base class.
     *
     * {@example upgrade/static/ts/module.ts region="ng1-hero-wrapper" }
     *
     * * The `name` parameter should be the name of the Angular 1 directive.
     * * The `elementRef` and `injector` parameters should be acquired from Angular by dependency
     *   injection into the base class constructor.
     *
     * Note that we must manually implement lifecycle hooks that call through to the super class.
     * This is because, at the moment, the AoT compiler is not able to tell that the
     * `UpgradeComponent`
     * already implements them and so does not wire up calls to them at runtime.
     */
    function UpgradeComponent(name, elementRef, injector) {
        this.name = name;
        this.elementRef = elementRef;
        this.injector = injector;
        this.controllerInstance = null;
        this.bindingDestination = null;
        this.$injector = injector.get($INJECTOR);
        this.$compile = this.$injector.get($COMPILE);
        this.$templateCache = this.$injector.get($TEMPLATE_CACHE);
        this.$httpBackend = this.$injector.get($HTTP_BACKEND);
        this.$controller = this.$injector.get($CONTROLLER);
        this.element = elementRef.nativeElement;
        this.$element = angular.element(this.element);
        this.directive = this.getDirective(name);
        this.bindings = this.initializeBindings(this.directive);
        this.linkFn = this.compileTemplate(this.directive);
        // We ask for the Angular 1 scope from the Angular 2+ injector, since
        // we will put the new component scope onto the new injector for each component
        var $parentScope = injector.get($SCOPE);
        // QUESTION 1: Should we create an isolated scope if the scope is only true?
        // QUESTION 2: Should we make the scope accessible through `$element.scope()/isolateScope()`?
        this.$componentScope = $parentScope.$new(!!this.directive.scope);
        var controllerType = this.directive.controller;
        var bindToController = this.directive.bindToController;
        if (controllerType) {
            this.controllerInstance = this.buildController(controllerType, this.$componentScope, this.$element, this.directive.controllerAs);
        }
        else if (bindToController) {
            throw new Error("Upgraded directive '" + name + "' specifies 'bindToController' but no controller.");
        }
        this.bindingDestination = bindToController ? this.controllerInstance : this.$componentScope;
        this.setupOutputs();
    }
    UpgradeComponent.prototype.ngOnInit = function () {
        var _this = this;
        var attrs = NOT_SUPPORTED;
        var transcludeFn = NOT_SUPPORTED;
        var directiveRequire = this.getDirectiveRequire(this.directive);
        var requiredControllers = this.resolveRequire(this.directive.name, this.$element, directiveRequire);
        if (this.directive.bindToController && isMap(directiveRequire)) {
            var requiredControllersMap_1 = requiredControllers;
            Object.keys(requiredControllersMap_1).forEach(function (key) {
                _this.controllerInstance[key] = requiredControllersMap_1[key];
            });
        }
        this.callLifecycleHook('$onInit', this.controllerInstance);
        var link = this.directive.link;
        var preLink = (typeof link == 'object') && link.pre;
        var postLink = (typeof link == 'object') ? link.post : link;
        if (preLink) {
            preLink(this.$componentScope, this.$element, attrs, requiredControllers, transcludeFn);
        }
        var childNodes = [];
        var childNode;
        while (childNode = this.element.firstChild) {
            this.element.removeChild(childNode);
            childNodes.push(childNode);
        }
        var attachElement = function (clonedElements, scope) { _this.$element.append(clonedElements); };
        var attachChildNodes = function (scope, cloneAttach) { return cloneAttach(childNodes); };
        this.linkFn(this.$componentScope, attachElement, { parentBoundTranscludeFn: attachChildNodes });
        if (postLink) {
            postLink(this.$componentScope, this.$element, attrs, requiredControllers, transcludeFn);
        }
        this.callLifecycleHook('$postLink', this.controllerInstance);
    };
    UpgradeComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        // Forward input changes to `bindingDestination`
        Object.keys(changes).forEach(function (propName) { return _this.bindingDestination[propName] = changes[propName].currentValue; });
        this.callLifecycleHook('$onChanges', this.bindingDestination, changes);
    };
    UpgradeComponent.prototype.ngDoCheck = function () {
        var _this = this;
        var twoWayBoundProperties = this.bindings.twoWayBoundProperties;
        var twoWayBoundLastValues = this.bindings.twoWayBoundLastValues;
        var propertyToOutputMap = this.bindings.propertyToOutputMap;
        twoWayBoundProperties.forEach(function (propName, idx) {
            var newValue = _this.bindingDestination[propName];
            var oldValue = twoWayBoundLastValues[idx];
            if (!looseIdentical(newValue, oldValue)) {
                var outputName = propertyToOutputMap[propName];
                var eventEmitter = _this[outputName];
                eventEmitter.emit(newValue);
                twoWayBoundLastValues[idx] = newValue;
            }
        });
    };
    UpgradeComponent.prototype.ngOnDestroy = function () {
        this.callLifecycleHook('$onDestroy', this.controllerInstance);
        this.$componentScope.$destroy();
    };
    UpgradeComponent.prototype.callLifecycleHook = function (method, context, arg) {
        if (context && typeof context[method] === 'function') {
            context[method](arg);
        }
    };
    UpgradeComponent.prototype.getDirective = function (name) {
        var directives = this.$injector.get(name + 'Directive');
        if (directives.length > 1) {
            throw new Error('Only support single directive definition for: ' + this.name);
        }
        var directive = directives[0];
        if (directive.replace)
            this.notSupported('replace');
        if (directive.terminal)
            this.notSupported('terminal');
        if (directive.compile)
            this.notSupported('compile');
        var link = directive.link;
        // QUESTION: why not support link.post?
        if (typeof link == 'object') {
            if (link.post)
                this.notSupported('link.post');
        }
        return directive;
    };
    UpgradeComponent.prototype.getDirectiveRequire = function (directive) {
        var require = directive.require || (directive.controller && directive.name);
        if (isMap(require)) {
            Object.keys(require).forEach(function (key) {
                var value = require[key];
                var match = value.match(REQUIRE_PREFIX_RE);
                var name = value.substring(match[0].length);
                if (!name) {
                    require[key] = match[0] + key;
                }
            });
        }
        return require;
    };
    UpgradeComponent.prototype.initializeBindings = function (directive) {
        var _this = this;
        var btcIsObject = typeof directive.bindToController === 'object';
        if (btcIsObject && Object.keys(directive.scope).length) {
            throw new Error("Binding definitions on scope and controller at the same time is not supported.");
        }
        var context = (btcIsObject) ? directive.bindToController : directive.scope;
        var bindings = new Bindings();
        if (typeof context == 'object') {
            Object.keys(context).forEach(function (propName) {
                var definition = context[propName];
                var bindingType = definition.charAt(0);
                // QUESTION: What about `=*`? Ignore? Throw? Support?
                switch (bindingType) {
                    case '@':
                    case '<':
                        // We don't need to do anything special. They will be defined as inputs on the
                        // upgraded component facade and the change propagation will be handled by
                        // `ngOnChanges()`.
                        break;
                    case '=':
                        bindings.twoWayBoundProperties.push(propName);
                        bindings.twoWayBoundLastValues.push(INITIAL_VALUE);
                        bindings.propertyToOutputMap[propName] = propName + 'Change';
                        break;
                    case '&':
                        bindings.expressionBoundProperties.push(propName);
                        bindings.propertyToOutputMap[propName] = propName;
                        break;
                    default:
                        var json = JSON.stringify(context);
                        throw new Error("Unexpected mapping '" + bindingType + "' in '" + json + "' in '" + _this.name + "' directive.");
                }
            });
        }
        return bindings;
    };
    UpgradeComponent.prototype.compileTemplate = function (directive) {
        if (this.directive.template !== undefined) {
            return this.compileHtml(getOrCall(this.directive.template));
        }
        else if (this.directive.templateUrl) {
            var url = getOrCall(this.directive.templateUrl);
            var html = this.$templateCache.get(url);
            if (html !== undefined) {
                return this.compileHtml(html);
            }
            else {
                throw new Error('loading directive templates asynchronously is not supported');
            }
        }
        else {
            throw new Error("Directive '" + this.name + "' is not a component, it is missing template.");
        }
    };
    UpgradeComponent.prototype.buildController = function (controllerType, $scope, $element, controllerAs) {
        // TODO: Document that we do not pre-assign bindings on the controller instance
        var locals = { $scope: $scope, $element: $element };
        var controller = this.$controller(controllerType, locals, null, controllerAs);
        $element.data(controllerKey(this.directive.name), controller);
        return controller;
    };
    UpgradeComponent.prototype.resolveRequire = function (directiveName, $element, require) {
        var _this = this;
        if (!require) {
            return null;
        }
        else if (Array.isArray(require)) {
            return require.map(function (req) { return _this.resolveRequire(directiveName, $element, req); });
        }
        else if (typeof require === 'object') {
            var value_1 = {};
            Object.keys(require).forEach(function (key) { return value_1[key] = _this.resolveRequire(directiveName, $element, require[key]); });
            return value_1;
        }
        else if (typeof require === 'string') {
            var match = require.match(REQUIRE_PREFIX_RE);
            var inheritType = match[1] || match[3];
            var name_1 = require.substring(match[0].length);
            var isOptional = !!match[2];
            var searchParents = !!inheritType;
            var startOnParent = inheritType === '^^';
            var ctrlKey = controllerKey(name_1);
            if (startOnParent) {
                $element = $element.parent();
            }
            var value = searchParents ? $element.inheritedData(ctrlKey) : $element.data(ctrlKey);
            if (!value && !isOptional) {
                throw new Error("Unable to find required '" + require + "' in upgraded directive '" + directiveName + "'.");
            }
            return value;
        }
        else {
            throw new Error("Unrecognized require syntax on upgraded directive '" + directiveName + "': " + require);
        }
    };
    UpgradeComponent.prototype.setupOutputs = function () {
        var _this = this;
        // Set up the outputs for `=` bindings
        this.bindings.twoWayBoundProperties.forEach(function (propName) {
            var outputName = _this.bindings.propertyToOutputMap[propName];
            _this[outputName] = new EventEmitter();
        });
        // Set up the outputs for `&` bindings
        this.bindings.expressionBoundProperties.forEach(function (propName) {
            var outputName = _this.bindings.propertyToOutputMap[propName];
            var emitter = _this[outputName] = new EventEmitter();
            // QUESTION: Do we want the ng1 component to call the function with `<value>` or with
            //           `{$event: <value>}`. The former is closer to ng2, the latter to ng1.
            _this.bindingDestination[propName] = function (value) { return emitter.emit(value); };
        });
    };
    UpgradeComponent.prototype.notSupported = function (feature) {
        throw new Error("Upgraded directive '" + this.name + "' contains unsupported feature: '" + feature + "'.");
    };
    UpgradeComponent.prototype.compileHtml = function (html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        return this.$compile(div.childNodes);
    };
    return UpgradeComponent;
}());
function getOrCall(property) {
    return typeof (property) === 'function' ? property() : property;
}
// NOTE: Only works for `typeof T !== 'object'`.
function isMap(value) {
    return value && !Array.isArray(value) && typeof value === 'object';
}
//# sourceMappingURL=upgrade_component.js.map