(function(angular) {
    'use strict';
    angular.module('datatables', ['datatables.directive', 'datatables.factory', 'datatables.bootstrap']).
    value('DT_LAST_ROW_KEY', 'datatable:lastRow');
})(angular);
