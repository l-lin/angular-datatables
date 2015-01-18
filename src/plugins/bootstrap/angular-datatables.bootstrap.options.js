'use strict';
angular.module('datatables.bootstrap.options', ['datatables.options', 'datatables.util'])
    .constant('DT_BOOTSTRAP_DEFAULT_OPTIONS', {
        TableTools: {
            classes: {
                container: 'DTTT btn-group',
                buttons: {
                    normal: 'btn btn-default',
                    disabled: 'disabled'
                },
                collection: {
                    container: 'DTTT_dropdown dropdown-menu',
                    buttons: {
                        normal: '',
                        disabled: 'disabled'
                    }
                },
                print: {
                    info: 'DTTT_print_info modal'
                },
                select: {
                    row: 'active'
                }
            },
            DEFAULTS: {
                oTags: {
                    collection: {
                        container: 'ul',
                        button: 'li',
                        liner: 'a'
                    }
                }
            }
        },
        ColVis: {
            classes: {
                masterButton: 'btn btn-default'
            }
        },
        pagination: {
            classes: {
                ul: 'pagination'
            }
        },
        dom: '<\'row\'<\'col-xs-6\'l><\'col-xs-6\'f>r>t<\'row\'<\'col-xs-6\'i><\'col-xs-6\'p>>'
    })
    .factory('DTBootstrapDefaultOptions', dtBootstrapDefaultOptions);

/* @ngInject */
function dtBootstrapDefaultOptions(DTDefaultOptions, DTPropertyUtil, DT_BOOTSTRAP_DEFAULT_OPTIONS) {
    return {
        getOptions: getOptions
    };
    /**
     * Get the default options for bootstrap integration
     * @returns {*} the bootstrap default options
     */
    function getOptions() {
        return DTPropertyUtil.overrideProperties(DT_BOOTSTRAP_DEFAULT_OPTIONS, DTDefaultOptions.bootstrapOptions);
    }
}
