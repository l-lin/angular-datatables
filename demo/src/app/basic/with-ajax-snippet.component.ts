import { Component } from '@angular/core';

@Component({
  selector: 'app-with-ajax-snippet',
  template: `
  <div id="html" class="col s12 m9 l12">
    <h4 class="header">HTML</h4>
    <section [innerHTML]="htmlSnippet" highlight-js-content=".xml"></section>
  </div>
  <div id="ts" class="col s12 m9 l12">
    <h4 class="header">Typescript</h4>
    <section [innerHTML]="tsSnippet" highlight-js-content=".typescript"></section>
  </div>
  <div id="data" class="col s12 m9 l12">
    <h4 class="header">Example data</h4>
    <section [innerHTML]="dataSnippet" highlight-js-content=".json"></section>
  </div>
  `
})
export class WithAjaxSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'with-ajax',
  templateUrl: 'with-ajax.component.html'
})
export class WithAjaxComponent implements OnInit {
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
}</code>
</pre>
  `;

  dataSnippet = `
<pre>
<code class="json highlight">{
  "data": [
    {
      "id": 860,
      "firstName": "Superman",
      "lastName": "Yoda"
    },
    {
      "id": 870,
      "firstName": "Foo",
      "lastName": "Whateveryournameis"
    },
    {
      "id": 590,
      "firstName": "Toto",
      "lastName": "Titi"
    }
  ]
}</code>
</pre>
  `;
}
