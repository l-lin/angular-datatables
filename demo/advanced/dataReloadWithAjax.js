'use strict';
angular.module('datatablesSampleApp').controller('DataReloadWithAjaxCtrl', DataReloadWithAjaxCtrl);

function DataReloadWithAjaxCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json').withPaginationType('full_numbers');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
    vm.reloadData = reloadData;
    vm.changeData = changeData;

    function reloadData() {
        vm.dtOptions.reloadData();
    }
    function changeData() {
        vm.dtOptions.sAjaxSource = 'data1.json';
    }
}
