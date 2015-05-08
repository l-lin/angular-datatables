'use strict';
angular.module('showcase.rerender', ['datatables', 'ngResource'])
.controller('RerenderDefaultRendererCtrl', RerenderDefaultRendererCtrl)
.controller('RerenderAjaxRendererCtrl', RerenderAjaxRendererCtrl)
.controller('RerenderPromiseRendererCtrl', RerenderPromiseRendererCtrl)
.controller('RerenderNGRendererCtrl', RerenderNGRendererCtrl);

function RerenderDefaultRendererCtrl(DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions();
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];
    vm.dtInstance = {};
}

function RerenderAjaxRendererCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name').notVisible(),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notSortable()
    ];
    vm.dtInstance = {};
}

function RerenderPromiseRendererCtrl($resource, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('data.json').query().$promise;
        });
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name').notVisible(),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notSortable()
    ];
    vm.dtInstance = {};
}

function RerenderNGRendererCtrl($resource, DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;
    vm.persons = [];
    vm.dtOptions = DTOptionsBuilder.newOptions();
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];
    vm.dtInstance = {};

    $resource('data.json').query().$promise.then(function(persons) {
        vm.persons = persons;
    });
}
