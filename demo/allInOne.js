/**
 * @author l.lin
 * @created 17/07/14 17:04
 */
(function() {
    'use strict';
    angular.module('datatablesSampleApp').controller('allInOneCtrl', function ($scope, DTOptionsBuilder, DTColumnBuilder) {
        $scope.dtOptions = DTOptionsBuilder
            .fromSource('data.json')
            .withPaginationType('full_numbers')
            .withOption('language', {
                paginate: {
                    first: "&laquo;",
                    last: "&raquo;",
                    next: "&rarr;",
                    previous: "&larr;"
                }
            })
            // Add Bootstrap compatibility
            .withBootstrap()

            // Add ColVis compatibility
            .withColVis()
            // Add a state change function
            .withColVisStateChange(function(iColumn, bVisible) {
                console.log('The column' + iColumn + ' has changed its status to ' + bVisible)
            })
            // Exclude the last column from the list
            .withColVisOption('aiExclude', [2])

            // Add ColReorder compatibility
            .withColReorder()
            // Set order
            .withColReorderOrder([1, 0, 2])
            // Fix last right column
            .withColReorderOption('iFixedColumnsRight', 1)
            .withColReorderCallback(function() {
                console.log('Columns order has been changed with: ' + this.fnOrder());
            })

            // Add Table tools compatibility
            .withTableTools('vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf')
            .withTableToolsButtons([
                'copy',
                'print', {
                    'sExtends': 'collection',
                    'sButtonText': 'Save',
                    'aButtons': ['csv', 'xls', 'pdf']
                }
            ]);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID').withClass('text-danger'),
            DTColumnBuilder.newColumn('firstName').withTitle('First name'),
            DTColumnBuilder.newColumn('lastName').withTitle('Last name')
        ];
    });
})();
