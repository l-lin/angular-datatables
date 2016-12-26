'use strict';
angular.module('showcase.withSelect', ['datatables', 'datatables.select'])
    .controller('WithSelectCtrl', WithSelectCtrl);

function WithSelectCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withPaginationType('full_numbers')
        // Active Select plugin
        .withSelect({
            style:    'os',
            selector: 'td:first-child'
        });
    vm.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle('')
            .notSortable()
            .withClass('select-checkbox')
            // Need to define the mRender function, otherwise we get a [Object Object]
            .renderWith(function() {return '';}),
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];
}
