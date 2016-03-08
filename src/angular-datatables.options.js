'use strict';
angular.module('datatables.options', [])
    .constant('DT_DEFAULT_OPTIONS', {
        // Default ajax properties. See http://legacy.datatables.net/usage/options#sAjaxDataProp
        sAjaxDataProp: '',
        // Set default columns (used when none are provided)
        aoColumns: []
    })
    .constant('DT_LOADING_CLASS', 'dt-loading')
    .service('DTDefaultOptions', dtDefaultOptions);

function dtDefaultOptions() {
    var options = {
        loadingTemplate: '<h3>Loading...</h3>',
        bootstrapOptions: {},
        setLoadingTemplate: setLoadingTemplate,
        setLanguageSource: setLanguageSource,
        setLanguage: setLanguage,
        setDisplayLength: setDisplayLength,
        setBootstrapOptions: setBootstrapOptions,
        setDOM: setDOM
    };

    return options;

    /**
     * Set the default loading template
     * @param loadingTemplate the HTML to display when loading the table
     * @returns {DTDefaultOptions} the default option config
     */
    function setLoadingTemplate(loadingTemplate) {
        options.loadingTemplate = loadingTemplate;
        return options;
    }

    /**
     * Set the default language source for all datatables
     * @param sLanguageSource the language source
     * @returns {DTDefaultOptions} the default option config
     */
    function setLanguageSource(sLanguageSource) {
        // HACK to resolve the language source manually instead of DT
        // See https://github.com/l-lin/angular-datatables/issues/356
        $.ajax({
            dataType: 'json',
            url: sLanguageSource,
            success: function(json) {
                $.extend(true, $.fn.DataTable.defaults, {
                    language: json
                });
            }
        });
        return options;
    }

    /**
     * Set the language for all datatables
     * @param language the language
     * @returns {DTDefaultOptions} the default option config
     */
    function setLanguage(language) {
        $.extend(true, $.fn.DataTable.defaults, {
            language: language
        });
        return options;
    }

    /**
     * Set the default number of items to display for all datatables
     * @param displayLength the number of items to display
     * @returns {DTDefaultOptions} the default option config
     */
    function setDisplayLength(displayLength) {
        $.extend($.fn.DataTable.defaults, {
            displayLength: displayLength
        });
        return options;
    }

    /**
     * Set the default options to be use for Bootstrap integration.
     * See https://github.com/l-lin/angular-datatables/blob/dev/src/angular-datatables.bootstrap.options.js to check
     * what default options Angular DataTables is using.
     * @param oBootstrapOptions an object containing the default options for Bootstrap integration
     * @returns {DTDefaultOptions} the default option config
     */
    function setBootstrapOptions(oBootstrapOptions) {
        options.bootstrapOptions = oBootstrapOptions;
        return options;
    }

    /**
     * Set the DOM for all DataTables.
     * See https://datatables.net/reference/option/dom
     * @param dom the dom
     * @returns {DTDefaultoptions} the default option config
     */
    function setDOM(dom) {
        $.extend($.fn.DataTable.defaults, {
            dom: dom
        });
        return options;
    }
}
