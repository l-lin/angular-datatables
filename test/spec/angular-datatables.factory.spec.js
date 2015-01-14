describe('datatables.factory', function() {
    'use strict';

    beforeEach(module('datatables.factory'));

    describe('DTColumnBuilder', function() {
        var DATA = 'foobar',
            TITLE = 'FooBarTitle',
            CLASS = 'foo-bar-class',
            DTColumnBuilder,
            column;

        beforeEach(inject(function($injector) {
            DTColumnBuilder = $injector.get('DTColumnBuilder');
            column = DTColumnBuilder.newColumn(DATA);
        }));

        it('should build the column', function() {
            expect(column.mData).toBe(DATA);
        });

        it('should set the title', function() {
            column.withTitle(TITLE);
            expect(column.sTitle).toBe(TITLE);
        });

        it('should set the class', function() {
            column.withClass(CLASS);
            expect(column.sClass).toBe(CLASS);
        });

        it('should hide the column', function() {
            column.notVisible();
            expect(column.bVisible).toBeFalsy();
        });
    });

    describe('DTColumnDefBuilder', function () {
        var targets = 0,
            TITLE = 'FooBarTitle',
            CLASS = 'foo-bar-class',
            DTColumnDefBuilder,
            columnDef;

        beforeEach(inject(function($injector) {
            DTColumnDefBuilder = $injector.get('DTColumnDefBuilder');
            columnDef = DTColumnDefBuilder.newColumnDef(targets);
        }));

        it('should build the column', function() {
            expect(columnDef.aTargets).toEqual([targets]);
        });

        it('should set the title', function() {
            columnDef.withTitle(TITLE);
            expect(columnDef.sTitle).toBe(TITLE);
        });

        it('should set the class', function() {
            columnDef.withClass(CLASS);
            expect(columnDef.sClass).toBe(CLASS);
        });

        it('should hide the column', function() {
            columnDef.notVisible();
            expect(columnDef.bVisible).toBeFalsy();
        });
    });

    describe('DTOptionsBuilder', function() {
        var AJAX_SOURCE = 'data.json',
            DATA_PROP = 'FooBarData',
            DTOptionsBuilder,
            options;
        beforeEach(inject(function($injector) {
            DTOptionsBuilder = $injector.get('DTOptionsBuilder');
            options = DTOptionsBuilder.newOptions();
        }));

        it('should create a new option', function() {
            expect(options).toBeDefined();
            options.withSource(AJAX_SOURCE);
            expect(options.ajax).toBe(AJAX_SOURCE);
        });

        it('should create new option with an ajax source', function() {
            options = DTOptionsBuilder.fromSource(AJAX_SOURCE);
            expect(options.ajax).toBe(AJAX_SOURCE);
        });

        it('should be able to add a data prop', function() {
            options.withDataProp(DATA_PROP);
            expect(options.sAjaxDataProp).toBe(DATA_PROP);
        });

        it('should be able to define the function to fetch the data', function() {
            var fn = function() {};
            options.withFnServerData(fn);
            expect(options.fnServerData).toBe(fn);
        });

        it('should throw an error if the parameter is not a function when setting the server data function', function() {
            expect(function() {options.withFnServerData({});}).toThrow(new Error('The parameter must be a function'));
        });
    });
});
