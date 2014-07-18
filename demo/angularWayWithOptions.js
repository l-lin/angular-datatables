/**
 * @author l.lin
 * @created 17/07/14 17:04
 */
(function() {
    'use strict';
    angular.module('datatablesSampleApp').controller('angularWayWithOptionsCtrl', function ($scope, $resource, DTOptionsBuilder) {
        $scope.persons = $resource('data.json').query();
        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    });
})();
