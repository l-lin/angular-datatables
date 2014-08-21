(function(angular) {
    'use strict';

    angular.module('datatables.directive', ['datatables.options', 'datatables.util']).
    directive('datatable', function(DT_DEFAULT_OPTIONS, $timeout, $DTBootstrap, DTLoadingTemplate, $DTPropertyUtil) {
        var $loading = angular.element(DTLoadingTemplate.html),
            _showLoading = function ($elem) {
                $elem.after($loading);
                $elem.hide();
            },
            _hideLoading = function ($elem) {
                $elem.show();
                $loading.hide();
            }, _renderDataTableAndEmitEvent = function ($elem, options, $scope) {
                var oTable = $elem.DataTable(options);
                $scope.$emit('event:dataTableLoaded', { id: $elem.attr('id') });
                return oTable;
            }, _doRenderDataTable = function($elem, options, $scope) {
                // Add $timeout to be sure that angular has finished rendering before calling datatables
                $timeout(function() {
                    _hideLoading($elem);
                    _renderDataTableAndEmitEvent($elem, options, $scope);
                }, 0, false);
            },
            /**
             * Check if the given table is a using DataTable version 1.9.4
             * @param oTable the datatable
             * @private
             */
            _isDTOldVersion = function(oTable) {
                return angular.isDefined(oTable) && angular.isFunction(oTable.fnClearTable);
            },
            _hasReloadAjaxPlugin = function(oTable) {
                return angular.isDefined(oTable.fnReloadAjax) && angular.isFunction(oTable.fnReloadAjax);
            };

        /**
         * Factory that build a renderer given the options
         */
        var RendererFactory = {
            fromOptions: function(options, isNgDisplay) {
                if (isNgDisplay) {
                    return new NGRenderer(options);
                }
                if (angular.isDefined(options)) {
                    if (angular.isDefined(options.fnPromise) && options.fnPromise !== null) {
                        return new PromiseRenderer(options);
                    }
                    if (angular.isDefined(options.sAjaxSource) && options.sAjaxSource !== null ||
                        angular.isDefined(options.ajax) && options.ajax !== null) {
                        return new AjaxRenderer(options);
                    }
                    return new DefaultRenderer(options);
                }
                return new DefaultRenderer();
            }
        };

        /**
         * Default renderer without any server call
         * @constructor
         */
        var DefaultRenderer = function(options) {
            return {
                options: options,
                render: function ($scope, $elem) {
                    _doRenderDataTable($elem, this.options, $scope);
                }
            };
        };

        /**
         * Renderer for displaying the Angular way
         * @param options
         * @returns {{options: *}} the renderer
         * @constructor
         */
        var NGRenderer = function(options) {
            return {
                options: options,
                render: function ($scope, $elem) {
                    var _this = this,
                        parentScope = $scope.$parent,
                        dataProp = $DTPropertyUtil.findDataPropFromScope(parentScope);
                    if (parentScope[dataProp].length === 0) {
                        _doRenderDataTable($elem, _this.options, $scope);
                    }
                    $scope.$on(DT_DEFAULT_OPTIONS.lastRowKey, function () {
                        _doRenderDataTable($elem, _this.options, $scope);
                    });
                }
            };
        };

        /**
         * Renderer for displaying with a promise
         * @param options the options
         * @returns {{options: *}} the renderer
         * @constructor
         */
        var PromiseRenderer = function(options) {
            var oTable;
            var _render = function (options, $elem, data, $scope) {
                options.aaData = data;
                // Add $timeout to be sure that angular has finished rendering before calling datatables
                $timeout(function () {
                    _hideLoading($elem);
                    // Set it to true in order to be able to redraw the dataTable
                    options.bDestroy = true;
                    // Condition to refresh the dataTable
                    if (oTable) {
                        if (_isDTOldVersion(oTable)) {
                            oTable.fnClearTable();
                            oTable.fnDraw();
                            oTable.fnAddData(options.aaData);
                        } else {
                            oTable.clear();
                            oTable.rows.add(options.aaData).draw();
                        }
                    } else {
                        oTable = _renderDataTableAndEmitEvent($elem, options, $scope);
                    }
                }, 0, false);
            };
            return {
                options: options,
                render: function ($scope, $elem) {
                    var _this = this;
                    var _loadedPromise = null;
                    var _whenLoaded = function (data) {
                        _render(_this.options, $elem, data, $scope);
                        _loadedPromise = null;
                    };
                    var _startLoading = function (fnPromise) {
                        if(angular.isFunction(fnPromise)){
                            _loadedPromise = fnPromise();
                        } else {
                            _loadedPromise = fnPromise;
                        }
                        _showLoading($elem);
                        _loadedPromise.then(_whenLoaded);
                    };
                    var _reload = function (fnPromise) {
                        if (_loadedPromise) {
                            _loadedPromise.then(function() {
                                _startLoading(fnPromise);
                            });
                        } else {
                            _startLoading(fnPromise);
                        }
                    };
                    $scope.$watch('dtOptions.fnPromise', function (fnPromise) {
                        if (angular.isDefined(fnPromise)) {
                            _reload(fnPromise);
                        } else {
                            throw new Error('You must provide a promise or a function that returns a promise!');
                        }
                    });
                    $scope.$watch('dtOptions.reload', function (reload) {
                        if (reload) {
                            $scope.dtOptions.reload = false;
                            _reload($scope.dtOptions.fnPromise);
                        }
                    });
                }
            };
        };

        /**
         * Renderer for displaying with Ajax
         * @param options the options
         * @returns {{options: *}} the renderer
         * @constructor
         */
        var AjaxRenderer = function (options) {
            var oTable;
            var _render = function (options, $elem, $scope) {
                // Set it to true in order to be able to redraw the dataTable
                options.bDestroy = true;
                // Add $timeout to be sure that angular has finished rendering before calling datatables
                $timeout(function () {
                    _hideLoading($elem);
                    // Condition to refresh the dataTable
                    if (oTable) {
                        if (_hasReloadAjaxPlugin(oTable)) {
                            // Reload Ajax data using the plugin "fnReloadAjax": https://next.datatables.net/plug-ins/api/fnReloadAjax
                            // For DataTable v1.9.4
                            oTable.fnReloadAjax(options.sAjaxSource);
                        } else if (!_isDTOldVersion(oTable)) {
                            // For DataTable v1.10+, DT provides methods https://datatables.net/reference/api/ajax.url()
                            var ajaxUrl = options.sAjaxSource || options.ajax.url || options.ajax;
                            oTable.ajax.url(ajaxUrl).load();
                        } else {
                            throw new Error('Reload Ajax not supported. Please use the plugin "fnReloadAjax" (https://next.datatables.net/plug-ins/api/fnReloadAjax) or use a more recent version of DataTables (v1.10+)');
                        }
                    } else {
                        oTable = _renderDataTableAndEmitEvent($elem, options, $scope);
                    }
                }, 0, false);
            };
            return {
                options: options,
                render: function ($scope, $elem) {
                    var _this = this;
                    // Define default values in case it is an ajax datatables
                    if (angular.isUndefined(_this.options.sAjaxDataProp)) {
                        _this.options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
                    }
                    if (angular.isUndefined(_this.options.aoColumns)) {
                        _this.options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
                    }
                    $scope.$watch('dtOptions.sAjaxSource', function (sAjaxSource) {
                        if (angular.isDefined(sAjaxSource)) {
                            _this.options.sAjaxSource = sAjaxSource;
                            if (angular.isDefined(_this.options.ajax)) {
                                if (angular.isObject(_this.options.ajax)) {
                                    _this.options.ajax.url = sAjaxSource;
                                } else {
                                    _this.options.ajax = {url: sAjaxSource};
                                }
                            }
                        }
                        _render(options, $elem, $scope);
                    });
                    $scope.$watch('dtOptions.reload', function (reload) {
                        if (reload) {
                            $scope.dtOptions.reload = false;
                            _render(options, $elem, $scope);
                        }
                    });
                }
            };
        };

        return {
            restrict: 'A',
            scope: {
                dtOptions: '=',
                dtColumns: '=',
                dtColumnDefs: '=',
                datatable: '@'
            },
            link: function($scope, $elem) {
                _showLoading($elem);

                // Build options
                var isNgDisplay = $scope.datatable && $scope.datatable === 'ng',
                    options;
                if (angular.isDefined($scope.dtOptions)) {
                    options = {};
                    angular.extend(options, $scope.dtOptions);
                    // Set the columns
                    if (angular.isArray($scope.dtColumns)) {
                        options.aoColumns = $scope.dtColumns;
                    }
                    // Set the column defs
                    if (angular.isArray($scope.dtColumnDefs)) {
                        options.aoColumnDefs = $scope.dtColumnDefs;
                    }
                    // Integrate bootstrap (or not)
                    if (options.integrateBootstrap) {
                        $DTBootstrap.integrate(options);
                    } else {
                        $DTBootstrap.deIntegrate();
                    }
                }
                // Render dataTable
                RendererFactory.fromOptions(options, isNgDisplay).render($scope, $elem);
            }
        };
    }).
    directive('dtRows', function ($rootScope, DT_DEFAULT_OPTIONS) {
        return {
            restrict: 'A',
            link: function($scope) {
                if ($scope.$last === true) {
                    $rootScope.$broadcast(DT_DEFAULT_OPTIONS.lastRowKey);
                }
            }
        };
    });
})(angular);
