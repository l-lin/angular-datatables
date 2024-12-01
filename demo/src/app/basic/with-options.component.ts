import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-with-options',
    templateUrl: 'with-options.component.html',
    standalone: false
})
export class WithOptionsComponent implements OnInit {

  pageTitle = 'With Options';
  mdIntro = 'assets/docs/basic/with-options/intro.md';
  mdHTML = 'assets/docs/basic/with-options/source-html.md';
  mdTS = 'assets/docs/basic/with-options/source-ts.md';
  mdTSV1 = 'assets/docs/basic/with-options/source-ts-dtv1.md';

  dtOptions: Config = {};

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }
}
