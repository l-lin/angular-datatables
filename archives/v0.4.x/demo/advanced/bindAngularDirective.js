'use strict';
angular.module('showcase.bindAngularDirective', ['datatables'])
.controller('BindAngularDirectiveCtrl', BindAngularDirectiveCtrl);

function BindAngularDirectiveCtrl($scope, $compile, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.message = '';
    vm.edit = edit;
    vm.delete = deleteRow;
    vm.dtInstance = {};
    vm.dtOptions = DTOptionsBuilder.fromSource('data1.json')
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name'),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];

    function edit(id) {
        vm.message = 'You are trying to edit the row with ID: ' + id;
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        vm.dtInstance.reloadData();
    }
    function deleteRow(id) {
        vm.message = 'You are trying to remove the row with ID: ' + id;
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        vm.dtInstance.reloadData();
    }
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        return '<button class="btn btn-warning" ng-click="showCase.edit(' + data.id + ')">' +
            '   <i class="fa fa-edit"></i>' +
            '</button>&nbsp;' +
            '<button class="btn btn-danger" ng-click="showCase.delete(' + data.id + ')">' +
            '   <i class="fa fa-trash-o"></i>' +
            '</button>';
    }
}
