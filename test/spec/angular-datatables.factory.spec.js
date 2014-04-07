describe('angularDatatables.factory', function() {
    'use strict';

    beforeEach(module('datatables'));

    describe('DTColumnBuilder', function() {
        var DATA = 'foobar',
            LABEL = 'FooBarLabel',
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
        
        it('should set the label', function() {
            column.withLabel(LABEL);
            expect(column.label).toBe(LABEL);
        });
        
        it('should set the class', function() {
            column.withClass(CLASS);
            expect(column.sClass).toBe(CLASS);
        });
        
        it('should set the visibility', function() {
            column.setVisible(true);
            expect(column.bVisible).toBeTruthy();
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
            expect(options.sAjaxSource).toBe(AJAX_SOURCE);
        });
        
        it('should create new option with an ajax source', function() {
            options = DTOptionsBuilder.fromSource(AJAX_SOURCE);
            expect(options.sAjaxSource).toBe(AJAX_SOURCE);
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
