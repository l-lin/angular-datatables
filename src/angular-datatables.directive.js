(function(angular) {
    'use strict';

    angular.module('datatables.directive', []).
    constant('DT_DEFAULT_OPTIONS', {
        sAjaxDataProp: '',
        aoColumns: []
    }).
    directive('datatable', function($http, DT_DEFAULT_OPTIONS, $timeout, DT_LAST_ROW_KEY, DT_HAS_NG_ROWS) {
        var hasNgRows = false;
        var $loading = angular.element('<h3>Loading...</h3>');
        var _doRenderDataTable = function($elem, options) {
            // Add $timeout to be sure that angular has finished rendering before calling datatables
            $timeout(function() {
                // Show datatable & hide loading
                $elem.show();
                $loading.hide();
                $elem.dataTable(options);
            }, 0, false);
        };
        var _renderDataTableIfNoNgRows = function ($elem, options) {
            // Mmh ugly... I don't know how to do it in another way...
            // Waiting in case we have ng rows
            $timeout(function () {
                if (!hasNgRows) {
                    _doRenderDataTable($elem, options);
                }
            }, 100);
        };
        return {
            restrict: 'A',
            scope: {
                dtOptions: '=',
                dtColumns: '='
            },
            link: function($scope, $elem) {
                // Display loading
                $elem.after($loading);
                $elem.hide();

                var options;
                if (angular.isDefined($scope.dtOptions)) {
                    options = {};
                    angular.extend(options, $scope.dtOptions);
                    // Set the columns
                    if (angular.isArray($scope.dtColumns)) {
                        options.aoColumns = $scope.dtColumns;
                    }

                    if (angular.isObject(options.dataPromise)) {
                        options.dataPromise.then(function(data) {
                            options.aaData = data;
                        });
                    } else if (angular.isDefined(options.sAjaxSource)) {
                        // Define default values in case it is an ajax datatables
                        if (angular.isUndefined(options.sAjaxDataProp)) {
                            options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
                        }
                        if (angular.isUndefined(options.aoColumns)) {
                            options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
                        }
                    }
                }
                _renderDataTableIfNoNgRows($elem, options);

                $scope.$on(DT_HAS_NG_ROWS, function () {
                    hasNgRows = true;
                });

                $scope.$on(DT_LAST_ROW_KEY, function () {
                    _doRenderDataTable($elem, options);
                });
            }
        };
    }).
    directive('dtRows', function ($rootScope, DT_LAST_ROW_KEY, DT_HAS_NG_ROWS) {
        return {
            restrict: 'A',
            link: function($scope) {
                $rootScope.$broadcast(DT_HAS_NG_ROWS);
                if ($scope.$last === true) {
                    $rootScope.$broadcast(DT_LAST_ROW_KEY);
                }
            }
        };
    });
})(angular);
