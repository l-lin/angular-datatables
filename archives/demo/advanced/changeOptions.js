'use strict';
angular.module('showcase.changeOptions', ['datatables', 'ngResource'])
.controller('ChangeOptionsDefaultRendererCtrl', ChangeOptionsDefaultRendererCtrl)
.controller('ChangeOptionsAjaxRendererCtrl', ChangeOptionsAjaxRendererCtrl)
.controller('ChangeOptionsPromiseRendererCtrl', ChangeOptionsPromiseRendererCtrl)
.controller('ChangeOptionsNGRendererCtrl', ChangeOptionsNGRendererCtrl);

function ChangeOptionsDefaultRendererCtrl(DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/English.json');
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];

    vm.changeOptions = changeOptions;
    vm.changeColumnDefs = changeColumnDefs;

    function changeOptions() {
        vm.dtOptions.withPaginationType('full_numbers')
            .withLanguageSource('//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/French.json')
            .withDisplayLength(2)
            .withDOM('pitrfl');
    }
    function changeColumnDefs() {
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notVisible(),
            DTColumnDefBuilder.newColumnDef(1).notVisible(),
            DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];
    }
}

function ChangeOptionsAjaxRendererCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
        .withLanguageSource('//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/English.json');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name').notVisible(),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notSortable()
    ];

    vm.changeOptions = changeOptions;
    vm.changeColumns = changeColumns;

    function changeOptions() {
        vm.dtOptions.withPaginationType('full_numbers')
            .withLanguageSource('//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/French.json')
            .withDisplayLength(2)
            .withDOM('pitrfl');
    }
    function changeColumns() {
        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
            DTColumnBuilder.newColumn('firstName').withTitle('First name').notVisible(),
            DTColumnBuilder.newColumn('lastName').withTitle('Last name').notSortable()
        ];
    }
}

function ChangeOptionsPromiseRendererCtrl($resource, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $resource('data.json').query().$promise;
        })
        .withLanguageSource('//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/English.json');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name').notVisible(),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notSortable()
    ];

    vm.changeOptions = changeOptions;
    vm.changeColumns = changeColumns;

    function changeOptions() {
        vm.dtOptions.withPaginationType('full_numbers')
            .withLanguageSource('//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/French.json')
            .withDisplayLength(2)
            .withDOM('pitrfl');
    }
    function changeColumns() {
        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
            DTColumnBuilder.newColumn('firstName').withTitle('First name').notVisible(),
            DTColumnBuilder.newColumn('lastName').withTitle('Last name').notSortable()
        ];
    }
}

function ChangeOptionsNGRendererCtrl($resource, DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;
    vm.persons = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/English.json');
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];
    vm.changeOptions = changeOptions;
    vm.changeColumnDefs = changeColumnDefs;

    $resource('data.json').query().$promise.then(function(persons) {
        vm.persons = persons;
    });

    function changeOptions() {
        vm.dtOptions.withPaginationType('full_numbers')
            .withLanguageSource('//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/French.json')
            .withDisplayLength(2)
            .withDOM('pitrfl');
    }
    function changeColumnDefs() {
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notVisible(),
            DTColumnDefBuilder.newColumnDef(1).notVisible(),
            DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];
    }
}
