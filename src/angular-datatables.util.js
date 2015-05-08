'use strict';

angular.module('datatables.util', [])
    .factory('DTPropertyUtil', dtPropertyUtil)
    // TODO: Remove this service when the DTInstances service is removed!
    .service('failzQ', failzQ);

/* @ngInject */
function dtPropertyUtil($q) {
    return {
        overrideProperties: overrideProperties,
        deleteProperty: deleteProperty,
        resolveObjectPromises: resolveObjectPromises,
        resolveArrayPromises: resolveArrayPromises
    };

    /**
     * Overrides the source property with the given target properties.
     * Source is not written. It's making a fresh copy of it in order to ensure that we do not change the parameters.
     * @param source the source properties to override
     * @param target the target properties
     * @returns {*} the object overrided
     */
    function overrideProperties(source, target) {
        var result = angular.copy(source);

        if (angular.isUndefined(result) || result === null) {
            result = {};
        }
        if (angular.isUndefined(target) || target === null) {
            return result;
        }
        if (angular.isObject(target)) {
            for (var prop in target) {
                if (target.hasOwnProperty(prop)) {
                    result[prop] = overrideProperties(result[prop], target[prop]);
                }
            }
        } else {
            result = angular.copy(target);
        }
        return result;
    }

    /**
     * Delete the property from the given object
     * @param obj the object
     * @param propertyName the property name
     */
    function deleteProperty(obj, propertyName) {
        if (angular.isObject(obj)) {
            delete obj[propertyName];
        }
    }

    /**
     * Resolve any promises from a given object if there are any.
     * @param obj the object
     * @param excludedPropertiesName the list of properties to ignore
     * @returns {promise} the promise that the object attributes promises are all resolved
     */
    function resolveObjectPromises(obj, excludedPropertiesName) {
        var defer = $q.defer(),
            promises = [],
            resolvedObj = {},
            excludedProp = excludedPropertiesName || [];
        if (!angular.isObject(obj) || angular.isArray(obj)) {
            defer.resolve(obj);
        } else {
            resolvedObj = angular.extend(resolvedObj, obj);
            for (var prop in resolvedObj) {
                if (resolvedObj.hasOwnProperty(prop) && $.inArray(prop, excludedProp) === -1) {
                    if (angular.isArray(resolvedObj[prop])) {
                        promises.push(resolveArrayPromises(resolvedObj[prop]));
                    } else {
                        promises.push($q.when(resolvedObj[prop]));
                    }
                }
            }
            $q.all(promises).then(function(result) {
                var index = 0;
                for (var prop in resolvedObj) {
                    if (resolvedObj.hasOwnProperty(prop) && $.inArray(prop, excludedProp) === -1) {
                        resolvedObj[prop] = result[index++];
                    }
                }
                defer.resolve(resolvedObj);
            });
        }
        return defer.promise;
    }

    /**
     * Resolve the given array promises
     * @param array the array containing promise or not
     * @returns {promise} the promise that the array contains a list of objects/values promises that are resolved
     */
    function resolveArrayPromises(array) {
        var defer = $q.defer(),
            promises = [],
            resolveArray = [];
        if (!angular.isArray(array)) {
            defer.resolve(array);
        } else {
            angular.forEach(array, function(item) {
                if (angular.isObject(item)) {
                    promises.push(resolveObjectPromises(item));
                } else {
                    promises.push($q.when(item));
                }
            });
            $q.all(promises).then(function(result) {
                angular.forEach(result, function(item) {
                    resolveArray.push(item);
                });
                defer.resolve(resolveArray);
            });
        }
        return defer.promise;
    }
}

/* @ngInject */
function failzQ($q, $timeout) {
    var DEFAULT_TIME = 1000;
    /**
     * failzQ wrap a promise and reject the promise if not resolved with a given time
     */
    return function(promise, time) {
        var defer = $q.defer();
        var t = time || DEFAULT_TIME;

        $timeout(function() {
            defer.reject('Not resolved within ' + t);
        }, t);

        $q.when(promise).then(function(result) {
            defer.resolve(result);
        }, function(failure) {
            defer.reject(failure);
        });
        return defer.promise;
    };
}
