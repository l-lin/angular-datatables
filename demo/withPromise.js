/**
 * @author l.lin
 * @created 17/07/14 16:45
 */
(function() {
    'use strict';
    angular.module('datatablesSampleApp').controller('withPromiseCtrl', function ($scope, DTOptionsBuilder, DTColumnBuilder, $resource) {
        $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('data.json').query().$promise;
        }).withPaginationType('full_numbers');

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('firstName').withTitle('First name'),
            DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
        ];
    });
})();