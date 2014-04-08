/*!
 * angular-datatables - v0.0.1
 * https://github.com/l-lin/angular-datatables
 */
/*!
 * angular-datatables - v0.0.1
 * https://github.com/l-lin/angular-datatables
 */
(function ($, angular) {
  'use strict';
  /**
     * Source: https://editor.datatables.net/release/DataTables/extras/Editor/examples/bootstrap.html
     */
  angular.module('datatables.bootstrap', []).service('$DTBootstrap', function () {
    this.initialized = false;
    this.init = function () {
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
      /* Bootstrap style pagination control */
      $.extend($.fn.dataTableExt.oPagination, {
        'bootstrap': {
          'fnInit': function (oSettings, nPaging, fnDraw) {
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
          },
          'fnUpdate': function (oSettings, fnDraw) {
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
          }
        }
      });
      this.initialized = true;
    };
    this.integrate = function (options) {
      this.init();
      // TODO: It currently applies the bootstrap integration to all tables...
      options.sDom = '<\'row\'<\'col-xs-6\'l><\'col-xs-6\'f>r>t<\'row\'<\'col-xs-6\'i><\'col-xs-6\'p>>';
      options.sPaginationType = 'bootstrap';
    };
  });
}(jQuery, angular));
(function (angular) {
  'use strict';
  angular.module('datatables.directive', []).value('datatablesTemplateUrl', 'src/angular-datatables.html').constant('DT_DEFAULT_OPTIONS', {
    sAjaxDataProp: '',
    aoColumns: []
  }).directive('dtColumnRepeat', function () {
    /**
        * This directive is used to tell the "datatable" directive that the table is
        * rendered.
        */
    return {
      restrict: 'A',
      link: function ($scope) {
        if ($scope.$last) {
          $scope.$emit('dt:lastElem');
        }
      }
    };
  }).directive('datatable', [
    '$http',
    'datatablesTemplateUrl',
    '$timeout',
    function ($http, datatablesTemplateUrl, $timeout) {
      return {
        restrict: 'A',
        scope: {
          dtOptions: '=',
          dtColumns: '='
        },
        link: function ($scope, $elem) {
          if (angular.isDefined($scope.dtOptions)) {
            var options = {};
            angular.extend(options, $scope.dtOptions);
            // Set the columns
            if (angular.isArray($scope.dtColumns)) {
              options.aoColumns = $scope.dtColumns;
            }
            // Load the datatable! 
            // Add $timeout to be sure that angular has finished rendering before calling datatables
            $timeout(function () {
              $elem.dataTable(options);
            }, 0, false);
          } else {
            $timeout(function () {
              $elem.dataTable();
            }, 0, false);
          }
        }
      };
    }
  ]).directive('datatableAjax', [
    '$http',
    'DT_DEFAULT_OPTIONS',
    'datatablesTemplateUrl',
    '$timeout',
    function ($http, DT_DEFAULT_OPTIONS, datatablesTemplateUrl, $timeout) {
      return {
        restrict: 'A',
        scope: {
          dtOptions: '=',
          dtColumns: '='
        },
        templateUrl: datatablesTemplateUrl,
        link: function ($scope, $elem) {
          var options = DT_DEFAULT_OPTIONS;
          if (angular.isUndefined($scope.dtOptions)) {
            throw new Error('The option must be defined!');
          }
          angular.extend(options, $scope.dtOptions);
          // Just some basic validation.
          if (angular.isUndefined(options.sAjaxSource)) {
            throw new Error('"sAjaxSource" must be defined!');
          }
          // for Angular http inceptors
          if (angular.isUndefined(options.fnServerData)) {
            options.fnServerData = function (sSource, aoData, resultCb) {
              $http.get(sSource).then(function (result) {
                resultCb(result.data);
              });
            };
          }
          // Set the columns
          if (angular.isArray($scope.dtColumns)) {
            options.aoColumns = $scope.dtColumns;
          }
          // Load the datatable! 
          $scope.$on('dt:lastElem', function () {
            // Add $timeout to be sure that angular has finished rendering before calling datatables
            $timeout(function () {
              $elem.dataTable(options);
            }, 0, false);
          });
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
         * @returns {$DTDefaultOption} the default option config
         */
    this.setLanguageSource = function (sLanguageSource) {
      $.extend($.fn.dataTable.defaults, { oLanguage: { sUrl: sLanguageSource } });
      return this;
    };
    /**
         * Set the default number of items to display for all datatables
         * @param iDisplayLength the number of items to display
         * @returns {$DTDefaultOption} the default option config
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
         */
      var DTOptions = function (sAjaxSource) {
        this.sAjaxSource = sAjaxSource;
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
             * @param {DTOption} the options
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
        this.withColOrder = function (aiOrder) {
          if (angular.isArray(aiOrder)) {
            this.oColReorder = fromNullable(this.oColReorder).orEmptyObj();
            this.oColReorder.aiOrder = aiOrder;
          } else {
            throw new Error('The order must be an array!');
          }
          return this;
        };
        /**
             * Set the reorder callback function
             * @param fnReorderCallback
             * @returns {DTOptions} the options
             */
        this.withReorderCallback = function (fnReorderCallback) {
          if (angular.isFunction(fnReorderCallback)) {
            this.oColReorder = fromNullable(this.oColReorder).orEmptyObj();
            this.oColReorder.fnReorderCallback = fnReorderCallback;
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
          var colVisPrefix = 'C<"clear">';
          this.sDom = colVisPrefix + fromNullable(this.sDom).or(DT_DEFAULT_DOM);
          return this;
        };
      };
      return {
        newOptions: function () {
          return new DTOptions();
        },
        fromSource: function (sAjaxSource) {
          return new DTOptions(sAjaxSource);
        }
      };
    }
  ]).factory('DTColumnBuilder', function () {
    /**
         * The wrapped datatables column 
         * @param mData the data to display of the column
         * @param label the label of the column title to display in the DOM
         */
    var DTColumn = function (mData, label) {
      if (angular.isUndefined(mData)) {
        throw new Error('The parametr "mData" is not defined!');
      }
      this.mData = mData;
      this.label = label || '';
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
             * Set the label of the colum
             * @param label the label of the column
             * @returns {DTColumn} the wrapped datatables column
             */
      this.withLabel = function (label) {
        this.label = label;
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
      newColumn: function (mData, label) {
        return new DTColumn(mData, label);
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
  ]);
}(angular));
angular.module('datatables').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('src/angular-datatables.html', '<thead>\n' + '    <tr>\n' + '        <th ng-repeat="column in dtColumns" dt-column-repeat>\n' + '            {{ column.label }}\n' + '        </th>\n' + '    </tr>\n' + '</thead>\n');
  }
]);