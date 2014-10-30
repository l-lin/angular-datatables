'use strict';
angular.module('datatablesSampleApp').controller('angularWayCtrl', function ($scope, $resource) {
    $scope.persons = $resource('data.json').query();
});
