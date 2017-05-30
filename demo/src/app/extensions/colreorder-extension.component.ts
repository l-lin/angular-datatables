import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-colreorder-extension',
  templateUrl: 'colreorder-extension.component.html'
})
export class ColreorderExtensionComponent implements OnInit {
  // Must be declared as "any", not as "DataTables.Settings"
  dtOptions: any = {};

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
        fixedColumnsRight: 2
      }
    };
  }
}
