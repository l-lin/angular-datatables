(function (angular) {
    'use strict';
    angular.module('datatables.renderer', ['datatables.factory', 'datatables.options']).
    factory('DTRendererFactory', function($timeout, $compile, DTLoadingTemplate, DT_DEFAULT_OPTIONS) {
        var $loading = angular.element(DTLoadingTemplate.html),
            _showLoading = function ($elem) {
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
                $scope.$emit('event:dataTableLoaded', { id: $elem.attr('id'), dt: oTable });
                return oTable;
            }, _doRenderDataTable = function($elem, options, $scope) {
                _hideLoading($elem);
                return _renderDataTableAndEmitEvent($elem, options, $scope);
            };
        /**
         * Default renderer without any server call
         * @constructor
         */
        var DefaultRenderer = function(options) {
            return {
                options: options,
                render: function ($scope, $elem) {
                    var _this = this;
                    // Add $timeout to be sure that angular has finished rendering before calling datatables
                    $timeout(function() {
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
        var NGRenderer = function(options) {
            return {
                options: options,
                render: function ($scope, $elem, staticHTML) {
                    var _this = this,
                        expression = $elem.find('tbody').html(),
                        // Find the resources from the comment <!-- ngRepeat: item in items --> displayed by angular in the DOM
                        // This regexp is inspired by the one used in the "ngRepeat" directive
                        match = expression.match(/^\s*.+\s+in\s+(\S*)\s*/),
                        ngRepeatAttr = match[1];

                    if (!match) {
                        throw new Error('Expected expression in form of "_item_ in _collection_[ track by _id_]" but got "{0}".', expression);
                    }

                    var oTable,
                        alreadyRendered = false,
                        parentScope = $scope.$parent;

                    parentScope.$watchCollection(ngRepeatAttr, function () {
                        if (oTable && alreadyRendered) {
                            oTable.ngDestroy();
                            // Re-compile because we lost the angular binding to the existing data
                            $elem.html(staticHTML);
                            $compile($elem.contents())(parentScope);
                        }
                        $timeout(function() {
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
        var PromiseRenderer = function(options) {
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
                    var _this = this,
                        _loadedPromise = null,
                        _whenLoaded = function (data) {
                            _render(_this.options, $elem, data, $scope);
                            _loadedPromise = null;
                        }, _startLoading = function (fnPromise) {
                            if(angular.isFunction(fnPromise)){
                                _loadedPromise = fnPromise();
                            } else {
                                _loadedPromise = fnPromise;
                            }
                            _loadedPromise.then(_whenLoaded);
                        }, _reload = function (fnPromise) {
                            if (_loadedPromise) {
                                _loadedPromise.then(function() {
                                    _startLoading(fnPromise);
                                });
                            } else {
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
                        var ajaxUrl = options.sAjaxSource || options.ajax.url || options.ajax;
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
                                    _this.options.ajax = {url: sAjaxSource};
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
            fromOptions: function(options, isNgDisplay) {
                if (isNgDisplay) {
                    return new NGRenderer(options);
                }
                if (angular.isDefined(options)) {
                    if (angular.isDefined(options.fnPromise) && options.fnPromise !== null) {
                        return new PromiseRenderer(options);
                    }
                    if (angular.isDefined(options.sAjaxSource) && options.sAjaxSource !== null ||
                        angular.isDefined(options.ajax) && options.ajax !== null) {
                        return new AjaxRenderer(options);
                    }
                    return new DefaultRenderer(options);
                }
                return new DefaultRenderer();
            },
            showLoading: _showLoading
        };
    });

})(angular);
