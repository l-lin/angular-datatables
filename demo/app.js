(function(angular) {
    'use strict';
    angular.module('angularDatatablesSampleApp', ['angularDatatables']).
    controller('simpleCtrl', function($scope, DTOptionsBuilder, DTColumnBuilder) {
        $scope.dtOptions = DTOptionsBuilder.fromSource('data.json');
        $scope.dtColumns = [DTColumnBuilder.newColumn('id').withLabel('ID'),
            DTColumnBuilder.newColumn('firstName').withLabel('First name'),
            DTColumnBuilder.newColumn('lastName').withLabel('Last name')];
    });
})(angular);
