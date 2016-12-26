"use strict";
var core_1 = require('@angular/core');
var HighlightJsContentDirective = (function () {
    function HighlightJsContentDirective(elementRef) {
        this.elementRef = elementRef;
    }
    HighlightJsContentDirective.prototype.ngOnInit = function () {
        if (this.useBr) {
            hljs.configure({ useBR: true });
        }
    };
    HighlightJsContentDirective.prototype.ngAfterViewChecked = function () {
        var selector = this.highlightSelector || 'code';
        if (this.elementRef.nativeElement.innerHTML) {
            var snippets = this.elementRef.nativeElement.querySelectorAll(selector);
            for (var _i = 0, snippets_1 = snippets; _i < snippets_1.length; _i++) {
                var snippet = snippets_1[_i];
                hljs.highlightBlock(snippet);
            }
        }
    };
    HighlightJsContentDirective.decorators = [
        { type: core_1.Directive, args: [{ selector: '[highlight-js-content]' },] },
    ];
    /** @nocollapse */
    HighlightJsContentDirective.ctorParameters = [
        { type: core_1.ElementRef, },
    ];
    HighlightJsContentDirective.propDecorators = {
        'useBr': [{ type: core_1.Input },],
        'highlightSelector': [{ type: core_1.Input, args: ['highlight-js-content',] },],
    };
    return HighlightJsContentDirective;
}());
exports.HighlightJsContentDirective = HighlightJsContentDirective;
//# sourceMappingURL=highlight-js-content.directive.js.map