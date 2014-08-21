(function (angular) {
    'use strict';
    angular.module('datatables.util', []).factory('$DTPropertyUtil', function () {
        return {
            /**
             * Overrides the source property with the given target properties.
             * Source is not written. It's making a fresh copy of it in order to ensure that we do not change the parameters.
             * @param source the source properties to override
             * @param target the target properties
             * @returns {*} the object overrided
             */
            overrideProperties: function (source, target) {
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
                            result[prop] = this.overrideProperties(result[prop], target[prop]);
                        }
                    }
                } else {
                    result = angular.copy(target);
                }
                return result;
            },
            /**
             * Find the first array data property from the given scope.
             * It
             * @param scope the scope
             * @returns {string} the property
             */
            findDataPropFromScope: function (scope) {
                for (var prop in scope) {
                    if (prop.indexOf('$', 0) !== 0 && scope.hasOwnProperty(prop) && angular.isArray(scope[prop])) {
                        return prop;
                    }
                }
                throw new Error('Cannot find the data property from the scope');
            }
        };
    });
})(angular);
