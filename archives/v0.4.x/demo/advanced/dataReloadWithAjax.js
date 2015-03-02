'use strict';
angular.module('showcase.dataReload.withAjax', ['datatables'])
.controller('DataReloadWithAjaxCtrl', DataReloadWithAjaxCtrl);

function DataReloadWithAjaxCtrl(DTOptionsBuilder, DTColumnBuilder, DTInstances) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json').withPaginationType('full_numbers');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
    vm.newSource = 'data1.json';

    DTInstances.getLast().then(function(dtInstance) {
        vm.dtInstance = dtInstance;
    });
}
