/*!
 * angular-datatables - v0.2.0
 * https://github.com/l-lin/angular-datatables
 * License: MIT
 */
/*!
 * angular-datatables - v0.2.0
 * https://github.com/l-lin/angular-datatables
 * License: MIT
 */
/*jshint camelcase: false */
(function (window, document, $, angular) {
  'use strict';
  angular.module('datatables.bootstrap.tabletools', [
    'datatables.bootstrap.options',
    'datatables.util'
  ]).service('DTBootstrapTableTools', [
    'DTPropertyUtil',
    'DTBootstrapDefaultOptions',
    function (DTPropertyUtil, DTBootstrapDefaultOptions) {
      var _initializedTableTools = false, _savedFn = {}, _saveFnToBeOverrided = function () {
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
            var tableToolsOptions = DTPropertyUtil.overrideProperties(DTBootstrapDefaultOptions.getOptions().TableTools, bootstrapOptions ? bootstrapOptions.TableTools : null);
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
    }
  ]);
  angular.module('datatables.bootstrap.colvis', [
    'datatables.bootstrap.options',
    'datatables.util'
  ]).service('DTBootstrapColVis', [
    'DTPropertyUtil',
    'DTBootstrapDefaultOptions',
    function (DTPropertyUtil, DTBootstrapDefaultOptions) {
      var _initializedColVis = false;
      this.integrate = function (addDrawCallbackFunction, bootstrapOptions) {
        if (!_initializedColVis) {
          var colVisProperties = DTPropertyUtil.overrideProperties(DTBootstrapDefaultOptions.getOptions().ColVis, bootstrapOptions ? bootstrapOptions.ColVis : null);
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
    }
  ]);
  /**
     * Source: https://editor.datatables.net/release/DataTables/extras/Editor/examples/bootstrap.html
     */
  angular.module('datatables.bootstrap', [
    'datatables.bootstrap.options',
    'datatables.bootstrap.tabletools',
    'datatables.bootstrap.colvis'
  ]).service('DTBootstrap', [
    'DTBootstrapTableTools',
    'DTBootstrapColVis',
    'DTBootstrapDefaultOptions',
    function (DTBootstrapTableTools, DTBootstrapColVis, DTBootstrapDefaultOptions) {
      var _initialized = false, _drawCallbackFunctionList = [], _savedFn = {};
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
              var $paginationContainer = $('<ul></ul>', { 'class': 'pagination' });
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
                    var inner = $('<' + (button.DT_el || 'div') + '/>').appendTo($paginationContainer);
                    attach(inner, button);
                  } else {
                    btnDisplay = '';
                    btnClass = '';
                    var $paginationBtn = $('<li></li>'), isDisabled;
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
                        'id': idx === 0 && typeof button === 'string' ? settings.sTableId + '_' + button : null
                      }).html(btnDisplay).appendTo($paginationBtn);
                      // IMPORTANT: Reference to internal functions of DT. It might change between versions
                      $.fn.DataTable.ext.internal._fnBindAction(node, { action: button }, clickHandler);
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
              } catch (e) {
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
    }
  ]);
}(window, document, jQuery, angular));
/**
 * Created by llin on 16/08/14.
 */
(function (angular) {
  'use strict';
  angular.module('datatables.bootstrap.options', [
    'datatables.options',
    'datatables.util'
  ]).constant('DT_BOOTSTRAP_DEFAULT_OPTIONS', {
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
        print: { info: 'DTTT_print_info modal' },
        select: { row: 'active' }
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
    ColVis: { classes: { masterButton: 'btn btn-default' } },
    dom: '<\'row\'<\'col-xs-6\'l><\'col-xs-6\'f>r>t<\'row\'<\'col-xs-6\'i><\'col-xs-6\'p>>'
  }).service('DTBootstrapDefaultOptions', [
    'DTDefaultOptions',
    'DTPropertyUtil',
    'DT_BOOTSTRAP_DEFAULT_OPTIONS',
    function (DTDefaultOptions, DTPropertyUtil, DT_BOOTSTRAP_DEFAULT_OPTIONS) {
      /**
         * Get the default options for bootstrap integration
         * @returns {*} the bootstrap default options
         */
      this.getOptions = function () {
        return DTPropertyUtil.overrideProperties(DT_BOOTSTRAP_DEFAULT_OPTIONS, DTDefaultOptions.bootstrapOptions);
      };
    }
  ]);
}(angular));
(function (angular) {
  'use strict';
  angular.module('datatables.directive', [
    'datatables.renderer',
    'datatables.options'
  ]).directive('datatable', [
    'DT_DEFAULT_OPTIONS',
    'DTBootstrap',
    'DTRendererFactory',
    function (DT_DEFAULT_OPTIONS, DTBootstrap, DTRendererFactory) {
      return {
        restrict: 'A',
        scope: {
          dtOptions: '=',
          dtColumns: '=',
          dtColumnDefs: '=',
          datatable: '@'
        },
        compile: function (tElm) {
          var _staticHTML = tElm[0].innerHTML;
          return function postLink($scope, $elem, iAttrs, ctrl) {
            ctrl.showLoading($elem);
            $scope.$watch('[dtOptions, dtColumns, dtColumnDefs]', function () {
              ctrl.render($elem, ctrl.buildOptions(), _staticHTML);
            }, true);
          };
        },
        controller: [
          '$scope',
          function ($scope) {
            this.showLoading = function ($elem) {
              DTRendererFactory.showLoading($elem);
            };
            this.buildOptions = function () {
              // Build options
              var options;
              if (angular.isDefined($scope.dtOptions)) {
                options = {};
                angular.extend(options, $scope.dtOptions);
                // Set the columns
                if (angular.isArray($scope.dtColumns)) {
                  options.aoColumns = $scope.dtColumns;
                }
                // Set the column defs
                if (angular.isArray($scope.dtColumnDefs)) {
                  options.aoColumnDefs = $scope.dtColumnDefs;
                }
                // Integrate bootstrap (or not)
                if (options.integrateBootstrap) {
                  DTBootstrap.integrate(options);
                } else {
                  DTBootstrap.deIntegrate();
                }
              }
              return options;
            };
            this.render = function ($elem, options, staticHTML) {
              var isNgDisplay = $scope.datatable && $scope.datatable === 'ng';
              // Render dataTable
              DTRendererFactory.fromOptions(options, isNgDisplay).render($scope, $elem, staticHTML);
            };
          }
        ]
      };
    }
  ]);
}(angular));
(function ($, angular) {
  'use strict';
  angular.module('datatables.factory', [
    'datatables.bootstrap',
    'datatables.options'
  ]).factory('DTOptionsBuilder', [
    'DT_DEFAULT_OPTIONS',
    function (DT_DEFAULT_OPTIONS) {
      /**
         * Optional class to handle undefined or null
         * @param obj the object to wrap
         */
      var Optional = function (obj) {
        this.obj = obj;
        /**
             * Check if the wrapped object is defined
             * @returns true if the wrapped object is defined, false otherwise
             */
        this.isPresent = function () {
          return angular.isDefined(this.obj) && this.obj !== null;
        };
        /**
             * Return the wrapped object or an empty object
             * @returns the wrapped objector an empty object
             */
        this.orEmptyObj = function () {
          if (this.isPresent()) {
            return this.obj;
          }
          return {};
        };
        /**
             * Return the wrapped object or the given second choice
             * @returns the wrapped object or the given second choice
             */
        this.or = function (secondChoice) {
          if (this.isPresent()) {
            return this.obj;
          }
          return secondChoice;
        };
      };
      /**
         * Wrap the given objec
         * @param obj the object to wrap
         * @returns {Optional} the optional of the wrapped object
         */
      var fromNullable = function (obj) {
        return new Optional(obj);
      };
      /**
         * The wrapped datatables options class
         * @param sAjaxSource the ajax source to fetch the data
         * @param fnPromise the function that returns a promise to fetch the data
         */
      var DTOptions = {
          integrateBootstrap: false,
          hasColVis: false,
          hasColReorder: false,
          hasTableTools: false,
          hasOverrideDom: false,
          reloadData: function () {
            this.reload = true;
            return this;
          },
          withOption: function (key, value) {
            if (angular.isString(key)) {
              this[key] = value;
            }
            return this;
          },
          withSource: function (sAjaxSource) {
            this.sAjaxSource = sAjaxSource;
            return this;
          },
          withDataProp: function (sAjaxDataProp) {
            this.sAjaxDataProp = sAjaxDataProp;
            return this;
          },
          withFnServerData: function (fn) {
            if (!angular.isFunction(fn)) {
              throw new Error('The parameter must be a function');
            }
            this.fnServerData = fn;
            return this;
          },
          withPaginationType: function (sPaginationType) {
            if (angular.isString(sPaginationType)) {
              this.sPaginationType = sPaginationType;
            } else {
              throw new Error('The pagination type must be provided');
            }
            return this;
          },
          withLanguage: function (oLanguage) {
            this.oLanguage = oLanguage;
            return this;
          },
          withLanguageSource: function (sLanguageSource) {
            return this.withLanguage({ sUrl: sLanguageSource });
          },
          withDisplayLength: function (iDisplayLength) {
            this.iDisplayLength = iDisplayLength;
            return this;
          },
          withFnPromise: function (fnPromise) {
            this.fnPromise = fnPromise;
            return this;
          },
          withDOM: function (sDom) {
            this.sDom = sDom;
            this.hasOverrideDom = true;
            return this;
          },
          withBootstrap: function () {
            this.integrateBootstrap = true;
            // Override page button active CSS class
            if (angular.isObject(this.oClasses)) {
              this.oClasses.sPageButtonActive = 'active';
            } else {
              this.oClasses = { sPageButtonActive: 'active' };
            }
            return this;
          },
          withBootstrapOptions: function (bootstrapOptions) {
            this.bootstrap = bootstrapOptions;
            return this;
          },
          withColReorderOption: function (key, value) {
            if (angular.isString(key)) {
              this.oColReorder = fromNullable(this.oColReorder).orEmptyObj();
              this.oColReorder[key] = value;
            }
            return this;
          },
          withColReorder: function () {
            var colReorderPrefix = 'R';
            this.sDom = colReorderPrefix + fromNullable(this.sDom).or(DT_DEFAULT_OPTIONS.dom);
            this.hasColReorder = true;
            return this;
          },
          withColReorderOrder: function (aiOrder) {
            if (angular.isArray(aiOrder)) {
              this.withColReorderOption('aiOrder', aiOrder);
            }
            return this;
          },
          withColReorderCallback: function (fnReorderCallback) {
            if (angular.isFunction(fnReorderCallback)) {
              this.withColReorderOption('fnReorderCallback', fnReorderCallback);
            } else {
              throw new Error('The reorder callback must be a function');
            }
            return this;
          },
          withColVisOption: function (key, value) {
            if (angular.isString(key)) {
              this.oColVis = fromNullable(this.oColVis).orEmptyObj();
              this.oColVis[key] = value;
            }
            return this;
          },
          withColVis: function () {
            var colVisPrefix = 'C';
            this.sDom = colVisPrefix + fromNullable(this.sDom).or(DT_DEFAULT_OPTIONS.dom);
            this.hasColVis = true;
            return this;
          },
          withColVisStateChange: function (fnStateChange) {
            if (angular.isFunction(fnStateChange)) {
              this.withColVisOption('fnStateChange', fnStateChange);
            } else {
              throw new Error('The state change must be a function');
            }
            return this;
          },
          withTableToolsOption: function (key, value) {
            if (angular.isString(key)) {
              this.oTableTools = fromNullable(this.oTableTools).orEmptyObj();
              this.oTableTools[key] = value;
            }
            return this;
          },
          withTableTools: function (sSwfPath) {
            var tableToolsPrefix = 'T';
            this.sDom = tableToolsPrefix + fromNullable(this.sDom).or(DT_DEFAULT_OPTIONS.dom);
            this.hasTableTools = true;
            if (angular.isString(sSwfPath)) {
              this.withTableToolsOption('sSwfPath', sSwfPath);
            }
            return this;
          },
          withTableToolsButtons: function (aButtons) {
            if (angular.isArray(aButtons)) {
              this.withTableToolsOption('aButtons', aButtons);
            }
            return this;
          }
        };
      return {
        newOptions: function () {
          return Object.create(DTOptions);
        },
        fromSource: function (sAjaxSource) {
          var options = Object.create(DTOptions);
          options.sAjaxSource = sAjaxSource;
          return options;
        },
        fromFnPromise: function (fnPromise) {
          var options = Object.create(DTOptions);
          options.fnPromise = fnPromise;
          return options;
        }
      };
    }
  ]).factory('DTColumnBuilder', function () {
    /**
         * The wrapped datatables column 
         * @param mData the data to display of the column
         * @param sTitle the sTitle of the column title to display in the DOM
         */
    var DTColumn = {
        withOption: function (key, value) {
          if (angular.isString(key)) {
            this[key] = value;
          }
          return this;
        },
        withTitle: function (sTitle) {
          this.sTitle = sTitle;
          return this;
        },
        withClass: function (sClass) {
          this.sClass = sClass;
          return this;
        },
        notVisible: function () {
          this.bVisible = false;
          return this;
        },
        notSortable: function () {
          this.bSortable = false;
          return this;
        },
        renderWith: function (mRender) {
          this.mRender = mRender;
          return this;
        }
      };
    return {
      newColumn: function (mData, sTitle) {
        if (angular.isUndefined(mData)) {
          throw new Error('The parameter "mData" is not defined!');
        }
        var column = Object.create(DTColumn);
        column.mData = mData;
        column.sTitle = sTitle || '';
        return column;
      },
      DTColumn: DTColumn
    };
  }).factory('DTColumnDefBuilder', [
    'DTColumnBuilder',
    function (DTColumnBuilder) {
      return {
        newColumnDef: function (targets) {
          if (angular.isUndefined(targets)) {
            throw new Error('The parameter "targets" must be defined! See https://datatables.net/reference/option/columnDefs.targets');
          }
          var column = Object.create(DTColumnBuilder.DTColumn);
          if (angular.isArray(targets)) {
            column.aTargets = targets;
          } else {
            column.aTargets = [targets];
          }
          return column;
        }
      };
    }
  ]).factory('DTLoadingTemplate', function () {
    return { html: '<h3 class="dt-loading">Loading...</h3>' };
  });
}(jQuery, angular));
(function (angular, $) {
  'use strict';
  angular.module('datatables', [
    'datatables.directive',
    'datatables.factory',
    'datatables.bootstrap'
  ]).run(function () {
    if ($.fn.DataTable.Api) {
      /**
             * Register an API to destroy a DataTable without detaching the tbody so that we can add new data
             * when rendering with the "Angular way".
             */
      $.fn.DataTable.Api.register('ngDestroy()', function (remove) {
        remove = remove || false;
        return this.iterator('table', function (settings) {
          var orig = settings.nTableWrapper.parentNode;
          var classes = settings.oClasses;
          var table = settings.nTable;
          var tbody = settings.nTBody;
          var thead = settings.nTHead;
          var tfoot = settings.nTFoot;
          var jqTable = $(table);
          var jqTbody = $(tbody);
          var jqWrapper = $(settings.nTableWrapper);
          var rows = $.map(settings.aoData, function (r) {
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
          $('th, td', thead).removeClass(classes.sSortable + ' ' + classes.sSortableAsc + ' ' + classes.sSortableDesc + ' ' + classes.sSortableNone);
          if (settings.bJUI) {
            $('th span.' + classes.sSortIcon + ', td span.' + classes.sSortIcon, thead).detach();
            $('th, td', thead).each(function () {
              var wrapper = $('div.' + classes.sSortJUIWrapper, this);
              $(this).append(wrapper.contents());
              wrapper.detach();
            });
          }
          if (!remove && orig) {
            // insertBefore acts like appendChild if !arg[1]
            orig.insertBefore(table, settings.nTableReinsertBefore);
          }
          // -------------------------------------------------------------------------
          // This is the only change with the "destroy()" API (with DT v1.10.1)
          // -------------------------------------------------------------------------
          // Add the TR elements back into the table in their original order
          // jqTbody.children().detach();
          // jqTbody.append( rows );
          // -------------------------------------------------------------------------
          // Restore the width of the original table - was read from the style property,
          // so we can restore directly to that
          jqTable.css('width', settings.sDestroyWidth).removeClass(classes.sTable);
          // If the were originally stripe classes - then we add them back here.
          // Note this is not fool proof (for example if not all rows had stripe
          // classes - but it's a good effort without getting carried away
          ien = settings.asDestroyStripes.length;
          if (ien) {
            jqTbody.children().each(function (i) {
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
  });
}(angular, jQuery));
(function (angular) {
  'use strict';
  angular.module('datatables.options', []).constant('DT_DEFAULT_OPTIONS', {
    dom: 'lfrtip',
    sAjaxDataProp: '',
    aoColumns: []
  }).service('DTDefaultOptions', function () {
    this.bootstrapOptions = {};
    /**
         * Set the default language source for all datatables
         * @param sLanguageSource the language source
         * @returns {DTDefaultOptions} the default option config
         */
    this.setLanguageSource = function (sLanguageSource) {
      $.extend($.fn.dataTable.defaults, { oLanguage: { sUrl: sLanguageSource } });
      return this;
    };
    /**
         * Set the language for all datatables
         * @param oLanguage the language
         * @returns {DTDefaultOptions} the default option config
         */
    this.setLanguage = function (oLanguage) {
      $.extend(true, $.fn.dataTable.defaults, { oLanguage: oLanguage });
      return this;
    };
    /**
         * Set the default number of items to display for all datatables
         * @param iDisplayLength the number of items to display
         * @returns {DTDefaultOptions} the default option config
         */
    this.setDisplayLength = function (iDisplayLength) {
      $.extend($.fn.dataTable.defaults, { iDisplayLength: iDisplayLength });
      return this;
    };
    /**
         * Set the default options to be use for Bootstrap integration.
         * See https://github.com/l-lin/angular-datatables/blob/dev/src/angular-datatables.bootstrap.options.js to check
         * what default options Angular DataTables is using.
         * @param oBootstrapOptions an object containing the default options for Bootstreap integration
         * @returns {DTDefaultOptions} the default option config
         */
    this.setBootstrapOptions = function (oBootstrapOptions) {
      this.bootstrapOptions = oBootstrapOptions;
      return this;
    };
  });
}(angular));
(function (angular) {
  'use strict';
  angular.module('datatables.renderer', [
    'datatables.factory',
    'datatables.options'
  ]).factory('DTRendererFactory', [
    '$timeout',
    '$compile',
    'DTLoadingTemplate',
    'DT_DEFAULT_OPTIONS',
    function ($timeout, $compile, DTLoadingTemplate, DT_DEFAULT_OPTIONS) {
      var $loading = angular.element(DTLoadingTemplate.html), _showLoading = function ($elem) {
          $elem.after($loading);
          $elem.hide();
          $loading.show();
        }, _hideLoading = function ($elem) {
          $elem.show();
          $loading.hide();
        }, _renderDataTableAndEmitEvent = function ($elem, options, $scope) {
          var dtId = '#' + $elem.attr('id');
          if ($.fn.dataTable.isDataTable(dtId)) {
            options.destroy = true;
          }
          var oTable = $elem.DataTable(options);
          $scope.$emit('event:dataTableLoaded', {
            id: dtId,
            dt: oTable
          });
          return oTable;
        }, _doRenderDataTable = function ($elem, options, $scope) {
          _hideLoading($elem);
          return _renderDataTableAndEmitEvent($elem, options, $scope);
        };
      /**
         * Default renderer without any server call
         * @constructor
         */
      var DefaultRenderer = function (options) {
        return {
          options: options,
          render: function ($scope, $elem) {
            var _this = this;
            // Add $timeout to be sure that angular has finished rendering before calling datatables
            $timeout(function () {
              _doRenderDataTable($elem, _this.options, $scope);
            }, 0, false);
          }
        };
      };
      /**
         * Renderer for displaying the Angular way
         * @param options
         * @returns {{options: *}} the renderer
         * @constructor
         */
      var NGRenderer = function (options) {
        return {
          options: options,
          render: function ($scope, $elem, staticHTML) {
            var _this = this, expression = $elem.find('tbody').html(),
              // Find the resources from the comment <!-- ngRepeat: item in items --> displayed by angular in the DOM
              // This regexp is inspired by the one used in the "ngRepeat" directive
              match = expression.match(/^\s*.+\s+in\s+(\S*)\s*/), ngRepeatAttr = match[1];
            if (!match) {
              throw new Error('Expected expression in form of "_item_ in _collection_[ track by _id_]" but got "{0}".', expression);
            }
            var oTable, alreadyRendered = false, parentScope = $scope.$parent;
            parentScope.$watchCollection(ngRepeatAttr, function () {
              if (oTable && alreadyRendered) {
                oTable.ngDestroy();
                // Re-compile because we lost the angular binding to the existing data
                $elem.html(staticHTML);
                $compile($elem.contents())(parentScope);
              }
              $timeout(function () {
                alreadyRendered = true;
                oTable = _doRenderDataTable($elem, _this.options, $scope);
              }, 0, false);
            }, true);
          }
        };
      };
      /**
         * Renderer for displaying with a promise
         * @param options the options
         * @returns {{options: *}} the renderer
         * @constructor
         */
      var PromiseRenderer = function (options) {
        var oTable;
        var _render = function (options, $elem, data, $scope) {
          options.aaData = data;
          // Add $timeout to be sure that angular has finished rendering before calling datatables
          $timeout(function () {
            _hideLoading($elem);
            // Set it to true in order to be able to redraw the dataTable
            options.bDestroy = true;
            // Condition to refresh the dataTable
            if (oTable) {
              oTable.clear();
              oTable.rows.add(options.aaData).draw();
            } else {
              oTable = _renderDataTableAndEmitEvent($elem, options, $scope);
            }
          }, 0, false);
        };
        return {
          options: options,
          render: function ($scope, $elem) {
            var _this = this, _loadedPromise = null, _whenLoaded = function (data) {
                _render(_this.options, $elem, data, $scope);
                _loadedPromise = null;
              }, _startLoading = function (fnPromise) {
                if (angular.isFunction(fnPromise)) {
                  _loadedPromise = fnPromise();
                } else {
                  _loadedPromise = fnPromise;
                }
                _loadedPromise.then(_whenLoaded);
              }, _reload = function (fnPromise) {
                if (_loadedPromise) {
                  _loadedPromise.then(function () {
                    _startLoading(fnPromise);
                  });
                } else {
                  _startLoading(fnPromise);
                }
              };
            $scope.$watch('dtOptions.fnPromise', function (fnPromise) {
              if (angular.isDefined(fnPromise)) {
                _reload(fnPromise);
              } else {
                throw new Error('You must provide a promise or a function that returns a promise!');
              }
            });
            $scope.$watch('dtOptions.reload', function (reload) {
              if (reload) {
                $scope.dtOptions.reload = false;
                _reload($scope.dtOptions.fnPromise);
              }
            });
          }
        };
      };
      /**
         * Renderer for displaying with Ajax
         * @param options the options
         * @returns {{options: *}} the renderer
         * @constructor
         */
      var AjaxRenderer = function (options) {
        var oTable;
        var _render = function (options, $elem, $scope) {
          // Set it to true in order to be able to redraw the dataTable
          options.bDestroy = true;
          // Add $timeout to be sure that angular has finished rendering before calling datatables
          $timeout(function () {
            _hideLoading($elem);
            // Condition to refresh the dataTable
            if (oTable) {
              var ajaxUrl = options.sAjaxSource || options.ajax.url || options.ajax;
              oTable.ajax.url(ajaxUrl).load();
            } else {
              oTable = _renderDataTableAndEmitEvent($elem, options, $scope);
            }
          }, 0, false);
        };
        return {
          options: options,
          render: function ($scope, $elem) {
            var _this = this;
            // Define default values in case it is an ajax datatables
            if (angular.isUndefined(_this.options.sAjaxDataProp)) {
              _this.options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
            }
            if (angular.isUndefined(_this.options.aoColumns)) {
              _this.options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
            }
            $scope.$watch('dtOptions.sAjaxSource', function (sAjaxSource) {
              if (angular.isDefined(sAjaxSource)) {
                _this.options.sAjaxSource = sAjaxSource;
                if (angular.isDefined(_this.options.ajax)) {
                  if (angular.isObject(_this.options.ajax)) {
                    _this.options.ajax.url = sAjaxSource;
                  } else {
                    _this.options.ajax = { url: sAjaxSource };
                  }
                }
              }
              _render(options, $elem, $scope);
            });
            $scope.$watch('dtOptions.reload', function (reload) {
              if (reload) {
                $scope.dtOptions.reload = false;
                _render(options, $elem, $scope);
              }
            });
          }
        };
      };
      return {
        fromOptions: function (options, isNgDisplay) {
          if (isNgDisplay) {
            return new NGRenderer(options);
          }
          if (angular.isDefined(options)) {
            if (angular.isDefined(options.fnPromise) && options.fnPromise !== null) {
              return new PromiseRenderer(options);
            }
            if (angular.isDefined(options.sAjaxSource) && options.sAjaxSource !== null || angular.isDefined(options.ajax) && options.ajax !== null) {
              return new AjaxRenderer(options);
            }
            return new DefaultRenderer(options);
          }
          return new DefaultRenderer();
        },
        showLoading: _showLoading
      };
    }
  ]);
}(angular));
(function (angular) {
  'use strict';
  angular.module('datatables.util', []).factory('DTPropertyUtil', function () {
    return {
      overrideProperties: function (source, target) {
        var result = angular.copy(source);
        if (angular.isUndefined(result) || result === null) {
          result = {};
        }
        if (angular.isUndefined(target) || target === null) {
          return result;
        }
        if (angular.isObject(target)) {
          for (var prop in target) {
            if (target.hasOwnProperty(prop)) {
              result[prop] = this.overrideProperties(result[prop], target[prop]);
            }
          }
        } else {
          result = angular.copy(target);
        }
        return result;
      }
    };
  });
}(angular));