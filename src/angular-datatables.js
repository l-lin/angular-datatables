'use strict';

angular.module('datatables', ['datatables.directive', 'datatables.factory'])
    .run(initAngularDataTables);

/* @ngInject */
function initAngularDataTables() {
    if ($.fn.DataTable.Api) {
        /**
         * Register an API to destroy a DataTable without detaching the tbody so that we can add new data
         * when rendering with the "Angular way".
         */
        $.fn.DataTable.Api.register('ngDestroy()', function(remove) {
            remove = remove || false;

            return this.iterator('table', function(settings) {
                var orig = settings.nTableWrapper.parentNode;
                var classes = settings.oClasses;
                var table = settings.nTable;
                var tbody = settings.nTBody;
                var thead = settings.nTHead;
                var tfoot = settings.nTFoot;
                var jqTable = $(table);
                var jqTbody = $(tbody);
                var jqWrapper = $(settings.nTableWrapper);
                var rows = $.map(settings.aoData, function(r) {
                    return r.nTr;
                });
                var ien;

                // Flag to note that the table is currently being destroyed - no action
                // should be taken
                settings.bDestroying = true;

                // Fire off the destroy callbacks for plug-ins etc
                $.fn.DataTable.ext.internal._fnCallbackFire(settings, 'aoDestroyCallback', 'destroy', [settings]);

                // If not being removed from the document, make all columns visible
                if (!remove) {
                    new $.fn.DataTable.Api(settings).columns().visible(true);
                }

                // Blitz all `DT` namespaced events (these are internal events, the
                // lowercase, `dt` events are user subscribed and they are responsible
                // for removing them
                jqWrapper.unbind('.DT').find(':not(tbody *)').unbind('.DT');
                $(window).unbind('.DT-' + settings.sInstance);

                // When scrolling we had to break the table up - restore it
                if (table !== thead.parentNode) {
                    jqTable.children('thead').detach();
                    jqTable.append(thead);
                }

                if (tfoot && table !== tfoot.parentNode) {
                    jqTable.children('tfoot').detach();
                    jqTable.append(tfoot);
                }

                // Remove the DataTables generated nodes, events and classes
                jqTable.detach();
                jqWrapper.detach();

                settings.aaSorting = [];
                settings.aaSortingFixed = [];
                $.fn.DataTable.ext.internal._fnSortingClasses(settings);

                $(rows).removeClass(settings.asStripeClasses.join(' '));

                $('th, td', thead).removeClass(classes.sSortable + ' ' +
                    classes.sSortableAsc + ' ' + classes.sSortableDesc + ' ' + classes.sSortableNone
                );

                if (settings.bJUI) {
                    $('th span.' + classes.sSortIcon + ', td span.' + classes.sSortIcon, thead).detach();
                    $('th, td', thead).each(function() {
                        var wrapper = $('div.' + classes.sSortJUIWrapper, this);
                        $(this).append(wrapper.contents());
                        wrapper.detach();
                    });
                }

                // -------------------------------------------------------------------------
                // This is the only change with the "destroy()" API (with DT v1.10.1)
                // -------------------------------------------------------------------------
                if (!remove && orig) {
                    // insertBefore acts like appendChild if !arg[1]
                    if (orig.contains(settings.nTableReinsertBefore)) {
                        orig.insertBefore(table, settings.nTableReinsertBefore);
                    } else {
                        orig.appendChild(table);
                    }
                }
                // Add the TR elements back into the table in their original order
                // jqTbody.children().detach();
                // jqTbody.append( rows );
                // -------------------------------------------------------------------------

                // Restore the width of the original table - was read from the style property,
                // so we can restore directly to that
                jqTable
                    .css('width', settings.sDestroyWidth)
                    .removeClass(classes.sTable);

                // If the were originally stripe classes - then we add them back here.
                // Note this is not fool proof (for example if not all rows had stripe
                // classes - but it's a good effort without getting carried away
                ien = settings.asDestroyStripes.length;

                if (ien) {
                    jqTbody.children().each(function(i) {
                        $(this).addClass(settings.asDestroyStripes[i % ien]);
                    });
                }

                /* Remove the settings object from the settings array */
                var idx = $.inArray(settings, $.fn.DataTable.settings);
                if (idx !== -1) {
                    $.fn.DataTable.settings.splice(idx, 1);
                }
            });
        });
    }
}
