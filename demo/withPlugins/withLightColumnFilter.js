'use strict';
angular.module('showcase.withLightColumnFilter', ['datatables', 'datatables.light-columnfilter'])
.controller('WithLightColumnFilterCtrl', WithLightColumnFilterCtrl);

function WithLightColumnFilterCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withPaginationType('full_numbers')
        .withLightColumnFilter({
            0 : { "type" : "text"},
            1 : { "type" : "text"},
            2 : { "type" : "text"}
        });
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];
}
