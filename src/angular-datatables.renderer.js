'use strict';
angular.module('datatables.renderer', ['datatables.factory', 'datatables.options', 'datatables.instances'])
.factory('DTRendererService', dtRendererService)
.factory('DTRenderer', dtRenderer)
.factory('DTDefaultRenderer', dtDefaultRenderer)
.factory('DTNGRenderer', dtNGRenderer)
.factory('DTPromiseRenderer', dtPromiseRenderer)
.factory('DTAjaxRenderer', dtAjaxRenderer)
.factory('DTRendererFactory', dtRendererFactory);

/* @ngInject */
function dtRendererService(DTLoadingTemplate, DTInstances) {
    var $loading = angular.element(DTLoadingTemplate.html);
    var rendererService = {
        getLoadingElem: getLoadingElem,
        showLoading: showLoading,
        hideLoading: hideLoading,
        renderDataTableAndRegisterInstance: renderDataTableAndRegisterInstance,
        doRenderDataTable: doRenderDataTable
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
    function renderDataTableAndRegisterInstance($elem, options, dtInstance) {
        var dtId = '#' + $elem.attr('id');
        if ($.fn.dataTable.isDataTable(dtId)) {
            options.destroy = true;
        }
        // See http://datatables.net/manual/api#Accessing-the-API to understand the difference between DataTable and dataTable
        var DT = $elem.DataTable(options);
        var dt = $elem.dataTable();

        dtInstance.id = $elem.attr('id');
        dtInstance.DataTable = DT;
        dtInstance.dataTable = dt;
        DTInstances.register(dtInstance);

        if (options && options.hasColumnFilter) {
            dt.columnFilter(options.columnFilterOptions);
        }
        return DT;
    }
    function doRenderDataTable($elem, options, dtInstance) {
        rendererService.hideLoading($elem);
        return rendererService.renderDataTableAndRegisterInstance($elem, options, dtInstance);
    }
}

function dtRenderer() {
    return {
        withOptions: function (options) {
            this.options = options;
            return this;
        }
    };
}

 /* @ngInject */
function dtDefaultRenderer(DTRenderer, DTRendererService) {
    return {
        create: create
    };

    function create(options) {
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTDefaultRenderer';
        renderer.options = options;
        renderer.render = function ($scope, $elem, dtInstance) {
            DTRendererService.doRenderDataTable($elem, this.options, dtInstance);
            return this;
        };
        return renderer;
    }
}

/* @ngInject */
function dtNGRenderer($compile, $timeout, DTRenderer, DTRendererService) {
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
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTNGRenderer';
        renderer.options = options;
        renderer.render = render;
        return renderer;

        function render($scope, $elem, dtInstance, staticHTML) {
            var expression = $elem.find('tbody').html(),
                // Find the resources from the comment <!-- ngRepeat: item in items --> displayed by angular in the DOM
                // This regexp is inspired by the one used in the "ngRepeat" directive
                match = expression.match(/^\s*.+?\s+in\s+(\S*)\s*/),
                ngRepeatAttr = match[1];

            if (!match) {
                throw new Error('Expected expression in form of "_item_ in _collection_[ track by _id_]" but got "{0}".', expression);
            }

            var oTable,
                alreadyRendered = false,
                parentScope = $scope.$parent;

            parentScope.$watchCollection(ngRepeatAttr, function () {
                if (oTable && alreadyRendered) {
                    oTable.ngDestroy();
                    // Re-compile because we lost the angular binding to the existing data
                    $elem.html(staticHTML);
                    $compile($elem.contents())(parentScope);
                }
                $timeout(function() {
                    alreadyRendered = true;
                    oTable = DTRendererService.doRenderDataTable($elem, renderer.options, dtInstance);
                }, 0, false);
            }, true);
            return renderer;
        }
    }
}

