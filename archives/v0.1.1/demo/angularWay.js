/**
 * @author l.lin
 * @created 17/07/14 17:04
 */
(function() {
    'use strict';
    angular.module('datatablesSampleApp').controller('angularWayCtrl', function ($scope, $resource) {
        $scope.persons = $resource('data.json').query();
    });
})();