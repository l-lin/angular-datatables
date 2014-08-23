(function(angular) {
    'use strict';

    angular.module('datatables.directive', ['datatables.renderer', 'datatables.options']).
    directive('datatable', function(DT_DEFAULT_OPTIONS, $timeout, $DTBootstrap, DTRendererFactory) {
        return {
            restrict: 'A',
            scope: {
                dtOptions: '=',
                dtColumns: '=',
                dtColumnDefs: '=',
                datatable: '@'
            },
            link: function($scope, $elem) {
                DTRendererFactory.showLoading($elem);

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
                DTRendererFactory.fromOptions(options, isNgDisplay).render($scope, $elem);
            }
        };
    }).
    /**
     * FIXME: Remove me when dealing with version 0.2.0
     * @deprecated Since v0.1.0
     */
    directive('dtRows', function ($log) {
        var hasWarned;
        return {
            restrict: 'A',
            priority: 1001,
            link: function() {
                if (!hasWarned) {
                    $log.warn('As of v0.1.0, the directive "dtRows" is deprecated. This directive is no longer needed. It will be removed completely from v0.2.0');
                    hasWarned = true;
                }
            }
        };
    });
})(angular);
