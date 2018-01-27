import { Component } from '@angular/core';

@Component({
  selector: 'app-multiple-tables-snippet',
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
export class MultipleTablesSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;p&gt;
&lt;button type="button" class="btn waves-effect waves-light blue" (click)="displayToConsole()"&gt;
  Display the DataTable instances in the console
&lt;/button&gt;
&lt;/p&gt;
&lt;table id="first-table" datatable [dtOptions]="dtOptions[0]" class="row-border hover"&gt;&lt;/table&gt;
&lt;table id="second-table" datatable [dtOptions]="dtOptions[1]" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-multiple-tables',
  templateUrl: 'multiple-tables.component.html'
})
export class MultipleTablesComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  dtOptions: DataTables.Settings[] = [];

  displayToConsole(): void {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        console.log(\`The DataTable \${index} instance ID is: \${dtInstance.table().node().id}\`);
      });
    });
  }

  ngOnInit(): void {
    this.dtOptions[0] = this.buildDtOptions('data/data.json');
    this.dtOptions[1] = this.buildDtOptions('data/data1.json');
  }

  private buildDtOptions(url: string): DataTables.Settings {
    return {
      ajax: url,
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
</code>
</pre>
  `;
}
