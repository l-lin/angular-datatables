'use strict';
angular.module('datatables.bootstrap.colvis', ['datatables.bootstrap.options', 'datatables.util'])
    .service('DTBootstrapColVis', dtBootstrapColVis);

/* @ngInject */
function dtBootstrapColVis(DTPropertyUtil, DTBootstrapDefaultOptions) {
    var _initializedColVis = false;
    return {
        integrate: integrate,
        deIntegrate: deIntegrate
    };

    function integrate(addDrawCallbackFunction, bootstrapOptions) {
        if (!_initializedColVis) {
            var colVisProperties = DTPropertyUtil.overrideProperties(
                DTBootstrapDefaultOptions.getOptions().ColVis,
                bootstrapOptions ? bootstrapOptions.ColVis : null
            );
            /* ColVis Bootstrap compatibility */
            if ($.fn.DataTable.ColVis) {
                addDrawCallbackFunction(function() {
                    $('.ColVis_MasterButton').attr('class', 'ColVis_MasterButton ' + colVisProperties.classes.masterButton);
                    $('.ColVis_Button').removeClass('ColVis_Button');
                });
            }

            _initializedColVis = true;
        }
    }

    function deIntegrate() {
        if (_initializedColVis && $.fn.DataTable.ColVis) {
            _initializedColVis = false;
        }
    }
}
