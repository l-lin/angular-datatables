'use strict';
angular.module('datatables.factory', [])
    .factory('DTOptionsBuilder', dtOptionsBuilder)
    .factory('DTColumnBuilder', dtColumnBuilder)
    .factory('DTColumnDefBuilder', dtColumnDefBuilder)
    .factory('DTLoadingTemplate', dtLoadingTemplate);

/* @ngInject */
function dtOptionsBuilder() {
    /**
     * The wrapped datatables options class
     * @param sAjaxSource the ajax source to fetch the data
     * @param fnPromise the function that returns a promise to fetch the data
     */
    var DTOptions = {
        hasOverrideDom: false,

        /**
         * Add the option to the datatables optoins
         * @param key the key of the option
         * @param value an object or a function of the option
         * @returns {DTOptions} the options
         */
        withOption: function(key, value) {
            if (angular.isString(key)) {
                this[key] = value;
            }
            return this;
        },

        /**
         * Add the Ajax source to the options.
         * This corresponds to the "ajax" option
         * @param ajax the ajax source
         * @returns {DTOptions} the options
         */
        withSource: function(ajax) {
            this.ajax = ajax;
            return this;
        },

        /**
         * Add the ajax data properties.
         * @param sAjaxDataProp the ajax data property
         * @returns {DTOptions} the options
         */
        withDataProp: function(sAjaxDataProp) {
            this.sAjaxDataProp = sAjaxDataProp;
            return this;
        },

        /**
         * Set the server data function.
         * @param fn the function of the server retrieval
         * @returns {DTOptions} the options
         */
        withFnServerData: function(fn) {
            if (!angular.isFunction(fn)) {
                throw new Error('The parameter must be a function');
            }
            this.fnServerData = fn;
            return this;
        },

        /**
         * Set the pagination type.
         * @param sPaginationType the pagination type
         * @returns {DTOptions} the options
         */
        withPaginationType: function(sPaginationType) {
            if (angular.isString(sPaginationType)) {
                this.sPaginationType = sPaginationType;
            } else {
                throw new Error('The pagination type must be provided');
            }
            return this;
        },

        /**
         * Set the language of the datatables
         * @param language the language
         * @returns {DTOptions} the options
         */
        withLanguage: function(language) {
            this.language = language;
            return this;
        },

        /**
         * Set the language source
         * @param languageSource the language source
         * @returns {DTOptions} the options
         */
        withLanguageSource: function(languageSource) {
            return this.withLanguage({
                url: languageSource
            });
        },

        /**
         * Set default number of items per page to display
         * @param iDisplayLength the number of items per page
         * @returns {DTOptions} the options
         */
        withDisplayLength: function(iDisplayLength) {
            this.iDisplayLength = iDisplayLength;
            return this;
        },

        /**
         * Set the promise to fetch the data
         * @param fnPromise the function that returns a promise
         * @returns {DTOptions} the options
         */
        withFnPromise: function(fnPromise) {
            this.fnPromise = fnPromise;
            return this;
        },

        /**
         * Set the Dom of the DataTables.
         * @param dom the dom
         * @returns {DTOptions} the options
         */
        withDOM: function(dom) {
            this.dom = dom;
            return this;
        }
    };

    return {
        /**
         * Create a wrapped datatables options
         * @returns {DTOptions} a wrapped datatables option
         */
        newOptions: function() {
            return Object.create(DTOptions);
        },
        /**
         * Create a wrapped datatables options with the ajax source setted
         * @param ajax the ajax source
         * @returns {DTOptions} a wrapped datatables option
         */
        fromSource: function(ajax) {
            var options = Object.create(DTOptions);
            options.ajax = ajax;
            return options;
        },
        /**
         * Create a wrapped datatables options with the data promise.
         * @param fnPromise the function that returns a promise to fetch the data
         * @returns {DTOptions} a wrapped datatables option
         */
        fromFnPromise: function(fnPromise) {
            var options = Object.create(DTOptions);
            options.fnPromise = fnPromise;
            return options;
        }
    };
}

function dtColumnBuilder() {
    /**
     * The wrapped datatables column
     * @param mData the data to display of the column
     * @param sTitle the sTitle of the column title to display in the DOM
     */
    var DTColumn = {
        /**
         * Add the option of the column
         * @param key the key of the option
         * @param value an object or a function of the option
         * @returns {DTColumn} the wrapped datatables column
         */
        withOption: function(key, value) {
            if (angular.isString(key)) {
                this[key] = value;
            }
            return this;
        },

        /**
         * Set the title of the colum
         * @param sTitle the sTitle of the column
         * @returns {DTColumn} the wrapped datatables column
         */
        withTitle: function(sTitle) {
            this.sTitle = sTitle;
            return this;
        },

        /**
         * Set the CSS class of the column
         * @param sClass the CSS class
         * @returns {DTColumn} the wrapped datatables column
         */
        withClass: function(sClass) {
            this.sClass = sClass;
            return this;
        },

        /**
         * Hide the column
         * @returns {DTColumn} the wrapped datatables column
         */
        notVisible: function() {
            this.bVisible = false;
            return this;
        },

        /**
         * Set the column as not sortable
         * @returns {DTColumn} the wrapped datatables column
         */
        notSortable: function() {
            this.bSortable = false;
            return this;
        },

        /**
         * Render each cell with the given parameter
         * @mRender mRender the function/string to render the data
         * @returns {DTColumn} the wrapped datatables column
         */
        renderWith: function(mRender) {
            this.mRender = mRender;
            return this;
        }
    };

    return {
        /**
         * Create a new wrapped datatables column
         * @param mData the data of the column to display
         * @param sTitle the sTitle of the column title to display in the DOM
         * @returns {DTColumn} the wrapped datatables column
         */
        newColumn: function(mData, sTitle) {
            if (angular.isUndefined(mData)) {
                throw new Error('The parameter "mData" is not defined!');
            }
            var column = Object.create(DTColumn);
            column.mData = mData;
            if (angular.isDefined(sTitle)) {
                column.sTitle = sTitle;
            }
            return column;
        },
        DTColumn: DTColumn
    };
}

/* @ngInject */
function dtColumnDefBuilder(DTColumnBuilder) {
    return {
        newColumnDef: function(targets) {
            if (angular.isUndefined(targets)) {
                throw new Error('The parameter "targets" must be defined! See https://datatables.net/reference/option/columnDefs.targets');
            }
            var column = Object.create(DTColumnBuilder.DTColumn);
            if (angular.isArray(targets)) {
                column.aTargets = targets;
            } else {
                column.aTargets = [targets];
            }
            return column;
        }
    };
}

function dtLoadingTemplate($compile, DTDefaultOptions, DT_LOADING_CLASS) {
    return {
        compileHtml: function($scope) {
            return $compile(angular.element('<div class="' + DT_LOADING_CLASS + '">' + DTDefaultOptions.loadingTemplate + '</div>'))($scope);
        },
        isLoading: function(elem) {
            return elem.hasClass(DT_LOADING_CLASS);
        }
    };
}
