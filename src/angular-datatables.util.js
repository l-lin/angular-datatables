'use strict';
angular.module('datatables.util', []).factory('DTPropertyUtil', function () {
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
        }
    };
});
