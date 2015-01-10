'use strict';
angular.module('datatablesSampleApp').controller('ApiCtrl', ApiCtrl);

function ApiCtrl(DTOptionsBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(10)
        .withColReorder()
        .withColVis()
        .withOption('bAutoWidth', false)
        .withTableTools('vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf');
}
