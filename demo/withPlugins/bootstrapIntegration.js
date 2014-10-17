'use strict';
angular.module('datatablesSampleApp').controller('bootstrapIntegrationCtrl', function ($scope, DTOptionsBuilder, DTColumnBuilder) {
    $scope.dtOptions = DTOptionsBuilder
        .fromSource('data.json')
        // Add Bootstrap compatibility
        .withBootstrap();
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID').withClass('text-danger'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];
});
