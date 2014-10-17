'use strict';
angular.module('datatablesSampleApp').controller('withOptionsCtrl', function ($scope, DTOptionsBuilder, DTColumnDefBuilder) {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withDisplayLength(2)
        .withDOM('pitrfl');
    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];
});
