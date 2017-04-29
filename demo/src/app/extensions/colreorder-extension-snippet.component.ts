import { Component } from '@angular/core';

@Component({
  selector: 'app-colreorder-extension-snippet',
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
export class ColreorderExtensionSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-colreorder-extension',
  templateUrl: 'colreorder-extension.component.html'
})
export class ColreorderExtensionComponent implements OnInit {
  // Must be declared as "any", not as "DataTables.Settings"
  dtOptions: any = {};

  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [{
        title: 'No move me!',
        data: 'id'
      }, {
        title: 'Try to move me!',
        data: 'firstName'
      }, {
        title: 'You cannot move me! *evil laugh*',
        data: 'lastName'
      }],
      dom: 'Rt',
      // Use this attribute to enable colreorder
      colReorder: {
        order: [1, 0, 2],
        fixedColumnsRight: 2
      }
    };
  }
}
</code>
</pre>
  `;
}
