'use strict';

angular.module('datatables.directive', ['datatables.renderer', 'datatables.options', 'datatables.util'])
    .directive('datatable', function($q, DT_DEFAULT_OPTIONS, DTBootstrap, DTRendererFactory, DTRendererService, DTPropertyUtil) {
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
                    function handleChanges(newVal, oldVal){
                        if (newVal !== oldVal) {
                            var newDTOptions = newVal[0], oldDTOptions = oldVal[0];
                            // Do not rerender if we want to reload. There are already
                            // some watchers in the renderers.
                            if (!newDTOptions.reload || newDTOptions.sAjaxSource !== oldDTOptions.sAjaxSource) {
                                ctrl.render($elem, ctrl.buildOptionsPromise(), _staticHTML);
                            } else {
                                // The reload attribute is set to false here in order
                                // to recall this watcher again
                                newDTOptions.reload = false;
                            }
                        }
                    }

                    // Options can hold heavy data, and other deep/large objects. 
                    // watchcollection can improve this by only watching shallowly
                    var watchFunction = iAttrs.disableDeepWatchers ? '$watchCollection' : '$watch';
                    angular.forEach(['dtColumns', 'dtColumnDefs', 'dtOptions'], function(tableDefField){
                        $scope[watchFunction].call($scope, tableDefField, handleChanges, true);
                    });
                    ctrl.showLoading($elem);
                    ctrl.render($elem, ctrl.buildOptionsPromise(), _staticHTML);
                };
            },
            controller: function($scope) {
                var _renderer;
                this.showLoading = function($elem) {
                    DTRendererService.showLoading($elem);
                };
                this.buildOptionsPromise = function() {
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
                        if (angular.isDefined($scope.dtOptions)) {
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
                            // Integrate bootstrap (or not)
                            if (options.integrateBootstrap) {
                                DTBootstrap.integrate(options);
                            } else {
                                DTBootstrap.deIntegrate();
                            }
                        }
                        defer.resolve(options);
                    });
                    return defer.promise;
                };
                this.render = function($elem, optionsPromise, staticHTML) {
                    optionsPromise.then(function(options) {
                        var isNgDisplay = $scope.datatable && $scope.datatable === 'ng';
                        // Render dataTable
                        if (_renderer) {
                            _renderer.withOptions(options).render($scope, $elem, staticHTML);
                        } else {
                            _renderer = DTRendererFactory.fromOptions(options, isNgDisplay).render($scope, $elem, staticHTML);
                        }
                    });
                };
            }
        };
    });
