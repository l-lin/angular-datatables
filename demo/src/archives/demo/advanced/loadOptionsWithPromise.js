'use strict';
angular.module('showcase.loadOptionsWithPromise', ['datatables', 'ngResource'])
.controller('LoadOptionsWithPromiseCtrl', LoadOptionsWithPromiseCtrl);

function LoadOptionsWithPromiseCtrl($resource) {
    var vm = this;
    vm.dtOptions = $resource('dtOptions.json').get().$promise;
    vm.dtColumns = $resource('dtColumns.json').query().$promise;
}
