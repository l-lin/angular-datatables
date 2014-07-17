(function(angular, backToTop) {
    'use strict';
    angular.module('datatablesSampleApp', ['ngResource', 'datatables', 'ui.bootstrap', 'ui.router', 'hljs']).
    controller('apiCtrl', function($scope, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(10)
            .withColReorder()
            .withColVis()
            .withOption('bAutoWidth', false)
            .withTableTools('vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf');
    }).
    config(function (hljsServiceProvider) {
        hljsServiceProvider.setOptions({
            // replace tab with 4 spaces
            tabReplace: '    '
        });
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
            .state('angularWayWithOptions', {
                url: '/angularWayWithOptions',
                templateUrl: 'demo/partials/angular_way_with_options.html'
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
            .state('bootstrapIntegration', {
                url: '/bootstrapIntegration',
                templateUrl: 'demo/partials/bootstrap_integration.html'
            })
            .state('allInOne', {
                url: '/allInOne',
                templateUrl: 'demo/partials/all_in_one.html'
            })
            .state('api', {
                url: '/api',
                templateUrl: 'demo/partials/api.html'
            });
    });

    backToTop.init({
        theme: 'classic', // Available themes: 'classic', 'sky', 'slate'
        animation: 'fade' // Available animations: 'fade', 'slide'
    });
})(angular, backToTop);
