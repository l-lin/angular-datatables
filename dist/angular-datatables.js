/*!
 * angular-datatables - v0.0.1
 * https://github.com/l-lin/angular-datatables
 */
/*!
 * angular-datatables - v0.0.1
 * https://github.com/l-lin/angular-datatables
 */
(function (angular) {
  'use strict';
  angular.module('angularDatatables.directive', []).value('angularDatatablesTemplateUrl', 'src/angular-datatables.html').constant('DT_DEFAULT_OPTIONS', {
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
    function ($http, DT_DEFAULT_OPTIONS) {
      return {
        restrict: 'A',
        scope: {
          dtOptions: '=',
          dtColumns: '='
        },
        templateUrl: 'src/angular-datatables.html',
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
            $elem.dataTable(options);
          });
        }
      };
    }
  ]);
}(angular));
(function (angular) {
  'use strict';
  angular.module('angularDatatables.factory', []).constant('DT_OPTION_KEYS', {
    ajaxSource: 'sAjaxSource',
    ajaxDataProp: 'sAjaxDataProp',
    fnServerData: 'fnServerData'
  }).factory('DTOptionsBuilder', [
    'DT_OPTION_KEYS',
    function (DT_OPTION_KEYS) {
      var DTOptions = function (sAjaxSource) {
        if (angular.isString(sAjaxSource)) {
          this[DT_OPTION_KEYS.ajaxSource] = sAjaxSource;
        }
        this.addOption = function (key, value) {
          if (angular.isString(key)) {
            this[key] = value;
          }
          return this;
        };
        this.addSource = function (sAjaxSource) {
          this.addOption(DT_OPTION_KEYS.ajaxSource, sAjaxSource);
          return this;
        };
        this.addDataProp = function (dataProp) {
          this.addOption(DT_OPTION_KEYS.ajaxDataProp, dataProp);
          return this;
        };
        this.addFnServerData = function (fn) {
          if (!angular.isFunction(fn)) {
            throw new Error('The parameter must be a function');
          }
          this.addOption(DT_OPTION_KEYS.fnServerData, fn);
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
    var DTColumn = function (mData) {
      this.label = '';
      this.mData = mData;
      this.sClass = '';
      this.bVisible = true;
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
    };
    return {
      newColumn: function (mData) {
        return new DTColumn(mData);
      }
    };
  });
}(angular));
(function (angular) {
  'use strict';
  angular.module('angularDatatables', [
    'angularDatatables.directive',
    'angularDatatables.factory'
  ]);
}(angular));
angular.module('angularDatatables').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('src/angular-datatables.html', '<thead>\r' + '\n' + '    <tr>\r' + '\n' + '        <th ng-repeat="column in dtColumns" dt-column-repeat>\r' + '\n' + '            {{ column.label }}\r' + '\n' + '        </th>\r' + '\n' + '    </tr>\r' + '\n' + '</thead>\r' + '\n');
  }
]);