'use strict';
angular.module('datatables.renderer', ['datatables.factory', 'datatables.options'])
.factory('DTRendererService', function(DTLoadingTemplate) {
    var $loading = angular.element(DTLoadingTemplate.html);
    return {
        getLoadingElem: function() {
            return $loading;
        },
        showLoading: function ($elem) {
            $elem.after($loading);
            $elem.hide();
            $loading.show();
        },
        hideLoading: function ($elem) {
            $elem.show();
            $loading.hide();
        },
        renderDataTableAndEmitEvent: function ($elem, options, $scope) {
            var dtId = '#' + $elem.attr('id');
            if ($.fn.dataTable.isDataTable(dtId)) {
                options.destroy = true;
            }
            var oTable = $elem.DataTable(options);
            // See http://datatables.net/manual/api#Accessing-the-API to understand the difference between DataTable and dataTable
            $scope.$emit('event:dataTableLoaded', { id: $elem.attr('id'), DataTable: oTable, dataTable: $elem.dataTable() });
            return oTable;
        },
        doRenderDataTable: function($elem, options, $scope) {
            this.hideLoading($elem);
            return this.renderDataTableAndEmitEvent($elem, options, $scope);
        }
    };
})
.factory('DTRenderer', function() {
    return {
        withOptions: function (options) {
            this.options = options;
            return this;
        }
    };
})
.factory('DTDefaultRenderer', function($timeout, DTRenderer, DTRendererService) {
    /**
     * Default renderer without any server call
     * @constructor
     */
    return {
        create: function (options) {
            var renderer = Object.create(DTRenderer);
            renderer.name = 'DTDefaultRenderer';
            renderer.options = options;
            renderer.render = function ($scope, $elem) {
                var _this = this;
                // Add $timeout to be sure that angular has finished rendering before calling datatables
                $timeout(function() {
                    DTRendererService.doRenderDataTable($elem, _this.options, $scope);
                }, 0, false);
                return _this;
            };
            return renderer;
        }
    };
})
.factory('DTNGRenderer', function($compile, $timeout, DTRenderer, DTRendererService) {
    /**
     * Renderer for displaying the Angular way
     * @param options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: function (options) {
            var renderer = Object.create(DTRenderer);
            renderer.name = 'DTNGRenderer';
            renderer.options = options;
            renderer.render = function ($scope, $elem, staticHTML) {
                var _this = this,
                    expression = $elem.find('tbody').html(),
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
                        oTable = DTRendererService.doRenderDataTable($elem, _this.options, $scope);
                    }, 0, false);
                }, true);
                return _this;
            };
            return renderer;
        }
    };
})
.factory('DTPromiseRenderer', function($timeout, DTRenderer, DTRendererService) {
    /**
     * Renderer for displaying with a promise
     * @param options the options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: function (options) {
            var oTable,
                // Reloading data call the "render()" function again, so it
                // might $watch again. So this flag is here to prevent that!
                _watcherInitialized = false,
                _render = function (options, $elem, data, $scope) {
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
                            oTable = DTRendererService.renderDataTableAndEmitEvent($elem, options, $scope);
                        }
                    }, 0, false);
                };

            var renderer = Object.create(DTRenderer);
            renderer.name = 'DTPromiseRenderer';
            renderer.options = options;
            renderer.render = function ($scope, $elem) {
                var _this = this,
                    _loadedPromise = null,
                    _whenLoaded = function (data) {
                        _render(_this.options, $elem, data, $scope);
                        _loadedPromise = null;
                    }, _startLoading = function (fnPromise) {
                        if(angular.isFunction(fnPromise)){
                            _loadedPromise = fnPromise();
                        } else {
                            _loadedPromise = fnPromise;
                        }
                        _loadedPromise.then(_whenLoaded);
                    }, _reload = function (fnPromise) {
                        if (angular.isDefined(fnPromise)) {
                            if (_loadedPromise) {
                                _loadedPromise.then(function() {
                                    _startLoading(fnPromise);
                                });
                            } else {
                                _startLoading(fnPromise);
                            }
                        } else {
                            throw new Error('You must provide a promise or a function that returns a promise!');
                        }
                    };
                if (!_watcherInitialized) {
                    $scope.$watch('dtOptions.fnPromise', function (fnPromise, oldPromise) {
                        if (fnPromise !== oldPromise) {
                            _reload(fnPromise);
                        }
                    });
                    _watcherInitialized = true;
                }
                _reload($scope.dtOptions.fnPromise);
                return _this;
            };
            return renderer;
        }
    };
})
.factory('DTAjaxRenderer', function($timeout, DTRenderer, DTRendererService, DT_DEFAULT_OPTIONS) {
    /**
     * Renderer for displaying with Ajax
     * @param options the options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: function (options) {
            var oTable,
                _setOptionsAndRender = function(options, sAjaxSource, $elem, $scope) {
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
                    _render(options, $elem, $scope);
                },
                _render = function (options, $elem, $scope) {
                    // Set it to true in order to be able to redraw the dataTable
                    options.bDestroy = true;
                    // Add $timeout to be sure that angular has finished rendering before calling datatables
                    $timeout(function () {
                        DTRendererService.hideLoading($elem);
                        // Condition to refresh the dataTable
                        if (oTable) {
                            var ajaxUrl = options.sAjaxSource || options.ajax.url || options.ajax;
                            oTable.ajax.url(ajaxUrl).load();
                        } else {
                            oTable = DTRendererService.renderDataTableAndEmitEvent($elem, options, $scope);
                        }
                    }, 0, false);
                };
            var renderer = Object.create(DTRenderer);
            renderer.name = 'DTAjaxRenderer';
            renderer.options = options;
            renderer.render = function ($scope, $elem) {
                var _this = this;
                // Define default values in case it is an ajax datatables
                if (angular.isUndefined(_this.options.sAjaxDataProp)) {
                    _this.options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
                }
                if (angular.isUndefined(_this.options.aoColumns)) {
                    _this.options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
                }
                _setOptionsAndRender(_this.options, _this.options.sAjaxSource, $elem, $scope);
                return this;
            };
            return renderer;
        }
    };
})
.factory('DTRendererFactory', function(DTDefaultRenderer, DTNGRenderer, DTPromiseRenderer, DTAjaxRenderer) {
    return {
        fromOptions: function(options, isNgDisplay) {
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
    };
});
