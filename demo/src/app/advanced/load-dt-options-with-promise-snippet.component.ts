import { Component } from '@angular/core';

@Component({
  selector: 'app-load-dt-options-with-promise-snippet',
  template: `
  <div id="html" class="col s12 m9 l12">
    <h4 class="header">HTML</h4>
    <section [innerHTML]="htmlSnippet" hljsContent=".xml"></section>
  </div>
  <div id="ts" class="col s12 m9 l12">
    <h4 class="header">Typescript</h4>
    <section [innerHTML]="tsSnippet" hljsContent=".typescript"></section>
  </div>
  <div id="data" class="col s12 m9 l12">
    <h4 class="header">Example data</h4>
    <section [innerHTML]="dataSnippet" hljsContent=".json"></section>
  </div>
  `
})
export class LoadDtOptionsWithPromiseSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-load-dt-options-with-promise',
  templateUrl: 'load-dt-options-with-promise.component.html'
})
export class LoadDtOptionsWithPromiseComponent implements OnInit {
  dtOptions: Promise&lt;DataTables.Settings&gt;;

  constructor(@Inject(HttpClient) private httpClient: HttpClient) {}

  ngOnInit(): void {
  this.dtOptions = this.httpClient.get&lt;DataTables.Settings&gt;('data/dtOptions.json')
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise&lt;any&gt; {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}</code>
</pre>
  `;

  dataSnippet = `
<pre>
<code class="json highlight">{
  "ajax": "data/data.json",
  "displayLength": 2,
  "paginationType": "full_numbers",
  "columns": [
    {
      "data": "id",
      "title": "ID"
    },
    {
      "data": "firstName",
      "title": "First name"
    },
    {
      "data": "lastName",
      "title": "Last name",
      "visible": false
    }
  ]
}</code>
</pre>
`;
}
