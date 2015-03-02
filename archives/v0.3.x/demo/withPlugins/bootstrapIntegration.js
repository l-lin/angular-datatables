'use strict';
angular.module('datatablesSampleApp').controller('BootstrapIntegrationCtrl', BootstrapIntegrationCtrl);

function BootstrapIntegrationCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder
        .fromSource('data.json')
        // Add Bootstrap compatibility
        .withBootstrap();
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID').withClass('text-danger'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];
}
