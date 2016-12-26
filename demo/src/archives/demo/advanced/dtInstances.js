'use strict';
angular.module('showcase.dtInstances', ['datatables']).controller('DTInstancesCtrl', DTInstancesCtrl);

function DTInstancesCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtInstances = [];
    vm.dtOptions1 = DTOptionsBuilder.fromSource('data.json')
        .withDisplayLength(2)
        .withPaginationType('full_numbers');
    vm.dtColumns1 = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];
    vm.dtInstance1 = {};

    vm.dtOptions2 = DTOptionsBuilder.fromSource('data1.json');
    vm.dtColumns2 = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
    vm.dtInstance2 = {};
    vm.dtInstanceCallback = dtInstanceCallback;

    function dtInstanceCallback(dtInstance) {
        vm.dtInstance2 = dtInstance;
    }
}
