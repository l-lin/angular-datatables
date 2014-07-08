(function(angular) {
    'use strict';

    angular.module('datatables.directive', []).
    constant('DT_DEFAULT_OPTIONS', {
        sAjaxDataProp: '',
        aoColumns: []
    }).
    directive('datatable', function(DT_DEFAULT_OPTIONS, $timeout, DT_LAST_ROW_KEY) {
        var $loading = angular.element('<h3>Loading...</h3>');
        var _showLoading = function ($elem) {
            $elem.after($loading);
            $elem.hide();
        };
        var _hideLoading = function ($elem) {
            $elem.show();
            $loading.hide();
        };
        var _doRenderDataTable = function($elem, options) {
            // Add $timeout to be sure that angular has finished rendering before calling datatables
            $timeout(function() {
                _hideLoading($elem);
                $elem.DataTable(options);
            }, 0, false);
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
                    if (angular.isDefined(options.fnPromise)) {
                        return new PromiseRenderer(options);
                    }
                    if (angular.isDefined(options.sAjaxSource)) {
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
                    _doRenderDataTable($elem, this.options);
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
                    var _this = this;
                    $scope.$on(DT_LAST_ROW_KEY, function () {
                        _doRenderDataTable($elem, _this.options);
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
            var _render = function (options, $elem, data) {
                options.aaData = data;
                // Add $timeout to be sure that angular has finished rendering before calling datatables
                $timeout(function () {
                    _hideLoading($elem);
                    // Set it to true in order to be able to redraw the dataTable
                    options.bDestroy = true;
                    // Condition to refresh the dataTable
                    if (oTable) {
                        oTable.fnClearTable();
                        oTable.fnDraw();
                        oTable.fnAddData(options.aaData);
                    } else {
                        oTable = $elem.DataTable(options);
                    }
                }, 0, false);
            };
            return {
                options: options,
                render: function ($scope, $elem) {
                    var _this = this;
                    var _loadedPromise = null;
                    var _whenLoaded = function (data) {
                        _render(_this.options, $elem, data);
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
                            throw new Error('You must provide a function that returns a promise!');
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
            var _render = function (options, $elem) {
                // Set it to true in order to be able to redraw the dataTable
                options.bDestroy = true;
                // Add $timeout to be sure that angular has finished rendering before calling datatables
                $timeout(function () {
                    _hideLoading($elem);
                    // Condition to refresh the dataTable
                    if (oTable) {
                        if (angular.isDefined(oTable.fnReloadAjax) && angular.isFunction(oTable.fnReloadAjax)) {
                            // Reload Ajax data using the plugin "fnReloadAjax": https://next.datatables.net/plug-ins/api/fnReloadAjax
                            // For DataTable v1.9.4
                            oTable.fnReloadAjax(options.sAjaxSource);
                        } else if (angular.isDefined(oTable.ajax) && angular.isFunction(oTable.ajax.load)) {
                            // For DataTable v1.10+, DT provides methods https://datatables.net/reference/api/ajax.url()
                            oTable.ajax.url(options.sAjaxSource).load();
                        } else {
                            throw new Error('Reload Ajax not supported. Please use the plugin "fnReloadAjax" (https://next.datatables.net/plug-ins/api/fnReloadAjax) or use a more recent version of DataTables (v1.10+)');
                        }
                    } else {
                        oTable = $elem.DataTable(options);
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
                        _this.options.sAjaxSource = sAjaxSource;
                        _this.options.ajax = sAjaxSource;
                        _render(options, $elem);
                    });
                    $scope.$watch('dtOptions.reload', function (reload) {
                        if (reload) {
                            $scope.dtOptions.reload = false;
                            _render(options, $elem);
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
                }
                // Render dataTable
                RendererFactory.fromOptions(options, isNgDisplay).render($scope, $elem);
            }
        };
    }).
    directive('dtRows', function ($rootScope, DT_LAST_ROW_KEY) {
        return {
            restrict: 'A',
            link: function($scope) {
                if ($scope.$last === true) {
                    $rootScope.$broadcast(DT_LAST_ROW_KEY);
                }
            }
        };
    });
})(angular);
