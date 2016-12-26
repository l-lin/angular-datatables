import { ElementRef, OnInit, AfterViewChecked } from '@angular/core';
export declare class HighlightJsContentDirective implements OnInit, AfterViewChecked {
    private elementRef;
    useBr: boolean;
    highlightSelector: string;
    constructor(elementRef: ElementRef);
    ngOnInit(): void;
    ngAfterViewChecked(): void;
}
