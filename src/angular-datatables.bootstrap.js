(function($, angular) {
    'use strict';
    /**
     * Source: https://editor.datatables.net/release/DataTables/extras/Editor/examples/bootstrap.html
     */
    angular.module('datatables.bootstrap', []).service('$DTBootstrap', function() {
        this.initialized = false;
        this.init = function() {
            if (this.initialized) {
                return;
            }
            /* Default class modification */
            $.extend($.fn.dataTableExt.oStdClasses, {
                'sWrapper': 'dataTables_wrapper form-inline',
                'sFilterInput': 'form-control input-sm',
                'sLengthSelect': 'form-control input-sm'
            });

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

            /* Bootstrap style pagination control */
            $.extend($.fn.dataTableExt.oPagination, {
                'bootstrap': {
                    'fnInit': function(oSettings, nPaging, fnDraw) {
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
                    },

                    'fnUpdate': function(oSettings, fnDraw) {
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
                    }
                }
            });
            this.initialized = true;
        };
        this.integrate = function(options) {
            this.init();
            
            // TODO: It currently apply the integration to all tables...
            
            options.sDom = '<\'row\'<\'col-xs-6\'l><\'col-xs-6\'f>r>t<\'row\'<\'col-xs-6\'i><\'col-xs-6\'p>>';
            options.sPaginationType = 'bootstrap';

            /* Set the defaults for DataTables initialisation */
            // $.extend(true, options, {
            //     'sDom': '<\'row\'<\'col-xs-6\'l><\'col-xs-6\'f>r>t<\'row\'<\'col-xs-6\'i><\'col-xs-6\'p>>',
            //     'sPaginationType': 'bootstrap',
            //     'oLanguage': {
            //         'sLengthMenu': '_MENU_ records per page'
            //     }
            // });
        };
    });

})(jQuery, angular);