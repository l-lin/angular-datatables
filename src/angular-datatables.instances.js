'use strict';

angular.module('datatables.instances', ['datatables.util'])
    .factory('DTInstanceFactory', dtInstanceFactory);

function dtInstanceFactory() {
    var DTInstance = {
        reloadData: reloadData,
        changeData: changeData,
        rerender: rerender
    };
    return {
        newDTInstance: newDTInstance,
        copyDTProperties: copyDTProperties
    };

    function newDTInstance(renderer) {
        var dtInstance = Object.create(DTInstance);
        dtInstance._renderer = renderer;
        return dtInstance;
    }

    function copyDTProperties(result, dtInstance) {
        dtInstance.id = result.id;
        dtInstance.DataTable = result.DataTable;
        dtInstance.dataTable = result.dataTable;
    }

    function reloadData(callback, resetPaging) {
        /*jshint validthis:true */
        this._renderer.reloadData(callback, resetPaging);
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
