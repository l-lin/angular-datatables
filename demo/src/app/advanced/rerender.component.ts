import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';

@Component({
  selector: 'app-rerender',
  templateUrl: 'rerender.component.html'
})
export class RerenderComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

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
    this.dtTrigger.next();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
