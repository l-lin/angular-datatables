'use strict';
angular.module('datatablesSampleApp').controller('dataReloadWithAjaxCtrl', function($scope, DTOptionsBuilder, DTColumnBuilder) {
    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
    };
    $scope.changeData = function() {
        $scope.dtOptions.sAjaxSource = 'data1.json';
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource('data.json').withPaginationType('full_numbers');

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
});
