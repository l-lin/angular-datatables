import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import 'datatables.net-colreorder'

@Component({
  selector: 'app-colreorder-extension',
  templateUrl: 'colreorder-extension.component.html'
})
export class ColreorderExtensionComponent implements OnInit {

  pageTitle = 'DataTables ColReorder extension';
  mdIntro = 'assets/docs/extensions/colreorder/intro.md';
  mdInstall = 'assets/docs/extensions/colreorder/installation.md';
  mdHTML = 'assets/docs/extensions/colreorder/source-html.md';
  mdTS = 'assets/docs/extensions/colreorder/source-ts.md';

  dtOptions: Config = {};

  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [{
        title: 'No move me!',
        data: 'id'
      }, {
        title: 'Try to move me!',
        data: 'firstName'
      }, {
        title: 'You cannot move me! *evil laugh*',
        data: 'lastName'
      }],
      dom: 'Rt',
      // Use this attribute to enable colreorder
      colReorder: {
        order: [1, 0, 2],
      }
    };
  }
}
