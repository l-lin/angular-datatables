/*jshint camelcase: false */
'use strict';

angular.module('datatables.bootstrap.tabletools', ['datatables.bootstrap.options', 'datatables.util'])
.service('DTBootstrapTableTools', function (DTPropertyUtil, DTBootstrapDefaultOptions) {
    var _initializedTableTools = false,
        _savedFn = {},
        _saveFnToBeOverrided = function () {
            if ($.fn.DataTable.TableTools) {
                _savedFn.TableTools = {
                    classes: angular.copy($.fn.DataTable.TableTools.classes),
                    oTags: angular.copy($.fn.DataTable.TableTools.DEFAULTS.oTags)
                };
            }
        };
    this.integrate = function (bootstrapOptions) {
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
    };
    this.deIntegrate = function () {
        if (_initializedTableTools && $.fn.DataTable.TableTools && _savedFn.TableTools) {
            $.extend(true, $.fn.DataTable.TableTools.classes, _savedFn.TableTools.classes);
            $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, _savedFn.TableTools.oTags);
            _initializedTableTools = false;
        }
    };
});

angular.module('datatables.bootstrap.colvis', ['datatables.bootstrap.options', 'datatables.util'])
.service('DTBootstrapColVis', function (DTPropertyUtil, DTBootstrapDefaultOptions) {
    var _initializedColVis = false;
    this.integrate = function (addDrawCallbackFunction, bootstrapOptions) {
        if (!_initializedColVis) {
            var colVisProperties = DTPropertyUtil.overrideProperties(
                DTBootstrapDefaultOptions.getOptions().ColVis,
                bootstrapOptions ? bootstrapOptions.ColVis : null
            );
            /* ColVis Bootstrap compatibility */
            if ($.fn.DataTable.ColVis) {
                addDrawCallbackFunction(function () {
                    $('.ColVis_MasterButton').attr('class', 'ColVis_MasterButton ' + colVisProperties.classes.masterButton);
                    $('.ColVis_Button').removeClass('ColVis_Button');
                });
            }

            _initializedColVis = true;
        }
    };
    this.deIntegrate = function () {
        if (_initializedColVis && $.fn.DataTable.ColVis) {
            _initializedColVis = false;
        }
    };
});

/**
 * Source: https://editor.datatables.net/release/DataTables/extras/Editor/examples/bootstrap.html
 */
