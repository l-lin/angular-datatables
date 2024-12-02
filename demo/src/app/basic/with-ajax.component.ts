import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';

@Component({
    selector: 'app-with-ajax',
    templateUrl: 'with-ajax.component.html',
    standalone: false
})
export class WithAjaxComponent implements OnInit {

  pageTitle = 'Quickstart';
  mdIntro = 'assets/docs/basic/with-ajax/intro.md';
  mdHTML = 'assets/docs/basic/with-ajax/source-html.md';
  mdTS = 'assets/docs/basic/with-ajax/source-ts.md';
  mdTSV1 = 'assets/docs/basic/with-ajax/source-ts-dtv1.md';

  dtOptions: Config = {};

  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [{
        title: 'ID',
        data: 'id'
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }]
    };
  }
}
