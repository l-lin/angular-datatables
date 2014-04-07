(function($, angular) {
    'use strict';
    angular.module('datatables.factory', ['datatables.bootstrap']).
    value('DT_DEFAULT_DOM', 'lfrtip').
    service('$DTDefaultOptions', function() {
        /**
         * Set the default language source for all datatables
         * @param sLanguageSource the language source
         * @return {$DTDefaultOption} the default option config
         */
        this.setLanguageSource = function(sLanguageSource) {
            $.extend($.fn.dataTable.defaults, {
                oLanguage: {
                    sUrl: sLanguageSource
                }
            });
            return this;
        };
        
        /**
         * Set the default number of items to display for all datatables
         * @param iDisplayLength the number of items to display
         * @return {$DTDefaultOption} the default option config
         */
        this.setDisplayLength = function(iDisplayLength) {
            $.extend($.fn.dataTable.defaults, {
                iDisplayLength: iDisplayLength
            });
            return this;
        };
    }).
    factory('DTOptionsBuilder', function($DTBootstrap, DT_DEFAULT_DOM) {
        /**
         * The wrapped datatables options class
         * @param sAjaxSource the ajax source to fetch the data
         */
        var DTOptions = function(sAjaxSource) {
            this.sAjaxSource = sAjaxSource;
            
            /**
             * Optional class to handle undefined or null
             * @param obj the object to wrap
             */
            var Optional = function(obj) {
                this.obj = obj;
                /**
                 * Check if the wrapped object is defined
                 * @return true if the wrapped object is defined, false otherwise
                 */
                this.isPresent = function() {
                    return angular.isDefined(this.obj) && !angular.isNull(this.obj);
                };
                
                /**
                 * Return the wrapped object or an empty object
                 * @return the wrapped objector an empty object
                 */
                this.orEmptyObj = function() {
                    if (this.isPresent()) {
                        return this.obj;
                    }
                    return {};
                };
                
                /**
                 * Return the wrapped object or the given second choice
                 * @return the wrapped object or the given second choice
                 */
                this.or = function(secondChoice) {
                    if (this.isPresent()) {
                        return this.obj;
                    }
                    return secondChoice;
                };
            };
            
            /**
             * Wrap the given objec
             * @param obj the object to wrap
             * @return {Optional} the optional of the wrapped object
             */
            var fromNullable = function(obj) {
                return new Optional(obj);
            };
            
            /**
             * Add the option to the datatables optoins
             * @param key the key of the option
             * @param value an object or a function of the option
             * @return {DTOption} the options
             */
            this.withOption = function(key, value) {
                if (angular.isString(key)) {
                    this[key] = value;
                }
                return this;
            };
            
            /**
             * Add the Ajax source to the options.
             * This corresponds to the "sAjaxSource" option
             * @param sAjaxSource the ajax source
             * @return {DTOption} the options
             */
            this.withSource = function(sAjaxSource) {
                this.sAjaxSource = sAjaxSource;
                return this;
            };
            
            /**
             * Add the ajax data properties.
             * @param sAjaxDataProp the ajax data property
             * @return {DTOption} the options
             */
            this.withDataProp = function(sAjaxDataProp) {
                this.sAjaxDataProp = sAjaxDataProp;
                return this;
            };
            
            /**
             * Set the server data function.
             * @param fn the function of the server retrieval
             * @return {DTOption} the options
             */
            this.withFnServerData = function(fn) {
                if (!angular.isFunction(fn)) {
                    throw new Error('The parameter must be a function');
                }
                this.fnServerData = fn;
                return this;
            };
            
            /**
             * Set the pagination type.
             * @param sPaginationType the pagination type
             * @return {DTOption} the options
             */
            this.withPaginationType = function(sPaginationType) {
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
             * @return {DTOption} the options
             */
            this.withLanguage = function(oLanguage) {
                this.oLanguage = oLanguage;
                return this;
            };
            
            /**
             * Set the language source
             * @param sLanguageSource the language source
             * @return {DTOption} the options
             */
            this.withLanguageSource = function(sLanguageSource) {
                return this.withLanguage({
                    sUrl: sLanguageSource
                });
            };
            
            /**
             * Set default number of items per page to display
             * @param iDisplayLength the number of items per page
             * @return {DTOption} the options
             */
            this.withDisplayLength = function(iDisplayLength) {
                this.iDisplayLength = iDisplayLength;
                return this;
            };
            
            // BOOTSTRAP INTEGRATION ---------
            // See http://getbootstrap.com
            
            /**
             * Add bootstrap compatibility
             * @return {DTOption} the options
             */
            this.withBootstrap = function() {
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
            this.withColReorderOption = function(key, value) {
                if (angular.isString(key)) {
                    this.oColReorder = fromNullable(this.oColReorder).orEmptyObj();
                    this.oColReorder[key] = value;
                }
                return this;
            };
            
            /**
             * Add colReorder compatibility
             * @return {DTOption} the options
             */
            this.withColReorder = function() {
                var colReorderPrefix = 'R';
                this.sDom = colReorderPrefix + fromNullable(this.sDom).or(DT_DEFAULT_DOM);
                return this;
            };
            
            /**
             * Set the default column order
             * @param aiOrder the column order
             * @return {DTOption} the options
             */
            this.withColOrder = function(aiOrder) {
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
             * @return {DTOptions} the options
             */
            this.withReorderCallback = function(fnReorderCallback) {
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
             * @param {DTOption} the options
             */
            this.withColVisOption = function(key, value) {
                if (angular.isString(key)) {
                    this.oColVis = fromNullable(this.oColVis).orEmptyObj();
                    this.oColVis[key] = value;
                }
                return this;
            };
            
            /**
             * Add colVis compatibility
             * @return {DTOption} the options
             */
            this.withColVis = function() {
                var colVisPrefix = 'C<"clear">';
                this.sDom = colVisPrefix + fromNullable(this.sDom).or(DT_DEFAULT_DOM);
                return this;
            };
            
        };
        
        return {
            /**
             * Create a wrapped datatables options
             * @return {DTOption} a wrapped datatables option
             */
            newOptions: function() {
                return new DTOptions();
            },
            /**
             * Create a wrapped datatables options with the ajax source setted
             * @param sAjaxSource the ajax source
             * @return {DTOption} a wrapped datatables option
             */
            fromSource: function(sAjaxSource) {
                return new DTOptions(sAjaxSource);
            }
        };
    }).
    factory('DTColumnBuilder', function() {
        /**
         * The wrapped datatables column 
         * @param mData the data to display of the column
         * @param label the label of the column title to display in the DOM
         */
        var DTColumn = function(mData, label) {
            if (angular.isUndefined(mData)) {
                throw new Error('The parametr "mData" is not defined!');
            }
            this.mData = mData;
            this.label = label || '';
            
            /**
             * Add the option of the column
             * @param key the key of the option
             * @param value an object or a function of the option
             * @return {DTColumn} the wrapped datatables column
             */
            this.withOption = function(key, value) {
                if (angular.isString(key)) {
                    this[key] = value;
                }
                return this;
            };
            
            /**
             * Set the label of the colum
             * @param label the label of the column
             * @return {DTColumn} the wrapped datatables column
             */
            this.withLabel = function(label) {
                this.label = label;
                return this;
            };
            
            /**
             * Set the CSS class of the column
             * @param sClass the CSS class
             * @return {DTColumn} the wrapped datatables column
             */
            this.withClass = function(sClass) {
                this.sClass = sClass;
                return this;
            };
            
            /**
             * Hide the column
             * @return {DTColumn} the wrapped datatables column
             */
            this.notVisible = function() {
                this.bVisible = false;
                return this;
            };
            
            /**
             * Set the column as not sortable
             * @return {DTColumn} the wrapped datatables column
             */
            this.notSortable = function() {
                this.bSortable = false;
                return this;
            };
            
            /**
             * Render each cell with the given parameter
             * @mRender mRender the function/string to render the data
             * @return {DTColumn} the wrapped datatables column
             */
            this.renderWith = function(mRender) {
                this.mRender = mRender;
                return this;
            };
        };
        
        return {
            /**
             * Create a new wrapped datatables column
             * @param mData the data of the column to display
             * @param label the label of the column title to display in the DOM
             * @return {DTColumn} the wrapped datatables column
             */
            newColumn: function(mData, label) {
                return new DTColumn(mData, label);
            }
        };
    });
})(jQuery, angular);
