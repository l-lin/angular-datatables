'use strict';
angular.module('datatables.renderer', ['datatables.instances', 'datatables.factory', 'datatables.options', 'datatables.instances'])
    .factory('DTRendererService', dtRendererService)
    .factory('DTRenderer', dtRenderer)
    .factory('DTDefaultRenderer', dtDefaultRenderer)
    .factory('DTNGRenderer', dtNGRenderer)
    .factory('DTPromiseRenderer', dtPromiseRenderer)
    .factory('DTAjaxRenderer', dtAjaxRenderer)
    .factory('DTRendererFactory', dtRendererFactory);

/* @ngInject */
function dtRendererService(DTLoadingTemplate) {
    var plugins = [];
    var rendererService = {
        showLoading: showLoading,
        hideLoading: hideLoading,
        renderDataTable: renderDataTable,
        hideLoadingAndRenderDataTable: hideLoadingAndRenderDataTable,
        registerPlugin: registerPlugin,
        postRender: postRender,
        preRender: preRender
    };
    return rendererService;

    function showLoading($elem, $scope) {
        var $loading = angular.element(DTLoadingTemplate.compileHtml($scope));
        $elem.after($loading);
        $elem.hide();
        $loading.show();
    }

    function hideLoading($elem) {
        $elem.show();
        var next = $elem.next();
        if (DTLoadingTemplate.isLoading(next)) {
            next.remove();
        }
    }

    function renderDataTable($elem, options) {
        var dtId = '#' + $elem.attr('id');
        if ($.fn.dataTable.isDataTable(dtId) && angular.isObject(options)) {
            options.destroy = true;
        }
        // See http://datatables.net/manual/api#Accessing-the-API to understand the difference between DataTable and dataTable
        var DT = $elem.DataTable(options);
        var dt = $elem.dataTable();

        var result = {
            id: $elem.attr('id'),
            DataTable: DT,
            dataTable: dt
        };

        postRender(options, result);

        return result;
    }

    function hideLoadingAndRenderDataTable($elem, options) {
        rendererService.hideLoading($elem);
        return rendererService.renderDataTable($elem, options);
    }

    function registerPlugin(plugin) {
        plugins.push(plugin);
    }

    function postRender(options, result) {
        angular.forEach(plugins, function(plugin) {
            if (angular.isFunction(plugin.postRender)) {
                plugin.postRender(options, result);
            }
        });
    }

    function preRender(options) {
        angular.forEach(plugins, function(plugin) {
            if (angular.isFunction(plugin.preRender)) {
                plugin.preRender(options);
            }
        });
    }
}

function dtRenderer() {
    return {
        withOptions: function(options) {
            this.options = options;
            return this;
        }
    };
}

/* @ngInject */
function dtDefaultRenderer($q, DTRenderer, DTRendererService, DTInstanceFactory) {
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _$elem;
        var _$scope;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTDefaultRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;

        function render($elem, $scope) {
            _$elem = $elem;
            _$scope = $scope;
            var dtInstance = DTInstanceFactory.newDTInstance(renderer);
            var result = DTRendererService.hideLoadingAndRenderDataTable($elem, renderer.options);
            _oTable = result.DataTable;
            DTInstanceFactory.copyDTProperties(result, dtInstance);
            return $q.when(dtInstance);
        }

        function reloadData() {
            // Do nothing
        }

        function changeData() {
            // Do nothing
        }

        function rerender() {
            _oTable.destroy();
            DTRendererService.showLoading(_$elem, _$scope);
            render(_$elem, _$scope);
        }
        return renderer;
    }
}

