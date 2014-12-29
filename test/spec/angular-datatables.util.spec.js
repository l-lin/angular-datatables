describe('datatables.service', function() {
    'use strict';
    beforeEach(module('datatables.util'));

    describe('DTPropertyUtil', function() {
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

        beforeEach(inject(function($injector) {
            DTPropertyUtil = $injector.get('DTPropertyUtil');
        }));

        describe(', when overriding the properties,', function() {
            it('should overrides the properties', function() {
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

            it('should return the source if the target is null or undefined', function() {
                expect(DTPropertyUtil.overrideProperties(source)).toEqual(source);
                expect(DTPropertyUtil.overrideProperties(source, null)).toEqual(source);
            });
        });
        describe(', when deleting a property from an object,', function() {
            var foo = {
                foo: 'Foo'
            };
            it('should remove the property if it exists', function() {
                DTPropertyUtil.deleteProperty(foo, 'foo');
                expect(foo.foo).toBeUndefined();
            });
        });
        describe(', when resolving the promises of an object,', function () {
            var foo = {};
            beforeEach(inject(function ($q) {
                var deferB = $q.defer();
                deferB.resolve('fooB');
                foo.b = deferB.promise;

                var deferA = $q.defer();
                deferA.resolve('fooA');
                foo.a = deferA.promise;

                var deferC = $q.defer();
                deferC.resolve('fooC');
                foo.c = deferC.promise;

                foo.d = 'fooD';
                foo.e = function() {
                    return 'fooE';
                };

                var deferF = $q.defer();
                deferF.resolve('fooF0');
                foo.f = [{
                    f0: deferF.promise
                }, 'fooF1'];
            }));
            it('should resolve all promises from an object', inject(function ($rootScope) {
                var resolveFoo = {};
                DTPropertyUtil.resolveObjectPromises(foo).then(function (result) {
                    resolveFoo = result;
                });
                $rootScope.$apply();
                expect(resolveFoo.a).toBe('fooA');
                expect(resolveFoo.b).toBe('fooB');
                expect(resolveFoo.c).toBe('fooC');
                expect(resolveFoo.d).toBe('fooD');
                expect(typeof resolveFoo.e).toEqual('function');
                expect(resolveFoo.f.length).toBe(foo.f.length);
                expect(resolveFoo.f[0].f0).toBe('fooF0');
                expect(resolveFoo.f[1]).toBe('fooF1');

                // Check that the former object is not modified
                expect(foo.a).not.toEqual('fooA');
                expect(foo.b).not.toEqual('fooB');
                expect(foo.c).not.toEqual('fooC');
            }));
            it('should take into account the list of excluded properties names', inject(function ($rootScope) {
                var resolveFoo = {};
                DTPropertyUtil.resolveObjectPromises(foo, ['a']).then(function (result) {
                    resolveFoo = result;
                });
                $rootScope.$apply();
                // The difference lies HERE! the resolveFoo.a is not resolved
                expect(resolveFoo.a).not.toBe('fooA');
                expect(resolveFoo.b).toBe('fooB');
                expect(resolveFoo.c).toBe('fooC');
                expect(resolveFoo.d).toBe('fooD');
                expect(typeof resolveFoo.e).toEqual('function');
                expect(resolveFoo.f.length).toBe(foo.f.length);
                expect(resolveFoo.f[0].f0).toBe('fooF0');
                expect(resolveFoo.f[1]).toBe('fooF1');

                // Check that the former object is not modified
                expect(foo.a).not.toEqual('fooA');
                expect(foo.b).not.toEqual('fooB');
                expect(foo.c).not.toEqual('fooC');
            }));
            it('should throw an error if the given parameter is not an object', inject(function ($rootScope) {
                var resultToCheck = null;
                DTPropertyUtil.resolveObjectPromises().then(function (result) {
                    resultToCheck = result;
                });
                $rootScope.$apply();
                expect(resultToCheck).toBeUndefined();

                DTPropertyUtil.resolveObjectPromises(null).then(function (result) {
                    resultToCheck = result;
                });
                $rootScope.$apply();
                expect(resultToCheck).toBe(null);

                DTPropertyUtil.resolveObjectPromises([]).then(function (result) {
                    resultToCheck = result;
                });
                $rootScope.$apply();
                expect(resultToCheck).toEqual([]);

                DTPropertyUtil.resolveObjectPromises(function() {}).then(function (result) {
                    resultToCheck = result;
                });
                $rootScope.$apply();
                expect(typeof resultToCheck).toBe('function');
            }));
        });
        describe(', when resolving the promises of an array,', function () {
            var array = [], foo = {};
            beforeEach(inject(function ($q) {
                var deferB = $q.defer();
                deferB.resolve('fooB');
                foo.b = deferB.promise;

                var deferA = $q.defer();
                deferA.resolve('fooA');
                foo.a = deferA.promise;

                var deferC = $q.defer();
                deferC.resolve('fooC');
                foo.c = deferC.promise;

                foo.d = 'fooD';
                foo.e = function() {
                    return 'fooE';
                };

                array.push(foo);
                array.push('foo');
            }));
            it('should resolve all promise from the given array', inject(function ($rootScope) {
                var resolvedArray = [];
                DTPropertyUtil.resolveArrayPromises(array).then(function (result) {
                    resolvedArray = result;
                });
                $rootScope.$apply();
                expect(resolvedArray.length).toBe(array.length);
                var resolveFoo = resolvedArray[0];
                expect(resolveFoo.a).toBe('fooA');
                expect(resolveFoo.b).toBe('fooB');
                expect(resolveFoo.c).toBe('fooC');
                expect(resolveFoo.d).toBe('fooD');
                expect(typeof resolveFoo.e).toEqual('function');
                expect(resolvedArray[1]).toBe('foo');

                // Check that the former object is not modified
                expect(foo.a).not.toEqual('fooA');
                expect(foo.b).not.toEqual('fooB');
                expect(foo.c).not.toEqual('fooC');
            }));
            it('should throw an error if the given parameter is not an array', inject(function ($rootScope) {
                var resultToCheck = null;
                DTPropertyUtil.resolveArrayPromises().then(function (result) {
                    resultToCheck = result;
                });
                $rootScope.$apply();
                expect(resultToCheck).toBeUndefined();

                DTPropertyUtil.resolveArrayPromises(null).then(function (result) {
                    resultToCheck = result;
                });
                $rootScope.$apply();
                expect(resultToCheck).toBe(null);

                DTPropertyUtil.resolveArrayPromises({}).then(function (result) {
                    resultToCheck = result;
                });
                $rootScope.$apply();
                expect(resultToCheck).toEqual({});

                DTPropertyUtil.resolveArrayPromises(function() {}).then(function (result) {
                    resultToCheck = result;
                });
                $rootScope.$apply();
                expect(typeof resultToCheck).toBe('function');
            }));
        });
    });
});
