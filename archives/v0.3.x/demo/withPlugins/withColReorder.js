'use strict';
angular.module('datatablesSampleApp').controller('WithColReorderCtrl', WithColReorderCtrl);

function WithColReorderCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withPaginationType('full_numbers')
        // Activate col reorder plugin
        .withColReorder()
        // Set order
        .withColReorderOrder([1, 0, 2])
        // Fix last right column
        .withColReorderOption('iFixedColumnsRight', 1)
        .withColReorderCallback(function() {
            console.log('Columns order has been changed with: ' + this.fnOrder());
        });
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('No move me!'),
        DTColumnBuilder.newColumn('firstName').withTitle('Try to move me!'),
        DTColumnBuilder.newColumn('lastName').withTitle('You cannot move me! *evil laugh*')
    ];
}
