import { Component } from '@angular/core';

@Component({
  selector: 'app-responsive-extension-snippet',
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
export class ResponsiveExtensionSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-responsive-extension',
  templateUrl: 'responsive-extension.component.html'
})
export class ResponsiveExtensionComponent implements OnInit {
  // Must be declared as "any", not as "DataTables.Settings"
  dtOptions: any = {};

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
        data: 'lastName',
        class: 'none'
      }],
      // Use this attribute to enable the responsive extension
      responsive: true
    };
  }
}</code>
</pre>
  `;
}
