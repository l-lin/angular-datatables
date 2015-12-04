'use strict';

angular.module('datatables.directive', ['datatables.instances', 'datatables.renderer', 'datatables.options', 'datatables.util'])
    .directive('datatable', dataTable);

/* @ngInject */
function dataTable($q, $http, DTRendererFactory, DTRendererService, DTPropertyUtil) {
    return {
        restrict: 'A',
        scope: {
            dtOptions: '=',
            dtColumns: '=',
            dtColumnDefs: '=',
            datatable: '@',
            dtInstance: '='
        },
        compile: compileDirective,
        controller: ControllerDirective
    };

    /* @ngInject */
    function compileDirective(tElm) {
        var _staticHTML = tElm[0].innerHTML;

        return function postLink($scope, $elem, iAttrs, ctrl) {
            function handleChanges(newVal, oldVal) {
                if (newVal !== oldVal) {
                    ctrl.render($elem, ctrl.buildOptionsPromise(), _staticHTML);
                }
            }

            // Options can hold heavy data, and other deep/large objects.
            // watchcollection can improve this by only watching shallowly
            var watchFunction = iAttrs.dtDisableDeepWatchers ? '$watchCollection' : '$watch';
            angular.forEach(['dtColumns', 'dtColumnDefs', 'dtOptions'], function(tableDefField) {
                $scope[watchFunction].call($scope, tableDefField, handleChanges, true);
            });
            DTRendererService.showLoading($elem, $scope);
            ctrl.render($elem, ctrl.buildOptionsPromise(), _staticHTML);
        };
    }

    /* @ngInject */
    function ControllerDirective($scope) {
        var _dtInstance;
        var vm = this;
        vm.buildOptionsPromise = buildOptionsPromise;
        vm.render = render;

        function buildOptionsPromise() {
            var defer = $q.defer();
            // Build options
            $q.all([
                $q.when($scope.dtOptions),
                $q.when($scope.dtColumns),
                $q.when($scope.dtColumnDefs)
            ]).then(function(results) {
                var dtOptions = results[0],
                    dtColumns = results[1],
                    dtColumnDefs = results[2];
                // Since Angular 1.3, the promise throws a "Maximum call stack size exceeded" when cloning
                // See https://github.com/l-lin/angular-datatables/issues/110
                DTPropertyUtil.deleteProperty(dtOptions, '$promise');
                DTPropertyUtil.deleteProperty(dtColumns, '$promise');
                DTPropertyUtil.deleteProperty(dtColumnDefs, '$promise');
                var options;
                if (angular.isDefined(dtOptions)) {
                    options = {};
                    angular.extend(options, dtOptions);
                    // Set the columns
                    if (angular.isArray(dtColumns)) {
                        options.aoColumns = dtColumns;
                    }

                    // Set the column defs
                    if (angular.isArray(dtColumnDefs)) {
                        options.aoColumnDefs = dtColumnDefs;
                    }

                    // HACK to resolve the language source manually instead of DT
                    // See https://github.com/l-lin/angular-datatables/issues/181
                    if (options.language && options.language.url) {
                        var languageDefer = $q.defer();
                        $http.get(options.language.url).success(function(language) {
                            languageDefer.resolve(language);
                        });
                        options.language = languageDefer.promise;
                    }

                }
                return DTPropertyUtil.resolveObjectPromises(options, ['data', 'aaData', 'fnPromise']);
            }).then(function(options) {
                defer.resolve(options);
            });
            return defer.promise;
        }

        function render($elem, optionsPromise, staticHTML) {
            optionsPromise.then(function(options) {
                DTRendererService.preRender(options);

                var isNgDisplay = $scope.datatable && $scope.datatable === 'ng';
                // Render dataTable
                if (_dtInstance && _dtInstance._renderer) {
                    _dtInstance._renderer.withOptions(options)
                        .render($elem, $scope, staticHTML).then(function(dtInstance) {
                            _dtInstance = dtInstance;
                            _setDTInstance(dtInstance);
                        });
                } else {
                    DTRendererFactory.fromOptions(options, isNgDisplay)
                        .render($elem, $scope, staticHTML).then(function(dtInstance) {
                            _dtInstance = dtInstance;
                            _setDTInstance(dtInstance);
                        });
                }
            });
        }

        function _setDTInstance(dtInstance) {
            if (angular.isFunction($scope.dtInstance)) {
                $scope.dtInstance(dtInstance);
            } else if (angular.isDefined($scope.dtInstance)) {
                $scope.dtInstance = dtInstance;
            }
        }
    }
}
