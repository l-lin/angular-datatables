/*jshint camelcase: false */
'use strict';

angular.module('datatables.bootstrap.tabletools', ['datatables.bootstrap.options', 'datatables.util'])
    .service('DTBootstrapTableTools', dtBootstrapTableTools);

/* @ngInject */
function dtBootstrapTableTools(DTPropertyUtil, DTBootstrapDefaultOptions) {
    var _initializedTableTools = false,
        _savedFn = {};

    return {
        integrate: integrate,
        deIntegrate: deIntegrate
    };

    function integrate(bootstrapOptions) {
        if (!_initializedTableTools) {
            _saveFnToBeOverrided();

            /*
             * TableTools Bootstrap compatibility
             * Required TableTools 2.1+
             */
            if ($.fn.DataTable.TableTools) {
                var tableToolsOptions = DTPropertyUtil.overrideProperties(
                    DTBootstrapDefaultOptions.getOptions().TableTools,
                    bootstrapOptions ? bootstrapOptions.TableTools : null
                );
                // Set the classes that TableTools uses to something suitable for Bootstrap
                $.extend(true, $.fn.DataTable.TableTools.classes, tableToolsOptions.classes);

                // Have the collection use a bootstrap compatible dropdown
                $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, tableToolsOptions.DEFAULTS.oTags);
            }

            _initializedTableTools = true;
        }
    }

    function deIntegrate() {
        if (_initializedTableTools && $.fn.DataTable.TableTools && _savedFn.TableTools) {
            $.extend(true, $.fn.DataTable.TableTools.classes, _savedFn.TableTools.classes);
            $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, _savedFn.TableTools.oTags);
            _initializedTableTools = false;
        }
    }

    function _saveFnToBeOverrided() {
        if ($.fn.DataTable.TableTools) {
            _savedFn.TableTools = {
                classes: angular.copy($.fn.DataTable.TableTools.classes),
                oTags: angular.copy($.fn.DataTable.TableTools.DEFAULTS.oTags)
            };
        }
    }
}
