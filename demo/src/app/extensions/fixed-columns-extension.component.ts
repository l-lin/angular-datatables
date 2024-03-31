import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import 'datatables.net-fixedcolumns-dt';

@Component({
  selector: 'app-fixed-columns-extension',
  templateUrl: 'fixed-columns-extension.component.html'
})
export class FixedColumnsExtensionComponent implements OnInit {

  pageTitle = 'DataTables Fixed Columns extension';
  mdIntro = 'assets/docs/extensions/fixedcolumns/intro.md';
  mdInstall = 'assets/docs/extensions/fixedcolumns/installation.md';
  mdHTML = 'assets/docs/extensions/fixedcolumns/source-html.md';
  mdTS = 'assets/docs/extensions/fixedcolumns/source-ts.md';

  // Unfortunately this still requires `any` due to types issue in fixedcolumns
  dtOptions: any = {};

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
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Last name',
        data: 'lastName'
      },
      {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }

    ],
    // Make sure that scrollX is set to true for this to work!
    scrollX: true,
    fixedColumns: {
        left: 3,
        right: 0
      },
    };
  }
}
