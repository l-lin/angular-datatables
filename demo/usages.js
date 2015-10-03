'use strict';
angular.module('showcase.usages', ['ngResource'])
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
        name: 'angularDirectiveInDOM',
        label: 'Angular directive in DOM'
    }, {
        name: 'bindAngularDirective',
        label: 'Bind Angular directive'
    }, {
        name: 'angularWayDataChange',
        label: 'Change data with the Angular way'
    }, {
        name: 'changeOptions',
        label: 'Change options'
    }, {
        name: 'dataReloadWithAjax',
        label: 'Data reload with Ajax'
    }, {
        name: 'dataReloadWithPromise',
        label: 'Data reload with promise'
    }, {
        name: 'disableDeepWatchers',
        label: 'Disable deep watchers'
    }, {
        name: 'dtInstances',
        label: 'Fetching DataTable instances'
    }, {
        name: 'rerender',
        label: 'Re-render a table'
    }, {
        name: 'rowClickEvent',
        label: 'Row click event'
    }, {
        name: 'rowSelect',
        label: 'Selecting rows'
    }, {
        name: 'serverSideProcessing',
        label: 'Server side processing'
    }, {
        name: 'loadOptionsWithPromise',
        label: 'Load DT options with promise'
    }],
    withPlugins: [ {
        name: 'withAngularTranslate',
        label: 'With Angular Translate'
    }, {
        name: 'withAngularTranslateSwitchLanguage',
        label: 'Switch language with Angular Translate'
    }, {
        name: 'withButtons',
        label: 'With Buttons'
    }, {
        name: 'bootstrapIntegration',
        label: 'Bootstrap integration'
    }, {
        name: 'overrideBootstrapOptions',
        label: 'Override Bootstrap options'
    }, {
        name: 'withColumnFilter',
        label: 'With Column Filter'
    }, {
        name: 'withColReorder',
        label: 'With ColReorder'
    }, {
        name: 'withColVis',
        label: 'With ColVis [deprecated]'
    }, {
        name: 'withFixedColumns',
        label: 'With Fixed Columns'
    }, {
        name: 'withFixedHeader',
        label: 'With Fixed Header',
        onExit: function() {
            var fixedHeaderEle = document.getElementsByClassName('fixedHeader');
            angular.element(fixedHeaderEle).remove();
            var fixedFooterEle = document.getElementsByClassName('fixedFooter');
            angular.element(fixedFooterEle).remove();
        }
    }, {
        name: 'withLightColumnFilter',
        label: 'With Light Column Filter'
    }, {
        name: 'withResponsive',
        label: 'With Responsive'
    }, {
        name: 'withSelect',
        label: 'With Select'
    }, {
        name: 'withScroller',
        label: 'With Scroller'
    }, {
        name: 'withTableTools',
        label: 'With TableTools [deprecated]'
    }]
});
