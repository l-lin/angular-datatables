import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import 'datatables.net-select';

@Component({
  selector: 'app-select-extension',
  templateUrl: 'select-extension.component.html'
})
export class SelectExtensionComponent implements OnInit {

  pageTitle = 'DataTables Select extension';
  mdIntro = 'assets/docs/extensions/select/intro.md';
  mdInstall = 'assets/docs/extensions/select/installation.md';
  mdHTML = 'assets/docs/extensions/select/source-html.md';
  mdTS = 'assets/docs/extensions/select/source-ts.md';
  mdTSV2 = 'assets/docs/extensions/select/source-ts-dtv2.md';

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
      }],
      // Use this attribute to enable the select extension
      select: true
    };
  }
}
