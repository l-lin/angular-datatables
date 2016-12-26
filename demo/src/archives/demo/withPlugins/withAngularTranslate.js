'use strict';
angular.module('showcase.withAngularTranslate', ['datatables', 'pascalprecht.translate'])
.controller('WithAngularTranslateCtrl', WithAngularTranslateCtrl);

function WithAngularTranslateCtrl(DTOptionsBuilder, DTColumnBuilder, $translate) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id', $translate('id')),
        DTColumnBuilder.newColumn('firstName').withTitle($translate('firstName')),
        DTColumnBuilder.newColumn('lastName').withTitle($translate('lastName'))
    ];
}