/* @ngInject */
function dtPromiseRenderer($timeout, DTRenderer, DTRendererService) {
    /**
     * Renderer for displaying with a promise
     * @param options the options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: create
    };

    function create (options) {
        var oTable;
        // Reloading data call the "render()" function again, so it
        // might $watch again. So this flag is here to prevent that!
        var _watcherInitialized = false;
        var _loadedPromise = null;

        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTPromiseRenderer';
        renderer.options = options;
        renderer.render = render;
        return renderer;

        function render($scope, $elem, dtInstance) {
            if (!_watcherInitialized) {
                $scope.$watch('dtOptions.fnPromise', function (fnPromise, oldPromise) {
                    if (fnPromise !== oldPromise) {
                        _reload(fnPromise);
                    }
                });
                _watcherInitialized = true;
            }
            _reload(renderer.options.fnPromise);
            return renderer;

            function _reload(fnPromise) {
                if (angular.isUndefined(fnPromise)) {
                    throw new Error('You must provide a promise or a function that returns a promise!');
                }
                if (_loadedPromise) {
                    _loadedPromise.then(function() {
                        _startLoading(fnPromise);
                    });
                } else {
                    _startLoading(fnPromise);
                }
            }
            function _startLoading(fnPromise) {
                if(angular.isFunction(fnPromise)){
                    _loadedPromise = fnPromise();
                } else {
                    _loadedPromise = fnPromise;
                }
                _loadedPromise.then(_whenLoaded);
            }
            function _whenLoaded(result) {
                var data = result;
                // In case the data is nested in an object
                if (renderer.options.sAjaxDataProp) {
                    data = result[renderer.options.sAjaxDataProp];
                }
                _doRender(renderer.options, $elem, data, dtInstance);
                _loadedPromise = null;
            }
            function _doRender(options, $elem, data, dtInstance) {
                // Since Angular 1.3, the promise renderer is throwing "Maximum call stack size exceeded"
                // By removing the $promise attribute, we avoid an infinite loop when jquery is cloning the data
                // See https://github.com/l-lin/angular-datatables/issues/110
                delete data.$promise;
                options.aaData = data;
                // Add $timeout to be sure that angular has finished rendering before calling datatables
                $timeout(function () {
                    DTRendererService.hideLoading($elem);
                    // Set it to true in order to be able to redraw the dataTable
                    options.bDestroy = true;
                    // Condition to refresh the dataTable
                    if (oTable) {
                        oTable.clear();
                        oTable.rows.add(options.aaData).draw();
                    } else {
                        oTable = DTRendererService.renderDataTableAndRegisterInstance($elem, options, dtInstance);
                    }
                }, 0, false);
            }
        }
    }
}

/* @ngInject */
function dtAjaxRenderer($timeout, DTRenderer, DTRendererService, DT_DEFAULT_OPTIONS) {
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
        var oTable;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTAjaxRenderer';
        renderer.options = options;
        renderer.render = render;
        return renderer;

        function render($scope, $elem, dtInstance) {
            // Define default values in case it is an ajax datatables
            if (angular.isUndefined(renderer.options.sAjaxDataProp)) {
                renderer.options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
            }
            if (angular.isUndefined(renderer.options.aoColumns)) {
                renderer.options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
            }
            _setOptionsAndRender(renderer.options, renderer.options.sAjaxSource, $elem, dtInstance);
            return renderer;
        }
        function _setOptionsAndRender(options, sAjaxSource, $elem, dtInstance) {
            if (angular.isDefined(sAjaxSource)) {
                options.sAjaxSource = sAjaxSource;
                if (angular.isDefined(options.ajax)) {
                    if (angular.isObject(options.ajax)) {
                        options.ajax.url = sAjaxSource;
                    } else {
                        options.ajax = {url: sAjaxSource};
                    }
                }
            }
            _doRender(options, $elem, dtInstance);
        }
        function _doRender(options, $elem, dtInstance) {
            // Set it to true in order to be able to redraw the dataTable
            options.bDestroy = true;
            DTRendererService.hideLoading($elem);
            // Condition to refresh the dataTable
            if (oTable) {
                var ajaxUrl = options.sAjaxSource || options.ajax.url || options.ajax;
                oTable.ajax.url(ajaxUrl).load();
            } else {
                if (_shouldDeferRender(options)) {
                    $timeout(function () {
                        oTable = DTRendererService.renderDataTableAndRegisterInstance($elem, options, dtInstance);
                    }, 0, false);
                } else {
                    oTable = DTRendererService.renderDataTableAndRegisterInstance($elem, options, dtInstance);
                }
            }
        }
        // See https://github.com/l-lin/angular-datatables/issues/147
        function _shouldDeferRender(options) {
            if (angular.isDefined(options) && angular.isDefined(options.sDom)) {
                // S for scroller plugin
                return options.sDom.indexOf('S') >= 0;
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

    function fromOptions(options, isNgDisplay) {
        if (isNgDisplay) {
            return DTNGRenderer.create(options);
        }
        if (angular.isDefined(options)) {
            if (angular.isDefined(options.fnPromise) && options.fnPromise !== null) {
                return DTPromiseRenderer.create(options);
            }
            if (angular.isDefined(options.sAjaxSource) && options.sAjaxSource !== null ||
                angular.isDefined(options.ajax) && options.ajax !== null) {
                return DTAjaxRenderer.create(options);
            }
            return DTDefaultRenderer.create(options);
        }
        return DTDefaultRenderer.create();
    }
}
