(function(angular) {
    'use strict';

    angular.module('datatables.directive', []).
    constant('DT_DEFAULT_OPTIONS', {
        sAjaxDataProp: '',
        aoColumns: []
    }).
    directive('datatable', function($http, DT_DEFAULT_OPTIONS, $timeout) {
        return {
            restrict: 'A',
            scope: {
                dtOptions: '=',
                dtColumns: '='
            },
            link: function($scope, $elem) {
                if (angular.isDefined($scope.dtOptions)) {
                    var options = {};
                    angular.extend(options, $scope.dtOptions);
                    
                    // Set the columns
                    if (angular.isArray($scope.dtColumns)) {
                        options.aoColumns = $scope.dtColumns;
                    }
                    
                    // Define defaults values in case it is an ajax datatables
                    if (angular.isDefined(options.sAjaxSource)) {
                        if (angular.isUndefined(options.sAjaxDataProp)) {
                            options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
                        }
                        if (angular.isUndefined(options.aoColumns)) {
                            options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
                        }
                    }
                    
                    // Add $timeout to be sure that angular has finished rendering before calling datatables
                    $timeout(function() {
                        $elem.dataTable(options);
                    }, 0, false);
                } else {
                    // Add $timeout to be sure that angular has finished rendering before calling datatables
                    $timeout(function() {
                        $elem.dataTable();
                    }, 0, false);
                }
            }
        };
    });
})(angular);