/**
 * @author l.lin
 * @created 17/07/14 17:04
 */
(function() {
    'use strict';
    angular.module('datatablesSampleApp').controller('angularWayWithOptionsCtrl', function ($scope, $resource, DTOptionsBuilder, DTColumnBuilder) {
        $scope.persons = $resource('data.json').query();
        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('firstName').withTitle('First name'),
            DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
        ];
    });
})();