import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buttons-extension',
  templateUrl: 'buttons-extension.component.html'
})
export class ButtonsExtensionComponent implements OnInit {

  pageTitle = 'DataTables Buttons extension';
  mdIntro = 'assets/docs/extensions/buttons/intro.md';
  mdInstall = 'assets/docs/extensions/buttons/installation.md';
  mdHTML = 'assets/docs/extensions/buttons/source-html.md';
  mdTS = 'assets/docs/extensions/buttons/source-ts.md';


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
          exportOption: [1, 2, 3]
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
