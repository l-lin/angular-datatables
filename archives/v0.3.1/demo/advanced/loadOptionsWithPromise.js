'use strict';
angular.module('datatablesSampleApp').controller('LoadOptionsWithPromiseCtrl', LoadOptionsWithPromiseCtrl);

function LoadOptionsWithPromiseCtrl($q, $resource) {
    var vm = this;
    vm.dtOptions = $resource('/angular-datatables/dtOptions.json').get().$promise;
    vm.dtColumns = $resource('/angular-datatables/dtColumns.json').query().$promise;
}
