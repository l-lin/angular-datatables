'use strict';
angular.module('datatables.options', [])
    .constant('DT_DEFAULT_OPTIONS', {
        // Default dom
        dom: 'lfrtip',
        // Default ajax properties. See http://legacy.datatables.net/usage/options#sAjaxDataProp
        sAjaxDataProp: '',
        // Set default columns (used when none are provided)
        aoColumns: []
    })
    .service('DTDefaultOptions', dtDefaultOptions);

function dtDefaultOptions() {
    var options = {
        bootstrapOptions: {},
        setLanguageSource: setLanguageSource,
        setLanguage: setLanguage,
        setDisplayLength: setDisplayLength,
        setBootstrapOptions: setBootstrapOptions
    };

    return options;

    /**
     * Set the default language source for all datatables
     * @param sLanguageSource the language source
     * @returns {DTDefaultOptions} the default option config
     */
    function setLanguageSource(sLanguageSource) {
        $.extend($.fn.dataTable.defaults, {
            oLanguage: {
                sUrl: sLanguageSource
            }
        });
        return options;
    }

    /**
     * Set the language for all datatables
     * @param oLanguage the language
     * @returns {DTDefaultOptions} the default option config
     */
    function setLanguage(oLanguage) {
        $.extend(true, $.fn.dataTable.defaults, {
            oLanguage: oLanguage
        });
        return options;
    }

    /**
     * Set the default number of items to display for all datatables
     * @param iDisplayLength the number of items to display
     * @returns {DTDefaultOptions} the default option config
     */
    function setDisplayLength(iDisplayLength) {
        $.extend($.fn.dataTable.defaults, {
            iDisplayLength: iDisplayLength
        });
        return options;
    }

    /**
     * Set the default options to be use for Bootstrap integration.
     * See https://github.com/l-lin/angular-datatables/blob/dev/src/angular-datatables.bootstrap.options.js to check
     * what default options Angular DataTables is using.
     * @param oBootstrapOptions an object containing the default options for Bootstreap integration
     * @returns {DTDefaultOptions} the default option config
     */
    function setBootstrapOptions(oBootstrapOptions) {
        options.bootstrapOptions = oBootstrapOptions;
        return options;
    }
}
