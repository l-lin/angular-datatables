'use strict';
angular.module('showcase.withFixedHeader', ['datatables', 'datatables.fixedheader'])
.controller('WithFixedHeaderCtrl', WithFixedHeaderCtrl);

function WithFixedHeaderCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withPaginationType('full_numbers')
        .withDisplayLength(25)
        .withFixedHeader({
            bottom: true
        });
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];
}
