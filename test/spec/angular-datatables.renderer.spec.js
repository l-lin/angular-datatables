describe('datatables.renderer', function () {
    'use strict';

    beforeEach(module('datatables.renderer'));

    describe('DTRendererService', function () {
        var DTRendererService, $loading, $elem, $scope, DTInstances;

        beforeEach(inject(function ($injector, $rootScope) {
            DTRendererService = $injector.get('DTRendererService');
            $loading = DTRendererService.getLoadingElem();
            $elem = $(
                    '<table id="foobar">' +
                    '   <thead>' +
                    '       <tr>' +
                    '           <th>Foo</th>' +
                    '           <th>Bar</th>' +
                    '       </tr>' +
                    '   </thead>' +
                    '   <tbody>' +
                    '   </tbody>' +
                    '</table>'
            );
            $scope = $rootScope.$new();
            DTInstances = $injector.get('DTInstances');
        }));

        describe(', when showing the loading,', function () {
            beforeEach(function () {
                spyOn($.fn, 'after').andCallThrough();
                spyOn($.fn, 'hide').andCallThrough();
                spyOn($.fn, 'show').andCallThrough();
            });

            it('should hide the given element and show the loading', function () {
                DTRendererService.showLoading($elem);
                expect($elem.after).toHaveBeenCalledWith($loading);
                expect($elem.hide).toHaveBeenCalled();
                expect($loading.show).toHaveBeenCalled();
            });
        });
        describe(', when hiding the loading,', function () {
            beforeEach(function () {
                spyOn($.fn, 'show').andCallThrough();
                spyOn($.fn, 'hide').andCallThrough();
            });

            it('should show the given element and hide the loading', function () {
                DTRendererService.hideLoading($elem);
                expect($elem.show).toHaveBeenCalled();
                expect($loading.hide).toHaveBeenCalled();
            });
        });
        describe(', when rendering the DataTable and registring the instance,', function () {
            var options, result;
            beforeEach(function () {
                options = {};
                spyOn($.fn, 'attr').andCallThrough();
                spyOn(DTInstances, 'register');
                result = DTRendererService.renderDataTable($elem, options, {});
            });
            it('should retrieve the id of the element', function () {
                expect($elem.attr).toHaveBeenCalledWith('id');
            });
            it('should not have the option "destroy" set to true', function () {
                expect(options.destroy).not.toBeTruthy();
            });
            it('should return the DT API instance', function () {
                expect(result).toBeDefined();
            });
            it('should set the "destroy" option to true if we render again', function () {
                spyOn($.fn.dataTable, 'isDataTable').andReturn(true);
                DTRendererService.renderDataTable($elem, options, {});
                expect(options.destroy).toBeTruthy();
            });
        });
        describe(', when rendering the DataTable,', function () {
            var options;
            beforeEach(function () {
                options = {};
                spyOn(DTRendererService, 'hideLoading').andCallThrough();
                spyOn(DTRendererService, 'renderDataTable').andCallThrough();
            });

            it('should hide, render and register the datatable instance', function () {
                var oTable = DTRendererService.hideLoadingAndRenderDataTable($elem, options, {});
                expect(DTRendererService.hideLoading).toHaveBeenCalledWith($elem);
                expect(DTRendererService.renderDataTable).toHaveBeenCalled();
                expect(oTable).toBeDefined();
            });
        });
    });

    describe('DTRenderer', function () {
        var DTRenderer;

        beforeEach(inject(function ($injector) {
            DTRenderer = $injector.get('DTRenderer');
        }));

        it('should not have any options by default', function () {
            var renderer = Object.create(DTRenderer);
            expect(renderer.options).toBeUndefined();
        });
        it('should have any options when set', function () {
            var renderer = Object.create(DTRenderer);
            renderer.withOptions({});
            expect(renderer.options).toBeDefined();
        });
    });

    describe('DTRendererFactory', function () {
        var DTRendererFactory;

        beforeEach(inject(function ($injector) {
            DTRendererFactory = $injector.get('DTRendererFactory');
        }));

        it('should return the DTDefaultRenderer if no options is provided', function () {
            var renderer = DTRendererFactory.fromOptions();
            expect(renderer).toBeDefined();
            expect(renderer.name).toBe('DTDefaultRenderer');
        });
        it('should return the DTDefaultRenderer if the options does not contain any promise or ajax options', function () {
            var renderer = DTRendererFactory.fromOptions({});
            expect(renderer).toBeDefined();
            expect(renderer.name).toBe('DTDefaultRenderer');
        });
        it('should return the DTNGRenderer if the flag "isNgDisplay" is set to true', function () {
            var renderer = DTRendererFactory.fromOptions({}, true);
            expect(renderer).toBeDefined();
            expect(renderer.name).toBe('DTNGRenderer');
        });
        it('should return the DTPromiseRenderer if a promise is provided', function () {
            var renderer = DTRendererFactory.fromOptions({
                fnPromise: function () {
                }
            });
            expect(renderer).toBeDefined();
            expect(renderer.name).toBe('DTPromiseRenderer');
        });
        it('should return the DTAjaxRenderer if the ajax source is provided', function () {
            var renderer = DTRendererFactory.fromOptions({
                ajax: 'ajaxSource'
            });
            expect(renderer).toBeDefined();
            expect(renderer.name).toBe('DTAjaxRenderer');
        });
        it('should return the DTAjaxRenderer if the ajax options is provided', function () {
            var renderer = DTRendererFactory.fromOptions({
                ajax: 'ajaxSource'
            });
            expect(renderer).toBeDefined();
            expect(renderer.name).toBe('DTAjaxRenderer');
        });
    });
});
