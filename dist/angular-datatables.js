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
      // TODO: It currently apply the integration to all tables...
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
  angular.module('datatables.factory', ['datatables.bootstrap']).constant('DT_PAGINATION_TYPE_LIST', [
    'two_buttons',
    'full_numbers'
  ]).service('$DTDefaultOptions', function () {
    this.setLanguageSource = function (sLanguageSource) {
      $.extend($.fn.dataTable.defaults, { oLanguage: { sUrl: sLanguageSource } });
      return this;
    };
    this.setDisplayLength = function (iDisplayLength) {
      $.extend($.fn.dataTable.defaults, { iDisplayLength: iDisplayLength });
      return this;
    };
  }).factory('DTOptionsBuilder', [
    'DT_PAGINATION_TYPE_LIST',
    '$DTBootstrap',
    function (DT_PAGINATION_TYPE_LIST, $DTBootstrap) {
      var DTOptions = function (sAjaxSource) {
        if (angular.isString(sAjaxSource)) {
          this.sAjaxSource = sAjaxSource;
        }
        this.withOption = function (key, value) {
          if (angular.isString(key)) {
            this[key] = value;
          }
          return this;
        };
        this.withSource = function (sAjaxSource) {
          this.sAjaxSource = sAjaxSource;
          return this;
        };
        this.withDataProp = function (sAjaxDataProp) {
          this.sAjaxDataProp = sAjaxDataProp;
          return this;
        };
        this.withFnServerData = function (fn) {
          if (!angular.isFunction(fn)) {
            throw new Error('The parameter must be a function');
          }
          this.fnServerData = fn;
          return this;
        };
        this.withBootstrap = function () {
          $DTBootstrap.integrate(this);
          return this;
        };
        this.withPaginationType = function (sPaginationType) {
          if (angular.isString(sPaginationType)) {
            if (DT_PAGINATION_TYPE_LIST.indexOf(sPaginationType) > -1) {
              this.sPaginationType = sPaginationType;
            } else {
              console.error('The pagination type must be either "two_buttons" or "full_numbers"');
            }
          } else {
            console.error('The pagination type must be provided');
          }
          return this;
        };
        this.withLanguage = function (oLanguage) {
          this.oLanguage = oLanguage;
          return this;
        };
        this.withLanguageSource = function (sLanguageSource) {
          return this.withLanguage({ sUrl: sLanguageSource });
        };
        this.withDisplayLength = function (iDisplayLength) {
          this.iDisplayLength = iDisplayLength;
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
    var DTColumn = function (mData, label) {
      if (angular.isUndefined(mData)) {
        throw new Error('The parametr "mData" is not defined!');
      }
      this.label = label || '';
      this.mData = mData;
      this.addOption = function (key, value) {
        if (angular.isString(key)) {
          this[key] = value;
        }
        return this;
      };
      this.withLabel = function (label) {
        this.label = label;
        return this;
      };
      this.withClass = function (sClass) {
        this.sClass = sClass;
        return this;
      };
      this.setVisible = function (bVisible) {
        this.bVisible = bVisible;
        return this;
      };
      this.renderWith = function (mRender) {
        this.mRender = mRender;
        return this;
      };
      this.notSortable = function () {
        this.bSortable = false;
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