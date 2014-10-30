'use strict';
angular.module('datatablesSampleApp').controller('dataReloadWithPromiseCtrl', function($scope, DTOptionsBuilder, DTColumnBuilder, $resource) {
    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
    };
    $scope.changeData = function() {
        $scope.dtOptions.fnPromise = function() {
            return $resource('data1.json').query().$promise;
        };
        // Or $scope.dtOptions.fnPromise = $resource('data1.json').query().$promise;
    };

    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        return $resource('data.json').query().$promise;
    }).withPaginationType('full_numbers');

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
});
