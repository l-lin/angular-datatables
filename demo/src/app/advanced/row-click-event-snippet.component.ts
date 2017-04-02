import { Component } from '@angular/core';

@Component({
  selector: 'app-row-click-event-snippet',
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
export class RowClickEventSnippetComponent {
  htmlSnippet = `
<pre>
<code class="xml highlight">&lt;blockquote&gt;Please click on a row&lt;/blockquote&gt;
&lt;p class="text-danger"&gt;You clicked on: &lt;strong&gt;{{ message }}&lt;/strong&gt;&lt;/p&gt;
&lt;br /&gt;
&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'row-click-event',
  templateUrl: 'row-click-event.component.html'
})
export class RowClickEventComponent implements OnInit {
  message = '';
  dtOptions: DataTables.Settings = {};

  constructor(private zone: NgZone) { }

  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstName;
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
      }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.someClickHandler(data);
        });
        return row;
      }
    };
  }
}</code>
</pre>
  `;
}
