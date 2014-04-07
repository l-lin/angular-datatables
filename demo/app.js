(function(angular) {
    'use strict';
    angular.module('datatablesSampleApp', ['datatables']).
    controller('apiCtrl', function($scope, DTOptionsBuilder, DTColumnBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(25);
    });
})(angular);