/* @ngInject */
function dtNGRenderer($log, $q, $compile, $timeout, DTRenderer, DTRendererService, DTInstanceFactory) {
    /**
     * Renderer for displaying the Angular way
     * @param options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: create
    };

    function create(options) {
        var _staticHTML;
        var _oTable;
        var _$elem;
        var _parentScope;
        var _newParentScope;
        var dtInstance;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTNGRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem, $scope, staticHTML) {
            _staticHTML = staticHTML;
            _$elem = $elem;
            _parentScope = $scope.$parent;
            dtInstance = DTInstanceFactory.newDTInstance(renderer);

            var defer = $q.defer();
            var _$tableElem = _staticHTML.match(/<tbody([\s\S]*)<\/tbody>/i);
            var _expression = _$tableElem[1];
            // Find the resources from the comment <!-- ngRepeat: item in items --> displayed by angular in the DOM
            // This regexp is inspired by the one used in the "ngRepeat" directive
            var _match = _expression.match(/^\s*.+?\s+in\s+([a-zA-Z0-9\.-_]*)\s*/m);

            if (!_match) {
                throw new Error('Expected expression in form of "_item_ in _collection_[ track by _id_]" but got "{0}".', _expression);
            }
            var _ngRepeatAttr = _match[1];

            var _alreadyRendered = false;

            _parentScope.$watchCollection(_ngRepeatAttr, function() {
                if (_oTable && _alreadyRendered) {
                    _destroyAndCompile();
                }
                $timeout(function() {
                    _alreadyRendered = true;
                    // Ensure that prerender is called when the collection is updated
                    // See https://github.com/l-lin/angular-datatables/issues/502
                    DTRendererService.preRender(renderer.options);
                    var result = DTRendererService.hideLoadingAndRenderDataTable(_$elem, renderer.options);
                    _oTable = result.DataTable;
                    DTInstanceFactory.copyDTProperties(result, dtInstance);
                    defer.resolve(dtInstance);
                }, 0, false);
            }, true);
            return defer.promise;
        }

        function reloadData() {
            $log.warn('The Angular Renderer does not support reloading data. You need to do it directly on your model');
        }

        function changeData() {
            $log.warn('The Angular Renderer does not support changing the data. You need to change your model directly.');
        }

        function rerender() {
            _destroyAndCompile();
            DTRendererService.showLoading(_$elem, _parentScope);
            // Ensure that prerender is called after loadData from promise
            // See https://github.com/l-lin/angular-datatables/issues/563
            DTRendererService.preRender(options);
            $timeout(function() {
                var result = DTRendererService.hideLoadingAndRenderDataTable(_$elem, renderer.options);
                _oTable = result.DataTable;
                DTInstanceFactory.copyDTProperties(result, dtInstance);
            }, 0, false);
        }

        function _destroyAndCompile() {
            if (_newParentScope) {
                _newParentScope.$destroy();
            }
            _oTable.ngDestroy();
            // Re-compile because we lost the angular binding to the existing data
            _$elem.html(_staticHTML);
            _newParentScope = _parentScope.$new();
            $compile(_$elem.contents())(_newParentScope);
        }
    }
}

