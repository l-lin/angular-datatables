'use strict';
angular.module('showcase', [
    'showcase.angularWay',
    'showcase.angularWay.withOptions',
    'showcase.withAjax',
    'showcase.withOptions',
    'showcase.withPromise',

    'showcase.angularWay.dataChange',
    'showcase.bindAngularDirective',
    'showcase.changeOptions',
    'showcase.dataReload.withAjax',
    'showcase.dataReload.withPromise',
    'showcase.disableDeepWatchers',
    'showcase.loadOptionsWithPromise',
    'showcase.rerender',
    'showcase.rowClickEvent',
    'showcase.rowSelect',
    'showcase.serverSideProcessing',

    'showcase.bootstrapIntegration',
    'showcase.overrideBootstrapOptions',
    'showcase.withAngularTranslate',
    'showcase.withColReorder',
    'showcase.withColumnFilter',
    'showcase.withColVis',
    'showcase.withResponsive',
    'showcase.withScroller',
    'showcase.withTableTools',
    'showcase.withFixedColumns',
    'showcase.withFixedHeader',
    'showcase.dtInstances',

    'showcase.usages',
    'ui.bootstrap',
    'ui.router',
    'hljs'
])
.config(sampleConfig)
.config(routerConfig)
.config(translateConfig)
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
                    },
                    onExit: usage.onExit
                });
            });
        });
}

function translateConfig($translateProvider) {
    $translateProvider.translations('en', {
        id: 'ID with angular-translate',
        firstName: 'First name with angular-translate',
        lastName: 'Last name with angular-translate'
    });
    $translateProvider.preferredLanguage('en');
}

function dtLoadingTemplate() {
    return {
        html: '<img src="/angular-datatables/images/loading.gif" />'
    };
}
