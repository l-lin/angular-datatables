'use strict';
angular.module('showcase.dataReload.withAjax', ['datatables'])
.controller('DataReloadWithAjaxCtrl', DataReloadWithAjaxCtrl);

function DataReloadWithAjaxCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withOption('stateSave', true)
        .withPaginationType('full_numbers');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
    vm.newSource = 'data1.json';
    vm.reloadData = reloadData;
    vm.dtInstance = {};

    function reloadData() {
        var resetPaging = false;
        vm.dtInstance.reloadData(callback, resetPaging);
    }

    function callback(json) {
        console.log(json);
    }
}
