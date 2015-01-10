'use strict';
angular.module('datatablesSampleApp.usages', ['ngResource'])
.constant('USAGES', {
    basic: [{
        name: 'zeroConfig',
        label: 'Zero configuration'
    }, {
        name: 'withOptions',
        label: 'With options'
    }, {
        name: 'withAjax',
        label: 'With ajax'
    }, {
        name: 'withPromise',
        label: 'With promise'
    }, {
        name: 'angularWay',
        label: 'The Angular way'
    }, {
        name: 'angularWayWithOptions',
        label: 'The Angular way with options'
    }, {
        name: 'overrideLoadingTpl',
        label: 'Custom HTML loading'
    }],
    advanced: [{
        name: 'dataReloadWithAjax',
        label: 'Data reload with Ajax'
    }, {
        name: 'dataReloadWithPromise',
        label: 'Data reload with promise'
    }, {
        name: 'serverSideProcessing',
        label: 'Server side processing'
    }, {
        name: 'angularWayDataChange',
        label: 'Change data with the Angular way'
    }, {
        name: 'rowClickEvent',
        label: 'Row click event'
    }, {
        name: 'rowSelect',
        label: 'Selecting rows'
    }, {
        name: 'bindAngularDirective',
        label: 'Bind Angular directive'
    }, {
        name: 'changeOptions',
        label: 'Change options'
    }, {
        name: 'loadOptionsWithPromise',
        label: 'Load DT options with promise'
    }, {
        name: 'disableDeepWatchers',
        label: 'Disable deep watchers'
    }],
    withPlugins: [{
        name: 'withColReorder',
        label: 'With ColReorder'
    }, {
        name: 'withColVis',
        label: 'With ColVis'
    }, {
        name: 'withTableTools',
        label: 'With TableTools'
    }, {
        name: 'withResponsive',
        label: 'With Responsive'
    }, {
        name: 'withScroller',
        label: 'With Scroller'
    }, {
        name: 'withColumnFilter',
        label: 'With Column Filter'
    },{
        name: 'bootstrapIntegration',
        label: 'Bootstrap integration'
    }, {
        name: 'overrideBootstrapOptions',
        label: 'Override Bootstrap options'
    }, {
        name: 'withAngularTranslate',
        label: 'With Angular Translate'
    }]
});
