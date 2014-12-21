'use strict';
angular.module('datatablesSampleApp').controller('WithColumnFilterCtrl', WithColumnFilterCtrl);

function WithColumnFilterCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withPaginationType('full_numbers')
        .withColumnFilter({
            aoColumns: [{
                type: 'number'
            }, {
                type: 'text',
                bRegex: true,
                bSmart: true
            }, {
                type: 'select',
                values: ['Yoda', 'Titi', 'Kyle', 'Bar', 'Whateveryournameis']
            }]
        });
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];
}
