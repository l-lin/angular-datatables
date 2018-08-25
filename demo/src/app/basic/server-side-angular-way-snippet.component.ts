import { Component } from '@angular/core';

@Component({
  selector: 'app-server-side-angular-way-snippet',
  template: `
  <div id="html" class="col s12 m9 l12">
    <h4 class="header">HTML</h4>
    <section [innerHTML]="htmlSnippet" highlight-js-content=".xml"></section>
  </div>
  <div id="css" class="col s12 m9 l12">
    <h4 class="header">CSS</h4>
    <section [innerHTML]="cssSnippet" highlight-js-content=".css"></section>
  </div>
  <div id="ts" class="col s12 m9 l12">
    <h4 class="header">Typescript</h4>
    <section [innerHTML]="tsSnippet" highlight-js-content=".typescript"></section>
  </div>
  `
})
export class ServerSideAngularWaySnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th&gt;ID&lt;/th&gt;
      &lt;th&gt;First name&lt;/th&gt;
      &lt;th&gt;Last name&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody *ngIf="persons?.length != 0"&gt;
      &lt;tr *ngFor="let person of persons"&gt;
          &lt;td&gt;{{ person.id }}&lt;/td&gt;
          &lt;td&gt;{{ person.firstName }}&lt;/td&gt;
          &lt;td&gt;{{ person.lastName }}&lt;/td&gt;
      &lt;/tr&gt;
  &lt;/tbody&gt;
  &lt;tbody *ngIf="persons?.length == 0"&gt;
    &lt;tr&gt;
      &lt;td colspan="3" class="no-data-available"&gt;No data!&lt;/td&gt;
    &lt;/tr&gt;
  &lt;tbody&gt;
&lt;/table&gt;</code>
</pre>
  `;

  cssSnippet = `
<pre>
<code class="css highlight">/*
   server-side-angular-way.component.css
*/
.no-data-available {
  text-align: center;
}

/*
   src/styles.css (i.e. your global style)
*/
.dataTables_empty {
  display: none;
}</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

class Person {
  id: number;
  firstName: string;
  lastName: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-server-side-angular-way',
  templateUrl: 'server-side-angular-way.component.html',
  styleUrls: ['server-side-angular-way.component.css']
})
export class ServerSideAngularWayComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  persons: Person[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) =&gt; {
        that.http
          .post&lt;DataTablesResponse&gt;(
            'https://angular-datatables-demo-server.herokuapp.com/',
            dataTablesParameters, {}
          ).subscribe(resp =&gt; {
            that.persons = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'firstName' }, { data: 'lastName' }]
    };
  }
}</code>
</pre>
  `;
}
