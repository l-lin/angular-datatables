'use strict';
angular.module('datatablesSampleApp').controller('DataReloadWithPromiseCtrl', DataReloadWithPromiseCtrl);

function DataReloadWithPromiseCtrl(DTOptionsBuilder, DTColumnBuilder, $resource) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        return $resource('data.json').query().$promise;
    }).withPaginationType('full_numbers');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
    vm.reloadData = reloadData;
    vm.changeData = changeData;

    function reloadData() {
        vm.dtOptions.reloadData();
    }
    function changeData() {
        vm.dtOptions.fnPromise = function() {
            return $resource('data1.json').query().$promise;
        };
        // Or vm.dtOptions.fnPromise = $resource('data1.json').query().$promise;
    }
}