angular.module('datatables.bootstrap', ['datatables.bootstrap.options', 'datatables.bootstrap.tabletools', 'datatables.bootstrap.colvis'])
.service('DTBootstrap', function (DTBootstrapTableTools, DTBootstrapColVis, DTBootstrapDefaultOptions) {
    var _initialized = false,
        _drawCallbackFunctionList = [],
        _savedFn = {};

    var _saveFnToBeOverrided = function () {
        _savedFn.oStdClasses = angular.copy($.fn.dataTableExt.oStdClasses);
        _savedFn.fnPagingInfo = $.fn.dataTableExt.oApi.fnPagingInfo;
        _savedFn.renderer = angular.copy($.fn.DataTable.ext.renderer);
        if ($.fn.DataTable.TableTools) {
            _savedFn.TableTools = {
                classes: angular.copy($.fn.DataTable.TableTools.classes),
                oTags: angular.copy($.fn.DataTable.TableTools.DEFAULTS.oTags)
            };
        }
    }, _revertToDTFn = function () {
        $.extend($.fn.dataTableExt.oStdClasses, _savedFn.oStdClasses);
        $.fn.dataTableExt.oApi.fnPagingInfo = _savedFn.fnPagingInfo;
        $.extend(true, $.fn.DataTable.ext.renderer, _savedFn.renderer);
    };

    var _overrideClasses = function () {
        /* Default class modification */
        $.extend($.fn.dataTableExt.oStdClasses, {
            'sWrapper': 'dataTables_wrapper form-inline',
            'sFilterInput': 'form-control input-sm',
            'sLengthSelect': 'form-control input-sm',
            'sFilter': 'dataTables_filter',
            'sLength': 'dataTables_length'
        });
    };
    var _overridePagingInfo = function () {
        /* API method to get paging information */
        $.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings) {
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
    var _overridePagination = function () {
        // Note: Copy paste with some changes from DataTables v1.10.1 source code
        $.extend(true, $.fn.DataTable.ext.renderer, {
            pageButton: {
                _: function (settings, host, idx, buttons, page, pages) {
                    var classes = settings.oClasses;
                    var lang = settings.oLanguage.oPaginate;
                    var btnDisplay, btnClass, counter = 0;
                    var $paginationContainer = $('<ul></ul>', {
                        'class': 'pagination'
                    });

                    var attach = function (container, buttons) {
                        var i, ien, node, button;
                        var clickHandler = function (e) {
                            e.preventDefault();
                            // IMPORTANT: Reference to internal functions of DT. It might change between versions
                            $.fn.DataTable.ext.internal._fnPageChange(settings, e.data.action, true);
                        };


                        for (i = 0, ien = buttons.length; i < ien; i++) {
                            button = buttons[i];

                            if ($.isArray(button)) {
                                // Override DT element
                                button.DT_el = 'li';
                                var inner = $('<' + (button.DT_el || 'div') + '/>')
                                    .appendTo($paginationContainer);
                                attach(inner, button);
                            }
                            else {
                                btnDisplay = '';
                                btnClass = '';
                                var $paginationBtn = $('<li></li>'),
                                    isDisabled;

                                switch (button) {
                                    case 'ellipsis':
                                        $paginationContainer.append('<li class="disabled"><a href="#" onClick="event.preventDefault()">&hellip;</a></li>');
                                        break;

                                    case 'first':
                                        btnDisplay = lang.sFirst;
                                        btnClass = button;
                                        if (page <= 0) {
                                            $paginationBtn.addClass(classes.sPageButtonDisabled);
                                            isDisabled = true;
                                        }
                                        break;

                                    case 'previous':
                                        btnDisplay = lang.sPrevious;
                                        btnClass = button;
                                        if (page <= 0) {
                                            $paginationBtn.addClass(classes.sPageButtonDisabled);
                                            isDisabled = true;
                                        }
                                        break;

                                    case 'next':
                                        btnDisplay = lang.sNext;
                                        btnClass = button;
                                        if (page >= pages - 1) {
                                            $paginationBtn.addClass(classes.sPageButtonDisabled);
                                            isDisabled = true;
                                        }
                                        break;

                                    case 'last':
                                        btnDisplay = lang.sLast;
                                        btnClass = button;
                                        if (page >= pages - 1) {
                                            $paginationBtn.addClass(classes.sPageButtonDisabled);
                                            isDisabled = true;
                                        }
                                        break;

                                    default:
                                        btnDisplay = button + 1;
                                        btnClass = '';
                                        if (page === button) {
                                            $paginationBtn.addClass(classes.sPageButtonActive);
                                        }
                                        break;
                                }

                                if (btnDisplay) {
                                    $paginationBtn.appendTo($paginationContainer);
                                    node = $('<a>', {
                                        'href': '#',
                                        'class': btnClass,
                                        'aria-controls': settings.sTableId,
                                        'data-dt-idx': counter,
                                        'tabindex': settings.iTabIndex,
                                        'id': idx === 0 && typeof button === 'string' ?
                                            settings.sTableId + '_' + button :
                                            null
                                    })
                                        .html(btnDisplay)
                                        .appendTo($paginationBtn);

                                    // IMPORTANT: Reference to internal functions of DT. It might change between versions
                                    $.fn.DataTable.ext.internal._fnBindAction(
                                        node, {action: button}, clickHandler
                                    );

                                    counter++;
                                }
                            }
                        }
                    };

                    // IE9 throws an 'unknown error' if document.activeElement is used
                    // inside an iframe or frame. Try / catch the error. Not good for
                    // accessibility, but neither are frames.
                    try {
                        // Because this approach is destroying and recreating the paging
                        // elements, focus is lost on the select button which is bad for
                        // accessibility. So we want to restore focus once the draw has
                        // completed
                        var activeEl = $(document.activeElement).data('dt-idx');

                        // Add <ul> to the pagination
                        var container = $(host).empty();
                        $paginationContainer.appendTo(container);
                        attach(container, buttons);

                        if (activeEl !== null) {
                            $(host).find('[data-dt-idx=' + activeEl + ']').focus();
                        }
                    }
                    catch (e) {
                    }
                }
            }
        });
    };

    var _addDrawCallbackFunction = function (fn) {
        if (angular.isFunction(fn)) {
            _drawCallbackFunctionList.push(fn);
        }
    };

    var _init = function () {
        if (!_initialized) {
            _saveFnToBeOverrided();
            _overrideClasses();
            _overridePagingInfo();
            _overridePagination();

            _addDrawCallbackFunction(function () {
                $('div.dataTables_filter').find('input').addClass('form-control');
                $('div.dataTables_length').find('select').addClass('form-control');
            });

            _initialized = true;
        }
    }, _setDom = function (options) {
        if (!options.hasOverrideDom) {
            var sDom = DTBootstrapDefaultOptions.getOptions().dom;
            if (options.hasColReorder) {
                sDom = 'R' + sDom;
            }
            if (options.hasColVis) {
                sDom = 'C' + sDom;
            }
            if (options.hasTableTools) {
                sDom = 'T' + sDom;
            }
            return sDom;
        }
        return options.sDom;
    };

    /**
     * Integrate Bootstrap
     * @param options the datatables options
     */
    this.integrate = function (options) {
        _init();
        DTBootstrapTableTools.integrate(options.bootstrap);
        DTBootstrapColVis.integrate(_addDrawCallbackFunction, options.bootstrap);

        options.sDom = _setDom(options);
        if (angular.isUndefined(options.fnDrawCallback)) {
            // Call every drawcallback functions
            options.fnDrawCallback = function () {
                for (var index = 0; index < _drawCallbackFunctionList.length; index++) {
                    _drawCallbackFunctionList[index]();
                }
            };
        }
    };

    this.deIntegrate = function () {
        if (_initialized) {
            _revertToDTFn();
            DTBootstrapTableTools.deIntegrate();
            DTBootstrapColVis.deIntegrate();
            _initialized = false;
        }
    };
});
