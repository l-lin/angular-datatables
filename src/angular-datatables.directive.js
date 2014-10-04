'use strict';

angular.module('datatables.directive', ['datatables.renderer', 'datatables.options'])
.directive('datatable', function(DT_DEFAULT_OPTIONS, DTBootstrap, DTRendererFactory, DTRendererService) {
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
                $scope.$watch('[dtOptions, dtColumns, dtColumnDefs]', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        var newDTOptions = newVal[0],
                            oldDTOptions = oldVal[0];
                        // Do not rerender if we want to reload. There are already
                        // some watchers in the renderers.
                        if (!newDTOptions.reload || newDTOptions.sAjaxSource !== oldDTOptions.sAjaxSource) {
                            ctrl.render($elem, ctrl.buildOptions(), _staticHTML);
                        } else {
                            // The reload attribute is set to false here in order
                            // to recall this watcher again
                            newDTOptions.reload = false;
                        }
                    }
                }, true);
                ctrl.showLoading($elem);
                ctrl.render($elem, ctrl.buildOptions(), _staticHTML);
            };
        },
        controller: function ($scope) {
            var _renderer;
            this.showLoading = function ($elem) {
                DTRendererService.showLoading($elem);
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
                if (_renderer) {
                    _renderer.withOptions(options).render($scope, $elem, staticHTML);
                } else {
                    _renderer = DTRendererFactory.fromOptions(options, isNgDisplay).render($scope, $elem, staticHTML);
                }
            };
        }
    };
});
