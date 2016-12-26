"use strict";
var core_1 = require('@angular/core');
var HighlightJsService = (function () {
    function HighlightJsService() {
    }
    HighlightJsService.prototype.highlight = function (codeBlock, useBr) {
        if (useBr) {
            hljs.configure({ useBR: true });
        }
        hljs.highlightBlock(codeBlock);
    };
    HighlightJsService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    HighlightJsService.ctorParameters = [];
    return HighlightJsService;
}());
exports.HighlightJsService = HighlightJsService;
//# sourceMappingURL=highlight-js.service.js.map