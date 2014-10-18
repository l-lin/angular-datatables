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
        $urlRouterProvider.otherwise('/welcome');
        $stateProvider
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'demo/partials/welcome.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'welcome');
                }
            })
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
            .state('overrideLoadingTpl', {
                url: '/overrideLoadingTpl',
                templateUrl: 'demo/partials/override_loading_tpl.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'overrideLoadingTpl');
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
            .state('angularWayDataChange', {
                url: '/angularWayDataChange',
                templateUrl: 'demo/partials/angular_way_data_change.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'angularWayDataChange');
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
            .state('withResponsive', {
                url: '/withResponsive',
                templateUrl: 'demo/partials/with_responsive.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'withResponsive');
                }
            })
            .state('bootstrapIntegration', {
                url: '/bootstrapIntegration',
                templateUrl: 'demo/partials/bootstrap_integration.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'bootstrapIntegration');
                }
            })
            .state('overrideBootstrapOptions', {
                url: '/overrideBootstrapOptions',
                templateUrl: 'demo/partials/override_bootstrap_options.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'overrideBootstrapOptions');
                }
            })
            .state('rowClickEvent', {
                url: '/rowClickEvent',
                templateUrl: 'demo/partials/row_click_event.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'rowClickEvent');
                }
            })
            .state('bindAngularDirective', {
                url: '/bindAngularDirective',
                templateUrl: 'demo/partials/bind_angular_directive.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'bindAngularDirective');
                }
            })
            .state('changeOptions', {
                url: '/changeOptions',
                templateUrl: 'demo/partials/change_options.html',
                controller: function($rootScope) {
                    $rootScope.$broadcast('event:changeView', 'changeOptions');
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
    .factory('DTLoadingTemplate', function() {
        return {
            html: '<img src="../../images/loading.gif" />'
        };
    })
    .controller('sidebarCtrl', function($scope, $resource) {
        $scope.currentView = 'gettingStarted';
        $scope.$on('event:changeView', function (event, view) {
            $scope.currentView = view;
            $scope.isCollapsed = $scope.isUsageActive();
        });
        $scope.isActive = function (view) {
            return $scope.currentView === view;
        };
        $scope.isUsageActive = function () {
            return 'welcome' !== $scope.currentView && 'gettingStarted' !== $scope.currentView && 'api' !== $scope.currentView;
        };
        $scope.isCollapsed = !('gettingStarted' === $scope.currentView || 'api' === $scope.currentView);
        $scope.archives = $resource('/angular-datatables/archives.json').query();
    });

    backToTop.init({
        theme: 'classic', // Available themes: 'classic', 'sky', 'slate'
        animation: 'fade' // Available animations: 'fade', 'slide'
    });
})(angular, backToTop);