/* @ngInject */
function dtPromiseRenderer($q, $timeout, $log, DTRenderer, DTRendererService, DTInstanceFactory) {
    /**
     * Renderer for displaying with a promise
     * @param options the options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _loadedPromise = null;
        var _$elem;
        var _$scope;

        var dtInstance;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTPromiseRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem, $scope) {
            var defer = $q.defer();
            dtInstance = DTInstanceFactory.newDTInstance(renderer);
            _$elem = $elem;
            _$scope = $scope;
            _resolve(renderer.options.fnPromise, DTRendererService.renderDataTable).then(function(result) {
                _oTable = result.DataTable;
                DTInstanceFactory.copyDTProperties(result, dtInstance);
                defer.resolve(dtInstance);
            });
            return defer.promise;
        }

        function reloadData(callback, resetPaging) {
            var previousPage = _oTable && _oTable.page() ? _oTable.page() : 0;
            if (angular.isFunction(renderer.options.fnPromise)) {
                _resolve(renderer.options.fnPromise, _redrawRows).then(function(result) {
                    if (angular.isFunction(callback)) {
                        callback(result.DataTable.data());
                    }
                    if (resetPaging === false) {
                        result.DataTable.page(previousPage).draw(false);
                    }
                });
            } else {
                $log.warn('In order to use the reloadData functionality with a Promise renderer, you need to provide a function that returns a promise.');
            }
        }

        function changeData(fnPromise) {
            renderer.options.fnPromise = fnPromise;
            // We also need to set the $scope.dtOptions, otherwise, when we change the columns, it will revert to the old data
            // See https://github.com/l-lin/angular-datatables/issues/359
            _$scope.dtOptions.fnPromise = fnPromise;
            _resolve(renderer.options.fnPromise, _redrawRows);
        }

        function rerender() {
            _oTable.destroy();
            DTRendererService.showLoading(_$elem, _$scope);
            // Ensure that prerender is called after loadData from promise
            // See https://github.com/l-lin/angular-datatables/issues/563
            DTRendererService.preRender(options);
            render(_$elem, _$scope);
        }

        function _resolve(fnPromise, callback) {
            var defer = $q.defer();
            if (angular.isUndefined(fnPromise)) {
                throw new Error('You must provide a promise or a function that returns a promise!');
            }
            if (_loadedPromise) {
                _loadedPromise.then(function() {
                    defer.resolve(_startLoading(fnPromise, callback));
                });
            } else {
                defer.resolve(_startLoading(fnPromise, callback));
            }
            return defer.promise;
        }

        function _startLoading(fnPromise, callback) {
            var defer = $q.defer();
            if (angular.isFunction(fnPromise)) {
                _loadedPromise = fnPromise();
            } else {
                _loadedPromise = fnPromise;
            }
            _loadedPromise.then(function(result) {
                var data = result;
                // In case the data is nested in an object
                if (renderer.options.sAjaxDataProp) {
                    var properties = renderer.options.sAjaxDataProp.split('.');
                    while (properties.length) {
                        var property = properties.shift();
                        if (property in data) {
                            data = data[property];
                        }
                    }
                }
                _loadedPromise = null;
                defer.resolve(_doRender(renderer.options, _$elem, data, callback));
            });
            return defer.promise;
        }

        function _doRender(options, $elem, data, callback) {
            var defer = $q.defer();
            // Since Angular 1.3, the promise renderer is throwing "Maximum call stack size exceeded"
            // By removing the $promise attribute, we avoid an infinite loop when jquery is cloning the data
            // See https://github.com/l-lin/angular-datatables/issues/110
            delete data.$promise;
            options.aaData = data;
            // Add $timeout to be sure that angular has finished rendering before calling datatables
            $timeout(function() {
                DTRendererService.hideLoading($elem);
                // Set it to true in order to be able to redraw the dataTable
                options.bDestroy = true;
                defer.resolve(callback($elem, options));
            }, 0, false);
            return defer.promise;
        }

        function _redrawRows($elem, options) {
            _oTable.clear();
            _oTable.rows.add(options.aaData).draw(options.redraw);
            return {
                id: dtInstance.id,
                DataTable: dtInstance.DataTable,
                dataTable: dtInstance.dataTable
            };
        }
    }
}

/* @ngInject */
function dtAjaxRenderer($q, $timeout, DTRenderer, DTRendererService, DT_DEFAULT_OPTIONS, DTInstanceFactory) {
    /**
     * Renderer for displaying with Ajax
     * @param options the options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _$elem;
        var _$scope;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTAjaxRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem, $scope) {
            _$elem = $elem;
            _$scope = $scope;
            var defer = $q.defer();
            var dtInstance = DTInstanceFactory.newDTInstance(renderer);
            // Define default values in case it is an ajax datatables
            if (angular.isUndefined(renderer.options.sAjaxDataProp)) {
                renderer.options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
            }
            if (angular.isUndefined(renderer.options.aoColumns)) {
                renderer.options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
            }
            _doRender(renderer.options, $elem).then(function(result) {
                _oTable = result.DataTable;
                DTInstanceFactory.copyDTProperties(result, dtInstance);
                defer.resolve(dtInstance);
            });
            return defer.promise;
        }

        function reloadData(callback, resetPaging) {
            if (_oTable) {
                _oTable.ajax.reload(callback, resetPaging);
            }
        }

        function changeData(ajax) {
            renderer.options.ajax = ajax;
            // We also need to set the $scope.dtOptions, otherwise, when we change the columns, it will revert to the old data
            // See https://github.com/l-lin/angular-datatables/issues/359
            _$scope.dtOptions.ajax = ajax;
        }

        function rerender() {
            // Ensure that prerender is called after loadData from promise
            // See https://github.com/l-lin/angular-datatables/issues/563
            DTRendererService.preRender(options);
            render(_$elem, _$scope);
        }

        function _doRender(options, $elem) {
                var defer = $q.defer();
                // Destroy the table if it exists in order to be able to redraw the dataTable
                options.bDestroy = true;
                if (_oTable) {
                    _oTable.destroy();
                    DTRendererService.showLoading(_$elem, _$scope);
                    // Empty in case of columns change
                    $elem.empty();
                }
                DTRendererService.hideLoading($elem);
                // Condition to refresh the dataTable
                if (_shouldDeferRender(options)) {
                    $timeout(function() {
                        defer.resolve(DTRendererService.renderDataTable($elem, options));
                    }, 0, false);
                } else {
                    defer.resolve(DTRendererService.renderDataTable($elem, options));
                }
                return defer.promise;
            }
            // See https://github.com/l-lin/angular-datatables/issues/147
        function _shouldDeferRender(options) {
            if (angular.isDefined(options) && angular.isDefined(options.dom)) {
                // S for scroller plugin
                return options.dom.indexOf('S') >= 0;
            }
            return false;
        }
    }
}

/* @ngInject */
function dtRendererFactory(DTDefaultRenderer, DTNGRenderer, DTPromiseRenderer, DTAjaxRenderer) {
    return {
        fromOptions: fromOptions
    };

    function fromOptions(options, isNgDisplay) {
        if (isNgDisplay) {
            if (options && options.serverSide) {
                throw new Error('You cannot use server side processing along with the Angular renderer!');
            }
            return DTNGRenderer.create(options);
        }
        if (angular.isDefined(options)) {
            if (angular.isDefined(options.fnPromise) && options.fnPromise !== null) {
                if (options.serverSide) {
                    throw new Error('You cannot use server side processing along with the Promise renderer!');
                }
                return DTPromiseRenderer.create(options);
            }
            if (angular.isDefined(options.ajax) && options.ajax !== null ||
                angular.isDefined(options.ajax) && options.ajax !== null) {
                return DTAjaxRenderer.create(options);
            }
            return DTDefaultRenderer.create(options);
        }
        return DTDefaultRenderer.create();
    }
}
