'use strict';
angular.module('showcase.angularWay.withOptions', ['datatables', 'ngResource'])
.controller('AngularWayWithOptionsCtrl', AngularWayWithOptionsCtrl);

function AngularWayWithOptionsCtrl($resource, DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;
    vm.persons = [];
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];
    $resource('data.json').query().$promise.then(function(persons) {
        vm.persons = persons;
    });
}
