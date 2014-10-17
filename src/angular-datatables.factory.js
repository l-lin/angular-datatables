'use strict';
angular.module('datatables.factory', ['datatables.bootstrap', 'datatables.options'])
.factory('DTOptionsBuilder', function(DT_DEFAULT_OPTIONS) {
    /**
     * Optional class to handle undefined or null
     * @param obj the object to wrap
     */
    var Optional = {
        /**
         * Check if the wrapped object is defined
         * @returns true if the wrapped object is defined, false otherwise
         */
        isPresent: function() {
            return angular.isDefined(this.obj) && this.obj !== null;
        },

        /**
         * Return the wrapped object or an empty object
         * @returns the wrapped objector an empty object
         */
        orEmptyObj: function() {
            if (this.isPresent()) {
                return this.obj;
            }
            return {};
        },

        /**
         * Return the wrapped object or the given second choice
         * @returns the wrapped object or the given second choice
         */
        or: function(secondChoice) {
            if (this.isPresent()) {
                return this.obj;
            }
            return secondChoice;
        }
    };

    /**
     * Wrap the given objec
     * @param obj the object to wrap
     * @returns {Optional} the optional of the wrapped object
     */
    var fromNullable = function(obj) {
        var optional = Object.create(Optional);
        optional.obj = obj;
        return optional;
    };

    /**
     * The wrapped datatables options class
     * @param sAjaxSource the ajax source to fetch the data
     * @param fnPromise the function that returns a promise to fetch the data
     */
    var DTOptions = {
        integrateBootstrap: false,
        hasColVis: false,
        hasColReorder: false,
        hasTableTools: false,
        hasOverrideDom: false,

        reloadData: function() {
            this.reload = true;
            return this;
        },

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
         * This corresponds to the "sAjaxSource" option
         * @param sAjaxSource the ajax source
         * @returns {DTOptions} the options
         */
        withSource: function(sAjaxSource) {
            this.sAjaxSource = sAjaxSource;
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
         * @param oLanguage the language
         * @returns {DTOptions} the options
         */
        withLanguage: function(oLanguage) {
            this.oLanguage = oLanguage;
            return this;
        },

        /**
         * Set the language source
         * @param sLanguageSource the language source
         * @returns {DTOptions} the options
         */
        withLanguageSource: function(sLanguageSource) {
            return this.withLanguage({
                sUrl: sLanguageSource
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
         * @param sDom the dom
         * @returns {DTOptions} the options
         */
        withDOM: function(sDom) {
            this.sDom = sDom;
            this.hasOverrideDom = true;
            return this;
        },

        // BOOTSTRAP INTEGRATION ---------
        // See http://getbootstrap.com

        /**
         * Add bootstrap compatibility
         * @returns {DTOptions} the options
         */
        withBootstrap: function() {
            this.integrateBootstrap = true;
            // Override page button active CSS class
            if (angular.isObject(this.oClasses)) {
                this.oClasses.sPageButtonActive = 'active';
            } else {
                this.oClasses = {
                    sPageButtonActive: 'active'
                };
            }
            return this;
        },

        /**
         * Add bootstrap options
         * @param bootstrapOptions the bootstrap options
         * @returns {DTOptions} the options
         */
        withBootstrapOptions: function(bootstrapOptions) {
            this.bootstrap = bootstrapOptions;
            return this;
        },

        // COL REORDER DATATABLES PLUGIN ---------
        // See https://datatables.net/extras/colreorder/

        /**
         * Add option to "oColReorder" option
         * @param key the key of the option to add
         * @param value an object or a function of the function
         * @return {DTOptions} the options
         */
        withColReorderOption: function(key, value) {
            if (angular.isString(key)) {
                this.oColReorder = fromNullable(this.oColReorder).orEmptyObj();
                this.oColReorder[key] = value;
            }
            return this;
        },

        /**
         * Add colReorder compatibility
         * @returns {DTOptions} the options
         */
        withColReorder: function() {
            var colReorderPrefix = 'R';
            this.sDom = colReorderPrefix + fromNullable(this.sDom).or(DT_DEFAULT_OPTIONS.dom);
            this.hasColReorder = true;
            return this;
        },

        /**
         * Set the default column order
         * @param aiOrder the column order
         * @returns {DTOptions} the options
         */
        withColReorderOrder: function(aiOrder) {
            if (angular.isArray(aiOrder)) {
                this.withColReorderOption('aiOrder', aiOrder);
            }
            return this;
        },

        /**
         * Set the reorder callback function
         * @param fnReorderCallback the callback
         * @returns {DTOptions} the options
         */
        withColReorderCallback: function(fnReorderCallback) {
            if (angular.isFunction(fnReorderCallback)) {
                this.withColReorderOption('fnReorderCallback', fnReorderCallback);
            } else {
                throw new Error('The reorder callback must be a function');
            }
            return this;
        },

        // COL VIS DATATABLES PLUGIN ---------
        // See https://datatables.net/extras/colvis/

        /**
         * Add option to "oColVis" option
         * @param key the key of the option to add
         * @param value an object or a function of the function
         * @returns {DTOptions} the options
         */
        withColVisOption: function(key, value) {
            if (angular.isString(key)) {
                this.oColVis = fromNullable(this.oColVis).orEmptyObj();
                this.oColVis[key] = value;
            }
            return this;
        },

        /**
         * Add colVis compatibility
         * @returns {DTOptions} the options
         */
        withColVis: function() {
            var colVisPrefix = 'C';
            this.sDom = colVisPrefix + fromNullable(this.sDom).or(DT_DEFAULT_OPTIONS.dom);
            this.hasColVis = true;
            return this;
        },

        /**
         * Set the state change function
         * @param fnStateChange  the state change function
         * @returns {DTOptions} the options
         */
        withColVisStateChange: function(fnStateChange) {
            if (angular.isFunction(fnStateChange)) {
                this.withColVisOption('fnStateChange', fnStateChange);
            } else {
                throw new Error('The state change must be a function');
            }
            return this;
        },

        // TABLE TOOLS DATATABLES PLUGIN ---------
        // See https://datatables.net/extras/tabletools/

        /**
         * Add option to "oTableTools" option
         * @param key the key of the option to add
         * @param value an object or a function of the function
         * @returns {DTOptions} the options
         */
        withTableToolsOption: function(key, value) {
            if (angular.isString(key)) {
                this.oTableTools = fromNullable(this.oTableTools).orEmptyObj();
                this.oTableTools[key] = value;
            }
            return this;
        },

        /**
         * Add table tools compatibility
         * @param sSwfPath the path to the swf file to export in csv/xls
         * @returns {DTOptions} the options
         */
        withTableTools: function(sSwfPath) {
            var tableToolsPrefix = 'T';
            this.sDom = tableToolsPrefix + fromNullable(this.sDom).or(DT_DEFAULT_OPTIONS.dom);
            this.hasTableTools = true;
            if (angular.isString(sSwfPath)) {
                this.withTableToolsOption('sSwfPath', sSwfPath);
            }
            return this;
        },

        /**
         * Set the table tools buttons to display
         * @param aButtons the array of buttons to display
         * @returns {DTOptions} the options
         */
        withTableToolsButtons: function(aButtons) {
            if (angular.isArray(aButtons)) {
                this.withTableToolsOption('aButtons', aButtons);
            }
            return this;
        },

        // SCROLLER DATATABLES PLUGIN ---------
        // See http://datatables.net/extensions/scroller/

        /**
         * Add scroller compatibility
         * @returns {DTOptions} the options
         */
        withScroller: function() {
            var scrollerSuffix = 'S';
            this.sDom = fromNullable(this.sDom).or(DT_DEFAULT_OPTIONS.dom) + scrollerSuffix;
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
         * @param sAjaxSource the ajax source
         * @returns {DTOptions} a wrapped datatables option
         */
        fromSource: function(sAjaxSource) {
            var options = Object.create(DTOptions);
            options.sAjaxSource = sAjaxSource;
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
})
.factory('DTColumnBuilder', function() {
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
            column.sTitle = sTitle || '';
            return column;
        },
        DTColumn: DTColumn
    };
})
.factory('DTColumnDefBuilder', function(DTColumnBuilder) {
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
})
.factory('DTLoadingTemplate', function() {
    return {
        html: '<h3 class="dt-loading">Loading...</h3>'
    };
});
