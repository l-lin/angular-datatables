'use strict';
angular.module('showcase.loadOptionsWithPromise', ['datatables', 'ngResource'])
.controller('LoadOptionsWithPromiseCtrl', LoadOptionsWithPromiseCtrl);

function LoadOptionsWithPromiseCtrl($resource) {
    var vm = this;
    vm.dtOptions = $resource('/angular-datatables/dtOptions.json').get().$promise;
    vm.dtColumns = $resource('/angular-datatables/dtColumns.json').query().$promise;
}
