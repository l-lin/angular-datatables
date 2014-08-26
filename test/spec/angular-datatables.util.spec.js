describe('datatables.service', function () {
    'use strict';
    beforeEach(module('datatables.util'));

    describe('DTPropertyUtil', function () {
        var DTPropertyUtil,
            source = {
                a: 'a',
                b: 'b',
                c: {
                    c1: 'c1',
                    c2: 'c2'
                }
            },
            target = {
                a: 'ta',
                c: {
                    c1: 'tc1'
                },
                d: 'td',
                e: {
                    e1: 'te1',
                    e2: 'te2'
                }
            };

        beforeEach(inject(function ($injector) {
            DTPropertyUtil = $injector.get('DTPropertyUtil');
        }));

        describe(', when overriding the properties,', function () {
            it('should overrides the properties', function () {
                var result = DTPropertyUtil.overrideProperties(source, target);
                expect(result).not.toBeNull();
                expect(result).toEqual({
                    a: 'ta',
                    b: 'b',
                    c: {
                        c1: 'tc1',
                        c2: 'c2'
                    },
                    d: 'td',
                    e: {
                        e1: 'te1',
                        e2: 'te2'
                    }
                });
            });

            it('should return the source if the target is null or undefined', function () {
                expect(DTPropertyUtil.overrideProperties(source)).toEqual(source);
                expect(DTPropertyUtil.overrideProperties(source, null)).toEqual(source);
            });
        });
    });
});
