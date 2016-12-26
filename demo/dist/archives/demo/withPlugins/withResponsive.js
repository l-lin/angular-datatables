'use strict';
angular.module('showcase.withResponsive', ['datatables'])
.controller('WithResponsiveCtrl', WithResponsiveCtrl);

function WithResponsiveCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withPaginationType('full_numbers')
        // Active Responsive plugin
        .withOption('responsive', true);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        // .notVisible() does not work in this case. Use .withClass('none') instead
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').withClass('none')
    ];
}
