/**
 * @license Angular v2.2.4
 * (c) 2010-2016 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
    (factory((global.ng = global.ng || {}, global.ng.upgrade = global.ng.upgrade || {}, global.ng.upgrade.static = global.ng.upgrade.static || {}),global.ng.core));
}(this, function (exports,_angular_core) { 'use strict';

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var UPGRADE_MODULE_NAME = '$$UpgradeModule';
    var INJECTOR_KEY = '$$angularInjector';
    var $INJECTOR = '$injector';
    var $PARSE = '$parse';
    var $SCOPE = '$scope';
    var $PROVIDE = '$provide';
    var $DELEGATE = '$delegate';
    var $$TESTABILITY = '$$testability';
    var $COMPILE = '$compile';
    var $TEMPLATE_CACHE = '$templateCache';
    var $HTTP_BACKEND = '$httpBackend';
    var $CONTROLLER = '$controller';

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * A `PropertyBinding` represents a mapping between a property name
     * and an attribute name. It is parsed from a string of the form
     * `"prop: attr"`; or simply `"propAndAttr" where the property
     * and attribute have the same identifier.
     */
    var PropertyBinding = (function () {
        function PropertyBinding(binding) {
            this.binding = binding;
            this.parseBinding();
        }
        PropertyBinding.prototype.parseBinding = function () {
            var parts = this.binding.split(':');
            this.prop = parts[0].trim();
            this.attr = (parts[1] || this.prop).trim();
            this.bracketAttr = "[" + this.attr + "]";
            this.parenAttr = "(" + this.attr + ")";
            this.bracketParenAttr = "[(" + this.attr + ")]";
            var capitalAttr = this.attr.charAt(0).toUpperCase() + this.attr.substr(1);
            this.onAttr = "on" + capitalAttr;
            this.bindAttr = "bind" + capitalAttr;
            this.bindonAttr = "bindon" + capitalAttr;
        };
        return PropertyBinding;
    }());

    var INITIAL_VALUE = {
        __UNINITIALIZED__: true
    };
    var DowngradeComponentAdapter = (function () {
        function DowngradeComponentAdapter(id, info, element, attrs, scope, parentInjector, parse, componentFactory) {
            this.id = id;
            this.info = info;
            this.element = element;
            this.attrs = attrs;
            this.scope = scope;
            this.parentInjector = parentInjector;
            this.parse = parse;
            this.componentFactory = componentFactory;
            this.component = null;
            this.inputChangeCount = 0;
            this.inputChanges = null;
            this.componentRef = null;
            this.changeDetector = null;
            this.contentInsertionPoint = null;
            this.element[0].id = id;
            this.componentScope = scope.$new();
            this.childNodes = element.contents();
        }
        DowngradeComponentAdapter.prototype.createComponent = function () {
            var childInjector = _angular_core.ReflectiveInjector.resolveAndCreate([{ provide: $SCOPE, useValue: this.componentScope }], this.parentInjector);
            this.contentInsertionPoint = document.createComment('ng1 insertion point');
            this.componentRef = this.componentFactory.create(childInjector, [[this.contentInsertionPoint]], this.element[0]);
            this.changeDetector = this.componentRef.changeDetectorRef;
            this.component = this.componentRef.instance;
        };
        DowngradeComponentAdapter.prototype.setupInputs = function () {
            var _this = this;
            var attrs = this.attrs;
            var inputs = this.info.inputs || [];
            for (var i = 0; i < inputs.length; i++) {
                var input = new PropertyBinding(inputs[i]);
                var expr = null;
                if (attrs.hasOwnProperty(input.attr)) {
                    var observeFn = (function (prop /** TODO #9100 */) {
                        var prevValue = INITIAL_VALUE;
                        return function (value /** TODO #9100 */) {
                            if (_this.inputChanges !== null) {
                                _this.inputChangeCount++;
                                _this.inputChanges[prop] =
                                    new Ng1Change(value, prevValue === INITIAL_VALUE ? value : prevValue);
                                prevValue = value;
                            }
                            _this.component[prop] = value;
                        };
                    })(input.prop);
                    attrs.$observe(input.attr, observeFn);
                }
                else if (attrs.hasOwnProperty(input.bindAttr)) {
                    expr = attrs[input.bindAttr];
                }
                else if (attrs.hasOwnProperty(input.bracketAttr)) {
                    expr = attrs[input.bracketAttr];
                }
                else if (attrs.hasOwnProperty(input.bindonAttr)) {
                    expr = attrs[input.bindonAttr];
                }
                else if (attrs.hasOwnProperty(input.bracketParenAttr)) {
                    expr = attrs[input.bracketParenAttr];
                }
                if (expr != null) {
                    var watchFn = (function (prop /** TODO #9100 */) {
                        return function (value /** TODO #9100 */, prevValue /** TODO #9100 */) {
                            if (_this.inputChanges != null) {
                                _this.inputChangeCount++;
                                _this.inputChanges[prop] = new Ng1Change(prevValue, value);
                            }
                            _this.component[prop] = value;
                        };
                    })(input.prop);
                    this.componentScope.$watch(expr, watchFn);
                }
            }
            var prototype = this.info.component.prototype;
            if (prototype && prototype.ngOnChanges) {
                // Detect: OnChanges interface
                this.inputChanges = {};
                this.componentScope.$watch(function () { return _this.inputChangeCount; }, function () {
                    var inputChanges = _this.inputChanges;
                    _this.inputChanges = {};
                    _this.component.ngOnChanges(inputChanges);
                });
            }
            this.componentScope.$watch(function () { return _this.changeDetector && _this.changeDetector.detectChanges(); });
        };
        DowngradeComponentAdapter.prototype.projectContent = function () {
            var childNodes = this.childNodes;
            var parent = this.contentInsertionPoint.parentNode;
            if (parent) {
                for (var i = 0, ii = childNodes.length; i < ii; i++) {
                    parent.insertBefore(childNodes[i], this.contentInsertionPoint);
                }
            }
        };
        DowngradeComponentAdapter.prototype.setupOutputs = function () {
            var _this = this;
            var attrs = this.attrs;
            var outputs = this.info.outputs || [];
            for (var j = 0; j < outputs.length; j++) {
                var output = new PropertyBinding(outputs[j]);
                var expr = null;
                var assignExpr = false;
                var bindonAttr = output.bindonAttr ? output.bindonAttr.substring(0, output.bindonAttr.length - 6) : null;
                var bracketParenAttr = output.bracketParenAttr ?
                    "[(" + output.bracketParenAttr.substring(2, output.bracketParenAttr.length - 8) + ")]" :
                    null;
                if (attrs.hasOwnProperty(output.onAttr)) {
                    expr = attrs[output.onAttr];
                }
                else if (attrs.hasOwnProperty(output.parenAttr)) {
                    expr = attrs[output.parenAttr];
                }
                else if (attrs.hasOwnProperty(bindonAttr)) {
                    expr = attrs[bindonAttr];
                    assignExpr = true;
                }
                else if (attrs.hasOwnProperty(bracketParenAttr)) {
                    expr = attrs[bracketParenAttr];
                    assignExpr = true;
                }
                if (expr != null && assignExpr != null) {
                    var getter = this.parse(expr);
                    var setter = getter.assign;
                    if (assignExpr && !setter) {
                        throw new Error("Expression '" + expr + "' is not assignable!");
                    }
                    var emitter = this.component[output.prop];
                    if (emitter) {
                        emitter.subscribe({
                            next: assignExpr ?
                                (function (setter) { return function (v /** TODO #9100 */) { return setter(_this.scope, v); }; })(setter) :
                                (function (getter) { return function (v /** TODO #9100 */) {
                                    return getter(_this.scope, { $event: v });
                                }; })(getter)
                        });
                    }
                    else {
                        throw new Error("Missing emitter '" + output.prop + "' on component '" + this.info.component + "'!");
                    }
                }
            }
        };
        DowngradeComponentAdapter.prototype.registerCleanup = function () {
            var _this = this;
            this.element.bind('$destroy', function () {
                _this.componentScope.$destroy();
                _this.componentRef.destroy();
            });
        };
        return DowngradeComponentAdapter;
    }());
    var Ng1Change = (function () {
        function Ng1Change(previousValue, currentValue) {
            this.previousValue = previousValue;
            this.currentValue = currentValue;
        }
        Ng1Change.prototype.isFirstChange = function () { return this.previousValue === this.currentValue; };
        return Ng1Change;
    }());

    var downgradeCount = 0;
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
    function downgradeComponent(info) {
        var idPrefix = "NG2_UPGRADE_" + downgradeCount++ + "_";
        var idCount = 0;
        var directiveFactory = function ($injector, $parse) {
            return {
                restrict: 'E',
                require: '?^' + INJECTOR_KEY,
                link: function (scope, element, attrs, parentInjector, transclude) {
                    if (parentInjector === null) {
                        parentInjector = $injector.get(INJECTOR_KEY);
                    }
                    var componentFactoryResolver = parentInjector.get(_angular_core.ComponentFactoryResolver);
                    var componentFactory = componentFactoryResolver.resolveComponentFactory(info.component);
                    if (!componentFactory) {
                        throw new Error('Expecting ComponentFactory for: ' + info.component);
                    }
                    var facade = new DowngradeComponentAdapter(idPrefix + (idCount++), info, element, attrs, scope, parentInjector, $parse, componentFactory);
                    facade.setupInputs();
                    facade.createComponent();
                    facade.projectContent();
                    facade.setupOutputs();
                    facade.registerCleanup();
                }
            };
        };
        directiveFactory.$inject = [$INJECTOR, $PARSE];
        return directiveFactory;
    }

    /**
     * @whatItDoes
     *
     * *Part of the [upgrade/static](/docs/ts/latest/api/#!?query=upgrade%2Fstatic)
     * library for hybrid upgrade apps that support AoT compilation*
     *
     * Allow an Angular 2+ service to be accessible from Angular 1.
     *
     * @howToUse
     *
     * First ensure that the service to be downgraded is provided in an {@link NgModule}
     * that will be part of the upgrade application. For example, let's assume we have
     * defined `HeroesService`
     *
     * {@example upgrade/static/ts/module.ts region="ng2-heroes-service"}
     *
     * and that we have included this in our upgrade app {@link NgModule}
     *
     * {@example upgrade/static/ts/module.ts region="ng2-module"}
     *
     * Now we can register the `downgradeInjectable` factory function for the service
     * on an Angular 1 module.
     *
     * {@example upgrade/static/ts/module.ts region="downgrade-ng2-heroes-service"}
     *
     * Inside an Angular 1 component's controller we can get hold of the
     * downgraded service via the name we gave when downgrading.
     *
     * {@example upgrade/static/ts/module.ts region="example-app"}
     *
     * @description
     *
     * Takes a `token` that identifies a service provided from Angular 2+.
     *
     * Returns a [factory function](https://docs.angularjs.org/guide/di) that can be
     * used to register the service on an Angular 1 module.
     *
     * The factory function provides access to the Angular 2+ service that
     * is identified by the `token` parameter.
     *
     * @experimental
     */
    function downgradeInjectable(token) {
        return [INJECTOR_KEY, function (i) { return i.get(token); }];
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    ;
    function noNg() {
        throw new Error('AngularJS v1.x is not loaded!');
    }
    var angular = {
        bootstrap: noNg,
        module: noNg,
        element: noNg,
        version: noNg,
        resumeBootstrap: noNg,
        getTestability: noNg
    };
    try {
        if (window.hasOwnProperty('angular')) {
            angular = window.angular;
        }
    }
    catch (e) {
    }
    var bootstrap = angular.bootstrap;
    var module$1 = angular.module;
    var element = angular.element;

    // JS has NaN !== NaN
    function looseIdentical(a, b) {
        return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
    }

    function controllerKey(name) {
        return '$' + name + 'Controller';
    }

    var REQUIRE_PREFIX_RE = /^(\^\^?)?(\?)?(\^\^?)?/;
    var NOT_SUPPORTED = 'NOT_SUPPORTED';
    var INITIAL_VALUE$1 = {
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
    var UpgradeComponent = (function () {
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
            this.$element = element(this.element);
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
                            bindings.twoWayBoundLastValues.push(INITIAL_VALUE$1);
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
                _this[outputName] = new _angular_core.EventEmitter();
            });
            // Set up the outputs for `&` bindings
            this.bindings.expressionBoundProperties.forEach(function (propName) {
                var outputName = _this.bindings.propertyToOutputMap[propName];
                var emitter = _this[outputName] = new _angular_core.EventEmitter();
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

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // We have to do a little dance to get the ng1 injector into the module injector.
    // We store the ng1 injector so that the provider in the module injector can access it
    // Then we "get" the ng1 injector from the module injector, which triggers the provider to read
    // the stored injector and release the reference to it.
    var tempInjectorRef;
    function setTempInjectorRef(injector) {
        tempInjectorRef = injector;
    }
    function injectorFactory() {
        var injector = tempInjectorRef;
        tempInjectorRef = null; // clear the value to prevent memory leaks
        return injector;
    }
    function rootScopeFactory(i) {
        return i.get('$rootScope');
    }
    function compileFactory(i) {
        return i.get('$compile');
    }
    function parseFactory(i) {
        return i.get('$parse');
    }
    var angular1Providers = [
        // We must use exported named functions for the ng2 factories to keep the compiler happy:
        // > Metadata collected contains an error that will be reported at runtime:
        // >   Function calls are not supported.
        // >   Consider replacing the function or lambda with a reference to an exported function
        { provide: '$injector', useFactory: injectorFactory },
        { provide: '$rootScope', useFactory: rootScopeFactory, deps: ['$injector'] },
        { provide: '$compile', useFactory: compileFactory, deps: ['$injector'] },
        { provide: '$parse', useFactory: parseFactory, deps: ['$injector'] }
    ];

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
    var UpgradeModule = (function () {
        function UpgradeModule(
            /** The root {@link Injector} for the upgrade application. */
            injector, 
            /** The bootstrap zone for the upgrade application */
            ngZone) {
            this.injector = injector;
            this.ngZone = ngZone;
        }
        /**
         * Bootstrap an Angular 1 application from this NgModule
         * @param element the element on which to bootstrap the Angular 1 application
         * @param [modules] the Angular 1 modules to bootstrap for this application
         * @param [config] optional extra Angular 1 bootstrap configuration
         */
        UpgradeModule.prototype.bootstrap = function (element$$, modules, config /*angular.IAngularBootstrapConfig*/) {
            var _this = this;
            if (modules === void 0) { modules = []; }
            // Create an ng1 module to bootstrap
            var upgradeModule = module$1(UPGRADE_MODULE_NAME, modules)
                .value(INJECTOR_KEY, this.injector)
                .config([
                $PROVIDE, $INJECTOR,
                function ($provide, $injector) {
                    if ($injector.has($$TESTABILITY)) {
                        $provide.decorator($$TESTABILITY, [
                            $DELEGATE,
                            function (testabilityDelegate) {
                                var originalWhenStable = testabilityDelegate.whenStable;
                                var injector = _this.injector;
                                // Cannot use arrow function below because we need the context
                                var newWhenStable = function (callback) {
                                    originalWhenStable.call(this, function () {
                                        var ng2Testability = injector.get(_angular_core.Testability);
                                        if (ng2Testability.isStable()) {
                                            callback.apply(this, arguments);
                                        }
                                        else {
                                            ng2Testability.whenStable(newWhenStable.bind(this, callback));
                                        }
                                    });
                                };
                                testabilityDelegate.whenStable = newWhenStable;
                                return testabilityDelegate;
                            }
                        ]);
                    }
                }
            ])
                .run([
                $INJECTOR,
                function ($injector) {
                    _this.$injector = $injector;
                    // Initialize the ng1 $injector provider
                    setTempInjectorRef($injector);
                    _this.injector.get($INJECTOR);
                    // Put the injector on the DOM, so that it can be "required"
                    element(element$$).data(controllerKey(INJECTOR_KEY), _this.injector);
                    // Wire up the ng1 rootScope to run a digest cycle whenever the zone settles
                    var $rootScope = $injector.get('$rootScope');
                    _this.ngZone.onMicrotaskEmpty.subscribe(function () { return _this.ngZone.runOutsideAngular(function () { return $rootScope.$evalAsync(); }); });
                }
            ]);
            // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
            var windowAngular = window['angular'];
            windowAngular.resumeBootstrap = undefined;
            // Bootstrap the angular 1 application inside our zone
            this.ngZone.run(function () { bootstrap(element$$, [upgradeModule.name], config); });
            // Patch resumeBootstrap() to run inside the ngZone
            if (windowAngular.resumeBootstrap) {
                var originalResumeBootstrap_1 = windowAngular.resumeBootstrap;
                var ngZone_1 = this.ngZone;
                windowAngular.resumeBootstrap = function () {
                    var _this = this;
                    var args = arguments;
                    windowAngular.resumeBootstrap = originalResumeBootstrap_1;
                    ngZone_1.run(function () { windowAngular.resumeBootstrap.apply(_this, args); });
                };
            }
        };
        UpgradeModule.decorators = [
            { type: _angular_core.NgModule, args: [{ providers: angular1Providers },] },
        ];
        /** @nocollapse */
        UpgradeModule.ctorParameters = [
            { type: _angular_core.Injector, },
            { type: _angular_core.NgZone, },
        ];
        return UpgradeModule;
    }());

    exports.downgradeComponent = downgradeComponent;
    exports.downgradeInjectable = downgradeInjectable;
    exports.UpgradeComponent = UpgradeComponent;
    exports.UpgradeModule = UpgradeModule;

}));