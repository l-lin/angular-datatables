'use strict';
angular.module('datatablesSampleApp',
['datatablesSampleApp.usages', 'ngResource', 'datatables', 'ui.bootstrap', 'ui.router', 'hljs'])
.config(sampleConfig)
.config(routerConfig)
.factory('DTLoadingTemplate', dtLoadingTemplate);

backToTop.init({
    theme: 'classic', // Available themes: 'classic', 'sky', 'slate'
    animation: 'fade' // Available animations: 'fade', 'slide'
});

function sampleConfig(hljsServiceProvider) {
    hljsServiceProvider.setOptions({
        // replace tab with 4 spaces
        tabReplace: '    '
    });
}

function routerConfig($stateProvider, $urlRouterProvider, USAGES) {
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
            templateUrl: 'demo/partials/gettingStarted.html',
            controller: function($rootScope) {
                $rootScope.$broadcast('event:changeView', 'gettingStarted');
            }
        })
        .state('api', {
            url: '/api',
            templateUrl: 'demo/api/api.html',
            controller: function($rootScope) {
                $rootScope.$broadcast('event:changeView', 'api');
            }
        });

        angular.forEach(USAGES, function(usages, key) {
            angular.forEach(usages, function(usage) {
                $stateProvider.state(usage.name, {
                    url: '/' + usage.name,
                    templateUrl: 'demo/' + key + '/' + usage.name + '.html',
                    controller: function($rootScope) {
                        $rootScope.$broadcast('event:changeView', usage.name);
                    }
                });
            });
        });
}

function dtLoadingTemplate() {
    return {
        html: '<img src="/angular-datatables/images/loading.gif" />'
    };
}
