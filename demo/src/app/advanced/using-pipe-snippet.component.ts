import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-using-pipe-snippet',
  template: `
  <div id="html" class="col s12 m9 l12">
    <h4 class="header">HTML</h4>
    <section [innerHTML]="htmlSnippet" hljsContent=".xml"></section>
  </div>
  <div id="ts" class="col s12 m9 l12">
    <h4 class="header">Typescript</h4>
    <section [innerHTML]="tsSnippet" hljsContent=".typescript"></section>
  </div>
  `
})
export class UsingPipeSnippetComponent implements OnInit {

  constructor() { }

  htmlSnippet = `
<pre>
<code class="xml highlight">
&lt;table datatable [dtOptions]="dtOptions" class="row-border hover"&gt;&lt;/table&gt;</code>
</pre>
  `;

  tsSnippet = `
<pre>
<code class="typescript highlight">
import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component({
  selector: 'app-using-ng-pipe',
  templateUrl: './using-ng-pipe.component.html'
})
export class UsingNgPipeComponent implements OnInit {

  constructor(
    private pipeInstance: UpperCasePipe // inject your Angular Pipe
  ) { }

  // Use ADTSettings instead of DataTables.Settings
  dtOptions: ADTSettings = {};

  ngOnInit(): void {

    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [
        {
          title: 'ID',
          data: 'id'
        },
        {
          title: 'First name',
          data: 'firstName',
          ngPipeInstance: this.pipeInstance  // <-- Pipe is used here
        },
        {
          title: 'Last name',
          data: 'lastName',
          ngPipeInstance: this.pipeInstance  // <-- Pipe is used here
        }
      ]
    };
  }

}
</code>
</pre>
  `;

  ngOnInit(): void {
  }

}
