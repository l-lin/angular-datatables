'use strict';
angular.module('showcase.angularDirectiveInDOM', ['datatables'])
    .controller('AngularDirectiveInDomCtrl', AngularDirectiveInDomCtrl)
    .directive('datatableWrapper', datatableWrapper)
    .directive('customElement', customElement);

function AngularDirectiveInDomCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        // Add your custom button in the DOM
        .withDOM('<"custom-element">pitrfl');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];
}

/**
 * This wrapper is only used to compile your custom element
 */
function datatableWrapper($timeout, $compile) {
    return {
        restrict: 'E',
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: link
    };

    function link(scope, element) {
        // Using $timeout service as a "hack" to trigger the callback function once everything is rendered
        $timeout(function () {
            // Compiling so that angular knows the button has a directive
            $compile(element.find('.custom-element'))(scope);
        }, 0, false);
    }
}

/**
 * Your custom element
 */
function customElement() {
    return {
        restrict: 'C',
        template: '<h1>My custom element</h1>'
    };
}
