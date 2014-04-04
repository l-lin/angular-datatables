(function(angular) {
    'use strict';
    angular.module('angularDatatablesSampleApp', ['angularDatatables']).
    controller('simpleCtrl', function($scope) {
        $scope.options = {
            sAjaxSource: 'data.json'
        };
    });
})(angular);
