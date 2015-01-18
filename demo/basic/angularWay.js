'use strict';
angular.module('showcase.angularWay', ['datatables', 'ngResource'])
.controller('AngularWayCtrl', AngularWayCtrl);

function AngularWayCtrl($resource) {
    var vm = this;
    $resource('data.json').query().$promise.then(function(persons) {
        vm.persons = persons;
    });
}
