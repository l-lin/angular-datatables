'use strict';
angular.module('datatablesSampleApp').controller('angularWayCtrl', function($scope, $resource) {
    $resource('data.json').query().$promise.then(function(persons) {
        $scope.persons = persons;
    });
});
