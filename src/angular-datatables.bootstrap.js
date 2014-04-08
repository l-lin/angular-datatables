/*jshint camelcase: false */
(function(window, document, $, angular) {
    'use strict';

    angular.module('datatable.bootstrap.tabletools', []).service('$DTBootstrapTableTools', function() {
        var _initializedTableTools = false;
        this.integrate = function() {
            if (!_initializedTableTools) {
                /*
                 * TableTools Bootstrap compatibility
                 * Required TableTools 2.1+
                 */
                if ($.fn.DataTable.TableTools) {
                    // Set the classes that TableTools uses to something suitable for Bootstrap
                    $.extend(true, $.fn.DataTable.TableTools.classes, {
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
                    });
    
                    // Have the collection use a bootstrap compatible dropdown
                    $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
                        collection: {
                            container: 'ul',
                            button: 'li',
                            liner: 'a'
                        }
                    });
                }
    
                _initializedTableTools = true;
            }
        };
    });
    
    angular.module('datatables.bootstrap.colvis', []).service('$DTBootstrapColVis', function() {
        var _initializedColVis = false;
        this.integrate = function(addDrawCallbackFunction) {
            if (!_initializedColVis) {
                /* ColVis Bootstrap compatibility */
                if ($.fn.DataTable.ColVis) {
                    addDrawCallbackFunction(function() {
                        $('.ColVis_MasterButton').addClass('btn btn-default');
                        $('.ColVis_Button').removeClass('ColVis_Button');
                    });
                }
    
                _initializedColVis = true;
            }
        };
    });
    
    /**
     * Source: https://editor.datatables.net/release/DataTables/extras/Editor/examples/bootstrap.html
     */
    angular.module('datatables.bootstrap', ['datatable.bootstrap.tabletools', 'datatables.bootstrap.colvis']).
    service('$DTBootstrap', function($DTBootstrapTableTools, $DTBootstrapColVis) {
        var _initialized = false,
            _drawCallbackFunctionList = [];
        
        var _overrideClasses = function() {
            /* Default class modification */
            $.extend($.fn.dataTableExt.oStdClasses, {
                'sWrapper': 'dataTables_wrapper form-inline',
                'sFilterInput': 'form-control input-sm',
                'sLengthSelect': 'form-control input-sm',
                'sFilter': 'dataTables_filter',
                'sLength': 'dataTables_length'
            });
        };
        var _overridePagingInfo = function() {
            /* API method to get paging information */
            $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings) {
                return {
                    'iStart': oSettings._iDisplayStart,
                    'iEnd': oSettings.fnDisplayEnd(),
                    'iLength': oSettings._iDisplayLength,
                    'iTotal': oSettings.fnRecordsTotal(),
                    'iFilteredTotal': oSettings.fnRecordsDisplay(),
                    'iPage': oSettings._iDisplayLength === -1 ? 0 : Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
                    'iTotalPages': oSettings._iDisplayLength === -1 ? 0 : Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
                };
            };
        };
        var _overridePagination = function() {
            var _fnInit = function(oSettings, nPaging, fnDraw) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function(e) {
                    e.preventDefault();
                    if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                        fnDraw(oSettings);
                    }
                };
                $(nPaging).append(
                    '<ul class="pagination">' +
                    '<li class="prev disabled"><a href="#">&larr; ' + oLang.sPrevious + '</a></li>' +
                    '<li class="next disabled"><a href="#">' + oLang.sNext + ' &rarr; </a></li>' +
                    '</ul>');
                var els = $('a', nPaging);
                $(els[0]).bind('click.DT', {
                    action: 'previous'
                }, fnClickHandler);
                $(els[1]).bind('click.DT', {
                    action: 'next'
                }, fnClickHandler);
            };
            var _fnUpdate = function(oSettings, fnDraw) {
                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo();
                var an = oSettings.aanFeatures.p;
                var i, ien, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);
    
                if (oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                } else if (oPaging.iPage <= iHalf) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }
    
                var fnPaging = function(e) {
                    e.preventDefault();
                    oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                    fnDraw(oSettings);
                };
    
                for (i = 0, ien = an.length; i < ien; i++) {
                    // Remove the middle elements
                    $('li:gt(0)', an[i]).filter(':not(:last)').remove();
    
                    // Add the new list items and their event handlers
                    for (j = iStart; j <= iEnd; j++) {
                        sClass = (j === oPaging.iPage + 1) ? 'class="active"' : '';
                        $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                            .insertBefore($('li:last', an[i])[0])
                            .bind('click', fnPaging);
                    }
    
                    // Add / remove disabled classes from the static elements
                    if (oPaging.iPage === 0) {
                        $('li:first', an[i]).addClass('disabled');
                    } else {
                        $('li:first', an[i]).removeClass('disabled');
                    }
    
                    if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                        $('li:last', an[i]).addClass('disabled');
                    } else {
                        $('li:last', an[i]).removeClass('disabled');
                    }
                }
            };
            /* Bootstrap style pagination control */
            $.extend($.fn.dataTableExt.oPagination, {
                'bootstrap': {
                    fnInit: _fnInit,
                    fnUpdate: _fnUpdate
                }
            });
        };
        
        var _addDrawCallbackFunction = function(fn) {
            if (angular.isFunction(fn)) {
                _drawCallbackFunctionList.push(fn);
            }
        };

        var _init = function() {
            if (!_initialized) {
                _overrideClasses();
                _overridePagingInfo();
                _overridePagination();
    
                _addDrawCallbackFunction(function() {
                    $('div.dataTables_filter').find('input').addClass('form-control');
                    $('div.dataTables_length').find('select').addClass('form-control');
                });
    
                _initialized = true;
            }
        };

        /**
         * Integrate Bootstrap
         * @param options the datatables options
         */
        this.integrate = function(options) {
            _init();
            $DTBootstrapTableTools.integrate();
            $DTBootstrapColVis.integrate(_addDrawCallbackFunction);
            
            // TODO: It currently applies the bootstrap integration to all tables...
            options.sDom = '<\'row\'<\'col-xs-6\'l><\'col-xs-6\'f>r>t<\'row\'<\'col-xs-6\'i><\'col-xs-6\'p>>';
            options.sPaginationType = 'bootstrap';
            if (angular.isUndefined(options.fnDrawCallback)) {
                // Call every drawcallback functions
                options.fnDrawCallback = function() {
                    for (var index = 0; index < _drawCallbackFunctionList.length; index++) {
                        _drawCallbackFunctionList[index]();
                    }
                };
            }
        };
    });

})(window, document, jQuery, angular);
