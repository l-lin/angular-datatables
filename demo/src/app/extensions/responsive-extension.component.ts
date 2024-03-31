import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net-dt';
import 'datatables.net-responsive';

@Component({
  selector: 'app-responsive-extension',
  templateUrl: 'responsive-extension.component.html'
})
export class ResponsiveExtensionComponent implements OnInit {

  pageTitle = 'DataTables Responsive extension';
  mdIntro = 'assets/docs/extensions/responsive/intro.md';
  mdInstall = 'assets/docs/extensions/responsive/installation.md';
  mdHTML = 'assets/docs/extensions/responsive/source-html.md';
  mdTS = 'assets/docs/extensions/responsive/source-ts.md';

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
        data: 'lastName',
        className: 'none'
      }],
      // Use this attribute to enable the responsive extension
      responsive: true
    };
  }
}
