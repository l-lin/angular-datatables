import { Component } from '@angular/core';

@Component({
  selector: 'app-individual-column-filtering-snippet',
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
export class IndividualColumnFilteringSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;
  &lt;tfoot&gt;
    &lt;tr&gt;
      &lt;th&gt;&lt;input type="text" placeholder="Search ID" name="search-id"/&gt;&lt;/th&gt;
      &lt;th&gt;&lt;input type="text" placeholder="Search first name" name="search-first-name"/&gt;&lt;/th&gt;
      &lt;th&gt;&lt;input type="text" placeholder="Search last name" name="search-last-name"/&gt;&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/tfoot&gt;
&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-individual-column-filtering',
  templateUrl: 'individual-column-filtering.component.html'
})
export class IndividualColumnFilteringComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

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

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
          if (that.search() !== this['value']) {
            that
              .search(this['value'])
              .draw();
          }
        });
      });
    });
  }
}
</code>
</pre>
  `;
}
