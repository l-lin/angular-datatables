'use strict';
angular.module('datatablesSampleApp').controller('AngularWayCtrl', AngularWayCtrl);

function AngularWayCtrl($resource) {
    var vm = this;
    $resource('data.json').query().$promise.then(function(persons) {
        vm.persons = persons;
    });
}
