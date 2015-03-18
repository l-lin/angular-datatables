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
    var $loading = angular.element(DTLoadingTemplate.html);
    var plugins = [];
    var rendererService = {
        getLoadingElem: getLoadingElem,
        showLoading: showLoading,
        hideLoading: hideLoading,
        renderDataTable: renderDataTable,
        hideLoadingAndRenderDataTable: hideLoadingAndRenderDataTable,
        registerPlugin: registerPlugin,
        postRender: postRender,
        preRender: preRender
    };
    return rendererService;

    function getLoadingElem() {
        return $loading;
    }

    function showLoading($elem) {
        $elem.after($loading);
        $elem.hide();
        $loading.show();
    }

    function hideLoading($elem) {
        $elem.show();
        $loading.hide();
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
function dtDefaultRenderer($q, DTRenderer, DTRendererService, DTInstanceFactory, DTInstances) {
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _$elem;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTDefaultRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;

        function render($elem) {
            _$elem = $elem;
            var dtInstance = DTInstanceFactory.newDTInstance(renderer);
            var result = DTRendererService.hideLoadingAndRenderDataTable($elem, renderer.options);
            _oTable = result.DataTable;
            return $q.when(DTInstances.register(dtInstance, result));
        }

        function reloadData() {
            // Do nothing
        }

        function changeData() {
            // Do nothing
        }

        function rerender() {
            _oTable.destroy();
            DTRendererService.showLoading(_$elem);
            render(_$elem);
        }
        return renderer;
    }
}

/* @ngInject */
function dtNGRenderer($log, $q, $compile, $timeout, DTRenderer, DTRendererService, DTInstances, DTInstanceFactory) {
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
            var _expression = $elem.find('tbody').html();
            // Find the resources from the comment <!-- ngRepeat: item in items --> displayed by angular in the DOM
            // This regexp is inspired by the one used in the "ngRepeat" directive
            var _match = _expression.match(/^\s*.+?\s+in\s+(\S*)\s*/m);

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
                    var result = DTRendererService.hideLoadingAndRenderDataTable(_$elem, renderer.options);
                    _oTable = result.DataTable;
                    defer.resolve(DTInstances.register(dtInstance, result));
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
            DTRendererService.showLoading(_$elem);
            $timeout(function() {
                var result = DTRendererService.hideLoadingAndRenderDataTable(_$elem, renderer.options);
                _oTable = result.DataTable;
                dtInstance = DTInstances.register(dtInstance, result);
            }, 0, false);
        }

        function _destroyAndCompile() {
            _oTable.ngDestroy();
            // Re-compile because we lost the angular binding to the existing data
            _$elem.html(_staticHTML);
            $compile(_$elem.contents())(_parentScope);
        }
    }
}

/* @ngInject */
function dtPromiseRenderer($q, $timeout, $log, DTRenderer, DTRendererService, DTInstances, DTInstanceFactory) {
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

        var dtInstance;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTPromiseRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem) {
            var defer = $q.defer();
            dtInstance = DTInstanceFactory.newDTInstance(renderer);
            _$elem = $elem;
            _resolve(renderer.options.fnPromise, DTRendererService.renderDataTable).then(function(result) {
                _oTable = result.DataTable;
                defer.resolve(DTInstances.register(dtInstance, result));
            });
            return defer.promise;
        }

        function reloadData() {
            if (angular.isFunction(renderer.options.fnPromise)) {
                _resolve(renderer.options.fnPromise, _redrawRows);
            } else {
                $log.warn('In order to use the reloadData functionality with a Promise renderer, you need to provide a function that returns a promise.');
            }
        }

        function changeData(fnPromise) {
            renderer.options.fnPromise = fnPromise;
            _resolve(renderer.options.fnPromise, _redrawRows);
        }

        function rerender() {
            _oTable.destroy();
            DTRendererService.showLoading(_$elem);
            render(_$elem);
        }

        function _resolve(fnPromise, callback) {
            var defer = $q.defer();
            if (angular.isUndefined(fnPromise)) {
                throw new Error('You must provide a promise or a function that returns a promise!');
            }
            if (_loadedPromise) {
                _loadedPromise.then(function()  {
                    defer.resolve(_startLoading(fnPromise, callback));
                });
            } else  {
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

        function _redrawRows() {
            _oTable.clear();
            _oTable.rows.add(options.aaData).draw();
            return {
                id: dtInstance.id,
                DataTable: dtInstance.DataTable,
                dataTable: dtInstance.dataTable
            };
        }
    }
}

/* @ngInject */
function dtAjaxRenderer($q, $timeout, DTRenderer, DTRendererService, DT_DEFAULT_OPTIONS, DTInstances, DTInstanceFactory) {
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
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTAjaxRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem) {
            _$elem = $elem;
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
                defer.resolve(DTInstances.register(dtInstance, result));
            });
            return defer.promise;
        }

        function reloadData() {
            if (_oTable) {
                var ajaxUrl = renderer.options.ajax.url ||  renderer.options.ajax;
                _oTable.ajax.url(ajaxUrl).load();
            }
        }

        function changeData(ajax) {
            renderer.options.ajax = ajax;
            renderer.reloadData();
        }

        function rerender() {
            _oTable.destroy();
            DTRendererService.showLoading(_$elem);
            render(_$elem);
        }

        function _doRender(options, $elem) {
                var defer = $q.defer();
                // Set it to true in order to be able to redraw the dataTable
                options.bDestroy = true;
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

    function fromOptions(options, isNgDisplay)  {
        if (isNgDisplay) {
            return DTNGRenderer.create(options);
        }
        if (angular.isDefined(options)) {
            if (angular.isDefined(options.fnPromise) && options.fnPromise !== null) {
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
