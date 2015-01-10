'use strict';

angular.module('datatables.instances', [])
.factory('DTInstances', dtInstances)
.factory('DTInstanceFactory', dtInstanceFactory);

/* @ngInject */
function dtInstances($q) {
    var _instances = {};
    // Promise for fetching the last DT instance
    var _deferLastDTInstances = null;
    var _lastDTInstance = null;
    // Promise for fetching the list of DT instances
    var _deferDTInstances = null;
    var _dtInstances = null;
    return {
        register: register,
        getLast: getLast,
        getList: getList
    };

    function register(dtInstance) {
        _instances[dtInstance.id] = dtInstance;
        if (_deferLastDTInstances) {
            _deferLastDTInstances.resolve(dtInstance);
        }
        if (_deferDTInstances) {
            _deferDTInstances.resolve(_instances);
        }
    }

    function getLast() {
        var defer = $q.defer();
        if (!_lastDTInstance) {
            _deferLastDTInstances = $q.defer();
            _lastDTInstance = _deferLastDTInstances.promise;
        }
        _lastDTInstance.then(function (dtInstance) {
            defer.resolve(dtInstance);
            // Reset the promise
            _deferLastDTInstances = null;
            _lastDTInstance = null;
        });
        return defer.promise;
    }

    function getList() {
        var defer = $q.defer();
        _dtInstances.then(function (instances) {
            defer.resolve(instances);
            // Reset the promise
            _deferDTInstances = null;
            _dtInstances = null;
        });
        return defer.promise;
    }
}

function dtInstanceFactory() {
    var DTInstance = {};
    return {
        newDTInstance: newDTInstance
    };

    function newDTInstance() {
        return Object.create(DTInstance);
    }
}
