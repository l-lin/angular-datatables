import { Component, ElementRef } from '@angular/core';

import { HighlightJsService } from 'angular2-highlight-js';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular DataTables examples';

  ngAfterViewInit(): void {
    $('.button-collapse').sideNav();
  }
}
