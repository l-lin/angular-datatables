'use strict';
angular.module('showcase.dataReload.withPromise', ['datatables', 'ngResource'])
.controller('DataReloadWithPromiseCtrl', DataReloadWithPromiseCtrl);

function DataReloadWithPromiseCtrl(DTOptionsBuilder, DTColumnBuilder, $resource, DTInstances) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        return $resource('data.json').query().$promise;
    }).withPaginationType('full_numbers');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
    vm.newPromise = newPromise;

    DTInstances.getLast().then(function (dtInstance) {
        vm.dtInstance = dtInstance;
    });

    function newPromise() {
        return $resource('data1.json').query().$promise;
    }
}
