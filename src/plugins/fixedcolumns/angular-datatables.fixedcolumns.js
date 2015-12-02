'use strict';

// See https://datatables.net/extensions/fixedcolumns/
angular.module('datatables.fixedcolumns', ['datatables'])
    .config(dtFixedColumnsConfig);

/* @ngInject */
function dtFixedColumnsConfig($provide) {
    $provide.decorator('DTOptionsBuilder', dtOptionsBuilderDecorator);

    function dtOptionsBuilderDecorator($delegate) {
        var newOptions = $delegate.newOptions;
        var fromSource = $delegate.fromSource;
        var fromFnPromise = $delegate.fromFnPromise;

        $delegate.newOptions = function() {
            return _decorateOptions(newOptions);
        };
        $delegate.fromSource = function(ajax) {
            return _decorateOptions(fromSource, ajax);
        };
        $delegate.fromFnPromise = function(fnPromise) {
            return _decorateOptions(fromFnPromise, fnPromise);
        };

        return $delegate;

        function _decorateOptions(fn, params) {
            var options = fn(params);
            options.withFixedColumns = withFixedColumns;
            return options;

            /**
             * Add fixed columns support
             * @param fixedColumnsOptions the plugin options
             * @returns {DTOptions} the options
             */
            function withFixedColumns(fixedColumnsOptions) {
                options.fixedColumns = true;
                if (fixedColumnsOptions) {
                    options.fixedColumns = fixedColumnsOptions;
                }
                return options;
            }
        }
    }
}
