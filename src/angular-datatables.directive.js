(function(angular) {
    'use strict';

    angular.module('datatables.directive', []).
    constant('DT_DEFAULT_OPTIONS', {
        sAjaxDataProp: '',
        aoColumns: []
    }).
    directive('datatable', function(DT_DEFAULT_OPTIONS, $timeout, DT_LAST_ROW_KEY) {
        var $loading = angular.element('<h3>Loading...</h3>');
        var _doRenderDataTable = function($elem, options) {
            // Add $timeout to be sure that angular has finished rendering before calling datatables
            $timeout(function() {
                // Show datatable & hide loading
                $elem.show();
                $loading.hide();
                // Condition to refresh the dataTable
                $elem.dataTable(options);
            }, 0, false);
        };
        var RendererFactory = {
            fromOptions: function(options, isNgDisplay) {
                if (isNgDisplay) {
                    return new NGRenderer(options);
                }
                if (angular.isDefined(options)) {
                    if (angular.isObject(options.dataPromise)) {
                        return new PromiseDTRenderer(options);
                    }
                    if (angular.isDefined(options.sAjaxDataProp)) {
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
            var renderer = {
                options: options
            };
            renderer.render = function($scope, $elem) {
                _doRenderDataTable($elem, renderer.options);
            };
            return renderer;
        };

        var NGRenderer = function(options) {
            var renderer = new DefaultRenderer(options);
            renderer.render = function ($scope, $elem) {
                $scope.$on(DT_LAST_ROW_KEY, function () {
                    _doRenderDataTable($elem, renderer.options);
                });
            };
            return renderer;
        };

        var PromiseDTRenderer = function(options) {
            var renderer = {
                options: options
            }, oTable;
            renderer.render = function($scope, $elem) {
                // Watch changes
                $scope.$watch('dtOptions.dataPromise', function(promise) {
                    promise.then(function(data) {
                        options.aaData = data;
                        // Add $timeout to be sure that angular has finished rendering before calling datatables
                        $timeout(function() {
                            // Show datatable & hide loading
                            $elem.show();
                            $loading.hide();
                            // Set it to true in order to be able to redraw the dataTable
                            options.bDestroy = true;
                            // Condition to refresh the dataTable
                            if (oTable) {
                                oTable.fnClearTable();
                                oTable.fnDraw();
                                oTable.fnAddData(options.aaData);
                            } else {
                                oTable = $elem.dataTable(options);
                            }
                        }, 0, false);
                    });
                });
            };
            return renderer;
        };

        var AjaxRenderer = function (options) {
            var renderer = {
                options: options
            };
            renderer.render = function($scope, $elem) {
                // Define default values in case it is an ajax datatables
                if (angular.isUndefined(options.sAjaxDataProp)) {
                    options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
                }
                if (angular.isUndefined(options.aoColumns)) {
                    options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
                }
                $scope.$watch('dtOptions.sAjaxSource', function(sAjaxSource) {
                    options.sAjaxSource = sAjaxSource;
                    // Set it to true in order to be able to redraw the dataTable
                    options.bDestroy = true;
                    _doRenderDataTable($elem, renderer.options);
                });
            };
            return renderer;
        };


        return {
            restrict: 'A',
            scope: {
                dtOptions: '=',
                dtColumns: '=',
                datatable: '@'
            },
            link: function($scope, $elem) {
                // Display loading
                $elem.after($loading);
                $elem.hide();

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
