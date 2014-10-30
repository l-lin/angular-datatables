'use strict';
angular.module('datatablesSampleApp').controller('apiCtrl', function($scope, DTOptionsBuilder) {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDisplayLength(10)
        .withColReorder()
        .withColVis()
        .withOption('bAutoWidth', false)
        .withTableTools('../../vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf');
});
