/**
 * @author l.lin
 * @created 17/07/14 16:45
 */
(function() {
    'use strict';
    angular.module('datatablesSampleApp').controller('withOptionsCtrl', function ($scope, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(2)
            .withDOM('pitrfl');
    });
})();
