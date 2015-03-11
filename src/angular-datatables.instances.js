'use strict';

angular.module('datatables.instances', [])
    .factory('DTInstances', dtInstances)
    .factory('DTInstanceFactory', dtInstanceFactory);

/* @ngInject */
function dtInstances($q) {
    var _instances = {};
    // Promise for fetching the last DT instance
    var _deferLastDTInstance = $q.defer();
    var _lastDTInstance = null;
    // Promise for fetching the list of DT instances
    var _deferDTInstances = $q.defer();
    return {
        register: register,
        getLast: getLast,
        getList: getList
    };

    function register(dtInstance, result) {
        dtInstance.id = result.id;
        dtInstance.DataTable = result.DataTable;
        dtInstance.dataTable = result.dataTable;

        _instances[dtInstance.id] = dtInstance;
        _lastDTInstance = dtInstance;

        //previous promise
        _deferDTInstances.resolve(_instances);
        _deferLastDTInstance.resolve(_lastDTInstance);

        //new promise
        _deferDTInstances = $q.defer();
        _deferLastDTInstance = $q.defer();

        _deferDTInstances.resolve(_instances);
        _deferLastDTInstance.resolve(_lastDTInstance);

        return dtInstance;
    }

    function getLast() {
        var defer = $q.defer();
        _deferLastDTInstance.promise.then(function(lastInstance) {
            defer.resolve(lastInstance);
        });
        return defer.promise;
    }

    function getList() {
        var defer = $q.defer();
        _deferDTInstances.promise.then(function(instances) {
            defer.resolve(instances);
        });
        return defer.promise;
    }
}

function dtInstanceFactory() {
    var DTInstance = {
        reloadData: reloadData,
        changeData: changeData,
        rerender: rerender
    };
    return {
        newDTInstance: newDTInstance
    };

    function newDTInstance(renderer) {
        var dtInstance = Object.create(DTInstance);
        dtInstance._renderer = renderer;
        return dtInstance;
    }

    function reloadData() {
        /*jshint validthis:true */
        this._renderer.reloadData();
    }

    function changeData(data) {
        /*jshint validthis:true */
        this._renderer.changeData(data);
    }

    function rerender() {
        /*jshint validthis:true */
        this._renderer.rerender();
    }
}
