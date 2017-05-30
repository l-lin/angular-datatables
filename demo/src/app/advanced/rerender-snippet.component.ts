import { Component } from '@angular/core';

@Component({
  selector: 'app-rerender-snippet',
  template: `
  <div id="html" class="col s12 m9 l12">
    <h4 class="header">HTML</h4>
    <section [innerHTML]="htmlSnippet" highlight-js-content=".xml"></section>
  </div>
  <div id="ts" class="col s12 m9 l12">
    <h4 class="header">Typescript</h4>
    <section [innerHTML]="tsSnippet" highlight-js-content=".typescript"></section>
  </div>
  `
})
export class RerenderSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;p&gt;
  &lt;button type="button" class="btn waves-effect waves-light blue" (click)="rerender()"&gt;
    Rerender
  &lt;/button&gt;
&lt;/p&gt;
&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
</code>
</pre>
  `;
}
