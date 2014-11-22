'use strict';
angular.module('datatablesSampleApp')
.controller('loadOptionsWithPromiseCtrl', function ($q, $scope, $resource) {
    $scope.dtOptions = $resource('/angular-datatables/dtOptions.json').get().$promise;
    $scope.dtColumns = $resource('/angular-datatables/dtColumns.json').query().$promise;
});
