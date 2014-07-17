(function(angular, backToTop) {
    'use strict';
    angular.module('datatablesSampleApp', ['ngResource', 'datatables', 'ui.bootstrap.collapse', 'ui.bootstrap.tabs', 'ui.router']).
    controller('apiCtrl', function($scope, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(10)
            .withColReorder()
            .withColVis()
            .withOption('bAutoWidth', false)
            .withTableTools('vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf');
    }).
    config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/gettingStarted');
        $stateProvider
            .state('gettingStarted', {
                url: '/gettingStarted',
                templateUrl: 'demo/partials/getting_started.html'
            })
            .state('zeroConfig', {
                url: '/zeroConfig',
                templateUrl: 'demo/partials/zero_config.html'
            })
            .state('withOptions', {
                url: '/withOptions',
                templateUrl: 'demo/partials/with_options.html'
            })
            .state('withPromise', {
                url: '/withPromise',
                templateUrl: 'demo/partials/with_promise.html'
            })
            .state('dataReloadWithPromise', {
                url: '/dataReloadWithPromise',
                templateUrl: 'demo/partials/data_reload_with_promise.html'
            })
            .state('withAjax', {
                url: '/withAjax',
                templateUrl: 'demo/partials/with_ajax.html'
            })
            .state('dataReloadWithAjax', {
                url: '/dataReloadWithAjax',
                templateUrl: 'demo/partials/data_reload_with_ajax.html'
            })
            .state('angularWay', {
                url: '/angularWay',
                templateUrl: 'demo/partials/angular_way.html'
            })
            .state('withColReorder', {
                url: '/withColReorder',
                templateUrl: 'demo/partials/with_col_reorder.html'
            })
            .state('withColVis', {
                url: '/withColVis',
                templateUrl: 'demo/partials/with_col_vis.html'
            })
            .state('withTableTools', {
                url: '/withTableTools',
                templateUrl: 'demo/partials/with_table_tools.html'
            })
            .state('bootstrap', {
                url: '/bootstrap',
                templateUrl: 'demo/partials/bootstrap.html'
            })
            .state('allInOne', {
                url: '/allInOne',
                templateUrl: 'demo/partials/all_in_one.html'
            })
            .state('api', {
                url: '/api',
                templateUrl: 'demo/partials/api.html'
            });
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
//            $scope.dtOptions.fnPromise = sampleFactory.getData();
        };
        $scope.changeData = function() {
//            $scope.dtOptions.sAjaxSource = 'data1.json';
            $scope.dtOptions.fnPromise = sampleFactory.getData1;
        };

        $scope.persons = [];
        sampleFactory.getData().then(function(persons) {
            $scope.persons = persons;
        });

//        $scope.dtOptions = DTOptionsBuilder.fromSource('data').withPaginationType('full_numbers');
        $scope.dtOptions = DTOptionsBuilder.fromFnPromise(sampleFactory.getData).withPaginationType('full_numbers');
//        $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('firstName').withTitle('First name'),
            DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
        ];
    });

    backToTop.init({
        theme: 'classic', // Available themes: 'classic', 'sky', 'slate'
        animation: 'fade' // Available animations: 'fade', 'slide'
    });
})(angular, backToTop);
