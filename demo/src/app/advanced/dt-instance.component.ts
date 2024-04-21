import { Component, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-dt-instance',
  templateUrl: 'dt-instance.component.html'
})
export class DtInstanceComponent implements OnInit {

  pageTitle = 'Finding DataTable instance';
  mdIntro = 'assets/docs/advanced/dt-instance/intro.md';
  mdHTML = 'assets/docs/advanced/dt-instance/source-html.md';
  mdTS = 'assets/docs/advanced/dt-instance/source-ts.md';
  mdTSV1 = 'assets/docs/advanced/dt-instance/source-ts-dtv1.md';

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective|undefined;

  dtOptions: Config = {};

  displayToConsole(datatableElement: DataTableDirective | undefined): void {
    if (!datatableElement) return;
    datatableElement.dtInstance.then(dtInstance => console.log(dtInstance));
  }

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
