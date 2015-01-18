'use strict';
angular.module('showcase.rerender', ['datatables', 'ngResource'])
.controller('RerenderDefaultRendererCtrl', RerenderDefaultRendererCtrl)
.controller('RerenderAjaxRendererCtrl', RerenderAjaxRendererCtrl)
.controller('RerenderPromiseRendererCtrl', RerenderPromiseRendererCtrl)
.controller('RerenderNGRendererCtrl', RerenderNGRendererCtrl);

function RerenderDefaultRendererCtrl(DTOptionsBuilder, DTColumnDefBuilder, DTInstances) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions();
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];

    DTInstances.getLast().then(function (dtInstance) {
        vm.dtInstance = dtInstance;
    });
}

function RerenderAjaxRendererCtrl(DTOptionsBuilder, DTColumnBuilder, DTInstances) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name').notVisible(),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notSortable()
    ];

    DTInstances.getLast().then(function (dtInstance) {
        vm.dtInstance = dtInstance;
    });
}

function RerenderPromiseRendererCtrl($resource, DTOptionsBuilder, DTColumnBuilder, DTInstances) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('data.json').query().$promise;
        });
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name').notVisible(),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notSortable()
    ];

    DTInstances.getLast().then(function (dtInstance) {
        vm.dtInstance = dtInstance;
    });
}

function RerenderNGRendererCtrl($resource, DTOptionsBuilder, DTColumnDefBuilder, DTInstances) {
    var vm = this;
    vm.persons = [];
    vm.dtOptions = DTOptionsBuilder.newOptions();
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];

    $resource('data.json').query().$promise.then(function(persons) {
        vm.persons = persons;
    });

    DTInstances.getLast().then(function (dtInstance) {
        vm.dtInstance = dtInstance;
    });
}
