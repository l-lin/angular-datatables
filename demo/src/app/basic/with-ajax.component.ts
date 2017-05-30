import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-with-ajax',
  templateUrl: 'with-ajax.component.html'
})
export class WithAjaxComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

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
