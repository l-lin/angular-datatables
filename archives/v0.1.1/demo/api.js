/**
 * @author l.lin
 * @created 23/08/14 22:54
 */
(function () {
    'use strict';
    angular.module('datatablesSampleApp').controller('apiCtrl', function($scope, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(10)
            .withColReorder()
            .withColVis()
            .withOption('bAutoWidth', false)
            .withTableTools('../../vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf');
    });
})();
