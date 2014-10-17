'use strict';
angular.module('datatablesSampleApp').controller('withColReorderCtrl', function ($scope, DTOptionsBuilder, DTColumnBuilder) {
    $scope.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withPaginationType('full_numbers')
        // Activate col reorder plugin
        .withColReorder()
        // Set order
        .withColReorderOrder([1, 0, 2])
        // Fix last right column
        .withColReorderOption('iFixedColumnsRight', 1)
        .withColReorderCallback(function() {
            console.log('Columns order has been changed with: ' + this.fnOrder());
        });
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('No move me!'),
        DTColumnBuilder.newColumn('firstName').withTitle('Try to move me!'),
        DTColumnBuilder.newColumn('lastName').withTitle('You cannot move me! *evil laugh*')
    ];
});
