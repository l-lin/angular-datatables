/*!
 * angular-datatables - v0.0.1
 * https://github.com/l-lin/angular-datatables
 */
/*!
 * angular-datatables - v0.0.1
 * https://github.com/l-lin/angular-datatables
 */
/*jshint camelcase: false */
(function (window, document, $, angular) {
  'use strict';
  angular.module('datatable.bootstrap.tabletools', []).service('$DTBootstrapTableTools', function () {
    var _initializedTableTools = false;
    this.integrate = function () {
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
            print: { info: 'DTTT_print_info modal' },
            select: { row: 'active' }
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
  angular.module('datatables.bootstrap.colvis', []).service('$DTBootstrapColVis', function () {
    var _initializedColVis = false;
    this.integrate = function (addDrawCallbackFunction) {
      if (!_initializedColVis) {
        /* ColVis Bootstrap compatibility */
        if ($.fn.DataTable.ColVis) {
          addDrawCallbackFunction(function () {
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
  angular.module('datatables.bootstrap', [
    'datatable.bootstrap.tabletools',
    'datatables.bootstrap.colvis'
  ]).service('$DTBootstrap', [
    '$DTBootstrapTableTools',
    '$DTBootstrapColVis',
    function ($DTBootstrapTableTools, $DTBootstrapColVis) {
      var _initialized = false, _drawCallbackFunctionList = [];
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
        var _fnInit = function (oSettings, nPaging, fnDraw) {
          var oLang = oSettings.oLanguage.oPaginate;
          var fnClickHandler = function (e) {
            e.preventDefault();
            if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
              fnDraw(oSettings);
            }
          };
          $(nPaging).append('<ul class="pagination">' + '<li class="prev disabled"><a href="#">&larr; ' + oLang.sPrevious + '</a></li>' + '<li class="next disabled"><a href="#">' + oLang.sNext + ' &rarr; </a></li>' + '</ul>');
          var els = $('a', nPaging);
          $(els[0]).bind('click.DT', { action: 'previous' }, fnClickHandler);
          $(els[1]).bind('click.DT', { action: 'next' }, fnClickHandler);
        };
        var _fnUpdate = function (oSettings, fnDraw) {
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
          } else if (oPaging.iPage >= oPaging.iTotalPages - iHalf) {
            iStart = oPaging.iTotalPages - iListLength + 1;
            iEnd = oPaging.iTotalPages;
          } else {
            iStart = oPaging.iPage - iHalf + 1;
            iEnd = iStart + iListLength - 1;
          }
          var fnPaging = function (e) {
            e.preventDefault();
            oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
            fnDraw(oSettings);
          };
          for (i = 0, ien = an.length; i < ien; i++) {
            // Remove the middle elements
            $('li:gt(0)', an[i]).filter(':not(:last)').remove();
            // Add the new list items and their event handlers
            for (j = iStart; j <= iEnd; j++) {
              sClass = j === oPaging.iPage + 1 ? 'class="active"' : '';
              $('<li ' + sClass + '><a href="#">' + j + '</a></li>').insertBefore($('li:last', an[i])[0]).bind('click', fnPaging);
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
      var _addDrawCallbackFunction = function (fn) {
        if (angular.isFunction(fn)) {
          _drawCallbackFunctionList.push(fn);
        }
      };
      var _init = function () {
        if (!_initialized) {
          _overrideClasses();
          _overridePagingInfo();
          _overridePagination();
          _addDrawCallbackFunction(function () {
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
      this.integrate = function (options) {
        _init();
        $DTBootstrapTableTools.integrate();
        $DTBootstrapColVis.integrate(_addDrawCallbackFunction);
        // TODO: It currently applies the bootstrap integration to all tables...
        options.sDom = '<\'row\'<\'col-xs-6\'l><\'col-xs-6\'f>r>t<\'row\'<\'col-xs-6\'i><\'col-xs-6\'p>>';
        options.sPaginationType = 'bootstrap';
        if (angular.isUndefined(options.fnDrawCallback)) {
          // Call every drawcallback functions
          options.fnDrawCallback = function () {
            for (var index = 0; index < _drawCallbackFunctionList.length; index++) {
              _drawCallbackFunctionList[index]();
            }
          };
        }
      };
    }
  ]);
}(window, document, jQuery, angular));
(function (angular) {
  'use strict';
  angular.module('datatables.directive', []).constant('DT_DEFAULT_OPTIONS', {
    sAjaxDataProp: '',
    aoColumns: []
  }).directive('datatable', [
    'DT_DEFAULT_OPTIONS',
    '$timeout',
    'DT_LAST_ROW_KEY',
    function (DT_DEFAULT_OPTIONS, $timeout, DT_LAST_ROW_KEY) {
      var $loading = angular.element('<h3>Loading...</h3>');
      var _showLoading = function ($elem) {
        $elem.after($loading);
        $elem.hide();
      };
      var _hideLoading = function ($elem) {
        $elem.show();
        $loading.hide();
      };
      var _renderDataTableAndEmitEvent = function ($elem, options, $scope) {
        var oTable = $elem.DataTable(options);
        $scope.$emit('event:dataTableLoaded', { id: $elem.attr('id') });
        return oTable;
      };
      var _doRenderDataTable = function ($elem, options, $scope) {
        // Add $timeout to be sure that angular has finished rendering before calling datatables
        $timeout(function () {
          _hideLoading($elem);
          _renderDataTableAndEmitEvent($elem, options, $scope);
        }, 0, false);
      };
      /**
         * Factory that build a renderer given the options
         */
      var RendererFactory = {
          fromOptions: function (options, isNgDisplay) {
            if (isNgDisplay) {
              return new NGRenderer(options);
            }
            if (angular.isDefined(options)) {
              if (angular.isDefined(options.fnPromise) && options.fnPromise !== null) {
                return new PromiseRenderer(options);
              }
              if (angular.isDefined(options.sAjaxSource) && options.sAjaxSource !== null) {
                return new AjaxRenderer(options);
              }
              return new DefaultRenderer(options);
            }
            return new DefaultRenderer();
          }
        };
      /**
         * Default renderer without any server call
         * @constructor
         */
      var DefaultRenderer = function (options) {
        return {
          options: options,
          render: function ($scope, $elem) {
            _doRenderDataTable($elem, this.options, $scope);
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
          render: function ($scope, $elem) {
            var _this = this;
            $scope.$on(DT_LAST_ROW_KEY, function () {
              _doRenderDataTable($elem, _this.options, $scope);
            });
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
              oTable.fnClearTable();
              oTable.fnDraw();
              oTable.fnAddData(options.aaData);
            } else {
              oTable = _renderDataTableAndEmitEvent($elem, options, $scope);
            }
          }, 0, false);
        };
        return {
          options: options,
          render: function ($scope, $elem) {
            var _this = this;
            var _loadedPromise = null;
            var _whenLoaded = function (data) {
              _render(_this.options, $elem, data, $scope);
              _loadedPromise = null;
            };
            var _startLoading = function (fnPromise) {
              if (angular.isFunction(fnPromise)) {
                _loadedPromise = fnPromise();
              } else {
                _loadedPromise = fnPromise;
              }
              _showLoading($elem);
              _loadedPromise.then(_whenLoaded);
            };
            var _reload = function (fnPromise) {
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
              if (angular.isDefined(oTable.fnReloadAjax) && angular.isFunction(oTable.fnReloadAjax)) {
                // Reload Ajax data using the plugin "fnReloadAjax": https://next.datatables.net/plug-ins/api/fnReloadAjax
                // For DataTable v1.9.4
                oTable.fnReloadAjax(options.sAjaxSource);
              } else if (angular.isDefined(oTable.ajax) && angular.isFunction(oTable.ajax.load)) {
                // For DataTable v1.10+, DT provides methods https://datatables.net/reference/api/ajax.url()
                oTable.ajax.url(options.sAjaxSource).load();
              } else {
                throw new Error('Reload Ajax not supported. Please use the plugin "fnReloadAjax" (https://next.datatables.net/plug-ins/api/fnReloadAjax) or use a more recent version of DataTables (v1.10+)');
              }
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
              _this.options.sAjaxSource = sAjaxSource;
              _this.options.ajax = sAjaxSource;
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
        restrict: 'A',
        scope: {
          dtOptions: '=',
          dtColumns: '=',
          datatable: '@'
        },
        link: function ($scope, $elem) {
          _showLoading($elem);
          // Build options
          var isNgDisplay = $scope.datatable && $scope.datatable === 'ng', options;
          if (angular.isDefined($scope.dtOptions)) {
            options = {};
            angular.extend(options, $scope.dtOptions);
            // Set the columns
            if (angular.isArray($scope.dtColumns)) {
              options.aoColumns = $scope.dtColumns;
            }
          }
          // Render dataTable
          RendererFactory.fromOptions(options, isNgDisplay).render($scope, $elem);
        }
      };
    }
  ]).directive('dtRows', [
    '$rootScope',
    'DT_LAST_ROW_KEY',
    function ($rootScope, DT_LAST_ROW_KEY) {
      return {
        restrict: 'A',
        link: function ($scope) {
          if ($scope.$last === true) {
            $rootScope.$broadcast(DT_LAST_ROW_KEY);
          }
        }
      };
    }
  ]);
}(angular));
(function ($, angular) {
  'use strict';
  angular.module('datatables.factory', ['datatables.bootstrap']).value('DT_DEFAULT_DOM', 'lfrtip').service('$DTDefaultOptions', function () {
    /**
         * Set the default language source for all datatables
         * @param sLanguageSource the language source
         * @returns {$DTDefaultOptions} the default option config
         */
    this.setLanguageSource = function (sLanguageSource) {
      $.extend($.fn.dataTable.defaults, { oLanguage: { sUrl: sLanguageSource } });
      return this;
    };
    /**
         * Set the language for all datatables
         * @param oLanguage the language
         * @returns {$DTDefaultOptions} the default option config
         */
    this.setLanguage = function (oLanguage) {
      $.extend(true, $.fn.dataTable.defaults, { oLanguage: oLanguage });
      return this;
    };
    /**
         * Set the default number of items to display for all datatables
         * @param iDisplayLength the number of items to display
         * @returns {$DTDefaultOptions} the default option config
         */
    this.setDisplayLength = function (iDisplayLength) {
      $.extend($.fn.dataTable.defaults, { iDisplayLength: iDisplayLength });
      return this;
    };
  }).factory('DTOptionsBuilder', [
    '$DTBootstrap',
    'DT_DEFAULT_DOM',
    function ($DTBootstrap, DT_DEFAULT_DOM) {
      /**
         * The wrapped datatables options class
         * @param sAjaxSource the ajax source to fetch the data
         * @param fnPromise the function that returns a promise to fetch the data
         */
      var DTOptions = function (sAjaxSource, fnPromise) {
        this.sAjaxSource = sAjaxSource;
        this.fnPromise = fnPromise;
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
        this.reloadData = function () {
          this.reload = true;
          return this;
        };
        /**
             * Add the option to the datatables optoins
             * @param key the key of the option
             * @param value an object or a function of the option
             * @returns {DTOptions} the options
             */
        this.withOption = function (key, value) {
          if (angular.isString(key)) {
            this[key] = value;
          }
          return this;
        };
        /**
             * Add the Ajax source to the options.
             * This corresponds to the "sAjaxSource" option
             * @param sAjaxSource the ajax source
             * @returns {DTOptions} the options
             */
        this.withSource = function (sAjaxSource) {
          this.sAjaxSource = sAjaxSource;
          return this;
        };
        /**
             * Add the ajax data properties.
             * @param sAjaxDataProp the ajax data property
             * @returns {DTOptions} the options
             */
        this.withDataProp = function (sAjaxDataProp) {
          this.sAjaxDataProp = sAjaxDataProp;
          return this;
        };
        /**
             * Set the server data function.
             * @param fn the function of the server retrieval
             * @returns {DTOptions} the options
             */
        this.withFnServerData = function (fn) {
          if (!angular.isFunction(fn)) {
            throw new Error('The parameter must be a function');
          }
          this.fnServerData = fn;
          return this;
        };
        /**
             * Set the pagination type.
             * @param sPaginationType the pagination type
             * @returns {DTOptions} the options
             */
        this.withPaginationType = function (sPaginationType) {
          if (angular.isString(sPaginationType)) {
            this.sPaginationType = sPaginationType;
          } else {
            throw new Error('The pagination type must be provided');
          }
          return this;
        };
        /**
             * Set the language of the datatables
             * @param oLanguage the language
             * @returns {DTOptions} the options
             */
        this.withLanguage = function (oLanguage) {
          this.oLanguage = oLanguage;
          return this;
        };
        /**
             * Set the language source
             * @param sLanguageSource the language source
             * @returns {DTOptions} the options
             */
        this.withLanguageSource = function (sLanguageSource) {
          return this.withLanguage({ sUrl: sLanguageSource });
        };
        /**
             * Set default number of items per page to display
             * @param iDisplayLength the number of items per page
             * @returns {DTOptions} the options
             */
        this.withDisplayLength = function (iDisplayLength) {
          this.iDisplayLength = iDisplayLength;
          return this;
        };
        /**
             * Set the promise to fetch the data
             * @param fnPromise the function that returns a promise
             * @returns {DTOptions} the options
             */
        this.withFnPromise = function (fnPromise) {
          this.fnPromise = fnPromise;
          return this;
        };
        // BOOTSTRAP INTEGRATION ---------
        // See http://getbootstrap.com
        /**
             * Add bootstrap compatibility
             * @returns {DTOptions} the options
             */
        this.withBootstrap = function () {
          $DTBootstrap.integrate(this);
          return this;
        };
        // COL REORDER DATATABLES PLUGIN ---------
        // See https://datatables.net/extras/colreorder/
        /**
             * Add option to "oColReorder" option
             * @param key the key of the option to add
             * @param value an object or a function of the function
             * @return {DTOptions} the options
             */
        this.withColReorderOption = function (key, value) {
          if (angular.isString(key)) {
            this.oColReorder = fromNullable(this.oColReorder).orEmptyObj();
            this.oColReorder[key] = value;
          }
          return this;
        };
        /**
             * Add colReorder compatibility
             * @returns {DTOptions} the options
             */
        this.withColReorder = function () {
          var colReorderPrefix = 'R';
          this.sDom = colReorderPrefix + fromNullable(this.sDom).or(DT_DEFAULT_DOM);
          return this;
        };
        /**
             * Set the default column order
             * @param aiOrder the column order
             * @returns {DTOptions} the options
             */
        this.withColReorderOrder = function (aiOrder) {
          if (angular.isArray(aiOrder)) {
            this.withColReorderOption('aiOrder', aiOrder);
          }
          return this;
        };
        /**
             * Set the reorder callback function
             * @param fnReorderCallback the callback
             * @returns {DTOptions} the options
             */
        this.withColReorderCallback = function (fnReorderCallback) {
          if (angular.isFunction(fnReorderCallback)) {
            this.withColReorderOption('fnReorderCallback', fnReorderCallback);
          } else {
            throw new Error('The reorder callback must be a function');
          }
          return this;
        };
        // COL VIS DATATABLES PLUGIN ---------
        // See https://datatables.net/extras/colvis/
        /**
             * Add option to "oColVis" option
             * @param key the key of the option to add
             * @param value an object or a function of the function
             * @returns {DTOptions} the options
             */
        this.withColVisOption = function (key, value) {
          if (angular.isString(key)) {
            this.oColVis = fromNullable(this.oColVis).orEmptyObj();
            this.oColVis[key] = value;
          }
          return this;
        };
        /**
             * Add colVis compatibility
             * @returns {DTOptions} the options
             */
        this.withColVis = function () {
          var colVisPrefix = 'C';
          this.sDom = colVisPrefix + fromNullable(this.sDom).or(DT_DEFAULT_DOM);
          return this;
        };
        /**
             * Set the state change function
             * @param fnStateChange  the state change function
             * @returns {DTOptions} the options
             */
        this.withColVisStateChange = function (fnStateChange) {
          if (angular.isFunction(fnStateChange)) {
            this.withColVisOption('fnStateChange', fnStateChange);
          } else {
            throw new Error('The state change must be a function');
          }
          return this;
        };
        // TABLE TOOLS DATATABLES PLUGIN ---------
        // See https://datatables.net/extras/tabletools/
        /**
             * Add option to "oTableTools" option
             * @param key the key of the option to add
             * @param value an object or a function of the function
             * @returns {DTOptions} the options
             */
        this.withTableToolsOption = function (key, value) {
          if (angular.isString(key)) {
            this.oTableTools = fromNullable(this.oTableTools).orEmptyObj();
            this.oTableTools[key] = value;
          }
          return this;
        };
        /**
             * Add table tools compatibility
             * @param sSwfPath the path to the swf file to export in csv/xls
             * @returns {DTOptions} the options
             */
        this.withTableTools = function (sSwfPath) {
          var tableToolsPrefix = 'T';
          this.sDom = tableToolsPrefix + fromNullable(this.sDom).or(DT_DEFAULT_DOM);
          if (angular.isString(sSwfPath)) {
            this.withTableToolsOption('sSwfPath', sSwfPath);
          }
          return this;
        };
        /**
             * Set the table tools buttons to display
             * @param aButtons the array of buttons to display
             * @returns {DTOptions} the options
             */
        this.withTableToolsButtons = function (aButtons) {
          if (angular.isArray(aButtons)) {
            this.withTableToolsOption('aButtons', aButtons);
          }
          return this;
        };
      };
      return {
        newOptions: function () {
          return new DTOptions();
        },
        fromSource: function (sAjaxSource) {
          return new DTOptions(sAjaxSource, null);
        },
        fromFnPromise: function (fnPromise) {
          return new DTOptions(null, fnPromise);
        }
      };
    }
  ]).factory('DTColumnBuilder', function () {
    /**
         * The wrapped datatables column 
         * @param mData the data to display of the column
         * @param sTitle the sTitle of the column title to display in the DOM
         */
    var DTColumn = function (mData, sTitle) {
      if (angular.isUndefined(mData)) {
        throw new Error('The parameter "mData" is not defined!');
      }
      this.mData = mData;
      this.sTitle = sTitle || '';
      /**
             * Add the option of the column
             * @param key the key of the option
             * @param value an object or a function of the option
             * @returns {DTColumn} the wrapped datatables column
             */
      this.withOption = function (key, value) {
        if (angular.isString(key)) {
          this[key] = value;
        }
        return this;
      };
      /**
             * Set the title of the colum
             * @param sTitle the sTitle of the column
             * @returns {DTColumn} the wrapped datatables column
             */
      this.withTitle = function (sTitle) {
        this.sTitle = sTitle;
        return this;
      };
      /**
             * Set the CSS class of the column
             * @param sClass the CSS class
             * @returns {DTColumn} the wrapped datatables column
             */
      this.withClass = function (sClass) {
        this.sClass = sClass;
        return this;
      };
      /**
             * Hide the column
             * @returns {DTColumn} the wrapped datatables column
             */
      this.notVisible = function () {
        this.bVisible = false;
        return this;
      };
      /**
             * Set the column as not sortable
             * @returns {DTColumn} the wrapped datatables column
             */
      this.notSortable = function () {
        this.bSortable = false;
        return this;
      };
      /**
             * Render each cell with the given parameter
             * @mRender mRender the function/string to render the data
             * @returns {DTColumn} the wrapped datatables column
             */
      this.renderWith = function (mRender) {
        this.mRender = mRender;
        return this;
      };
    };
    return {
      newColumn: function (mData, sTitle) {
        return new DTColumn(mData, sTitle);
      }
    };
  });
}(jQuery, angular));
(function (angular) {
  'use strict';
  angular.module('datatables', [
    'datatables.directive',
    'datatables.factory',
    'datatables.bootstrap'
  ]).value('DT_LAST_ROW_KEY', 'datatable:lastRow');
}(angular));