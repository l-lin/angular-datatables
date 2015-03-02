'use strict';
angular.module('showcase.withFixedColumns', ['datatables', 'datatables.fixedcolumns'])
.controller('WithFixedColumnsCtrl', WithFixedColumnsCtrl);

function WithFixedColumnsCtrl(DTOptionsBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('scrollY', '300px')
        .withOption('scrollX', '100%')
        .withOption('scrollCollapse', true)
        .withOption('paging', false)
        .withFixedColumns({
            leftColumns: 1,
            rightColumns: 1
        });
}
