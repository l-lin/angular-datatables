(function(angular, backToTop) {
    'use strict';
    angular.module('datatablesSampleApp', ['ngResource', 'datatables', 'ui.bootstrap', 'ui.router', 'hljs'])
    .config(function (hljsServiceProvider) {
        hljsServiceProvider.setOptions({
            // replace tab with 4 spaces
            tabReplace: '    '
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/gettingStarted');
        $stateProvider
            .state('gettingStarted', {
                url: '/gettingStarted',
                templateUrl: 'demo/partials/getting_started.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'gettingStarted');
                }
            })
            .state('zeroConfig', {
                url: '/zeroConfig',
                templateUrl: 'demo/partials/zero_config.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'zeroConfig');
                }
            })
            .state('withOptions', {
                url: '/withOptions',
                templateUrl: 'demo/partials/with_options.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'withOptions');
                }
            })
            .state('withPromise', {
                url: '/withPromise',
                templateUrl: 'demo/partials/with_promise.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'withPromise');
                }
            })
            .state('dataReloadWithPromise', {
                url: '/dataReloadWithPromise',
                templateUrl: 'demo/partials/data_reload_with_promise.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'dataReloadWithPromise');
                }
            })
            .state('withAjax', {
                url: '/withAjax',
                templateUrl: 'demo/partials/with_ajax.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'withAjax');
                }
            })
            .state('dataReloadWithAjax', {
                url: '/dataReloadWithAjax',
                templateUrl: 'demo/partials/data_reload_with_ajax.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'dataReloadWithAjax');
                }
            })
            .state('serverSideProcessing', {
                url: '/serverSideProcessing',
                templateUrl: 'demo/partials/server_side_processing.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'serverSideProcessing');
                }
            })
            .state('angularWay', {
                url: '/angularWay',
                templateUrl: 'demo/partials/angular_way.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'angularWay');
                }
            })
            .state('angularWayWithOptions', {
                url: '/angularWayWithOptions',
                templateUrl: 'demo/partials/angular_way_with_options.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'angularWayWithOptions');
                }
            })
            .state('withColReorder', {
                url: '/withColReorder',
                templateUrl: 'demo/partials/with_col_reorder.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'withColReorder');
                }
            })
            .state('withColVis', {
                url: '/withColVis',
                templateUrl: 'demo/partials/with_col_vis.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'withColVis');
                }
            })
            .state('withTableTools', {
                url: '/withTableTools',
                templateUrl: 'demo/partials/with_table_tools.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'withTableTools');
                }
            })
            .state('bootstrapIntegration', {
                url: '/integrateBootstrap',
                templateUrl: 'demo/partials/bootstrap_integration.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'bootstrapIntegration');
                }
            })
            .state('allInOne', {
                url: '/allInOne',
                templateUrl: 'demo/partials/all_in_one.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'allInOne');
                }
            })
            .state('api', {
                url: '/api',
                templateUrl: 'demo/partials/api.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'api');
                }
            });
    })
    .controller('sidebarCtrl', function($scope) {
        $scope.currentView = 'gettingStarted';
        $scope.$on('event:changeView', function (event, view) {
            $scope.currentView = view;
            $scope.isCollapsed = $scope.isUsageActive();
        });
        $scope.isActive = function (view) {
            return $scope.currentView === view;
        };
        $scope.isUsageActive = function () {
            return 'gettingStarted' !== $scope.currentView && 'api' !== $scope.currentView;
        };
        $scope.isCollapsed = !('gettingStarted' === $scope.currentView || 'api' === $scope.currentView);
    })
    .controller('apiCtrl', function($scope, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(10)
            .withColReorder()
            .withColVis()
            .withOption('bAutoWidth', false)
            .withTableTools('vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf');
    });

    backToTop.init({
        theme: 'classic', // Available themes: 'classic', 'sky', 'slate'
        animation: 'fade' // Available animations: 'fade', 'slide'
    });
})(angular, backToTop);
