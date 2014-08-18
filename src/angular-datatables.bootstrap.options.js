/**
 * Created by llin on 16/08/14.
 */
(function (angular) {
    'use strict';
    angular.module('datatables.bootstrap.options', []).constant('DT_BOOTSTRAP_DEFAULT_OPTIONS', {
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
        dom: '<\'row\'<\'col-xs-6\'l><\'col-xs-6\'f>r>t<\'row\'<\'col-xs-6\'i><\'col-xs-6\'p>>'
    });
})(angular);
