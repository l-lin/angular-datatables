'use strict';
angular.module('showcase.withButtons', ['datatables', 'datatables.buttons'])
    .controller('WithButtonsCtrl', WithButtonsCtrl);

function WithButtonsCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withDOM('frtip')
        .withPaginationType('full_numbers')
        // Active Buttons extension
        .withButtons([
            'columnsToggle',
            'colvis',
            'copy',
            'print',
            'excel',
            {
                text: 'Some button',
                key: '1',
                action: function (e, dt, node, config) {
                    alert('Button activated');
                }
            }
        ]);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];
}
