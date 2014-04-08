(function(angular) {
    'use strict';
    angular.module('datatablesSampleApp', ['datatables']).
    controller('apiCtrl', function($scope, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDisplayLength(25);
    });
})(angular);
