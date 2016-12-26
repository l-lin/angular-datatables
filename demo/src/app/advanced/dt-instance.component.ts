import { Component, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';

declare var $: any;

@Component({
  selector: 'dt-instance',
  templateUrl: 'dt-instance.component.html'
})
export class DtInstanceComponent implements OnInit {
  @ViewChild(DataTableDirective)
  private datatableElement: DataTableDirective;

  dtOptions: any = {};

  displayToConsole(datatableElement: DataTableDirective): void {
    datatableElement.dtInstance.then(dtInstance => console.log(dtInstance));
  }

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

  ngAfterViewInit(): void {
    $('ul.tabs').tabs();
  }
}
