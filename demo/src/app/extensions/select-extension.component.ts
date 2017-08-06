import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-extension',
  templateUrl: 'select-extension.component.html'
})
export class SelectExtensionComponent implements OnInit {
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
      select: true
    };
  }
}
