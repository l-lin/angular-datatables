import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-range-search-snippet',
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
export class CustomRangeSearchSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;form (submit)="filterById()"&gt;
  &lt;label&gt;
    Min
    &lt;input type="number" name="min" id="min" [(ngModel)]="min" /&gt;
  &lt;/label&gt;
  &lt;label&gt;
    Max
    &lt;input type="number" name="max" id="max" [(ngModel)]="max" /&gt;
  &lt;/label&gt;
  &lt;button class="btn btn-primary" type="submit"&gt;Filter by ID&lt;/button&gt;
&lt;/form&gt;
&lt;br /&gt;
&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';

// Example from https://datatables.net/examples/plug-ins/range_filtering.html
@Component({
  selector: 'app-custom-range-search',
  templateUrl: 'custom-range-search.component.html'
})
export class CustomRangeSearchComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  min: number;
  max: number;

  dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    // We need to call the $.fn.dataTable like this because DataTables typings do not have the "ext" property
    $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {
      const id = parseFloat(data[0]) || 0; // use data for the id column
      if ((isNaN(this.min) && isNaN(this.max)) ||
        (isNaN(this.min) && id <= this.max) ||
        (this.min <= id && isNaN(this.max)) ||
        (this.min <= id && id <= this.max)) {
        return true;
      }
      return false;
    });

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

  ngOnDestroy(): void {
    // We remove the last function in the global ext search array so we do not add the fn each time the component is drawn
    // /!\\ This is not the ideal solution as other components may add other search function in this array, so be careful when
    // handling this global variable
    $.fn['dataTable'].ext.search.pop();
  }

  filterById(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
}</code>
</pre>
  `;
}
