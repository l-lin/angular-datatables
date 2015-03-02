'use strict';
angular.module('showcase.rowSelect', ['datatables'])
.controller('RowSelectCtrl', RowSelect);

function RowSelect($compile, $scope, $resource, DTOptionsBuilder, DTColumnBuilder, DTInstances) {
    var vm = this;
    vm.selected = {};
    vm.toggleAll = toggleAll;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        return $resource('data1.json').query().$promise;
    })
        .withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withPaginationType('full_numbers');
    vm.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle('').notSortable()
            .renderWith(function(data, type, full, meta) {
                return '<input type="checkbox" ng-model="showCase.selected[' + data.id + ']"/>';
            }),
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];

    DTInstances.getLast().then(function (dtInstance) {
        dtInstance.DataTable.data().each(function(data) {
            vm.selected[data.id] = false;
        });
    });

    var _toggle = true;
    function toggleAll() {
        for (var prop in vm.selected) {
           if (vm.selected.hasOwnProperty(prop)) {
               vm.selected[prop] = _toggle;
           }
        }
        _toggle = !_toggle;
    }
}
