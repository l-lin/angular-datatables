import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net-dt';
import 'datatables.net-buttons-dt';

@Component({
    selector: 'app-buttons-extension',
    templateUrl: 'buttons-extension.component.html',
    standalone: false
})
export class ButtonsExtensionComponent implements OnInit {

  pageTitle = 'DataTables Buttons extension';
  mdIntro = 'assets/docs/extensions/buttons/intro.md';
  mdInstall = 'assets/docs/extensions/buttons/installation.md';
  mdInstallV1 = 'assets/docs/extensions/buttons/installation-dtv1.md';
  mdHTML = 'assets/docs/extensions/buttons/source-html.md';
  mdTS = 'assets/docs/extensions/buttons/source-ts.md';
  mdTSV1 = 'assets/docs/extensions/buttons/source-ts-dtv1.md';

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
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        'columnsToggle',
        'colvis',
        'copy',
        {
          extend: 'csv',
          text: 'CSV export',
          fieldSeparator: ';',
          exportOptions: [1, 2, 3]
        },
        'excel',
        {
          text: 'Some button',
          key: '1',
          action: function (e, dt, node, config) {
            alert('Button activated');
          }
        }
      ]
    };
  }
}
