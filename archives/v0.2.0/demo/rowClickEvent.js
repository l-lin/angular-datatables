/**
 * @author l.lin
 * @created 17/07/14 16:45
 */
(function() {
    'use strict';
    angular.module('datatablesSampleApp').controller('rowClickEventCtrl', function ($scope, DTOptionsBuilder, DTColumnBuilder) {
        $scope.message = '';
        $scope.someClickHandler = function(info) {
            $scope.message = info.id + ' - ' + info.firstName;
        };

        $scope.dtOptions = DTOptionsBuilder.fromSource('data.json')
            .withPaginationType('full_numbers')
            .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td', nRow).bind('click', function() {
                    $scope.$apply(function() {
                        $scope.someClickHandler(aData);
                    });
                });
                return nRow;
            });
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('firstName').withTitle('First name'),
            DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
        ];
    });
})();