import { Component } from '@angular/core';

@Component({
  selector: 'app-dt-instance-snippet',
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
export class DtInstanceSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;p&gt;
  &lt;button type="button"
          class="btn waves-effect waves-light blue"
          (click)="displayToConsole(datatableElement)"&gt;
    Display the DataTable instance in the console
  &lt;/button&gt;
&lt;/p&gt;
&lt;p&gt;
&lt;blockquote&gt;
  The DataTable instance ID is: {{ (datatableEl.dtInstance | async)?.table().node().id }}
&lt;/blockquote&gt;
&lt;/p&gt;
&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component, ViewChild, OnInit } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'dt-instance',
  templateUrl: 'dt-instance.component.html'
})
export class DtInstanceComponent implements OnInit {
  @ViewChild(DataTableDirective)
  private datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  displayToConsole(datatableElement: DataTableDirective): void {
    datatableElement.dtInstance.then((dtInstance: DataTables.Api) => console.log(dtInstance));
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
}</code>
</pre>
  `;
}
