(function(angular) {
    'use strict';
    angular.module('datatablesSampleApp', ['ngResource', 'datatables', 'ui.bootstrap.collapse']).
    controller('apiCtrl', function($scope, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(10)
            .withColReorder()
            .withColVis()
            .withOption('bAutoWidth', false)
            .withTableTools('vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf');
    }).
    factory('sampleFactory', function($resource) {
        return {
            getData: function() {
                return $resource('data').query().$promise;
            },
            getData1: function() {
                return $resource('data1.json').query().$promise;
            }
        };
    }).
    controller('sampleCtrl', function($scope, DTOptionsBuilder, DTColumnBuilder, sampleFactory) {
        $scope.reload = function() {
            $scope.dtOptions.reloadData();
//            $scope.dtOptions.dataPromise = sampleFactory.getData();
        };
        $scope.changeData = function() {
            $scope.dtOptions.sAjaxSource = 'data1.json';
            $scope.dtOptions.dataPromise = sampleFactory.getData1();
        };

        $scope.persons = [];
        sampleFactory.getData().then(function(persons) {
            $scope.persons = persons;
        });

        $scope.dtOptions = DTOptionsBuilder.fromSource('data').withPaginationType('full_numbers');
//        $scope.dtOptions = DTOptionsBuilder.fromPromise(sampleFactory.getData()).withPaginationType('full_numbers');
//        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('firstName').withTitle('First name'),
            DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
        ];
    });
})(angular);
