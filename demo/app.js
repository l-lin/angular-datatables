(function(angular) {
    'use strict';
    angular.module('datatablesSampleApp', ['datatables']).
    controller('apiCtrl', function($scope, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(10)
            .withColReorder()
            .withColVis()
            .withTableTools('vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf');
    });
})(angular);
