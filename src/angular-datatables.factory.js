(function($, angular) {
    'use strict';
    angular.module('datatables.factory', ['datatables.bootstrap']).
    constant('DT_PAGINATION_TYPE_LIST', ['two_buttons', 'full_numbers']).
    service('$DTDefaultOptions', function() {
        this.setLanguageSource = function(sLanguageSource) {
            $.extend($.fn.dataTable.defaults, {
                oLanguage: {
                    sUrl: sLanguageSource
                }
            });
            return this;
        };
        this.setDisplayLength = function(iDisplayLength) {
            $.extend($.fn.dataTable.defaults, {
                iDisplayLength: iDisplayLength
            });
            return this;
        };
    }).
    factory('DTOptionsBuilder', function(DT_PAGINATION_TYPE_LIST, $DTBootstrap) {
        var DTOptions = function(sAjaxSource) {
            if (angular.isString(sAjaxSource)) {
                this.sAjaxSource = sAjaxSource;
            }
            
            this.withOption = function(key, value) {
                if (angular.isString(key)) {
                    this[key] = value;
                }
                return this;
            };
            this.withSource = function(sAjaxSource) {
                this.sAjaxSource = sAjaxSource;
                return this;
            };
            this.withDataProp = function(sAjaxDataProp) {
                this.sAjaxDataProp = sAjaxDataProp;
                return this;
            };
            this.withFnServerData = function(fn) {
                if (!angular.isFunction(fn)) {
                    throw new Error('The parameter must be a function');
                }
                this.fnServerData = fn;
                return this;
            };
            this.withBootstrap = function() {
                $DTBootstrap.integrate(this);
                return this;
            };
            this.withPaginationType = function(sPaginationType) {
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
            this.withLanguage = function(oLanguage) {
                this.oLanguage = oLanguage;
                return this;
            };
            this.withLanguageSource = function(sLanguageSource) {
                return this.withLanguage({
                    sUrl: sLanguageSource
                });
            };
            this.withDisplayLength = function(iDisplayLength) {
                this.iDisplayLength = iDisplayLength;
                return this;
            };
        };
        
        return {
            newOptions: function() {
                return new DTOptions();
            },
            fromSource: function(sAjaxSource) {
                return new DTOptions(sAjaxSource);
            }
        };
    }).
    factory('DTColumnBuilder', function() {
        var DTColumn = function(mData, label) {
            if (angular.isUndefined(mData)) {
                throw new Error('The parametr "mData" is not defined!');
            }
            this.label = label || '';
            this.mData = mData;
            this.addOption = function(key, value) {
                if (angular.isString(key)) {
                    this[key] = value;
                }
                return this;
            };
            this.withLabel = function(label) {
                this.label = label;
                return this;
            };
            this.withClass = function(sClass) {
                this.sClass = sClass;
                return this;
            };
            this.setVisible = function(bVisible) {
                this.bVisible = bVisible;
                return this;
            };
            this.renderWith = function(mRender) {
                this.mRender = mRender;
                return this;
            };
            this.notSortable = function() {
                this.bSortable = false;
                return this;
            };
        };
        
        return {
            newColumn: function(mData, label) {
                return new DTColumn(mData, label);
            }
        };
    });
})(jQuery, angular);
