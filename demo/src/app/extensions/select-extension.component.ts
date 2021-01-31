import { Component, OnInit } from '@angular/core';

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

  // Must be declared as "any", not as "DataTables.Settings"
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
      }],
      // Use this attribute to enable the select extension
      select: true
    };
  }
}
