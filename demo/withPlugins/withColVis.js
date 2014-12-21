'use strict';
angular.module('datatablesSampleApp').controller('WithColVisCtrl', WithColVisCtrl);

function WithColVisCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withPaginationType('full_numbers')
        // Active ColVis plugin
        .withColVis()
        // Add a state change function
        .withColVisStateChange(stateChange)
        // Exclude the last column from the list
        .withColVisOption('aiExclude', [2]);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];

    function stateChange(iColumn, bVisible) {
        console.log('The column', iColumn, ' has changed its status to', bVisible);
    }
}
