'use strict';
angular.module('datatablesSampleApp').controller('ServerSideProcessingCtrl', ServerSideProcessingCtrl);

function ServerSideProcessingCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withPaginationType('full_numbers');
    // vm.dtOptions = DTOptionsBuilder.newOptions()
    //     .withOption('ajax', {
    //      // Either you specify the AjaxDataProp here
    //      // dataSrc: 'data',
    //      url: '/angular-datatables/data/serverSideProcessing',
    //      type: 'POST'
    //  })
    //  // or here
    //  .withDataProp('data')
    //     .withOption('serverSide', true)
    //     .withPaginationType('full_numbers');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
}
