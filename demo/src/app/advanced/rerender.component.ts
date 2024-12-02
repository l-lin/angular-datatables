import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-rerender',
    templateUrl: 'rerender.component.html',
    standalone: false
})
export class RerenderComponent implements AfterViewInit, OnDestroy, OnInit {

  pageTitle = 'Rerender';
  mdIntro = 'assets/docs/advanced/rerender/intro.md';
  mdHTML = 'assets/docs/advanced/rerender/source-html.md';
  mdTS = 'assets/docs/advanced/rerender/source-ts.md';
  mdTSV1 = 'assets/docs/advanced/rerender/source-ts-dtv1.md';


  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  dtOptions: Config = {};

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
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then(dtInstance => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }
}
